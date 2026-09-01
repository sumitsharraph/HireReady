import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  Building2,
  ChevronDown,
  ChevronUp,
  Mic,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Lightbulb,
  Layers,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import type { InterviewQuestionItem } from '../../types';

export const InterviewPrepView: React.FC = () => {
  const {
    opportunities,
    activeOpportunity,
    setActiveOpportunity,
    activeResumeId,
    setActiveView
  } = useApp();
  const { sendLocalAlert } = useNotification();

  const [selectedOppId, setSelectedOppId] = useState(activeOpportunity?.id || opportunities[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});

  const currentOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  const handleFetchQuestions = async () => {
    if (!currentOpp) return;
    setIsLoading(true);
    try {
      const res = await api.generateInterviewPrep(currentOpp.id, activeResumeId);
      setQuestions(res.questions || []);
      if (res.questions && res.questions.length > 0) {
        // Expand first 2 by default
        setExpandedQuestionIds({ [res.questions[0].id]: true, [res.questions[1]?.id]: true });
      }
      sendLocalAlert('Questions Prepared', `Generated tailored interview question bank for ${currentOpp.company.name}.`, 'success');
    } catch (err: any) {
      sendLocalAlert('Failed to Generate Questions', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentOpp) {
      handleFetchQuestions();
    }
  }, [selectedOppId]);

  const toggleExpand = (id: string) => {
    setExpandedQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'Resume-Based', 'Project Deep-Dive', 'Technical Foundation', 'Role-Specific Scenarios', 'Skill-Gap Targeted', 'HR & Cultural Fit'];

  const filteredQuestions = questions.filter(q => categoryFilter === 'All' || q.category === categoryFilter);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Company-Tailored Question Bank</span>
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
            AI Placement Interview Preparation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
            High-frequency technical and behavioral questions derived directly from your resume, project architecture, and {currentOpp?.company.name || 'company'} technical stack.
          </p>
        </div>

        <button
          onClick={() => setActiveView('mock-ai')}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all self-start sm:self-auto active:scale-95"
        >
          <Mic className="w-4 h-4" />
          <span>Launch AI Mock Interview</span>
        </button>
      </div>

      {/* Control Bar: Drive Selector */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Drive:</span>
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

        <button
          onClick={handleFetchQuestions}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-indigo-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 self-end transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Regenerate Questions</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all ${
              categoryFilter === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Synthesizing company interview questions, edge-case follow-ups, and model answers...</p>
        </div>
      )}

      {/* Question List */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs rounded-3xl bg-white border border-slate-200 shadow-sm font-medium">
              No questions found under this filter.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isExpanded = !!expandedQuestionIds[q.id];
              return (
                <div
                  key={q.id}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all"
                >
                  <div
                    onClick={() => toggleExpand(q.id)}
                    className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {q.category}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            q.difficulty === 'Hard'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : q.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">{q.question}</h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                      {/* Model Answer */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                          <CheckCircle className="w-4 h-4" />
                          <span>Ideal Model Answer / Framework</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">{q.idealAnswer}</p>
                      </div>

                      {/* Key Points To Cover */}
                      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-700 font-bold text-xs">
                          <BookOpen className="w-4 h-4" />
                          <span>Essential Key Points to Hit</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 list-disc list-inside leading-relaxed font-medium">
                          {q.keyPointsToCover.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Interviewer Tip */}
                      {q.tipsForCandidate && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="leading-relaxed font-medium">
                            <strong className="text-amber-950">Candidate Pro-Tip:</strong> {q.tipsForCandidate}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
