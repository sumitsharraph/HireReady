import express from 'express';
import { db } from './db.js';
import {
  parsePlacementNoticeAI,
  analyzeResumeAI,
  checkEligibility,
  matchJobAndATSAI,
  generateSkillGapAndRoadmapAI,
  generateInterviewQuestionsAI,
  evaluateMockAnswerAI,
  generateMockReportAI,
  generateDailyPlanAI,
} from './aiServices.js';
import type { Resume } from '../src/types/index.js';

export function createApiApp() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS for cross-origin if needed
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), app: 'HireReady' });
  });

  // 1. Profile
  app.get('/api/profile', (req, res) => {
    res.json(db.getProfile());
  });

  app.put('/api/profile', (req, res) => {
    const updated = db.updateProfile(req.body);
    res.json(updated);
  });

  // 2. Resumes
  app.get('/api/resumes', (req, res) => {
    res.json(db.getResumes());
  });

  app.post('/api/resumes', async (req, res) => {
    try {
      const resumeData: Resume = req.body;
      if (!resumeData.id) {
        resumeData.id = 'res_' + Date.now();
      }
      if (!resumeData.uploadedAt) {
        resumeData.uploadedAt = new Date().toISOString();
      }

      if (!resumeData.generalAnalysis) {
        resumeData.generalAnalysis = await analyzeResumeAI(resumeData);
      }

      const saved = db.addResume(resumeData);
      res.json(saved);
    } catch (err: any) {
      console.error('Error adding resume:', err);
      res.status(500).json({ error: err.message || 'Failed to save resume' });
    }
  });

  app.put('/api/resumes/:id', async (req, res) => {
    try {
      const updated = db.updateResume(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Resume not found' });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/resumes/:id', (req, res) => {
    const success = db.deleteResume(req.params.id);
    res.json({ success });
  });

  app.post('/api/resumes/:id/analyze', async (req, res) => {
    try {
      const resumes = db.getResumes();
      const resume = resumes.find(r => r.id === req.params.id);
      if (!resume) return res.status(404).json({ error: 'Resume not found' });

      const analysis = await analyzeResumeAI(resume);
      const updated = db.updateResume(resume.id, { generalAnalysis: analysis });
      res.json(updated);
    } catch (err: any) {
      console.error('Error analyzing resume:', err);
      res.status(500).json({ error: err.message || 'Analysis failed' });
    }
  });

  // 3. Placement Notice Parser & Opportunities
  app.post('/api/opportunities/parse', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string' || text.trim().length < 10) {
        return res.status(400).json({ error: 'Please provide valid placement notice text.' });
      }

      const summary = await parsePlacementNoticeAI(text);
      db.addOpportunity(summary);
      res.json(summary);
    } catch (err: any) {
      console.error('Error parsing placement notice:', err);
      res.status(500).json({ error: err.message || 'Failed to parse notice' });
    }
  });

  app.get('/api/opportunities', (req, res) => {
    res.json(db.getOpportunities());
  });

  app.get('/api/opportunities/:id', (req, res) => {
    const opp = db.getOpportunity(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opp);
  });

  // 4. Eligibility Check
  app.post('/api/opportunities/:id/eligibility', (req, res) => {
    const opp = db.getOpportunity(req.params.id);
    if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
    const profile = req.body.profile || db.getProfile();
    const evaluation = checkEligibility(profile, opp);
    res.json(evaluation);
  });

  // 5. Job Match & Job-Specific ATS
  app.post('/api/opportunities/:id/match', async (req, res) => {
    try {
      const opp = db.getOpportunity(req.params.id);
      if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

      const { resumeId } = req.body;
      const resumes = db.getResumes();
      const resume = resumeId ? resumes.find(r => r.id === resumeId) : db.getPrimaryResume();
      if (!resume) return res.status(404).json({ error: 'No resume found for matching.' });

      const matchResult = await matchJobAndATSAI(resume, opp);
      const eligibility = checkEligibility(db.getProfile(), opp);

      res.json({
        ...matchResult,
        eligibility,
        selectedResumeId: resume.id,
        opportunityId: opp.id
      });
    } catch (err: any) {
      console.error('Error matching job & ATS:', err);
      res.status(500).json({ error: err.message || 'Job match calculation failed' });
    }
  });

  // 6. Skill Gap Analysis & Preparation Roadmap
  app.post('/api/opportunities/:id/roadmap', async (req, res) => {
    try {
      const opp = db.getOpportunity(req.params.id);
      if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

      const { resumeId, daysRemaining = 6 } = req.body;
      const resumes = db.getResumes();
      const resume = resumeId ? resumes.find(r => r.id === resumeId) : db.getPrimaryResume();
      if (!resume) return res.status(404).json({ error: 'No resume found' });

      const result = await generateSkillGapAndRoadmapAI(resume, opp, daysRemaining);
      res.json(result);
    } catch (err: any) {
      console.error('Error generating roadmap:', err);
      res.status(500).json({ error: err.message || 'Failed to generate roadmap' });
    }
  });

  // 7. Interview Preparation Questions
  app.post('/api/opportunities/:id/interview-prep', async (req, res) => {
    try {
      const opp = db.getOpportunity(req.params.id);
      if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

      const { resumeId } = req.body;
      const resumes = db.getResumes();
      const resume = resumeId ? resumes.find(r => r.id === resumeId) : db.getPrimaryResume();
      if (!resume) return res.status(404).json({ error: 'No resume found' });

      const questions = await generateInterviewQuestionsAI(resume, opp);
      res.json({ questions, company: opp.company.name, role: opp.jobRole });
    } catch (err: any) {
      console.error('Error generating interview prep:', err);
      res.status(500).json({ error: err.message || 'Failed to generate questions' });
    }
  });

  // 8. AI Mock Interview
  app.post('/api/mock-interview/start', (req, res) => {
    const { companyName = 'Tech Recruiters Inc', role = 'Software Engineer', interviewType = 'Technical', difficulty = 'Standard SDE-1' } = req.body;
    const session = db.addMockSession({
      id: 'mock_' + Date.now(),
      userId: db.getProfile().id,
      companyName,
      role,
      interviewType,
      difficulty,
      status: 'In Progress',
      currentTurnIndex: 0,
      turns: [
        {
          turnNumber: 1,
          question: `Welcome to your ${companyName} ${interviewType} interview for the ${role} position. To begin, could you introduce yourself briefly and walk me through an impressive technical engineering challenge you solved recently?`,
          category: 'Introduction & Project Overview',
          userAnswer: '',
          timestamp: new Date().toISOString()
        }
      ],
      startedAt: new Date().toISOString()
    });
    res.json(session);
  });

  app.post('/api/mock-interview/:id/turn', async (req, res) => {
    try {
      const { id } = req.params;
      const { userAnswer, turnNumber } = req.body;

      const sessions = db.getMockSessions();
      const session = sessions.find(s => s.id === id);
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const currentTurn = session.turns.find(t => t.turnNumber === turnNumber);
      if (!currentTurn) return res.status(404).json({ error: 'Turn not found' });

      currentTurn.userAnswer = userAnswer;

      const evaluationData = await evaluateMockAnswerAI(
        session.companyName,
        session.role,
        session.interviewType,
        currentTurn.question,
        userAnswer,
        turnNumber
      );

      currentTurn.evaluation = {
        score: evaluationData.score,
        technicalAccuracyScore: evaluationData.technicalAccuracyScore,
        communicationScore: evaluationData.communicationScore,
        completenessScore: evaluationData.completenessScore,
        strengths: evaluationData.strengths,
        missingPoints: evaluationData.missingPoints,
        betterAnswer: evaluationData.betterAnswer,
        improvementTip: evaluationData.improvementTip
      };

      if (session.turns.length < 5) {
        session.turns.push({
          turnNumber: session.turns.length + 1,
          question: evaluationData.nextQuestion.question,
          category: evaluationData.nextQuestion.category,
          userAnswer: '',
          timestamp: new Date().toISOString()
        });
        session.currentTurnIndex = session.turns.length - 1;
      }

      db.updateMockSession(id, session);
      res.json({ session, evaluation: currentTurn.evaluation, nextQuestion: evaluationData.nextQuestion });
    } catch (err: any) {
      console.error('Error during mock interview turn:', err);
      res.status(500).json({ error: err.message || 'Evaluation error' });
    }
  });

  app.post('/api/mock-interview/:id/finish', async (req, res) => {
    try {
      const { id } = req.params;
      const sessions = db.getMockSessions();
      const session = sessions.find(s => s.id === id);
      if (!session) return res.status(404).json({ error: 'Session not found' });

      const report = await generateMockReportAI(session.companyName, session.role, session.turns);
      session.report = report;
      session.status = 'Completed';
      session.completedAt = new Date().toISOString();

      db.updateMockSession(id, session);

      db.addNotification({
        id: 'notif_' + Date.now(),
        userId: db.getProfile().id,
        title: `Mock Interview Complete (${session.companyName})`,
        message: `You scored ${report.overallScore}/100! Review your strengths and revision recommendations.`,
        category: 'Interview Performance',
        timestamp: new Date().toISOString(),
        isRead: false,
        actionLink: '/interview'
      });

      res.json({ session, report });
    } catch (err: any) {
      console.error('Error completing mock interview:', err);
      res.status(500).json({ error: err.message || 'Report generation failed' });
    }
  });

  app.get('/api/mock-interview/history', (req, res) => {
    res.json(db.getMockSessions());
  });

  // 9. Placement Drive Tracker
  app.get('/api/drives', (req, res) => {
    res.json(db.getDrives());
  });

  app.post('/api/drives', (req, res) => {
    const newDrive = db.addDrive({
      id: 'drv_' + Date.now(),
      userId: db.getProfile().id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [{ status: req.body.status || 'Saved', updatedAt: new Date().toISOString() }],
      ...req.body
    });
    res.json(newDrive);
  });

  app.put('/api/drives/:id', (req, res) => {
    const existing = db.getDrives().find(d => d.id === req.params.id);
    if (!existing) return res.status(404).json({ error: 'Drive not found' });

    const updates = { ...req.body };
    if (updates.status && updates.status !== existing.status) {
      const history = existing.statusHistory || [];
      history.push({
        status: updates.status,
        updatedAt: new Date().toISOString(),
        note: updates.statusNote
      });
      updates.statusHistory = history;
    }

    const updated = db.updateDrive(req.params.id, updates);
    res.json(updated);
  });

  app.delete('/api/drives/:id', (req, res) => {
    const success = db.deleteDrive(req.params.id);
    res.json({ success });
  });

  // 10. Reminders & Calendar
  app.get('/api/reminders', (req, res) => {
    res.json(db.getReminders());
  });

  app.post('/api/reminders', (req, res) => {
    const reminder = db.addReminder({
      id: 'rem_' + Date.now(),
      userId: db.getProfile().id,
      isDelivered: false,
      isCompleted: false,
      ...req.body
    });
    res.json(reminder);
  });

  app.put('/api/reminders/:id', (req, res) => {
    const updated = db.updateReminder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Reminder not found' });
    res.json(updated);
  });

  app.delete('/api/reminders/:id', (req, res) => {
    res.json({ success: db.deleteReminder(req.params.id) });
  });

  app.get('/api/calendar', (req, res) => {
    res.json(db.getCalendarEvents());
  });

  app.post('/api/calendar', (req, res) => {
    const event = db.addCalendarEvent({
      id: 'cal_' + Date.now(),
      userId: db.getProfile().id,
      isCompleted: false,
      ...req.body
    });
    res.json(event);
  });

  app.put('/api/calendar/:id', (req, res) => {
    const updated = db.updateCalendarEvent(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Event not found' });
    res.json(updated);
  });

  app.delete('/api/calendar/:id', (req, res) => {
    res.json({ success: db.deleteCalendarEvent(req.params.id) });
  });

  // 11. Notifications
  app.get('/api/notifications', (req, res) => {
    res.json(db.getNotifications());
  });

  app.post('/api/notifications/:id/read', (req, res) => {
    res.json({ success: db.markNotificationRead(req.params.id) });
  });

  app.post('/api/notifications/read-all', (req, res) => {
    db.markAllNotificationsRead();
    res.json({ success: true });
  });

  // 12. "What Should I Do Today?" Engine
  app.get('/api/daily-plan', (req, res) => {
    res.json(db.getDailyPlan());
  });

  app.post('/api/daily-plan/refresh', async (req, res) => {
    try {
      const profile = db.getProfile();
      const drives = db.getDrives();
      const skillGaps = ['Database Indexing & B+ Trees', 'C# / .NET Fundamentals', 'Distributed Systems Basics'];
      const newPlan = await generateDailyPlanAI(profile, drives, skillGaps);
      db.setDailyPlan(newPlan);
      res.json(newPlan);
    } catch (err: any) {
      console.error('Error refreshing daily plan:', err);
      res.status(500).json({ error: err.message || 'Daily plan refresh failed' });
    }
  });

  app.patch('/api/daily-plan/:id/toggle', (req, res) => {
    const item = db.toggleDailyPlanItem(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  });

  // 13. HireReady Composite Score & Analytics
  app.get('/api/hireready-score', (req, res) => {
    res.json(db.calculateHireReadyScore());
  });

  app.put('/api/hireready-score/weights', (req, res) => {
    const updated = db.updateScoreWeights(req.body);
    res.json({ weights: updated, calculatedScore: db.calculateHireReadyScore() });
  });

  app.get('/api/analytics', (req, res) => {
    res.json(db.getAnalytics());
  });

  // 14. Demo Reset
  app.post('/api/demo/reset', (req, res) => {
    db.resetToDemo();
    res.json({ success: true, message: 'Database reset to verified campus demo state.' });
  });

  return app;
}
