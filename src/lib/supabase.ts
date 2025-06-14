import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Add error handling and validation for Supabase URL
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Expected format: https://your-project.supabase.co');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'ux-debt-tracker'
    }
  },
  // Add retry configuration for network issues
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Test connection on initialization
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error);
  } else {
    console.log('Supabase connection test successful');
  }
}).catch((err) => {
  console.error('Supabase connection test error:', err);
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          color: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          color: string;
          owner_id: string;
        };
        Update: {
          title?: string;
          description?: string;
          color?: string;
          updated_at?: string;
        };
      };
      ux_debts: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          screen: string;
          type: 'Heuristic' | 'Accessibility' | 'Performance' | 'Visual' | 'Usability';
          severity: 'Low' | 'Medium' | 'High' | 'Critical';
          status: 'Open' | 'In Progress' | 'Resolved';
          description: string;
          recommendation: string;
          logged_by: string;
          assignee?: string;
          figma_url?: string;
          screenshot_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          screen: string;
          type: 'Heuristic' | 'Accessibility' | 'Performance' | 'Visual' | 'Usability';
          severity: 'Low' | 'Medium' | 'High' | 'Critical';
          status: 'Open' | 'In Progress' | 'Resolved';
          description: string;
          recommendation: string;
          logged_by: string;
          assignee?: string;
          figma_url?: string;
          screenshot_url?: string;
        };
        Update: {
          title?: string;
          screen?: string;
          type?: 'Heuristic' | 'Accessibility' | 'Performance' | 'Visual' | 'Usability';
          severity?: 'Low' | 'Medium' | 'High' | 'Critical';
          status?: 'Open' | 'In Progress' | 'Resolved';
          description?: string;
          recommendation?: string;
          assignee?: string;
          figma_url?: string;
          screenshot_url?: string;
          updated_at?: string;
        };
      };
    };
  };
};