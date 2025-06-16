import { supabase } from './supabase';

// API endpoints for Figma plugin integration
export class DebtrixAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Set API key header for all requests
  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // Verify API key and get user info
  async verifyApiKey() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('api_key', this.apiKey)
        .single();

      if (error) throw error;
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: 'Invalid API key' };
    }
  }

  // Get user's projects
  async getProjects() {
    try {
      // First verify the API key and get user ID
      const userResult = await this.verifyApiKey();
      if (!userResult.success) {
        throw new Error('Invalid API key');
      }

      const { data, error } = await supabase
        .from('projects')
        .select('id, title, description, color, created_at, updated_at')
        .eq('owner_id', userResult.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { success: true, projects: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get UX debts for a project
  async getUXDebts(projectId: string) {
    try {
      const userResult = await this.verifyApiKey();
      if (!userResult.success) {
        throw new Error('Invalid API key');
      }

      // Verify user owns the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('owner_id', userResult.user.id)
        .single();

      if (projectError || !project) {
        throw new Error('Project not found or access denied');
      }

      const { data, error } = await supabase
        .from('ux_debts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, debts: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create a new UX debt
  async createUXDebt(projectId: string, debtData: {
    title: string;
    screen: string;
    type: 'Heuristic' | 'Accessibility' | 'Performance' | 'Visual' | 'Usability';
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status?: 'Open' | 'In Progress' | 'Resolved';
    description: string;
    recommendation: string;
    assignee?: string;
    figma_url?: string;
    logged_by: string;
  }) {
    try {
      const userResult = await this.verifyApiKey();
      if (!userResult.success) {
        throw new Error('Invalid API key');
      }

      // Verify user owns the project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('owner_id', userResult.user.id)
        .single();

      if (projectError || !project) {
        throw new Error('Project not found or access denied');
      }

      const { data, error } = await supabase
        .from('ux_debts')
        .insert([{
          ...debtData,
          project_id: projectId,
          status: debtData.status || 'Open',
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, debt: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Helper function to create API instance
export function createDebtrixAPI(apiKey: string) {
  return new DebtrixAPI(apiKey);
}

// API endpoint for external access (for Figma plugin)
export const API_BASE_URL = import.meta.env.VITE_SUPABASE_URL;