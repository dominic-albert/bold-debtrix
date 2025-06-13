// ProjectContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type UXDebtRow = Database['public']['Tables']['ux_debts']['Row'];

export interface UXDebt {
  id: string;
  title: string;
  screen: string;
  type: 'Heuristic' | 'Accessibility' | 'Performance' | 'Visual' | 'Usability';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  loggedBy: string;
  description: string;
  recommendation: string;
  screenshot_url?: string;
  assignee?: string;
  figmaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project extends Omit<ProjectRow, 'created_at' | 'updated_at'> {
  createdAt: Date;
  updatedAt: Date;
  uxDebts: UXDebt[];
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loadingProjects: boolean;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'uxDebts'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addUXDebt: (projectId: string, debt: Omit<UXDebt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUXDebt: (projectId: string, debtId: string, debt: Partial<UXDebt>) => Promise<void>;
  deleteUXDebt: (projectId: string, debtId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const refreshProjects = async () => {
    if (!user?.id) {
      setLoadingProjects(false);
      return;
    }
    
    setLoadingProjects(true);
    try {
      // Test Supabase connection first
      const { data: testData, error: testError } = await supabase
        .from('projects')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Supabase connection test failed:', testError);
        throw new Error(`Database connection failed: ${testError.message}`);
      }

      const { data: projectData, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      const projectsWithDebts = await Promise.all(
        (projectData || []).map(async (proj) => {
          const { data: uxDebtsData, error: debtsError } = await supabase
            .from('ux_debts')
            .select('*')
            .eq('project_id', proj.id);

          if (debtsError) {
            console.error('Error fetching UX debts for project:', proj.id, debtsError);
            // Continue with empty debts array instead of failing
          }

          return {
            ...proj,
            createdAt: new Date(proj.created_at),
            updatedAt: new Date(proj.updated_at),
            uxDebts: (uxDebtsData || []).map((debt) => ({
              ...debt,
              loggedBy: debt.logged_by,
              figmaUrl: debt.figma_url,
              screenshot_url: debt.screenshot_url,
              createdAt: new Date(debt.created_at),
              updatedAt: new Date(debt.updated_at),
            })),
          } as Project;
        })
      );

      setProjects(projectsWithDebts);

      // Update current project from refreshed data if it exists
      if (currentProject) {
        const updatedCurrent = projectsWithDebts.find(p => p.id === currentProject.id);
        setCurrentProject(updatedCurrent || null);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      toast.error(`Connection error: ${errorMessage}`);
      
      // Check if it's a network/connection error
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        toast.error('Unable to connect to database. Please check your internet connection and Supabase configuration.');
      }
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [user]);

  const addProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'uxDebts'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...projectData, owner_id: user?.id })
        .select()
        .single();

      if (error) throw error;

      toast.success('Project added!');
      await refreshProjects();
    } catch (err) {
      console.error('Failed to add project:', err);
      toast.error('Failed to add project.');
    }
  };

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ ...projectData, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast.success('Project updated.');
      await refreshProjects();
    } catch (err) {
      console.error('Failed to update project:', err);
      toast.error('Failed to update project.');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;

      toast.success('Project deleted.');
      if (currentProject?.id === id) setCurrentProject(null);
      await refreshProjects();
    } catch (err) {
      console.error('Failed to delete project:', err);
      toast.error('Failed to delete project.');
    }
  };

  const addUXDebt = async (projectId: string, debtData: Omit<UXDebt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const insertData = {
        project_id: projectId,
        title: debtData.title,
        screen: debtData.screen,
        type: debtData.type,
        severity: debtData.severity,
        status: debtData.status,
        assignee: debtData.assignee,
        logged_by: debtData.loggedBy,
        description: debtData.description,
        recommendation: debtData.recommendation,
        figma_url: debtData.figmaUrl,
        screenshot_url: debtData.screenshot_url,
      };

      const { data, error } = await supabase
        .from('ux_debts')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success('UX Debt added!');
      await refreshProjects();
    } catch (err) {
      console.error('Failed to add UX debt:', err);
      toast.error('Failed to add UX debt.');
    }
  };

  const updateUXDebt = async (projectId: string, debtId: string, debtData: Partial<UXDebt>) => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      // Map camelCase properties to snake_case database columns
      if (debtData.title !== undefined) updateData.title = debtData.title;
      if (debtData.screen !== undefined) updateData.screen = debtData.screen;
      if (debtData.type !== undefined) updateData.type = debtData.type;
      if (debtData.severity !== undefined) updateData.severity = debtData.severity;
      if (debtData.status !== undefined) updateData.status = debtData.status;
      if (debtData.assignee !== undefined) updateData.assignee = debtData.assignee;
      if (debtData.loggedBy !== undefined) updateData.logged_by = debtData.loggedBy;
      if (debtData.description !== undefined) updateData.description = debtData.description;
      if (debtData.recommendation !== undefined) updateData.recommendation = debtData.recommendation;
      if (debtData.figmaUrl !== undefined) updateData.figma_url = debtData.figmaUrl;
      if (debtData.screenshot_url !== undefined) updateData.screenshot_url = debtData.screenshot_url;

      const { error } = await supabase
        .from('ux_debts')
        .update(updateData)
        .eq('id', debtId);

      if (error) throw error;

      toast.success('UX Debt updated.');
      await refreshProjects();
    } catch (err) {
      console.error('Failed to update UX debt:', err);
      toast.error('Failed to update UX debt.');
    }
  };

  const deleteUXDebt = async (projectId: string, debtId: string) => {
    try {
      const { error } = await supabase.from('ux_debts').delete().eq('id', debtId);
      if (error) throw error;

      toast.success('UX Debt deleted.');
      await refreshProjects();
    } catch (err) {
      console.error('Failed to delete UX debt:', err);
      toast.error('Failed to delete UX debt.');
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      loadingProjects,
      setCurrentProject,
      addProject,
      updateProject,
      deleteProject,
      addUXDebt,
      updateUXDebt,
      deleteUXDebt,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}