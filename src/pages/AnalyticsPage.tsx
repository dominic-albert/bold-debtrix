import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  Users
} from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import Navbar from '../components/Navbar';

function AnalyticsPage() {
  const { projects } = useProject();

  // Calculate overall stats
  const totalDebts = projects.reduce((sum, project) => sum + project.uxDebts.length, 0);
  const resolvedDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.status === 'Resolved').length, 0);
  const openDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.status === 'Open').length, 0);
  const inProgressDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.status === 'In Progress').length, 0);

  // Calculate severity stats
  const criticalDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.severity === 'Critical').length, 0);
  const highDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.severity === 'High').length, 0);
  const mediumDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.severity === 'Medium').length, 0);
  const lowDebts = projects.reduce((sum, project) => 
    sum + project.uxDebts.filter(debt => debt.severity === 'Low').length, 0);

  // Calculate type stats
  const typeStats = projects.reduce((acc, project) => {
    project.uxDebts.forEach(debt => {
      acc[debt.type] = (acc[debt.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const resolutionRate = totalDebts > 0 ? ((resolvedDebts / totalDebts) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">
            Insights and trends across all your UX debt tracking
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{totalDebts}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500">from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedDebts}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-600 font-medium">{resolutionRate}%</span>
              <span className="text-gray-500">resolution rate</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-gray-900">{openDebts}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-red-600 font-medium">{criticalDebts}</span>
              <span className="text-gray-500">critical priority</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-600 font-medium">{inProgressDebts}</span>
              <span className="text-gray-500">in progress</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Severity Breakdown */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Issues by Severity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${totalDebts > 0 ? (criticalDebts / totalDebts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{criticalDebts}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${totalDebts > 0 ? (highDebts / totalDebts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{highDebts}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full"
                      style={{ width: `${totalDebts > 0 ? (mediumDebts / totalDebts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{mediumDebts}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${totalDebts > 0 ? (lowDebts / totalDebts) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{lowDebts}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Types */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Issues by Type</h3>
            <div className="space-y-4">
              {Object.entries(typeStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${totalDebts > 0 ? (count / totalDebts) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Project Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Issues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Open
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution Rate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => {
                  const projectOpen = project.uxDebts.filter(debt => debt.status === 'Open').length;
                  const projectInProgress = project.uxDebts.filter(debt => debt.status === 'In Progress').length;
                  const projectResolved = project.uxDebts.filter(debt => debt.status === 'Resolved').length;
                  const projectTotal = project.uxDebts.length;
                  const projectResolutionRate = projectTotal > 0 ? ((projectResolved / projectTotal) * 100).toFixed(1) : '0';
                  
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                          <div>
                            <div className="font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-500">{project.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {projectTotal}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">
                        {projectOpen}
                      </td>
                      <td className="px-6 py-4 text-sm text-yellow-600 font-medium">
                        {projectInProgress}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        {projectResolved}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {projectResolutionRate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;