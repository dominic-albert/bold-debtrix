import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase'; // ✅ Import Supabase client

// 👤 User type (name and avatar are optional)
interface User {
  id: string;
  email: string;
  name?: string;
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

// 🏗️ AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🌐 Check session & listen to auth state
  useEffect(() => {
    const getSession = async () => {
      try {
        setError(null);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to get session. Please check your connection.');
          setLoading(false);
          return;
        }

        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication. Please check your connection to Supabase.');
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setError(null);
          if (session?.user) {
            await fetchUserProfile(session.user.id, session.user.email || '');
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          setError('Authentication error occurred.');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔐 Login with Supabase
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw new Error(loginError.message);

      if (data.user) {
        await fetchUserProfile(data.user.id, data.user.email || '');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // ✍️ Signup and create profile
  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (signupError) throw new Error(signupError.message);

      if (data.user) {
        // Create profile with error handling
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email || '',
          full_name: name,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw here as the user account was created successfully
        }

        await fetchUserProfile(data.user.id, data.user.email || '');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      setError(null);
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) {
        console.error('Logout error:', logoutError);
      }
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear the user state even if logout fails
      setUser(null);
    }
  };

  // 📥 Fetch profile from Supabase with better error handling
  const fetchUserProfile = async (id: string, email: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Set user with basic info even if profile fetch fails
        setUser({
          id,
          email,
          name: undefined,
          avatar: undefined,
        });
        return;
      }

      setUser({
        id,
        email,
        name: profile?.full_name,
        avatar: profile?.avatar_url,
      });
    } catch (err) {
      console.error('Fetch user profile error:', err);
      // Set user with basic info even if profile fetch fails
      setUser({
        id,
        email,
        name: undefined,
        avatar: undefined,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🎯 useAuth Hook (Vite-friendly export)
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };