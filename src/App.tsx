import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  KanbanSquare,
  Mic,
  Menu
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { NoticeParserView } from './components/parser/NoticeParserView';
import { ResumeHubView } from './components/resume/ResumeHubView';
import { JobMatchView } from './components/matching/JobMatchView';
import { SkillGapRoadmapView } from './components/roadmap/SkillGapRoadmapView';
import { InterviewPrepView } from './components/interview/InterviewPrepView';
import { MockInterviewView } from './components/interview/MockInterviewView';
import { DriveTrackerView } from './components/tracker/DriveTrackerView';
import { CalendarView } from './components/calendar/CalendarView';
import { CompareDrivesView } from './components/compare/CompareDrivesView';
import { PlacementRecordsView } from './components/records/PlacementRecordsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { PlacementReportView } from './components/reports/PlacementReportView';

const MainLayout: React.FC = () => {
  const { activeView, setActiveView, toggleMobileMenu } = useApp();

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Body with Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-6 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'parser' && <NoticeParserView />}
          {activeView === 'resumes' && <ResumeHubView />}
          {activeView === 'matching' && <JobMatchView />}
          {activeView === 'roadmap' && <SkillGapRoadmapView />}
          {activeView === 'interview' && <InterviewPrepView />}
          {activeView === 'mock-ai' && <MockInterviewView />}
          {activeView === 'tracker' && <DriveTrackerView />}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'compare' && <CompareDrivesView />}
          {activeView === 'records' && <PlacementRecordsView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'reports' && <PlacementReportView />}
        </main>
      </div>

      {/* Mobile Bottom Quick Navigation Bar (phones & small screens only) */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg safe-bottom"
      >
        <button
          type="button"
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px]">Today</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('parser')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'parser'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileSearch className="w-4 h-4" />
          <span className="text-[10px]">Notice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('resumes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'resumes'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-[10px]">ATS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('tracker')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'tracker'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <KanbanSquare className="w-4 h-4" />
          <span className="text-[10px]">Drives</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('mock-ai')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
            activeView === 'mock-ai'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span className="text-[10px]">Mock AI</span>
        </button>

        <button
          type="button"
          onClick={toggleMobileMenu}
          className="flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 font-medium hover:text-slate-800 dark:hover:text-slate-200 transition-all"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppProvider>
            <MainLayout />
          </AppProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
