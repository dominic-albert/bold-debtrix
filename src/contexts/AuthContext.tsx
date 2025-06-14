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
  resetPassword: (email: string) => Promise<void>;
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
      console.log('Fetching profile for user:', authUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no rows

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116' || !profile) {
          console.log('Profile not found, creating new profile...');
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              full_name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
              avatar_url: authUser.user_metadata?.avatar_url || null,
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            return null;
          }

          console.log('Profile created successfully:', newProfile);
          return {
            id: authUser.id,
            email: authUser.email!,
            name: newProfile.full_name,
            avatar: newProfile.avatar_url,
          };
        }
        return null;
      }

      if (!profile) {
        console.log('No profile found, creating new profile...');
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: authUser.id,
            email: authUser.email!,
            full_name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
            avatar_url: authUser.user_metadata?.avatar_url || null,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return null;
        }

        console.log('Profile created successfully:', newProfile);
        return {
          id: authUser.id,
          email: authUser.email!,
          name: newProfile.full_name,
          avatar: newProfile.avatar_url,
        };
      }

      console.log('Profile found:', profile);
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
        console.log('Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (session?.user) {
          console.log('Session found, fetching profile...');
          const userProfile = await fetchUserProfile(session.user);
          if (userProfile) {
            setUser(userProfile);
            console.log('User profile loaded successfully');
          } else {
            console.error('Failed to fetch or create user profile');
            setUser(null);
          }
        } else {
          console.log('No session found');
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
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          if (userProfile) {
            setUser(userProfile);
          } else {
            console.error('Failed to fetch or create user profile');
            setUser(null);
          }
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
      
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful, user:', data.user?.id);

      if (data.user) {
        const userProfile = await fetchUserProfile(data.user);
        if (userProfile) {
          setUser(userProfile);
          toast.success('Welcome back!');
        } else {
          throw new Error('Failed to load user profile. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      let errorMessage = 'Login failed';
      
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('invalid_credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and click the confirmation link before signing in.';
      } else if (err.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
      } else if (err.message?.includes('User not found')) {
        errorMessage = 'No account found with this email address. Please sign up first.';
      } else if (err.message?.includes('Failed to load user profile')) {
        errorMessage = 'Failed to load user profile. Please try again.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
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
      
      console.log('Attempting signup for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful, user:', data.user?.id);

      if (data.user) {
        // Check if email confirmation is disabled
        if (data.user.email_confirmed_at) {
          // User is immediately confirmed, proceed with login
          const userProfile = await fetchUserProfile(data.user);
          if (userProfile) {
            setUser(userProfile);
            toast.success('Account created successfully! Welcome to Debtrix!');
          } else {
            throw new Error('Account created but failed to load profile. Please try signing in.');
          }
        } else {
          // Email confirmation is enabled
          toast.success('Account created! Please check your email to verify your account before signing in.');
        }
      }
    } catch (err: any) {
      console.error('Signup failed:', err);
      let errorMessage = 'Signup failed';
      
      if (err.message?.includes('User already registered') || err.message?.includes('user_already_exists')) {
        errorMessage = 'An account with this email already exists. Try signing in instead, or use a different email address.';
      } else if (err.message?.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message?.includes('Signup is disabled')) {
        errorMessage = 'Account registration is currently disabled. Please contact support.';
      } else if (err.message?.includes('Account created but failed to load profile')) {
        errorMessage = 'Account created but failed to load profile. Please try signing in.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Reset password function
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      
      console.log('Sending password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        console.error('Reset password error:', error);
        throw error;
      }

      toast.success('Password reset email sent! Check your inbox for instructions.');
    } catch (err: any) {
      console.error('Reset password failed:', err);
      let errorMessage = 'Failed to send reset email';
      
      if (err.message?.includes('User not found')) {
        errorMessage = 'No account found with this email address.';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // 🚪 Logout function
  const logout = async () => {
    try {
      setError(null);
      console.log('Logging out...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
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
    <AuthContext.Provider value={{ user, login, signup, logout, resetPassword, loading, error }}>
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