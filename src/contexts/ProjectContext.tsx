import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface UXDebt {
  id: string;
  title: string;
  screen: string;
  type: 'Heuristic' | 'Accessibility' | 'Performance' | 'Visual' | 'Usability';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  logged_by: string;
  description: string;
  recommendation: string;
  screenshot_url?: string;
  assignee?: string;
  figma_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  owner_id: string;
  uxDebts: UXDebt[];
  created_at: Date;
  updated_at: Date;
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'owner_id' | 'uxDebts' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addUXDebt: (projectId: string, debt: Omit<UXDebt, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateUXDebt: (projectId: string, debtId: string, debt: Partial<UXDebt>) => Promise<void>;
  deleteUXDebt: (projectId: string, debtId: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // 📋 Fetch projects from Supabase
  const fetchProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch UX debts for all projects
      const projectIds = projectsData?.map(p => p.id) || [];
      const { data: debtsData, error: debtsError } = await supabase
        .from('ux_debts')
        .select('*')
        .in('project_id', projectIds)
        .order('created_at', { ascending: false });

      if (debtsError) throw debtsError;

      // Combine projects with their debts
      const projectsWithDebts: Project[] = (projectsData || []).map(project => ({
        ...project,
        uxDebts: (debtsData || [])
          .filter(debt => debt.project_id === project.id)
          .map(debt => ({
            ...debt,
            created_at: new Date(debt.created_at),
            updated_at: new Date(debt.updated_at),
          })),
        created_at: new Date(project.created_at),
        updated_at: new Date(project.updated_at),
      }));

      setProjects(projectsWithDebts);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Refresh projects
  const refreshProjects = async () => {
    await fetchProjects();
  };

  // 📡 Load projects when user changes
  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [user]);

  // ➕ Add project
  const addProject = async (projectData: Omit<Project, 'id' | 'owner_id' | 'uxDebts' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...projectData,
          owner_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      const newProject: Project = {
        ...data,
        uxDebts: [],
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setProjects(prev => [newProject, ...prev]);
      toast.success('Project created successfully!');
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast.error('Failed to create project');
      throw error;
    }
  };

  // ✏️ Update project
  const updateProject = async (id: string, projectData: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', id);

      if (error) throw error;

      setProjects(prev =>
        prev.map(project =>
          project.id === id
            ? { ...project, ...projectData, updated_at: new Date() }
            : project
        )
      );

      if (currentProject?.id === id) {
        setCurrentProject(prev => prev ? { ...prev, ...projectData, updated_at: new Date() } : null);
      }

      toast.success('Project updated successfully!');
    } catch (error: any) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
      throw error;
    }
  };

  // 🗑️ Delete project
  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(prev => prev.filter(project => project.id !== id));
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }

      toast.success('Project deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
      throw error;
    }
  };

  // ➕ Add UX debt
  const addUXDebt = async (projectId: string, debtData: Omit<UXDebt, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ux_debts')
        .insert([{
          ...debtData,
          project_id: projectId,
        }])
        .select()
        .single();

      if (error) throw error;

      const newDebt: UXDebt = {
        ...data,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
      };

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                uxDebts: [newDebt, ...project.uxDebts],
                updated_at: new Date()
              }
            : project
        )
      );

      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? {
          ...prev,
          uxDebts: [newDebt, ...prev.uxDebts],
          updated_at: new Date()
        } : null);
      }

      toast.success('UX debt logged successfully!');
    } catch (error: any) {
      console.error('Error adding UX debt:', error);
      toast.error('Failed to log UX debt');
      throw error;
    }
  };

  // ✏️ Update UX debt
  const updateUXDebt = async (projectId: string, debtId: string, debtData: Partial<UXDebt>) => {
    try {
      const { error } = await supabase
        .from('ux_debts')
        .update(debtData)
        .eq('id', debtId);

      if (error) throw error;

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                uxDebts: project.uxDebts.map(debt =>
                  debt.id === debtId
                    ? { ...debt, ...debtData, updated_at: new Date() }
                    : debt
                ),
                updated_at: new Date()
              }
            : project
        )
      );

      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? {
          ...prev,
          uxDebts: prev.uxDebts.map(debt =>
            debt.id === debtId
              ? { ...debt, ...debtData, updated_at: new Date() }
              : debt
          ),
          updated_at: new Date()
        } : null);
      }

      toast.success('UX debt updated successfully!');
    } catch (error: any) {
      console.error('Error updating UX debt:', error);
      toast.error('Failed to update UX debt');
      throw error;
    }
  };

  // 🗑️ Delete UX debt
  const deleteUXDebt = async (projectId: string, debtId: string) => {
    try {
      const { error } = await supabase
        .from('ux_debts')
        .delete()
        .eq('id', debtId);

      if (error) throw error;

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId
            ? {
                ...project,
                uxDebts: project.uxDebts.filter(debt => debt.id !== debtId),
                updated_at: new Date()
              }
            : project
        )
      );

      if (currentProject?.id === projectId) {
        setCurrentProject(prev => prev ? {
          ...prev,
          uxDebts: prev.uxDebts.filter(debt => debt.id !== debtId),
          updated_at: new Date()
        } : null);
      }

      toast.success('UX debt deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting UX debt:', error);
      toast.error('Failed to delete UX debt');
      throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      loading,
      setCurrentProject,
      addProject,
      updateProject,
      deleteProject,
      addUXDebt,
      updateUXDebt,
      deleteUXDebt,
      refreshProjects,
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