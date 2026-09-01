export type WorkMode = 'Work From Office' | 'Hybrid' | 'Remote' | 'Not specified';
export type JobType = 'Full-time' | 'Internship + PPO' | 'Internship Only' | 'Contract' | 'Not specified';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  authProvider: 'google' | 'password' | 'demo';
  isVerified: boolean;
  college?: string;
  branch?: string;
  passingBatch?: number;
  cgpa?: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  college: string;
  degree: string;
  branch: string;
  passingBatch: number; // e.g. 2026 or 2027
  cgpa: number; // e.g. 8.4
  activeBacklogs: number;
  historyOfBacklogs: number;
  targetRoles: string[];
  avatarUrl?: string;
}

export interface ResumeSkill {
  name: string;
  category: 'Languages' | 'Frameworks & Libraries' | 'Databases' | 'Tools & Cloud' | 'Core Concepts' | 'Soft Skills';
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Proficient';
}

export interface ResumeProject {
  id: string;
  title: string;
  technologies: string[];
  description: string;
  bullets: string[];
  link?: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  location?: string;
  bullets: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  field: string;
  yearOfPassing: number;
  scoreOrCgpa: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string; // e.g. "Full-Stack Web Resume", "Java & Backend Resume"
  isPrimary: boolean;
  uploadedAt: string;
  fileName?: string;
  rawText: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  certifications: string[];
  achievements: string[];
  generalAnalysis?: ResumeAnalysis;
}

export interface ResumeIssue {
  id: string;
  category: 'Content' | 'Formatting' | 'Keywords' | 'Impact & Metrics' | 'Structure';
  severity: 'Critical' | 'Warning' | 'Suggestion';
  current: string;
  why: string;
  suggestion: string;
}

export interface ResumeAnalysis {
  overallScore: number; // 0 - 100
  scoreBreakdown: {
    contentQuality: number; // /15
    atsCompatibility: number; // /20
    skillsDepth: number; // /20
    projectsAndMetrics: number; // /20
    experienceQuality: number; // /10
    formattingAndStructure: number; // /10
    completeness: number; // /5
  };
  summary: string;
  strengths: string[];
  actionVerbsCount: number;
  quantifiedMetricsCount: number;
  issues: ResumeIssue[];
  keywordDensityHighlights: { keyword: string; count: number; impact: 'High' | 'Medium' | 'Low' }[];
}

export interface SelectionRound {
  roundNumber: number;
  name: string; // e.g. "Online Coding Assessment", "Technical Interview 1", "HR Round"
  description: string;
  duration?: string;
  mode?: 'Online' | 'Offline' | 'On-Campus';
  isConfirmed: boolean; // true if specified in notice, false if inferred
}

export interface CompanyInfo {
  name: string;
  website?: string;
  industry?: string;
  about: string;
}

export interface OpportunitySummary {
  id: string;
  cacNumber?: string; // e.g. "CAC/2026-27/084"
  driveTitle: string; // e.g. "Great Developers InfoTech - Campus Drive"
  company: CompanyInfo;
  jobRole: string;
  jobType: JobType;
  workMode: WorkMode;
  ctc: {
    salaryRange: string; // e.g. "₹4.5 - 6.0 LPA"
    baseSalary?: string;
    stipendDuringTraining?: string; // e.g. "₹15,000/month"
    trainingPeriod?: string; // e.g. "6 Months"
    serviceAgreementOrBond?: string; // e.g. "18 Months / None"
  };
  eligibilityCriteria: {
    passingBatch: number[]; // e.g. [2026, 2027]
    eligibleBranches: string[]; // e.g. ["CSE", "IT", "AIML", "ECE"]
    minimumCgpa: number; // e.g. 7.0 or 0 if not specified
    tenthTwelfthCriteria?: string; // e.g. "60% throughout in 10th/12th"
    allowedBacklogs: number; // 0 for no active backlogs
    otherCriteria?: string[];
  };
  keyResponsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  selectionProcess: SelectionRound[];
  applicationDeadline: {
    date: string; // YYYY-MM-DD
    time?: string; // e.g. "10:00 AM"
    rawDeadlineText: string;
  };
  registrationLink?: string;
  cacImportantPolicies: string[]; // Generic CAC/College guidelines (discipline, 2-offer rule, bond submission, attendance)
  rawNoticeText: string;
  createdAt: string;
}

