import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  screenshot?: string;
  assignee?: string;
  figmaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  uxDebts: UXDebt[];
  teamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addUXDebt: (projectId: string, debt: Omit<UXDebt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUXDebt: (projectId: string, debtId: string, debt: Partial<UXDebt>) => void;
  deleteUXDebt: (projectId: string, debtId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'E-commerce Redesign',
      description: 'Complete overhaul of the checkout process and product pages',
      color: 'bg-purple-500',
      uxDebts: [
        {
          id: '1',
          title: 'Checkout button too small on mobile',
          screen: 'Checkout Page',
          type: 'Usability',
          severity: 'High',
          status: 'Open',
          loggedBy: 'Sarah Chen',
          description: 'Users are having difficulty tapping the checkout button on mobile devices',
          recommendation: 'Increase button size to minimum 44px height following iOS HIG',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          title: 'Missing alt text on product images',
          screen: 'Product Gallery',
          type: 'Accessibility',
          severity: 'Medium',
          status: 'In Progress',
          loggedBy: 'Mike Johnson',
          description: 'Screen readers cannot interpret product images',
          recommendation: 'Add descriptive alt text to all product images',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-16'),
        }
      ],
      teamMembers: ['Sarah Chen', 'Mike Johnson', 'Alex Rivera'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: '2',
      title: 'Dashboard Analytics',
      description: 'User engagement tracking and reporting interface',
      color: 'bg-blue-500',
      uxDebts: [
        {
          id: '3',
          title: 'Chart loading too slow',
          screen: 'Analytics Dashboard',
          type: 'Performance',
          severity: 'Medium',
          status: 'Open',
          loggedBy: 'Alex Rivera',
          description: 'Charts take over 3 seconds to load with large datasets',
          recommendation: 'Implement data virtualization and lazy loading',
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14'),
        }
      ],
      teamMembers: ['Alex Rivera', 'Sarah Chen'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-14'),
    }
  ]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, projectData: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? { ...project, ...projectData, updatedAt: new Date() }
          : project
      )
    );
    if (currentProject?.id === id) {
      setCurrentProject(prev => prev ? { ...prev, ...projectData, updatedAt: new Date() } : null);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const addUXDebt = (projectId: string, debtData: Omit<UXDebt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDebt: UXDebt = {
      ...debtData,
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

  const updateUXDebt = (projectId: string, debtId: string, debtData: Partial<UXDebt>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? {
              ...project,
              uxDebts: project.uxDebts.map(debt =>
                debt.id === debtId
                  ? { ...debt, ...debtData, updatedAt: new Date() }
                  : debt
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
          debt.id === debtId
            ? { ...debt, ...debtData, updatedAt: new Date() }
            : debt
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
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}