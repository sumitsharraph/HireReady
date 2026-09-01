import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Building2,
  ArrowRight,
  Flame,
  BookOpen,
  Code2,
  Brain,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import type { PreparationPlanData } from '../../types';

export const SkillGapRoadmapView: React.FC = () => {
  const {
    opportunities,
    activeOpportunity,
    setActiveOpportunity,
    activeResumeId,
    setActiveView
  } = useApp();
  const { sendLocalAlert } = useNotification();

  const [selectedOppId, setSelectedOppId] = useState(activeOpportunity?.id || opportunities[0]?.id || '');
  const [daysRemaining, setDaysRemaining] = useState<number>(6);
  const [isLoading, setIsLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<PreparationPlanData | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skills'>('roadmap');
  const [skillSubTab, setSkillSubTab] = useState<'have' | 'partial' | 'needToLearn' | 'revise'>('needToLearn');
  const [completedTaskIds, setCompletedTaskIds] = useState<Record<string, boolean>>({});

  const currentOpp = opportunities.find(o => o.id === selectedOppId) || opportunities[0];

  const handleGenerateRoadmap = async () => {
    if (!currentOpp) return;
    setIsLoading(true);
    try {
      const res = await api.generateRoadmap(currentOpp.id, activeResumeId, daysRemaining);
      setRoadmapData(res);
      sendLocalAlert('Roadmap Generated', `Created ${daysRemaining}-day customized preparation sprint for ${currentOpp.company.name}.`, 'success');
    } catch (err: any) {
      sendLocalAlert('Failed to Generate Roadmap', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentOpp) {
      handleGenerateRoadmap();
    }
  }, [selectedOppId, daysRemaining]);

  const toggleTask = (taskId: string) => {
    setCompletedTaskIds(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const totalTasks = roadmapData?.dailyRoadmap.reduce((acc, d) => acc + d.tasks.length, 0) || 0;
  const completedCount = Object.values(completedTaskIds).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Day-by-Day Preparation Engine</span>
        </div>
        <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
          Placement Drive Skill-Gap & Preparation Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          HireReady pinpoints exactly what skills you lack for {currentOpp?.company.name || 'the drive'} and builds a day-by-day study roadmap adapted to days remaining.
        </p>
      </div>

      {/* Control Bar: Drive Selector + Days Slider */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Drive Selector (7 Cols) */}
        <div className="md:col-span-7">
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

        {/* Days Selector (5 Cols) */}
        <div className="md:col-span-5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
            <span>Sprint Duration:</span>
            <span className="font-sans font-bold text-indigo-600">{daysRemaining} Days {daysRemaining <= 3 && '⚡ (Emergency Sprint)'}</span>
          </div>
          <div className="flex items-center gap-2">
            {[3, 6, 10, 14].map(d => (
              <button
                key={d}
                onClick={() => setDaysRemaining(d)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  daysRemaining === d
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Crafting high-yield study topics, practice problems, and concept checklists...</p>
        </div>
      )}

      {/* Main Roadmap & Skill-Gap Content */}
      {!isLoading && roadmapData && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Tabs: Roadmap vs 4-Category Skill Matrix */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 gap-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'roadmap'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Day-by-Day Roadmap ({completedCount}/{totalTasks} Complete)</span>
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'skills'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>4-Way Skill Gap Matrix</span>
              </button>
            </div>

            <button
              onClick={() => setActiveView('interview')}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-bold"
            >
              <span>Practice Mock Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View 1: Day-by-Day Preparation Roadmap */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              {roadmapData.dailyRoadmap.map((day) => (
                <div
                  key={day.dayNumber}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-xs flex items-center justify-center">
                        D{day.dayNumber}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{day.title}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">{day.focusArea}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-sans text-slate-600 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto font-bold">
                      Estimated: {day.estimatedHours} hrs
                    </span>
                  </div>

                  {/* Tasks in Day */}
                  <div className="space-y-2.5">
                    {day.tasks.map((task) => {
                      const isDone = !!completedTaskIds[task.id];
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleTask(task.id)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isDone
                              ? 'bg-slate-50 border-slate-200 opacity-60'
                              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 text-indigo-600"
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                            <div>
                              <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                                {task.taskName}
                              </h4>
                              {task.resourcesOrTips && (
                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed font-medium">
                                  💡 {task.resourcesOrTips}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {task.estimatedMinutes}m
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              task.category === 'Coding'
                                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                                : task.category === 'DSA'
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                : task.category === 'Interview Prep'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {task.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View 2: 4-Way Skill Gap Matrix */}
          {activeTab === 'skills' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              {/* Sub-tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => setSkillSubTab('needToLearn')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    skillSubTab === 'needToLearn'
                      ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block text-rose-700">Critical Gaps</span>
                  <span className="font-black text-slate-900 text-sm">{roadmapData.skillGap.needToLearn.length} Need To Learn</span>
                </button>

                <button
                  onClick={() => setSkillSubTab('partial')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    skillSubTab === 'partial'
                      ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block text-amber-700">Intermediate</span>
                  <span className="font-black text-slate-900 text-sm">{roadmapData.skillGap.partial.length} Partial Grasp</span>
                </button>

                <button
                  onClick={() => setSkillSubTab('have')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    skillSubTab === 'have'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block text-emerald-700">Proficient</span>
                  <span className="font-black text-slate-900 text-sm">{roadmapData.skillGap.have.length} Skills You Have</span>
                </button>

                <button
                  onClick={() => setSkillSubTab('revise')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    skillSubTab === 'revise'
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-950 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold block text-cyan-700">Core CS</span>
                  <span className="font-black text-slate-900 text-sm">{roadmapData.skillGap.revise.length} Revise Before Test</span>
                </button>
              </div>

              {/* Skill Details Cards */}
              <div className="space-y-3">
                {roadmapData.skillGap[skillSubTab].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{item.skill}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium text-[10px]">
                        Category: {skillSubTab}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium">{item.actionableAdvice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
