import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// 👤 User type matching Supabase auth + profile
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// 🔐 AuthContext type
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// 🧠 Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🏗️ AuthProvider component with real Supabase integration
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📋 Fetch user profile from database
  const fetchUserProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: authUser.id,
        email: authUser.email!,
        name: profile.full_name,
        avatar: profile.avatar_url,
      };
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return null;
    }
  };

  // 🌐 Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        }
      } catch (err) {
        console.error('Error in getSession:', err);
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 👂 Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 🔐 Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        setUser(userProfile);
        toast.success('Welcome back!');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ✍️ Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Profile will be created automatically by the trigger
        toast.success('Account created successfully! Please check your email to verify your account.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Signup failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout function
  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success('Logged out successfully');
    } catch (err: any) {
      console.error('Logout error:', err);
      const errorMessage = err.message || 'Logout failed';
      setError(errorMessage);
      toast.error(errorMessage);
      // Still clear the user state even if logout fails
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🎯 useAuth Hook
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };