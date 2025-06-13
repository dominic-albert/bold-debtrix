import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/CreateProjectModal';

function DashboardPage() {
  const { projects } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
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
              
              return (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-3 h-3 rounded-full ${project.color} group-hover:scale-110 transition-transform`}></div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Total Issues</span>
                      <span className="font-medium text-gray-900">
                        {project.uxDebts.length}
                      </span>
                    </div>

                    {/* Severity Distribution */}
                    <div className="flex items-center gap-2">
                      {severityStats.critical > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-600 font-medium">{severityStats.critical}</span>
                        </div>
                      )}
                      {severityStats.high > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-medium">{severityStats.high}</span>
                        </div>
                      )}
                      {severityStats.medium > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-yellow-600 font-medium">{severityStats.medium}</span>
                        </div>
                      )}
                      {severityStats.low > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">{severityStats.low}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Progress */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{statusStats.open}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Clock className="w-3 h-3" />
                        <span>{statusStats.inProgress}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{statusStats.resolved}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {project.updatedAt.toLocaleDateString()}
                      </div>
                      <div>
                        {project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

export default DashboardPage;