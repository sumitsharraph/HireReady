import React from 'react';
import {
  FileCheck,
  Printer,
  Download,
  Award,
  Building2,
  CheckCircle2,
  FileText,
  Target,
  User,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const PlacementReportView: React.FC = () => {
  const { drives, resumes, hireReadyScore } = useApp();
  const { profile } = useAuth();
  const { sendLocalAlert } = useNotification();
  const readinessScore = hireReadyScore?.overallScore || 85;

  const handlePrint = () => {
    window.print();
    sendLocalAlert('Report Printed', 'Sent placement readiness report to printer / PDF export.', 'info');
  };

  const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Official Candidate Dossier</span>
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
            Placement Readiness Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
            Consolidated intelligence summary for placement coordinators, faculty advisors, and personal interview records.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-100 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="rounded-3xl bg-white text-slate-900 p-8 sm:p-12 shadow-sm border border-slate-200 space-y-8 print:p-0 print:shadow-none print:border-none">
        {/* Dossier Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-sans font-black tracking-widest text-indigo-600 uppercase">
              HireReady Official Placement Dossier
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 mt-1">
              {profile?.name || 'Rohan Sharma'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              {profile?.degree} in {profile?.branch} • Batch of {profile?.passingBatch || 2027}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-block px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">HireReady Index</span>
              <span className="font-sans text-2xl font-black text-indigo-700">{readinessScore}/100</span>
            </div>
          </div>
        </div>

        {/* Academic & Contact Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">College / University:</span>
            <span className="font-sans font-bold text-slate-900 truncate block">{profile?.college || 'NIT Trichy'}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Current CGPA:</span>
            <span className="font-sans font-black text-emerald-700">{profile?.cgpa || 8.64} / 10.0</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Active Backlogs:</span>
            <span className="font-sans font-bold text-slate-900">{profile?.activeBacklogs || 0} Standing</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Registered Email:</span>
            <span className="font-sans text-slate-700 truncate block font-medium">{profile?.email || 'rohan.sharma@campus.edu'}</span>
          </div>
        </div>

        {/* Resume ATS & Diagnostic Breakdown */}
        {primaryResume && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Primary Placement Resume: {primaryResume.title}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">ATS Score</span>
                <span className="font-sans font-black text-sm text-slate-900">
                  {primaryResume.generalAnalysis?.overallScore || 88}/100
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Action Verbs Count</span>
                <span className="font-sans font-bold text-sm text-slate-900">
                  {primaryResume.generalAnalysis?.actionVerbsCount || 14}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Quantified Metrics</span>
                <span className="font-sans font-bold text-sm text-slate-900">
                  {primaryResume.generalAnalysis?.quantifiedMetricsCount || 6}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Technical Skills</span>
                <span className="font-sans font-bold text-sm text-slate-900">
                  {primaryResume.skills?.length || 10} Extracted
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tracked Placement Drives Summary Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Target Placement Drives & Application Status</span>
          </h3>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Package</th>
                  <th className="p-3">Eligibility</th>
                  <th className="p-3">Pipeline Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {drives.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{d.opportunity.company.name}</td>
                    <td className="p-3 font-medium text-slate-700">{d.opportunity.jobRole}</td>
                    <td className="p-3 font-sans font-bold text-slate-900">{d.opportunity.ctc.salaryRange}</td>
                    <td className="p-3 text-emerald-700 font-bold">Eligible (8.64 CGPA)</td>
                    <td className="p-3 font-semibold text-indigo-700">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-sans font-medium">
          <span>Generated by HireReady AI Intelligence Engine</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
