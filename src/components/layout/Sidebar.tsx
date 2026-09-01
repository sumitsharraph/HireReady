import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  Target,
  Compass,
  HelpCircle,
  Mic,
  KanbanSquare,
  CalendarDays,
  Scale,
  Award,
  BarChart3,
  FileCheck2,
  GraduationCap,
  X
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface NavItem {
  id: AppView;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ElementType;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, drives, reminders, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  const handleNavClick = (id: AppView) => {
    setActiveView(id);
    setIsMobileMenuOpen(false);
  };

  const primaryNav: NavItem[] = [
    { id: 'dashboard', label: 'Overview & Today', icon: LayoutDashboard },
    {
      id: 'parser',
      label: 'Notice Parser',
      icon: FileSearch,
      badge: 'AI',
      badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
    },
    { id: 'resumes', label: 'Resume Hub & ATS', icon: FileText },
    { id: 'matching', label: 'Job Match & Fit', icon: Target },
    { id: 'roadmap', label: 'Skill Gap & Roadmap', icon: Compass },
    { id: 'interview', label: 'Interview Prep', icon: HelpCircle },
    {
      id: 'mock-ai',
      label: 'AI Mock Interview',
      icon: Mic,
      badge: 'Voice/AI',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
    }
  ];

  const secondaryNav: NavItem[] = [
    {
      id: 'tracker',
      label: 'Placement Tracker',
      icon: KanbanSquare,
      badge: drives.length ? `${drives.length}` : undefined,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
    },
    {
      id: 'calendar',
      label: 'Deadlines & Calendar',
      icon: CalendarDays,
      badge: reminders.length ? `${reminders.length}` : undefined,
      badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
    },
    { id: 'compare', label: 'Compare Drives', icon: Scale },
    { id: 'records', label: 'Placement Records', icon: Award },
    { id: 'analytics', label: 'Placement Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Placement Dossier', icon: FileCheck2 }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto">
      {/* College Placement Banner & Mobile Close Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex-1">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 mb-1">
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Campus Drives 2026-27</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            AI Placement Intelligence for Campus Recruitment & CAC Circulars.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-3 py-4 space-y-6">
        {/* Core Intelligence Modules */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Intelligence Engine
          </div>
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tracking & Analytics */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Drives & Analytics
          </div>
          <nav className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-100 dark:border-indigo-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 mt-auto">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Gemini 2.5 Server Online
          </span>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold">v2.4</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg screens and wider) */}
      <aside className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Drawer (screens <lg) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative flex flex-col w-72 max-w-[85vw] h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
