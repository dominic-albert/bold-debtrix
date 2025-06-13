import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Interfaces remain the same...
export interface UXDebt { /* ... same as your original */ }
export interface Project { /* ... same as your original */ }

interface ProjectContextType { /* ... same as your original */ }

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ux-debt-projects';
const LOCAL_CURRENT_PROJECT_KEY = 'ux-debt-current-project-id';

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem(LOCAL_STORAGE_KEY);
    const savedCurrentId = localStorage.getItem(LOCAL_CURRENT_PROJECT_KEY);

    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects, (key, value) => {
        if (['createdAt', 'updatedAt'].includes(key)) return new Date(value);
        return value;
      });
      setProjects(parsedProjects);

      if (savedCurrentId) {
        const current = parsedProjects.find((p: Project) => p.id === savedCurrentId);
        if (current) setCurrentProject(current);
      }
    }
  }, []);

  // Save to localStorage when projects change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  // Save to localStorage when current project changes
  useEffect(() => {
    if (currentProject?.id) {
      localStorage.setItem(LOCAL_CURRENT_PROJECT_KEY, currentProject.id);
    } else {
      localStorage.removeItem(LOCAL_CURRENT_PROJECT_KEY);
    }
  }, [currentProject]);

  const addProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date() }
          : project
      )
    );
    if (currentProject?.id === id) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    if (currentProject?.id === id) setCurrentProject(null);
  };

  const addUXDebt = (projectId: string, debt: Omit<UXDebt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDebt: UXDebt = {
      ...debt,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              uxDebts: [...project.uxDebts, newDebt],
              updatedAt: new Date()
            }
          : project
      )
    );
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        uxDebts: [...prev.uxDebts, newDebt],
        updatedAt: new Date()
      } : null);
    }
  };

  const updateUXDebt = (projectId: string, debtId: string, updates: Partial<UXDebt>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              uxDebts: project.uxDebts.map(debt =>
                debt.id === debtId ? { ...debt, ...updates, updatedAt: new Date() } : debt
              ),
              updatedAt: new Date()
            }
          : project
      )
    );
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        uxDebts: prev.uxDebts.map(debt =>
          debt.id === debtId ? { ...debt, ...updates, updatedAt: new Date() } : debt
        ),
        updatedAt: new Date()
      } : null);
    }
  };

  const deleteUXDebt = (projectId: string, debtId: string) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              uxDebts: project.uxDebts.filter(debt => debt.id !== debtId),
              updatedAt: new Date()
            }
          : project
      )
    );
    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? {
        ...prev,
        uxDebts: prev.uxDebts.filter(debt => debt.id !== debtId),
        updatedAt: new Date()
      } : null);
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
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
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
}