export type EligibilityStatus = 'Eligible' | 'Not Eligible' | 'Possibly Eligible' | 'Insufficient Information';

export interface EligibilityEvaluation {
  status: EligibilityStatus;
  overallReason: string;
  checks: {
    criterion: string;
    requirement: string;
    candidateValue: string;
    passed: boolean | 'warning' | 'unknown';
    detail: string;
  }[];
}

export interface JobMatchSkill {
  name: string;
  status: 'Strong Match' | 'Partial Match' | 'Missing' | 'Transferable';
  importance: 'Critical' | 'High' | 'Medium' | 'Nice to Have';
  explanation: string;
}

export interface JobSpecificATSAnalysis {
  jobAtsScore: number; // 0 - 100
  jobMatchScore: number; // 0 - 100
  matchedKeywords: string[];
  missingKeywords: string[];
  skillVisibilityScore: number; // 0 - 100
  roleAlignmentScore: number; // 0 - 100
  projectRelevanceScore: number; // 0 - 100
  actionableAtsSuggestions: {
    issue: string;
    recommendation: string;
    impact: 'High' | 'Medium' | 'Low';
  }[];
}

export interface SkillGapCategory {
  alreadyHave: string[];
  partiallyMatch: { skill: string; currentKnowledge: string; missingAspect: string }[];
  needToLearn: { skill: string; priority: 'High' | 'Medium' | 'Low'; reason: string }[];
  reviseBeforeInterview: { skill: string; keyFocusAreas: string[] }[];
}

export interface PreparationTask {
  id: string;
  dayNumber: number;
  title: string;
  estimatedMinutes: number;
  category: 'Fundamentals' | 'Hands-on Coding' | 'System & DBMS' | 'DSA' | 'Projects & Resume' | 'Mock Practice' | 'HR & Behavioral';
  description: string;
  keyTopics: string[];
  practiceQuestions: string[];
  completed: boolean;
}

export interface PreparationDay {
  dayNumber: number;
  dayTitle: string;
  focusTheme: string;
  tasks: PreparationTask[];
}

export interface PreparationRoadmap {
  id: string;
  opportunityId: string;
  resumeId: string;
  totalDays: number;
  isEmergencyPlan: boolean; // true if deadline is < 48 hours
  overallStrategy: string;
  days: PreparationDay[];
}

export interface InterviewQuestionItem {
  id: string;
  category: 'Resume Questions' | 'Project Questions' | 'Technical Questions' | 'Role-Specific Questions' | 'Skill-Gap Questions' | 'HR & Behavioral Questions';
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  whyItMatters: string;
  modelAnswer: string;
  keyPointsToCover: string[];
  candidateSpecificTip: string;
  isBookmarked?: boolean;
}

export interface MockInterviewTurn {
  turnNumber: number;
  question: string;
  category: string;
  userAnswer: string;
  audioDurationSeconds?: number;
  evaluation?: {
    score: number; // 0 - 10
    technicalAccuracyScore: number; // 0 - 10
    communicationScore: number; // 0 - 10
    completenessScore: number; // 0 - 10
    strengths: string[];
    missingPoints: string[];
    betterAnswer: string;
    improvementTip: string;
  };
  timestamp: string;
}

export interface MockInterviewReport {
  overallScore: number; // 0 - 100
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  summary: string;
  strongAreas: string[];
  weakAreas: string[];
  topicsToRevise: string[];
  detailedFeedback: string;
}

export interface MockInterviewSession {
  id: string;
  userId: string;
  opportunityId?: string;
  companyName: string;
  role: string;
  interviewType: 'Technical' | 'HR & Behavioral' | 'Project Deep-Dive' | 'Comprehensive Mixed';
  difficulty: 'Junior / Campus Entry' | 'Standard SDE-1' | 'Challenging / Elite Tier';
  status: 'In Progress' | 'Completed' | 'Abandoned';
  turns: MockInterviewTurn[];
  currentTurnIndex: number;
  report?: MockInterviewReport;
  startedAt: string;
  completedAt?: string;
}

