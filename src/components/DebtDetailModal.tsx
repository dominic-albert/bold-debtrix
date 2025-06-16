import React from 'react';
import { X, ExternalLink, Calendar, User, Edit, Trash2 } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';

interface DebtDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: any;
  projectId: string;
  onEdit: () => void;
}

function DebtDetailModal({ isOpen, onClose, debt, projectId, onEdit }: DebtDetailModalProps) {
  const { deleteUXDebt } = useProject();

  if (!isOpen) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-700 bg-red-50 border-red-200';
      case 'In Progress': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'Resolved': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${debt.title}"? This action cannot be undone.`)) {
      try {
        await deleteUXDebt(projectId, debt.id);
        onClose();
      } catch (error) {
        // Error is handled in the context
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">UX Debt Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <div className="text-lg font-semibold text-gray-900">{debt.title}</div>
          </div>

          {/* Meta Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Screen/Component</label>
              <div className="text-gray-900">{debt.screen}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                {debt.type}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(debt.severity)}`}>
                {debt.severity}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(debt.status)}`}>
                {debt.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
              {debt.description}
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
            <div className="text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
              {debt.recommendation}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-4">
            {debt.assignee && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <div className="text-gray-900">{debt.assignee}</div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logged By</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-gray-900">{debt.logged_by}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {debt.figma_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Figma Link</label>
              <a
                href={debt.figma_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Figma
              </a>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{debt.created_at.toLocaleDateString()} at {debt.created_at.toLocaleTimeString()}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{debt.updated_at.toLocaleDateString()} at {debt.updated_at.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default DebtDetailModal;