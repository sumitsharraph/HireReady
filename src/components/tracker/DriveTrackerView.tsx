import React, { useState } from 'react';
import {
  KanbanSquare,
  ListFilter,
  Plus,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import type { PlacementDriveItem, ApplicationStatus } from '../../types';

export const DriveTrackerView: React.FC = () => {
  const { drives, updateDriveStatus, deleteDrive, setActiveOpportunity, setActiveView } = useApp();
  const { sendLocalAlert } = useNotification();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const statusColumns: ApplicationStatus[] = [
    'Saved',
    'Interested',
    'Applied',
    'Resume Shortlisted',
    'Test Scheduled',
    'Interview Scheduled',
    'Selected',
    'Offer Accepted'
  ];

  const handleStatusChange = async (driveId: string, newStatus: ApplicationStatus) => {
    await updateDriveStatus(driveId, newStatus, `Moved to ${newStatus}`);
  };

  const filteredDrives = drives.filter(d => filterStatus === 'All' || d.status === filterStatus);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <KanbanSquare className="w-3.5 h-3.5" />
            <span>Placement Pipeline Management</span>
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
            Placement Drive Application Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
            Manage your campus recruitment pipeline from circular shortlisting to interview rounds and final CAC offer letter acceptance.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Toggle Kanban vs Table */}
          <div className="flex bg-white border border-slate-200 shadow-sm rounded-2xl p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                viewMode === 'table' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Table List
            </button>
          </div>

          <button
            onClick={() => setActiveView('parser')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Drive</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
          {statusColumns.map(status => {
            const drivesInCol = drives.filter(d => d.status === status);
            return (
              <div
                key={status}
                className="w-72 shrink-0 rounded-3xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-3 shadow-sm"
              >
                {/* Col Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold text-slate-900">{status}</span>
                  <span className="font-sans text-xs px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 font-bold">
                    {drivesInCol.length}
                  </span>
                </div>

                {/* Col Cards */}
                <div className="space-y-3 min-h-[300px]">
                  {drivesInCol.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-[11px] font-medium">
                      No drives in {status}
                    </div>
                  ) : (
                    drivesInCol.map(d => (
                      <div
                        key={d.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white transition-all space-y-2.5 shadow-2xs text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            {d.opportunity.cacNumber || 'CAC'}
                          </span>
                          <span className="text-[10px] font-sans font-black text-emerald-600">
                            {d.jobMatchScore || 85}% Match
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-900">{d.opportunity.company.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{d.opportunity.jobRole}</p>
                        </div>

                        <div className="text-[11px] text-slate-500 font-medium">
                          CTC: <strong className="text-slate-900">{d.opportunity.ctc.salaryRange}</strong>
                        </div>

                        {d.opportunity.applicationDeadline && (
                          <div className="text-[10px] text-rose-700 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">{d.opportunity.applicationDeadline.rawDeadlineText || d.opportunity.applicationDeadline.date}</span>
                          </div>
                        )}

                        {/* Status Mover Selector */}
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                          <select
                            value={d.status}
                            onChange={e => handleStatusChange(d.id, e.target.value as ApplicationStatus)}
                            className="bg-white border border-slate-200 text-[11px] text-slate-800 font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 max-w-[150px] truncate"
                          >
                            {statusColumns.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                            <option value="Rejected">Rejected</option>
                          </select>

                          <button
                            onClick={() => {
                              setActiveOpportunity(d.opportunity);
                              setActiveView('matching');
                            }}
                            className="text-indigo-600 hover:text-indigo-800 p-1"
                            title="Check ATS Match"
                          >
                            <Target className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table List View */}
      {viewMode === 'table' && (
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Company & CAC Ref</th>
                  <th className="p-4">Target Role</th>
                  <th className="p-4">Package (CTC)</th>
                  <th className="p-4">Status Pipeline</th>
                  <th className="p-4">Match & ATS</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {drives.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-indigo-700 block">{d.opportunity.cacNumber || 'CAC DRIVE'}</span>
                      <strong className="text-slate-900 text-sm font-bold">{d.opportunity.company.name}</strong>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-slate-800">{d.opportunity.jobRole}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">{d.opportunity.workMode}</span>
                    </td>
                    <td className="p-4 font-sans font-bold text-slate-900">
                      {d.opportunity.ctc.salaryRange}
                    </td>
                    <td className="p-4">
                      <select
                        value={d.status}
                        onChange={e => handleStatusChange(d.id, e.target.value as ApplicationStatus)}
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-900 font-medium rounded-xl px-3 py-1.5 focus:outline-none focus:bg-white focus:border-indigo-500"
                      >
                        {statusColumns.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-4 font-sans font-black text-emerald-600">
                      {d.jobMatchScore || 85}%
                    </td>
                    <td className="p-4 text-slate-500 text-[11px] font-medium">
                      {d.opportunity.applicationDeadline?.rawDeadlineText || 'Check Notice'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActiveOpportunity(d.opportunity);
                            setActiveView('matching');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors"
                        >
                          Match
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${d.opportunity.company.name} from tracker?`)) deleteDrive(d.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
