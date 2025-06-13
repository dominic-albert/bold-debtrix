import React from 'react';
import { X, Folder } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProject } from '../contexts/ProjectContext';
import { projectSchema, type ProjectFormData } from '../lib/validations';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const colorOptions = [
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Emerald', value: 'bg-emerald-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Rose', value: 'bg-rose-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
];

function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject } = useProject();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      color: colorOptions[0].value,
    }
  });

  const selectedColor = watch('color');

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await addProject({
        title: data.title,
        description: data.description,
        color: data.color,
        owner_id: '', // This will be set in the context
      });
      
      // Reset form and close modal
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Folder className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="title"
                type="text"
                {...register('title')}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
                  errors.title 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-purple-500'
                }`}
                placeholder="Enter project title"
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors resize-none ${
                errors.description 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-purple-500'
              }`}
              placeholder="Describe your project..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Color
            </label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setValue('color', color.value)}
                  className={`w-10 h-10 rounded-lg ${color.value} transition-all duration-200 ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-purple-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;