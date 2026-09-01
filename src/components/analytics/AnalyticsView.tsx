import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Zap,
  Target,
  FileText,
  PieChart as PieChartIcon,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { drives, resumes, hireReadyScore } = useApp();
  const readinessScore = hireReadyScore?.overallScore || 85;


  // Data for Readiness Radar
  const radarData = [
    { subject: 'ATS Quality', A: 88, fullMark: 100 },
    { subject: 'Technical Match', A: 82, fullMark: 100 },
    { subject: 'Mock Interview', A: 76, fullMark: 100 },
    { subject: 'DSA & Coding', A: 85, fullMark: 100 },
    { subject: 'Core CS (OS/DBMS)', A: 80, fullMark: 100 },
    { subject: 'Project Architecture', A: 90, fullMark: 100 }
  ];

  // Data for CTC Comparison Bar Chart
  const ctcData = drives.map(d => {
    // Parse approximate LPA
    const text = d.opportunity.ctc.salaryRange;
    const match = text.match(/(\d+(\.\d+)?)/);
    const lpa = match ? parseFloat(match[0]) : 10;
    return {
      name: d.opportunity.company.name.split(' ')[0],
      ctc: lpa,
      match: d.jobMatchScore || 80
    };
  });

  // Data for Pipeline Pie Chart
  const pipelineCounts: Record<string, number> = {};
  drives.forEach(d => {
    pipelineCounts[d.status] = (pipelineCounts[d.status] || 0) + 1;
  });

  const pieData = Object.entries(pipelineCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Performance & Analytics</span>
        </div>
        <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
          Placement Intelligence Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          Deep visual telemetry into your campus placement preparedness, ATS keyword coverage, and compensation opportunity landscape.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">HireReady Score</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-sans text-3xl font-black text-emerald-600">{readinessScore}</span>
            <span className="text-slate-400 text-xs font-bold">/100</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top 12% in Batch of 2027</span>
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tracked Placement Drives</span>
          <div className="font-sans text-3xl font-black text-slate-900 mt-2">
            {drives.length}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1.5">Active in recruitment pipeline</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average ATS Score</span>
          <div className="font-sans text-3xl font-black text-indigo-600 mt-2">
            86%
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1.5">Across 3 tailored resumes</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Match Rate</span>
          <div className="font-sans text-3xl font-black text-sky-600 mt-2">
            83%
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1.5">For Dream & Super-Dream roles</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Readiness Competency (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">6-Axis Competency Readiness Radar</h3>
            <span className="text-xs font-sans text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">Comprehensive</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Radar name="Student Readiness" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Package vs Match Bar Chart (6 Cols) */}
        <div className="lg:col-span-6 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Company CTC (LPA) & Match Fit</h3>
            <span className="text-xs font-sans text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">Comparison</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ctcData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 600 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '16px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="ctc" fill="#10b981" radius={[6, 6, 0, 0]} name="Package (LPA)" />
                <Bar dataKey="match" fill="#6366f1" radius={[6, 6, 0, 0]} name="Match %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
