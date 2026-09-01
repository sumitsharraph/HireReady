import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Star,
  Zap,
  BarChart2,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Award,
  UploadCloud,
  X,
  Code,
  BookOpen,
  Eye,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { AddResumeModal } from './AddResumeModal';
import type { Resume } from '../../types';

export const ResumeHubView: React.FC = () => {
  const {
    resumes,
    activeResumeId,
    setActiveResumeId,
    setPrimaryResume,
    deleteResume,
    refreshAllData,
    setActiveView
  } = useApp();
  const { sendLocalAlert } = useNotification();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const selectedResume = resumes.find((r) => r.id === activeResumeId) || resumes[0];

  const handleResumeAdded = (newResume: Resume) => {
    refreshAllData();
    setActiveResumeId(newResume.id);
  };

  const handleReAnalyze = async () => {
    if (!selectedResume) return;
    setIsAnalyzing(true);
    try {
      await api.analyzeResume(selectedResume.id);
      await refreshAllData();
      sendLocalAlert('Analysis Refreshed', 'AI evaluated all resume sections and updated scores.', 'success');
    } catch (err: any) {
      sendLocalAlert('Analysis Failed', err.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysis = selectedResume?.generalAnalysis;
  const overallScore = analysis?.overallScore || 85;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Resume Intelligence Hub</span>
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume Management & ATS Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed font-medium">
            Maintain multiple tailored resume versions (Full-Stack, Java Backend, Data Science), add premade placement templates, or upload files with 100-point section diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            id="open-add-resume-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Upload / Add Premade Resume</span>
          </button>
        </div>
      </div>

      {/* Resume Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resumes.map((r) => {
          const isSelected = r.id === selectedResume?.id;
          const score = r.generalAnalysis?.overallScore || 80;
          return (
            <div
              key={r.id}
              onClick={() => setActiveResumeId(r.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[150px] font-medium">
                    {r.fileName || 'resume.pdf'}
                  </span>
                  {r.isPrimary ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryResume(r.id);
                      }}
                      className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold"
                    >
                      Set Primary
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{r.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {r.skills?.length || 10} skills • {r.projects?.length || 2} projects
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-sans">
                  <span
                    className={`text-sm font-black ${
                      score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {score}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">/100 ATS</span>
                </div>
                {resumes.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete resume "${r.title}"?`)) deleteResume(r.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Diagnostic Panel */}
      {selectedResume && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Top Overview Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  Selected Resume Diagnostic
                </span>
                {selectedResume.isPrimary && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                    Active for Placement Drives
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5">{selectedResume.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{analysis?.summary}</p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setShowRawText(!showRawText)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{showRawText ? 'Hide Text' : 'View Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleReAnalyze}
                disabled={isAnalyzing}
                className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Re-scoring...' : 'Re-Run ATS Scoring'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('matching')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 dark:shadow-none transition-all"
              >
                <span>Match to Drive</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Raw Text Drawer */}
          {showRawText && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Resume Text Stream</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {selectedResume.rawText.length} characters
                </span>
              </div>
              <pre className="text-[11px] text-slate-800 dark:text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                {selectedResume.rawText}
              </pre>
            </div>
          )}

          {/* 100-Point Breakdown Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>100-Point Section Breakdown</span>
              </h3>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Total: {overallScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Content & Quality */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-400">Content Quality</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {analysis?.scoreBreakdown.contentQuality || 14}/15
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                    style={{
                      width: `${((analysis?.scoreBreakdown.contentQuality || 14) / 15) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* ATS Compatibility */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-400">ATS Parsing Format</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {analysis?.scoreBreakdown.atsCompatibility || 18}/20
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                    style={{
                      width: `${((analysis?.scoreBreakdown.atsCompatibility || 18) / 20) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Skills Depth */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-400">Skills Taxonomy</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {analysis?.scoreBreakdown.skillsDepth || 18}/20
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 dark:bg-cyan-500 rounded-full"
                    style={{
                      width: `${((analysis?.scoreBreakdown.skillsDepth || 18) / 20) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Projects & Metrics */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <div className="flex justify-between text-xs mb-1 font-medium">
                  <span className="text-slate-600 dark:text-slate-400">Projects & Metrics</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {analysis?.scoreBreakdown.projectsAndMetrics || 18}/20
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
                    style={{
                      width: `${((analysis?.scoreBreakdown.projectsAndMetrics || 18) / 20) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Metric Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>
                  Action Verbs: <strong>{analysis?.actionVerbsCount || 14}</strong>
                </span>
              </span>
              <span className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  Quantified Impact Metrics: <strong>{analysis?.quantifiedMetricsCount || 6}</strong>
                </span>
              </span>
              <span className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                <Award className="w-3.5 h-3.5 text-cyan-500" />
                <span>
                  Competitions & Certifications:{' '}
                  <strong>{selectedResume.certifications?.length || 2}</strong>
                </span>
              </span>
            </div>
          </div>

          {/* Current / Why / Suggestion Issues Explorer */}
          {analysis?.issues && analysis.issues.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Actionable ATS Improvements (Current / Why / Suggestion)</span>
              </h3>

              <div className="space-y-3">
                {analysis.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{issue.category}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
                        {issue.severity}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
                        <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-400 block mb-1">
                          Current State:
                        </span>
                        <p className="text-rose-950 dark:text-rose-200 leading-relaxed font-medium">
                          {issue.current}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                        <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-1">
                          Why Recruiters Care:
                        </span>
                        <p className="text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                          {issue.why}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 block mb-1">
                          Recommended Fix:
                        </span>
                        <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-bold">
                          {issue.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Projects Extracted Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Extracted Skills Taxonomy ({selectedResume.skills?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedResume.skills?.map((s, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold shadow-2xs"
                  >
                    {s.name} <span className="text-slate-400 dark:text-slate-500 text-[10px]">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Featured Projects:</span>
              <div className="space-y-2">
                {selectedResume.projects?.map((p) => (
                  <div
                    key={p.id}
                    className="text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  >
                    <h4 className="font-bold text-slate-900 dark:text-white">{p.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {p.technologies.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Resume Modal */}
      {isAddModalOpen && (
        <AddResumeModal
          onClose={() => setIsAddModalOpen(false)}
          onAdded={handleResumeAdded}
        />
      )}
    </div>
  );
};