export type DriveStatus = 
  | 'Saved'
  | 'Interested'
  | 'Applied'
  | 'Resume Shortlisted'
  | 'Test Scheduled'
  | 'Interview Scheduled'
  | 'Selected'
  | 'Rejected'
  | 'Offer Accepted'
  | 'Offer Declined'
  | 'Withdrawn';

export interface PlacementDriveItem {
  id: string;
  userId: string;
  opportunity: OpportunitySummary;
  selectedResumeId?: string;
  status: DriveStatus;
  notes?: string;
  testDate?: string;
  interviewDate?: string;
  offerDetails?: {
    offeredCtc: string;
    joiningDate?: string;
    location?: string;
  };
  testScore?: string;
  interviewNotes?: string;
  statusHistory: {
    status: DriveStatus;
    updatedAt: string;
    note?: string;
  }[];
  jobMatchScore?: number;
  atsScore?: number;
  eligibilityStatus?: EligibilityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderItem {
  id: string;
  userId: string;
  driveId?: string;
  title: string;
  message: string;
  targetDateTime: string;
  timingType: '1 day before' | '12 hours before' | '6 hours before' | '1 hour before' | 'Custom' | 'Immediate';
  category: 'Application Deadline' | 'Test Reminder' | 'Interview' | 'Preparation Milestone' | 'Custom';
  isDelivered: boolean;
  deliveredAt?: string;
  isCompleted: boolean;
}

export interface CalendarEventItem {
  id: string;
  userId: string;
  driveId?: string;
  title: string;
  startDateTime: string;
  endDateTime?: string;
  category: 'Application Deadline' | 'Aptitude Test' | 'Coding Test' | 'Interview' | 'Preparation Task' | 'Custom Reminder';
  color: string;
  description?: string;
  isCompleted: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'Deadline Approaching' | 'Interview Reminder' | 'Skill Gap Alert' | 'Resume Improvement' | 'Interview Performance' | 'System';
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
}

export interface HireReadyScoreWeights {
  resumeQuality: number; // e.g. 0.25
  jobMatch: number; // e.g. 0.30
  skillReadiness: number; // e.g. 0.20
  interviewPerformance: number; // e.g. 0.25
}

export interface HireReadyScoreData {
  overallScore: number; // 0 - 100
  resumeScore: number;
  jobMatchScore: number;
  skillReadinessScore: number;
  interviewReadinessScore: number;
  weights: HireReadyScoreWeights;
  recentChanges: {
    factor: string;
    delta: number;
    explanation: string;
  }[];
}

export interface DailyPlanItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  category: 'Revision' | 'Practice' | 'Project' | 'Mock' | 'Application';
  reason: string;
  driveName?: string;
  isDone: boolean;
}

export interface PlacementAnalytics {
  applicationsCount: number;
  shortlistingRate: number; // %
  interviewSuccessRate: number; // %
  averageJobMatchScore: number;
  averageResumeScore: number;
  averageMockInterviewScore: number;
  topMissingSkills: { skill: string; count: number }[];
  preparationCompletionRate: number; // %
  statusDistribution: { status: DriveStatus; count: number }[];
  scoreTrendHistory: { date: string; score: number; event: string }[];
}

export type ApplicationStatus = DriveStatus;


export interface JobMatchResult {
  matchScore: number;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  categorizedSkills: {
    strongMatches: string[];
    partialMatches: string[];
    missingSkills: string[];
    transferableSkills: string[];
  };
  resumeRecommendation?: string;
  recruiterPerspective?: string;
}

export interface EligibilityCheckResult {
  isEligible: boolean;
  status: 'Eligible' | 'Not Eligible' | 'Conditionally Eligible';
  reasons: string[];
  criteriaChecks: {
    field: string;
    passed: boolean;
    message: string;
  }[];
}

export interface PreparationPlanData {
  dailyRoadmap: {
    dayNumber: number;
    title: string;
    focusArea: string;
    estimatedHours: number;
    tasks: {
      id: string;
      taskName: string;
      category: string;
      estimatedMinutes: number;
      resourcesOrTips?: string;
    }[];
  }[];
  skillGap: {
    have: { skill: string; actionableAdvice: string }[];
    partial: { skill: string; actionableAdvice: string }[];
    needToLearn: { skill: string; actionableAdvice: string }[];
    revise: { skill: string; actionableAdvice: string }[];
  };
}

