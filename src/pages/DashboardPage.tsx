import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import ProjectOptionsMenu from '../components/ProjectOptionsMenu';

function DashboardPage() {
  const { projects } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityStats = (project: any) => {
    const critical = project.uxDebts.filter((debt: any) => debt.severity === 'Critical').length;
    const high = project.uxDebts.filter((debt: any) => debt.severity === 'High').length;
    const medium = project.uxDebts.filter((debt: any) => debt.severity === 'Medium').length;
    const low = project.uxDebts.filter((debt: any) => debt.severity === 'Low').length;
    return { critical, high, medium, low };
  };

  const getStatusStats = (project: any) => {
    const open = project.uxDebts.filter((debt: any) => debt.status === 'Open').length;
    const inProgress = project.uxDebts.filter((debt: any) => debt.status === 'In Progress').length;
    const resolved = project.uxDebts.filter((debt: any) => debt.status === 'Resolved').length;
    return { open, inProgress, resolved };
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">
              Manage your UX debt across {projects.length} projects
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-400" />
            Filters
          </button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first project</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const severityStats = getSeverityStats(project);
              const statusStats = getStatusStats(project);
              const totalDebts = project.uxDebts?.length || 0;
              
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105 group relative"
                >
                  {/* Project Header - Reduced padding */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <Link to={`/project/${project.id}`} className="flex items-center gap-3 flex-1">
                        <div className={`w-3 h-3 rounded-full ${project.color} group-hover:scale-110 transition-transform`}></div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                        <ProjectOptionsMenu 
                          project={project} 
                          onEdit={() => handleEditProject(project)}
                        />
                      </div>
                    </div>

                    <Link to={`/project/${project.id}`}>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    </Link>

                    {/* Compact Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="text-center p-2 bg-red-50 rounded-md border border-red-100">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="text-xs font-medium text-red-800">Open</div>
                        <div className="text-sm font-bold text-red-900">{statusStats.open}</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded-md border border-yellow-100">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-yellow-600" />
                        </div>
                        <div className="text-xs font-medium text-yellow-800">Progress</div>
                        <div className="text-sm font-bold text-yellow-900">{statusStats.inProgress}</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-md border border-green-100">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="text-xs font-medium text-green-800">Resolved</div>
                        <div className="text-sm font-bold text-green-900">{statusStats.resolved}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BarChart3 className="w-3 h-3 text-gray-600" />
                        </div>
                        <div className="text-xs font-medium text-gray-800">Total</div>
                        <div className="text-sm font-bold text-gray-900">{totalDebts}</div>
                      </div>
                    </div>

                    {/* Severity Indicators - More compact */}
                    {totalDebts > 0 && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Severity:</span>
                        <div className="flex items-center gap-2">
                          {severityStats.critical > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-600 font-medium">{severityStats.critical}</span>
                            </div>
                          )}
                          {severityStats.high > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs text-orange-600 font-medium">{severityStats.high}</span>
                            </div>
                          )}
                          {severityStats.medium > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                              <span className="text-xs text-yellow-600 font-medium">{severityStats.medium}</span>
                            </div>
                          )}
                          {severityStats.low > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">{severityStats.low}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer with Date - Reduced padding */}
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {new Date(project.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {editingProject && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          project={editingProject}
        />
      )}
    </div>
  );
}

export default DashboardPage;