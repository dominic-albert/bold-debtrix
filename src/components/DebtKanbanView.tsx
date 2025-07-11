import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Calendar,
  User
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import DebtOptionsMenu from './DebtOptionsMenu';
import EditDebtModal from './EditDebtModal';
import DebtDetailModal from './DebtDetailModal';

interface DebtKanbanViewProps {
  searchTerm: string;
}

function DebtKanbanView({ searchTerm }: DebtKanbanViewProps) {
  const { currentProject, updateUXDebt } = useProject();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [viewingDebt, setViewingDebt] = useState(null);
  const [draggedDebt, setDraggedDebt] = useState<string | null>(null);

  if (!currentProject) return null;

  const filteredDebts = currentProject.uxDebts.filter(debt =>
    debt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.screen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    debt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: 'Open', title: 'Open', color: 'border-red-200 bg-red-50', icon: AlertTriangle, iconColor: 'text-red-500' },
    { id: 'In Progress', title: 'In Progress', color: 'border-yellow-200 bg-yellow-50', icon: Clock, iconColor: 'text-yellow-500' },
    { id: 'Resolved', title: 'Resolved', color: 'border-green-200 bg-green-50', icon: CheckCircle2, iconColor: 'text-green-500' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'border-l-red-500';
      case 'High': return 'border-l-orange-500';
      case 'Medium': return 'border-l-yellow-500';
      case 'Low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const handleStatusChange = (debtId: string, newStatus: string) => {
    updateUXDebt(currentProject.id, debtId, { status: newStatus as any });
  };

  const handleEditDebt = (debt: any) => {
    setEditingDebt(debt);
    setShowEditModal(true);
  };

  const handleViewDebt = (debt: any) => {
    setViewingDebt(debt);
    setShowDetailModal(true);
  };

  const handleDragStart = (e: React.DragEvent, debtId: string) => {
    setDraggedDebt(debtId);
    e.dataTransfer.setData('text/plain', debtId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedDebt(null);
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const debtId = e.dataTransfer.getData('text/plain');
    
    if (debtId && debtId !== draggedDebt) return;
    
    if (debtId) {
      handleStatusChange(debtId, columnId);
    }
    
    setDraggedDebt(null);
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnDebts = filteredDebts.filter(debt => debt.status === column.id);
          
          return (
            <div key={column.id} className={`rounded-xl border-2 ${column.color} p-4 min-h-[500px]`}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 ${column.iconColor}`} />
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                  {columnDebts.length}
                </span>
              </div>

              {/* Drop Zone */}
              <div
                className={`space-y-3 min-h-[400px] rounded-lg transition-all duration-200 ${
                  draggedDebt ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnDebts.map((debt) => (
                  <div
                    key={debt.id}
                    className={`bg-white rounded-lg border-l-4 ${getSeverityColor(debt.severity)} p-4 shadow-sm hover:shadow-md transition-all cursor-move relative group ${
                      draggedDebt === debt.id ? 'opacity-50 transform rotate-2' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, debt.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleViewDebt(debt)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 cursor-pointer">
                        {debt.title}
                      </h4>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2" onClick={(e) => e.stopPropagation()}>
                        <DebtOptionsMenu 
                          debt={debt} 
                          projectId={currentProject.id}
                          onEdit={() => handleEditDebt(debt)}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {debt.description}
                    </p>

                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                          {debt.screen}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          debt.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                          debt.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                          debt.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {debt.severity}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-xs text-gray-600">{debt.logged_by}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {debt.figma_url && (
                          <a
                            href={debt.figma_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                            title="Open in Figma"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <div className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">{debt.created_at.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty state for columns */}
                {columnDebts.length === 0 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 bg-gray-50/50">
                    <Icon className={`w-8 h-8 ${column.iconColor} mx-auto mb-2 opacity-50`} />
                    <p className="text-sm font-medium">No {column.title.toLowerCase()} issues</p>
                    <p className="text-xs mt-1">Drag cards here to change status</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingDebt && (
        <EditDebtModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingDebt(null);
          }}
          debt={editingDebt}
          projectId={currentProject.id}
        />
      )}

      {viewingDebt && (
        <DebtDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setViewingDebt(null);
          }}
          debt={viewingDebt}
          projectId={currentProject.id}
          onEdit={() => {
            setShowDetailModal(false);
            setEditingDebt(viewingDebt);
            setShowEditModal(true);
          }}
        />
      )}
    </>
  );
}

export default DebtKanbanView;