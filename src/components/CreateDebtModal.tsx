import React from 'react';
import { X, AlertTriangle, Upload, Link as LinkIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { uxDebtSchema, type UXDebtFormData } from '../lib/validations';

interface CreateDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const debtTypes = [
  'Heuristic',
  'Accessibility',
  'Performance',
  'Visual',
  'Usability'
] as const;

const severityLevels = [
  { value: 'Low', color: 'text-green-600 bg-green-50 border-green-200' },
  { value: 'Medium', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { value: 'High', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { value: 'Critical', color: 'text-red-600 bg-red-50 border-red-200' }
] as const;

const statusOptions = [
  'Open',
  'In Progress',
  'Resolved'
] as const;

function CreateDebtModal({ isOpen, onClose, projectId }: CreateDebtModalProps) {
  const { addUXDebt } = useProject();
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<UXDebtFormData>({
    resolver: zodResolver(uxDebtSchema),
    defaultValues: {
      title: '',
      screen: '',
      type: 'Heuristic',
      severity: 'Medium',
      status: 'Open',
      description: '',
      recommendation: '',
      figmaUrl: '',
      assignee: '',
    }
  });

  const onSubmit = async (data: UXDebtFormData) => {
    try {
      await addUXDebt(projectId, {
        ...data,
        loggedBy: user?.name || user?.email || 'Unknown User',
        type: data.type as any,
        severity: data.severity as any,
        status: data.status as any,
      });
      
      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create UX debt:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Log UX Debt</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Title and Screen */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.title 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-purple-500'
                }`}
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screen/Component <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('screen')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.screen 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-purple-500'
                }`}
                placeholder="Where is this issue located?"
              />
              {errors.screen && (
                <p className="mt-1 text-sm text-red-600">{errors.screen.message}</p>
              )}
            </div>
          </div>

          {/* Type and Severity */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.type 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-purple-500'
                }`}
              >
                {debtTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                {...register('severity')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.severity 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-purple-500'
                }`}
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.value}</option>
                ))}
              </select>
              {errors.severity && (
                <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
              )}
            </div>
          </div>

          {/* Status and Assignee */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
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
                {...register('assignee')}
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
              {...register('description')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none transition-colors ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
              placeholder="Detailed description of the UX issue..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recommendation <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('recommendation')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 resize-none transition-colors ${
                errors.recommendation 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
              placeholder="How should this be fixed?"
            />
            {errors.recommendation && (
              <p className="mt-1 text-sm text-red-600">{errors.recommendation.message}</p>
            )}
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
                {...register('figmaUrl')}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.figmaUrl 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-purple-500'
                }`}
                placeholder="https://figma.com/..."
              />
              {errors.figmaUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.figmaUrl.message}</p>
              )}
            </div>
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Screenshot
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, JPEG up to 10MB
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              'Log UX Debt'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateDebtModal;