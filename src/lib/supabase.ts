import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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