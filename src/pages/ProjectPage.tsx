import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import Navbar from '../components/Navbar';
import CreateDebtModal from '../components/CreateDebtModal';
import DebtListView from '../components/DebtListView';
import DebtKanbanView from '../components/DebtKanbanView';

function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, setCurrentProject, currentProject } = useProject();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  const project = projects.find(p => p.id === id);

  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    } else if (id) {
      // Project not found, redirect to dashboard
      navigate('/dashboard');
    }
  }, [project, id, setCurrentProject, navigate]);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const getSeverityStats = () => {
    const critical = project.uxDebts.filter(debt => debt.severity === 'Critical').length;
    const high = project.uxDebts.filter(debt => debt.severity === 'High').length;
    const medium = project.uxDebts.filter(debt => debt.severity === 'Medium').length;
    const low = project.uxDebts.filter(debt => debt.severity === 'Low').length;
    return { critical, high, medium, low };
  };

  const getStatusStats = () => {
    const open = project.uxDebts.filter(debt => debt.status === 'Open').length;
    const inProgress = project.uxDebts.filter(debt => debt.status === 'In Progress').length;
    const resolved = project.uxDebts.filter(debt => debt.status === 'Resolved').length;
    return { open, inProgress, resolved };
  };

  const severityStats = getSeverityStats();
  const statusStats = getStatusStats();

  // Safe date formatting with fallback
  const formatDate = (dateValue: any) => {
    if (!dateValue) return 'Unknown';
    
    try {
      // Handle different date formats
      let date: Date;
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else {
        return 'Unknown';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown';
      }
      
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className={`w-4 h-4 rounded-full ${project.color} mt-1`}></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Updated {formatDate(project.updated_at || project.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add UX Debt
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Open</span>
              </div>
              <div className="text-2xl font-bold text-red-900">{statusStats.open}</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-yellow-900">{statusStats.inProgress}</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Resolved</span>
              </div>
              <div className="text-2xl font-bold text-green-900">{statusStats.resolved}</div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-800">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{project.uxDebts?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search UX debts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
              <Filter className="w-4 h-4 text-gray-400" />
              Filters
            </button>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'kanban'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'list' ? (
          <DebtListView searchTerm={searchTerm} />
        ) : (
          <DebtKanbanView searchTerm={searchTerm} />
        )}
      </div>

      <CreateDebtModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={project.id}
      />
    </div>
  );
}

export default ProjectPage;