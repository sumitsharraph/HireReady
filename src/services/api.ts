import type {
  StudentProfile,
  Resume,
  OpportunitySummary,
  PlacementDriveItem,
  ReminderItem,
  CalendarEventItem,
  NotificationItem,
  MockInterviewSession,
  HireReadyScoreData,
  DailyPlanItem,
  PlacementAnalytics,
} from '../types';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Network request failed' }));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // Profile
  getProfile: () => fetchJSON<StudentProfile>('/profile'),
  updateProfile: (profile: Partial<StudentProfile>) =>
    fetchJSON<StudentProfile>('/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  // Resumes
  getResumes: () => fetchJSON<Resume[]>('/resumes'),
  addResume: (resume: Partial<Resume>) =>
    fetchJSON<Resume>('/resumes', { method: 'POST', body: JSON.stringify(resume) }),
  updateResume: (id: string, updates: Partial<Resume>) =>
    fetchJSON<Resume>(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteResume: (id: string) =>
    fetchJSON<{ success: boolean }>(`/resumes/${id}`, { method: 'DELETE' }),
  analyzeResume: (id: string) =>
    fetchJSON<Resume>(`/resumes/${id}/analyze`, { method: 'POST' }),

  // Opportunities
  parsePlacementNotice: (text: string) =>
    fetchJSON<OpportunitySummary>('/opportunities/parse', { method: 'POST', body: JSON.stringify({ text }) }),
  getOpportunities: () => fetchJSON<OpportunitySummary[]>('/opportunities'),
  getOpportunity: (id: string) => fetchJSON<OpportunitySummary>(`/opportunities/${id}`),

  // Eligibility & Matching
  checkEligibility: (opportunityId: string, profile?: StudentProfile) =>
    fetchJSON<any>(`/opportunities/${opportunityId}/eligibility`, { method: 'POST', body: JSON.stringify({ profile }) }),
  matchJobAndATS: (opportunityId: string, resumeId?: string) =>
    fetchJSON<any>(`/opportunities/${opportunityId}/match`, { method: 'POST', body: JSON.stringify({ resumeId }) }),
  generateRoadmap: (opportunityId: string, resumeId?: string, daysRemaining?: number) =>
    fetchJSON<any>(`/opportunities/${opportunityId}/roadmap`, { method: 'POST', body: JSON.stringify({ resumeId, daysRemaining }) }),
  generateInterviewPrep: (opportunityId: string, resumeId?: string) =>
    fetchJSON<any>(`/opportunities/${opportunityId}/interview-prep`, { method: 'POST', body: JSON.stringify({ resumeId }) }),

  // AI Mock Interview
  startMockInterview: (config: { companyName: string; role: string; interviewType: string; difficulty: string }) =>
    fetchJSON<MockInterviewSession>('/mock-interview/start', { method: 'POST', body: JSON.stringify(config) }),
  submitMockTurn: (sessionId: string, userAnswer: string, turnNumber: number) =>
    fetchJSON<any>(`/mock-interview/${sessionId}/turn`, { method: 'POST', body: JSON.stringify({ userAnswer, turnNumber }) }),
  finishMockInterview: (sessionId: string) =>
    fetchJSON<any>(`/mock-interview/${sessionId}/finish`, { method: 'POST' }),
  getMockHistory: () => fetchJSON<MockInterviewSession[]>('/mock-interview/history'),

  // Drives Tracker
  getDrives: () => fetchJSON<PlacementDriveItem[]>('/drives'),
  addDrive: (drive: Partial<PlacementDriveItem>) =>
    fetchJSON<PlacementDriveItem>('/drives', { method: 'POST', body: JSON.stringify(drive) }),
  updateDrive: (id: string, updates: Partial<PlacementDriveItem> & { statusNote?: string }) =>
    fetchJSON<PlacementDriveItem>(`/drives/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteDrive: (id: string) =>
    fetchJSON<{ success: boolean }>(`/drives/${id}`, { method: 'DELETE' }),

  // Reminders & Calendar
  getReminders: () => fetchJSON<ReminderItem[]>('/reminders'),
  addReminder: (reminder: Partial<ReminderItem>) =>
    fetchJSON<ReminderItem>('/reminders', { method: 'POST', body: JSON.stringify(reminder) }),
  updateReminder: (id: string, updates: Partial<ReminderItem>) =>
    fetchJSON<ReminderItem>(`/reminders/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteReminder: (id: string) =>
    fetchJSON<{ success: boolean }>(`/reminders/${id}`, { method: 'DELETE' }),

  getCalendarEvents: () => fetchJSON<CalendarEventItem[]>('/calendar'),
  addCalendarEvent: (event: Partial<CalendarEventItem>) =>
    fetchJSON<CalendarEventItem>('/calendar', { method: 'POST', body: JSON.stringify(event) }),
  updateCalendarEvent: (id: string, updates: Partial<CalendarEventItem>) =>
    fetchJSON<CalendarEventItem>(`/calendar/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteCalendarEvent: (id: string) =>
    fetchJSON<{ success: boolean }>(`/calendar/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => fetchJSON<NotificationItem[]>('/notifications'),
  markNotificationRead: (id: string) =>
    fetchJSON<{ success: boolean }>(`/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () =>
    fetchJSON<{ success: boolean }>('/notifications/read-all', { method: 'POST' }),

  // Daily Plan & Score & Analytics
  getDailyPlan: () => fetchJSON<DailyPlanItem[]>('/daily-plan'),
  refreshDailyPlan: () => fetchJSON<DailyPlanItem[]>('/daily-plan/refresh', { method: 'POST' }),
  toggleDailyPlanItem: (id: string) =>
    fetchJSON<DailyPlanItem>(`/daily-plan/${id}/toggle`, { method: 'PATCH' }),

  getHireReadyScore: () => fetchJSON<HireReadyScoreData>('/hireready-score'),
  updateScoreWeights: (weights: Partial<HireReadyScoreData['weights']>) =>
    fetchJSON<any>('/hireready-score/weights', { method: 'PUT', body: JSON.stringify(weights) }),
  getAnalytics: () => fetchJSON<PlacementAnalytics>('/analytics'),

  // Demo Reset
  resetDemo: () => fetchJSON<{ success: boolean; message: string }>('/demo/reset', { method: 'POST' })
};
