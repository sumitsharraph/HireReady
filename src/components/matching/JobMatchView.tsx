import React, { useState, useEffect } from 'react';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Building2,
  Compass,
  Mic,
  Award,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import type { JobMatchResult, EligibilityCheckResult } from '../../types';

export const JobMatchView: React.FC = () => {
  const { profile } = useAuth();
  const {
    opportunities,
    activeOpportunity,
    setActiveOpportunity,
    resumes,
    activeResumeId,
    setActiveResumeId,
    setActiveView
  } = useApp();
  const { sendLocalAlert } = useNotification();

  const [selectedOppId, setSelectedOppId] = useState(activeOpportunity?.id || opportunities[0]?.id || '');
  const [selectedResId, setSelectedResId] = useState(activeResumeId || resumes[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [matchData, setMatchData] = useState<(JobMatchResult & { eligibility: EligibilityCheckResult }) | null>(null);

  const currentOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];
  const currentResume = resumes.find(r => r.id === selectedResId) || resumes[0];

  const handleRunMatch = async () => {
    if (!currentOpp || !currentResume) return;
    setIsLoading(true);
    try {
      const res = await api.matchJobAndATS(currentOpp.id, currentResume.id);
      setMatchData(res);
      sendLocalAlert('Job Fit Evaluated', `Calculated ${res.matchScore}% Match Score and ${res.atsScore}% ATS Score for ${currentOpp.company.name}.`, 'success');
    } catch (err: any) {
      sendLocalAlert('Match Calculation Failed', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentOpp && currentResume) {
      handleRunMatch();
    }
  }, [selectedOppId, selectedResId]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <Target className="w-3.5 h-3.5" />
          <span>Job Match & Eligibility Engine</span>
        </div>
        <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
          Candidate-to-Drive Compatibility Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          Evaluate precise technical alignment between your selected resume version and specific campus placement drives.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drive Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Placement Drive</span>
          </label>
          <select
            value={selectedOppId}
            onChange={e => {
              setSelectedOppId(e.target.value);
              const opp = opportunities.find(o => o.id === e.target.value);
              if (opp) setActiveOpportunity(opp);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
          >
            {opportunities.map(o => (
              <option key={o.id} value={o.id}>
                {o.company.name} — {o.jobRole} ({o.ctc.salaryRange})
              </option>
            ))}
          </select>
        </div>

        {/* Resume Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resume Version To Test</span>
          </label>
          <select
            value={selectedResId}
            onChange={e => {
              setSelectedResId(e.target.value);
              setActiveResumeId(e.target.value);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
          >
            {resumes.map(r => (
              <option key={r.id} value={r.id}>
                {r.title} {r.isPrimary ? '(Primary)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Evaluating technical match, keyword density, and eligibility criteria...</p>
        </div>
      )}

      {/* Match Result Display */}
      {!isLoading && matchData && currentOpp && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Job Match Score */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Job Match Score
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`font-sans text-3xl font-black ${
                    matchData.matchScore >= 80 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {matchData.matchScore}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">/100</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Skills & experience compatibility</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Target className="w-6 h-6" />
              </div>
            </div>

            {/* Job-Specific ATS Score */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Notice ATS Score
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`font-sans text-3xl font-black ${
                    matchData.atsScore >= 80 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {matchData.atsScore}
                  </span>
                  <span className="text-slate-400 text-xs font-bold">/100</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Keyword parsing against drive circular</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FileText className="w-6 h-6" />
              </div>
            </div>

            {/* Academic Eligibility Card */}
            <div className={`p-6 rounded-2xl border flex items-center justify-between shadow-sm ${
              matchData.eligibility?.isEligible
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  College Eligibility
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {matchData.eligibility?.isEligible ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <span className={`text-lg font-bold ${
                    matchData.eligibility?.isEligible ? 'text-emerald-900' : 'text-rose-900'
                  }`}>
                    {matchData.eligibility?.status || 'Eligible'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  {matchData.eligibility?.isEligible ? 'Meets CGPA, batch & backlog cutoff' : 'Criteria discrepancy found'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Academic Criteria Checks Table */}
          {matchData.eligibility?.criteriaChecks && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-800">College Academic Criteria Verification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {matchData.eligibility.criteriaChecks.map((chk, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                      chk.passed
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold text-slate-900 block">{chk.field}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{chk.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Skills Breakdown (4 Categories) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Drive Skill Alignment Matrix</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Strong Matches */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 border-b border-emerald-200 pb-2">
                  <span>Strong Matches</span>
                  <span className="font-sans font-bold">{matchData.categorizedSkills.strongMatches.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchData.categorizedSkills.strongMatches.map((sk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white text-emerald-900 border border-emerald-200 font-semibold shadow-2xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Partial Matches */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 border-b border-amber-200 pb-2">
                  <span>Partial Matches</span>
                  <span className="font-sans font-bold">{matchData.categorizedSkills.partialMatches.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchData.categorizedSkills.partialMatches.map((sk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white text-amber-900 border border-amber-200 font-semibold shadow-2xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-800 border-b border-rose-200 pb-2">
                  <span>Missing High Priority</span>
                  <span className="font-sans font-bold">{matchData.categorizedSkills.missingSkills.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchData.categorizedSkills.missingSkills.map((sk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white text-rose-900 border border-rose-200 font-semibold shadow-2xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Transferable Skills */}
              <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-800 border-b border-cyan-200 pb-2">
                  <span>Transferable Skills</span>
                  <span className="font-sans font-bold">{matchData.categorizedSkills.transferableSkills.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchData.categorizedSkills.transferableSkills.map((sk, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white text-cyan-900 border border-cyan-200 font-semibold shadow-2xs">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation & Resume Version Recommendation */}
          <div className="p-6 rounded-3xl bg-indigo-50/80 border border-indigo-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Resume Version & Positioning Recommendation</span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {matchData.resumeRecommendation || 'Your resume demonstrates solid foundational engineering skills for this role.'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              <strong className="text-slate-800">Recruiter Perspective:</strong> {matchData.recruiterPerspective}
            </p>

            <div className="pt-3 border-t border-indigo-200/60 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveView('roadmap')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
              >
                <Compass className="w-4 h-4" />
                <span>Generate {currentOpp.company.name} Roadmap</span>
              </button>
              <button
                onClick={() => setActiveView('interview')}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <Mic className="w-4 h-4 text-rose-500" />
                <span>Prepare Company Questions</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
