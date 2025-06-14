import React, { useState } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { UXDebt } from '../contexts/ProjectContext';

interface EditDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: UXDebt;
  projectId: string;
}

const debtTypes = [
  'Heuristic',
  'Accessibility',
  'Performance',
  'Visual',
  'Usability'
];

const severityLevels = [
  { value: 'Low', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { value: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'Critical', color: 'text-red-600 bg-red-50 border-red-200' }
];

const statusOptions = [
  'Open',
  'In Progress',
  'Resolved'
];

function EditDebtModal({ isOpen, onClose, debt, projectId }: EditDebtModalProps) {
  const { updateUXDebt } = useProject();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: debt.title,
    screen: debt.screen,
    type: debt.type,
    severity: debt.severity,
    status: debt.status,
    description: debt.description,
    recommendation: debt.recommendation,
    figma_url: debt.figma_url || '',
    assignee: debt.assignee || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await updateUXDebt(projectId, debt.id, {
        title: formData.title.trim(),
        screen: formData.screen.trim(),
        type: formData.type as any,
        severity: formData.severity as any,
        status: formData.status as any,
        description: formData.description.trim(),
        recommendation: formData.recommendation.trim(),
        assignee: formData.assignee.trim() || undefined,
        figma_url: formData.figma_url.trim() || undefined,
      });
      
      onClose();
    } catch (error) {
      // Error is handled in the context
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const isFormValid = formData.title.trim() && 
                     formData.screen.trim() && 
                     formData.description.trim() && 
                     formData.recommendation.trim();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit UX Debt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Title and Screen */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Brief description of the issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screen/Component <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.screen}
                onChange={(e) => handleInputChange('screen', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Where is this issue located?"
                required
              />
            </div>
          </div>

          {/* Type and Severity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                {debtTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.value}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and Assignee */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Who should fix this?"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="Detailed description of the UX issue..."
              required
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.recommendation}
              onChange={(e) => handleInputChange('recommendation', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
              placeholder="How should this be fixed?"
              required
            />
          </div>

          {/* Figma URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Figma URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="url"
                value={formData.figma_url}
                onChange={(e) => handleInputChange('figma_url', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://figma.com/..."
              />
            </div>
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </div>
            ) : (
              'Update UX Debt'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditDebtModal;