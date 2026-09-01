import React from 'react';
import {
  Award,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Briefcase,
  TrendingUp,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const PlacementRecordsView: React.FC = () => {
  const { drives } = useApp();
  const { profile } = useAuth();

  // Combine drive timeline logs into a chronological stream
  const timelineEvents: {
    id: string;
    companyName: string;
    role: string;
    timestamp: string;
    status: string;
    note?: string;
  }[] = [];

  drives.forEach(d => {
    if (d.statusHistory && d.statusHistory.length > 0) {
      d.statusHistory.forEach((t, i) => {
        timelineEvents.push({
          id: `${d.id}_${i}`,
          companyName: d.opportunity.company.name,
          role: d.opportunity.jobRole,
          timestamp: t.updatedAt,
          status: t.status,
          note: t.note
        });
      });
    } else {
      timelineEvents.push({
        id: `${d.id}_init`,
        companyName: d.opportunity.company.name,
        role: d.opportunity.jobRole,
        timestamp: d.createdAt,
        status: d.status,
        note: 'Drive tracked in HireReady pipeline'
      });
    }
  });

  // Sort descending by date
  timelineEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mb-2">
          <BadgeCheck className="w-3.5 h-3.5" />
          <span>Verified Student Placement Journey</span>
        </div>
        <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
          Placement Activity & Drive Records
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          Comprehensive historical activity log of all campus recruitment applications, test milestones, interview outcomes, and placement status records for {profile?.name || 'Candidate'}.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student Registration</span>
          <h3 className="text-base font-extrabold text-slate-900">{profile?.name || 'Rohan Sharma'}</h3>
          <p className="text-xs text-slate-500 font-medium">{profile?.branch || 'Computer Science'} ({profile?.passingBatch || 2027})</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Drives Applied</span>
          <h3 className="text-2xl font-black font-sans text-emerald-600">
            {drives.filter(d => ['Applied', 'Resume Shortlisted', 'Test Scheduled', 'Interview Scheduled', 'Selected', 'Offer Accepted'].includes(d.status)).length}
          </h3>
          <p className="text-xs text-slate-500 font-medium">Across 2026–2027 campus season</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Interviews / Shortlists</span>
          <h3 className="text-2xl font-black font-sans text-indigo-600">
            {drives.filter(d => ['Interview Scheduled', 'Test Scheduled', 'Resume Shortlisted'].includes(d.status)).length}
          </h3>
          <p className="text-xs text-slate-500 font-medium">Ongoing selection evaluation</p>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Chronological Placement Timeline
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineEvents.map(event => (
            <div key={event.id} className="relative space-y-1">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-600 border-2 border-white shadow-xs"></div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{event.companyName}</span>
                <span className="text-[10px] font-sans text-slate-400 font-bold">
                  {new Date(event.timestamp).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">{event.role}</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {event.status}
                </span>
              </div>

              {event.note && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-1 font-medium">
                  {event.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
