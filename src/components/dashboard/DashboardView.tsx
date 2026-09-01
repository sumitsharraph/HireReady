import React, { useState } from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileSearch,
  Mic,
  Target,
  AlertTriangle,
  Building2,
  ChevronRight,
  Sliders,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const DashboardView: React.FC = () => {
  const { profile } = useAuth();
  const {
    hireReadyScore,
    dailyPlan,
    toggleDailyTask,
    refreshDailyPlanWithAI,
    drives,
    setActiveView,
    setActiveOpportunity,
    reminders,
    analytics,
    refreshAllData
  } = useApp();

  const [isWeightsOpen, setIsWeightsOpen] = useState(false);
  const [isRefreshingPlan, setIsRefreshingPlan] = useState(false);
  const [weights, setWeights] = useState({
    resumeQuality: 25,
    jobMatch: 30,
    skillReadiness: 20,
    interviewPerformance: 25
  });

  const handleUpdateWeights = async () => {
    const total = weights.resumeQuality + weights.jobMatch + weights.skillReadiness + weights.interviewPerformance;
    if (total !== 100) {
      alert(`Weights must add up to exactly 100%. Current sum is ${total}%.`);
      return;
    }
    await api.updateScoreWeights({
      resumeQuality: weights.resumeQuality / 100,
      jobMatch: weights.jobMatch / 100,
      skillReadiness: weights.skillReadiness / 100,
      interviewPerformance: weights.interviewPerformance / 100
    });
    await refreshAllData();
    setIsWeightsOpen(false);
  };

  const handleRefreshPlan = async () => {
    setIsRefreshingPlan(true);
    try {
      await refreshDailyPlanWithAI();
    } finally {
      setIsRefreshingPlan(false);
    }
  };

  const score = hireReadyScore?.overallScore ?? 84;
  const completedTasks = dailyPlan.filter(t => t.isDone).length;
  const totalTasks = dailyPlan.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Campus Placement Status Banner */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/80 rounded-bl-full pointer-events-none -mr-4 -mt-4"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Campus Recruitment 2026-27 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-extrabold text-slate-900 tracking-tight">
              Welcome back, {profile?.name || 'Student'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed font-medium">
              {profile?.college} • {profile?.branch} ({profile?.passingBatch} Batch)
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                CGPA: <strong className="text-emerald-600 font-bold">{profile?.cgpa}</strong>/10.0
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 font-medium">
                Backlogs: <strong className="text-emerald-600 font-bold">{profile?.activeBacklogs}</strong> Active
              </span>
              <span className="px-3 py-1 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-800 font-medium">
                Placement Tier: <strong className="text-indigo-900 font-bold">Dream & Core SDE</strong>
              </span>
            </div>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dashboard-paste-notice-btn"
              onClick={() => setActiveView('parser')}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <FileSearch className="w-4 h-4" />
              <span>Parse Circular Notice</span>
            </button>
            <button
              id="dashboard-start-mock-btn"
              onClick={() => setActiveView('mock-ai')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Mic className="w-4 h-4 text-indigo-600" />
              <span>Start AI Mock</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: HireReady Score + "What Should I Do Today?" Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* HireReady Composite Score Card (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-50/50 rounded-bl-full pointer-events-none"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">HireReady Score</h2>
                  <p className="text-[11px] text-slate-500 font-medium">4-Factor Placement Preparedness</p>
                </div>
              </div>
              <button
                onClick={() => setIsWeightsOpen(!isWeightsOpen)}
                className="p-1.5 px-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-colors text-xs flex items-center gap-1 font-semibold"
                title="Adjust Factor Weights"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[11px]">Weights</span>
              </button>
            </div>

            {/* Score Big Display */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 mb-5 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans text-4xl font-black text-slate-900 tracking-tight">{score}</span>
                  <span className="text-slate-400 text-sm font-bold">/100</span>
                </div>
                <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>High Placement Readiness</span>
                </p>
              </div>
              <div className="w-16 h-16 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-600 transition-all duration-1000 ease-out"
                    strokeDasharray={`${score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <Zap className="w-5 h-5 text-indigo-600 absolute" />
              </div>
            </div>

            {/* Weights Adjuster (if toggled) */}
            {isWeightsOpen && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 mb-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-900">Adjust Component Weights (%)</span>
                  <span className="text-[10px] text-slate-500 font-medium">Sum must be 100%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Resume Quality ({weights.resumeQuality}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={weights.resumeQuality}
                      onChange={e => setWeights({ ...weights, resumeQuality: Number(e.target.value) })}
                      className="w-28 accent-indigo-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Job Match ({weights.jobMatch}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={weights.jobMatch}
                      onChange={e => setWeights({ ...weights, jobMatch: Number(e.target.value) })}
                      className="w-28 accent-indigo-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Skill Readiness ({weights.skillReadiness}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={weights.skillReadiness}
                      onChange={e => setWeights({ ...weights, skillReadiness: Number(e.target.value) })}
                      className="w-28 accent-indigo-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Interview Performance ({weights.interviewPerformance}%)</span>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={weights.interviewPerformance}
                      onChange={e => setWeights({ ...weights, interviewPerformance: Number(e.target.value) })}
                      className="w-28 accent-indigo-600"
                    />
                  </div>
                </div>
                <button
                  onClick={handleUpdateWeights}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
                >
                  Save Weights
                </button>
              </div>
            )}

            {/* 4 Factor Bars */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Resume Content & ATS Depth</span>
                  <span className="font-bold text-slate-900">{hireReadyScore?.resumeScore || 88}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${hireReadyScore?.resumeScore || 88}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Job & Notice Alignment</span>
                  <span className="font-bold text-slate-900">{hireReadyScore?.jobMatchScore || 82}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${hireReadyScore?.jobMatchScore || 82}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Core Skill Readiness</span>
                  <span className="font-bold text-slate-900">{hireReadyScore?.skillReadinessScore || 80}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${hireReadyScore?.skillReadinessScore || 80}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1 font-medium">
                  <span>Mock Interview Performance</span>
                  <span className="font-bold text-slate-900">{hireReadyScore?.interviewReadinessScore || 84}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${hireReadyScore?.interviewReadinessScore || 84}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Targeting Top 5% Placement Tier</span>
            <button
              onClick={() => setActiveView('analytics')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              <span>View Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* "What Should I Do Today?" Engine (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Today's Preparation Plan</h2>
                  <p className="text-[11px] text-slate-500 font-medium">AI Daily Prioritization Engine ({completedTasks}/{totalTasks} Complete)</p>
                </div>
              </div>
              <button
                onClick={handleRefreshPlan}
                disabled={isRefreshingPlan}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isRefreshingPlan ? 'animate-spin' : ''}`} />
                <span>{isRefreshingPlan ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            </div>

            {/* Task list */}
            <div className="space-y-3">
              {dailyPlan.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleDailyTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 group ${
                    task.isDone
                      ? 'bg-slate-50/60 border-slate-200 opacity-60'
                      : 'bg-slate-50 border-slate-100 hover:bg-indigo-50/60 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-indigo-600"
                    >
                      {task.isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <div className="w-5 h-5 rounded-lg bg-white border-2 border-indigo-200 flex items-center justify-center group-hover:border-indigo-500">
                          <div className="w-2 h-2 bg-indigo-600 rounded-sm opacity-0 group-hover:opacity-100"></div>
                        </div>
                      )}
                    </button>
                    <div>
                      <h3 className={`text-xs font-bold ${task.isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{task.reason}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {task.driveName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-indigo-700">
                            {task.driveName}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.estimatedMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    task.category === 'Practice'
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : task.category === 'Revision'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : task.category === 'Mock'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tasks update dynamically as drive dates approach</span>
            <button
              onClick={() => setActiveView('roadmap')}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              <span>Full Study Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Active Placement Drives + Dark Indigo AI Insights Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Campus Drives (8 Cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-100">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Active Placement Drives</h2>
                <p className="text-[11px] text-slate-500 font-medium">Registered circulars and preparation countdowns</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('tracker')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
            >
              <span>View All ({drives.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Drives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map(drive => (
              <div
                key={drive.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase">
                        {drive.opportunity.cacNumber || 'CAC DRIVE'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-2">{drive.opportunity.company.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{drive.opportunity.jobRole}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      drive.status === 'Applied'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : drive.status === 'Interested'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {drive.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                      CTC: <strong className="text-slate-900">{drive.opportunity.ctc.salaryRange}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                      {drive.opportunity.workMode}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
                      Match: {drive.jobMatchScore || 85}%
                    </span>
                  </div>

                  {drive.opportunity.applicationDeadline && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between text-xs text-rose-700">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium">Deadline: {drive.opportunity.applicationDeadline.rawDeadlineText || drive.opportunity.applicationDeadline.date}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                        Urgent
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setActiveOpportunity(drive.opportunity);
                      setActiveView('matching');
                    }}
                    className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                  >
                    <span>Check ATS Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveOpportunity(drive.opportunity);
                      setActiveView('roadmap');
                    }}
                    className="text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Prep Plan →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights & Recommendation Widget (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-indigo-900 text-white p-6 shadow-xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-bl-full opacity-40 pointer-events-none"></div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-indigo-800 text-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-300" />
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">AI Placement Insights</h3>
            </div>
            <p className="text-xs text-indigo-100/80 leading-relaxed mb-4">
              Based on your resume and upcoming CAC campus drives, focus heavily on{' '}
              <span className="text-indigo-300 font-bold">Dynamic Programming</span> and{' '}
              <span className="text-indigo-300 font-bold">System Scalability</span>. Your mock scores are strong (84%), but technical response speed needs continuous practice.
            </p>

            <div className="space-y-2 p-3.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/80 text-xs">
              <div className="flex justify-between text-indigo-200">
                <span>Next Scheduled Round</span>
                <span className="font-bold text-white">Coding Assessment</span>
              </div>
              <div className="flex justify-between text-indigo-300 text-[11px]">
                <span>Est. Window</span>
                <span>In 48-72 Hours</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-800/80">
            <button
              onClick={() => setActiveView('mock-ai')}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-colors"
            >
              Start AI Mock Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
