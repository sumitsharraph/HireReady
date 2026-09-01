import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Resume,
  OpportunitySummary,
  PlacementDriveItem,
  ReminderItem,
  CalendarEventItem,
  NotificationItem,
  HireReadyScoreData,
  DailyPlanItem,
  PlacementAnalytics,
} from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

export type AppView =
  | 'dashboard'
  | 'parser'
  | 'resumes'
  | 'matching'
  | 'roadmap'
  | 'interview'
  | 'mock-ai'
  | 'tracker'
  | 'calendar'
  | 'compare'
  | 'records'
  | 'analytics'
  | 'reports';

interface AppContextType {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  resumes: Resume[];
  primaryResume: Resume | null;
  activeResumeId: string;
  setActiveResumeId: (id: string) => void;
  opportunities: OpportunitySummary[];
  activeOpportunity: OpportunitySummary | null;
  setActiveOpportunity: (opp: OpportunitySummary | null) => void;
  drives: PlacementDriveItem[];
  reminders: ReminderItem[];
  calendarEvents: CalendarEventItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  hireReadyScore: HireReadyScoreData | null;
  dailyPlan: DailyPlanItem[];
  analytics: PlacementAnalytics | null;
  isLoading: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  
  // Actions
  refreshAllData: () => Promise<void>;
  parseNoticeAndSelect: (rawText: string) => Promise<OpportunitySummary>;
  saveDriveFromOpportunity: (opp: OpportunitySummary, status?: PlacementDriveItem['status']) => Promise<PlacementDriveItem>;
  updateDriveStatus: (driveId: string, status: PlacementDriveItem['status'], note?: string) => Promise<void>;
  deleteDrive: (driveId: string) => Promise<void>;
  toggleDailyTask: (taskId: string) => Promise<void>;
  refreshDailyPlanWithAI: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  addCustomReminder: (reminder: Partial<ReminderItem>) => Promise<ReminderItem>;
  deleteReminder: (id: string) => Promise<void>;
  addCalendarEvent: (event: Partial<CalendarEventItem>) => Promise<CalendarEventItem>;
  deleteCalendarEvent: (id: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  setPrimaryResume: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const { sendLocalAlert } = useNotification();

  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string>('');
  const [opportunities, setOpportunities] = useState<OpportunitySummary[]>([]);
  const [activeOpportunity, setActiveOpportunity] = useState<OpportunitySummary | null>(null);
  const [drives, setDrives] = useState<PlacementDriveItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hireReadyScore, setHireReadyScore] = useState<HireReadyScoreData | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlanItem[]>([]);
  const [analytics, setAnalytics] = useState<PlacementAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const primaryResume = resumes.find(r => r.id === activeResumeId) || resumes.find(r => r.isPrimary) || resumes[0] || null;

  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        resumesData,
        oppsData,
        drivesData,
        remindersData,
        calData,
        notifsData,
        scoreData,
        dailyPlanData,
        analyticsData
      ] = await Promise.all([
        api.getResumes(),
        api.getOpportunities(),
        api.getDrives(),
        api.getReminders(),
        api.getCalendarEvents(),
        api.getNotifications(),
        api.getHireReadyScore(),
        api.getDailyPlan(),
        api.getAnalytics()
      ]);

      setResumes(resumesData);
      const primary = resumesData.find(r => r.isPrimary) || resumesData[0];
      if (primary && !activeResumeId) {
        setActiveResumeId(primary.id);
      }

      setOpportunities(oppsData);
      if (oppsData.length > 0 && !activeOpportunity) {
        setActiveOpportunity(oppsData[0]);
      }

      setDrives(drivesData);
      setReminders(remindersData);
      setCalendarEvents(calData);
      setNotifications(notifsData);
      setHireReadyScore(scoreData);
      setDailyPlan(dailyPlanData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeResumeId, activeOpportunity]);

  useEffect(() => {
    refreshAllData();
  }, [profile]);

  const parseNoticeAndSelect = async (rawText: string): Promise<OpportunitySummary> => {
    const opp = await api.parsePlacementNotice(rawText);
    setOpportunities(prev => [opp, ...prev]);
    setActiveOpportunity(opp);
    sendLocalAlert('Placement Notice Structured', `Extracted details for ${opp.company.name} (${opp.jobRole}).`, 'success');
    return opp;
  };

  const saveDriveFromOpportunity = async (
    opp: OpportunitySummary,
    status: PlacementDriveItem['status'] = 'Saved'
  ): Promise<PlacementDriveItem> => {
    const existing = drives.find(d => d.opportunity.id === opp.id);
    if (existing) {
      sendLocalAlert('Drive Already Saved', `${opp.company.name} is already in your placement tracker.`, 'info');
      return existing;
    }

    const newDrive = await api.addDrive({
      opportunity: opp,
      selectedResumeId: activeResumeId || primaryResume?.id,
      status,
      jobMatchScore: 84,
      atsScore: 80,
      eligibilityStatus: 'Eligible',
      notes: `Extracted from placement circular ${opp.cacNumber || ''}`
    });

    setDrives(prev => [newDrive, ...prev]);
    sendLocalAlert('Saved to Placement Tracker', `${opp.company.name} added to your active placement pipeline.`, 'success');
    return newDrive;
  };

  const updateDriveStatus = async (driveId: string, status: PlacementDriveItem['status'], note?: string) => {
    const updated = await api.updateDrive(driveId, { status, statusNote: note });
    setDrives(prev => prev.map(d => (d.id === driveId ? updated : d)));
    sendLocalAlert('Status Updated', `Placement status changed to '${status}'.`, 'info');
    
    // Refresh score and analytics
    const [scoreData, analyticsData] = await Promise.all([
      api.getHireReadyScore(),
      api.getAnalytics()
    ]);
    setHireReadyScore(scoreData);
    setAnalytics(analyticsData);
  };

  const deleteDrive = async (driveId: string) => {
    await api.deleteDrive(driveId);
    setDrives(prev => prev.filter(d => d.id !== driveId));
    sendLocalAlert('Drive Removed', 'Opportunity removed from your placement tracker.', 'info');
  };

  const toggleDailyTask = async (taskId: string) => {
    const updated = await api.toggleDailyPlanItem(taskId);
    setDailyPlan(prev => prev.map(t => (t.id === taskId ? updated : t)));
  };

  const refreshDailyPlanWithAI = async () => {
    sendLocalAlert('AI Generating Plan', 'Analyzing upcoming drives, skill gaps, and deadlines...', 'info');
    const newPlan = await api.refreshDailyPlan();
    setDailyPlan(newPlan);
    sendLocalAlert('Plan Refreshed', "Today's personalized HireReady plan is ready.", 'success');
  };

  const markNotificationAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    sendLocalAlert('All Read', 'Marked all notifications as read.', 'info');
  };

  const addCustomReminder = async (reminder: Partial<ReminderItem>) => {
    const created = await api.addReminder(reminder);
    setReminders(prev => [created, ...prev]);
    sendLocalAlert('Reminder Set', `Alert scheduled for ${created.title}.`, 'success');
    return created;
  };

  const deleteReminder = async (id: string) => {
    await api.deleteReminder(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addCalendarEvent = async (event: Partial<CalendarEventItem>) => {
    const created = await api.addCalendarEvent(event);
    setCalendarEvents(prev => [created, ...prev]);
    sendLocalAlert('Event Scheduled', `Added "${created.title}" to your placement calendar.`, 'success');
    return created;
  };

  const deleteCalendarEvent = async (id: string) => {
    await api.deleteCalendarEvent(id);
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  const deleteResume = async (id: string) => {
    await api.deleteResume(id);
    setResumes(prev => prev.filter(r => r.id !== id));
    if (activeResumeId === id && resumes.length > 1) {
      const remaining = resumes.filter(r => r.id !== id);
      setActiveResumeId(remaining[0].id);
    }
    sendLocalAlert('Resume Deleted', 'Resume removed from your profile.', 'info');
  };

  const setPrimaryResume = async (id: string) => {
    await api.updateResume(id, { isPrimary: true });
    setResumes(prev => prev.map(r => ({ ...r, isPrimary: r.id === id })));
    setActiveResumeId(id);
    sendLocalAlert('Primary Resume Updated', 'HireReady will use this resume as default for all match analyses.', 'success');
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        resumes,
        primaryResume,
        activeResumeId,
        setActiveResumeId,
        opportunities,
        activeOpportunity,
        setActiveOpportunity,
        drives,
        reminders,
        calendarEvents,
        notifications,
        unreadNotificationCount,
        hireReadyScore,
        dailyPlan,
        analytics,
        isLoading,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        refreshAllData,
        parseNoticeAndSelect,
        saveDriveFromOpportunity,
        updateDriveStatus,
        deleteDrive,
        toggleDailyTask,
        refreshDailyPlanWithAI,
        markNotificationAsRead,
        markAllNotificationsRead,
        addCustomReminder,
        deleteReminder,
        addCalendarEvent,
        deleteCalendarEvent,
        deleteResume,
        setPrimaryResume
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
