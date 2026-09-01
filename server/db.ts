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
} from '../src/types/index.js';

export interface DatabaseState {
  profile: StudentProfile;
  resumes: Resume[];
  opportunities: OpportunitySummary[];
  drives: PlacementDriveItem[];
  reminders: ReminderItem[];
  calendarEvents: CalendarEventItem[];
  notifications: NotificationItem[];
  mockSessions: MockInterviewSession[];
  dailyPlan: DailyPlanItem[];
  scoreWeights: {
    resumeQuality: number;
    jobMatch: number;
    skillReadiness: number;
    interviewPerformance: number;
  };
}

const defaultProfile: StudentProfile = {
  id: 'usr_rohan_sharma',
  name: 'Rohan Sharma',
  email: 'rohan.sharma@campus.edu',
  phone: '+91 98765 43210',
  college: 'National Institute of Technology, Trichy',
  degree: 'B.Tech',
  branch: 'Computer Science and Engineering',
  passingBatch: 2027,
  cgpa: 8.64,
  activeBacklogs: 0,
  historyOfBacklogs: 0,
  targetRoles: ['Full-Stack Developer', 'Software Engineer (SDE-1)', 'Backend Engineer'],
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const defaultResumes: Resume[] = [
  {
    id: 'res_primary_mern',
    userId: 'usr_rohan_sharma',
    title: 'Full-Stack Web (React / TypeScript / Node)',
    isPrimary: true,
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    fileName: 'Rohan_Sharma_FullStack_Resume.pdf',
    rawText: `ROHAN SHARMA
Email: rohan.sharma@campus.edu | Phone: +91 98765 43210 | GitHub: github.com/rohansharma | LinkedIn: linkedin.com/in/rohansharma

EDUCATION
National Institute of Technology, Trichy — B.Tech in Computer Science & Engineering (2023 - 2027) | CGPA: 8.64/10
Delhi Public School, R.K. Puram — Class XII (CBSE) | Score: 96.4%

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), C++, Python, SQL, HTML5, CSS3
Frameworks & Libraries: React.js, Next.js, Node.js, Express.js, Tailwind CSS, Redux Toolkit
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, Git, Linux, RESTful APIs, AWS (S3, EC2 basics)
Core Concepts: Data Structures & Algorithms, Object-Oriented Programming (OOP), DBMS, Operating Systems, Computer Networks

PROJECTS
1. CollabSpace — Real-Time Collaborative Workspace
• Engineered a multi-user document editor with operational transformation and WebSockets, reducing synchronization latency by 45%.
• Implemented JWT-based role authentication and Redis caching, supporting over 500 concurrent active socket connections.
• Deployed microservices using Docker containers on AWS EC2 with automated GitHub Actions CI/CD pipeline.

2. DevPulse — Developer Analytics & Code Quality Dashboard
• Built a full-stack Git analytics tool in React and Node.js that visualizes commit velocity, code churn, and test coverage metrics.
• Optimized PostgreSQL relational schemas and query execution paths with indexed foreign keys, accelerating dashboard load times by 30%.
• Integrated OAuth 2.0 GitHub API for secure one-click student repository authentication.

EXPERIENCE & INTERNSHIPS
Software Engineering Intern — TechNova Labs (Summer 2025)
• Developed responsive UI components in React and TypeScript for an internal analytics platform used by 12,000+ daily enterprise users.
• Migrated 14 legacy REST endpoints to modular Express controllers with Zod schema validation, eliminating 98% of payload runtime errors.
• Collaborated in Agile bi-weekly sprints, participating in sprint planning, Jira grooming, and automated unit testing with Jest.

ACHIEVEMENTS & CERTIFICATIONS
• Winner (1st place) at Smart Campus Hackathon 2025 among 140+ competing collegiate teams.
• Solved 450+ problems across LeetCode & GeeksforGeeks with Knight badge (Rating: 1840).
• Meta Certified Front-End Developer Specialization (Coursera).`,
    personalInfo: {
      fullName: 'Rohan Sharma',
      email: 'rohan.sharma@campus.edu',
      phone: '+91 98765 43210',
      github: 'https://github.com/rohansharma',
      linkedin: 'https://linkedin.com/in/rohansharma',
      portfolio: 'https://rohansharma.dev'
    },
    education: [
      {
        institution: 'National Institute of Technology, Trichy',
        degree: 'B.Tech',
        field: 'Computer Science and Engineering',
        yearOfPassing: 2027,
        scoreOrCgpa: '8.64 CGPA'
      }
    ],
    skills: [
      { name: 'TypeScript', category: 'Languages', level: 'Advanced' },
      { name: 'JavaScript', category: 'Languages', level: 'Advanced' },
      { name: 'C++', category: 'Languages', level: 'Intermediate' },
      { name: 'SQL', category: 'Languages', level: 'Advanced' },
      { name: 'React.js', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Node.js', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Express.js', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Tailwind CSS', category: 'Frameworks & Libraries', level: 'Proficient' },
      { name: 'PostgreSQL', category: 'Databases', level: 'Advanced' },
      { name: 'MongoDB', category: 'Databases', level: 'Intermediate' },
      { name: 'Redis', category: 'Databases', level: 'Intermediate' },
      { name: 'Docker', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Git & GitHub', category: 'Tools & Cloud', level: 'Advanced' },
      { name: 'Data Structures & Algorithms', category: 'Core Concepts', level: 'Advanced' },
      { name: 'DBMS & Query Optimization', category: 'Core Concepts', level: 'Advanced' },
      { name: 'Operating Systems & Linux', category: 'Core Concepts', level: 'Intermediate' }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'CollabSpace — Real-Time Collaborative Workspace',
        technologies: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Redis', 'Docker'],
        description: 'Multi-user collaborative document platform with instant synchronization.',
        bullets: [
          'Engineered a multi-user document editor with operational transformation and WebSockets, reducing synchronization latency by 45%.',
          'Implemented JWT-based role authentication and Redis caching, supporting over 500 concurrent active socket connections.',
          'Deployed microservices using Docker containers on AWS EC2 with automated GitHub Actions CI/CD pipeline.'
        ]
      },
      {
        id: 'proj_2',
        title: 'DevPulse — Developer Analytics & Code Quality Dashboard',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'OAuth 2.0'],
        description: 'Full-stack analytics tool visualizing Git commit velocity and metrics.',
        bullets: [
          'Built a full-stack Git analytics tool in React and Node.js that visualizes commit velocity, code churn, and test coverage metrics.',
          'Optimized PostgreSQL relational schemas and query execution paths with indexed foreign keys, accelerating dashboard load times by 30%.',
          'Integrated OAuth 2.0 GitHub API for secure one-click student repository authentication.'
        ]
      }
    ],
    experience: [
      {
        id: 'exp_1',
        role: 'Software Engineering Intern',
        company: 'TechNova Labs',
        duration: 'May 2025 - July 2025',
        location: 'Bengaluru, India',
        bullets: [
          'Developed responsive UI components in React and TypeScript for an internal analytics platform used by 12,000+ daily enterprise users.',
          'Migrated 14 legacy REST endpoints to modular Express controllers with Zod schema validation, eliminating 98% of payload runtime errors.',
          'Collaborated in Agile bi-weekly sprints, participating in sprint planning, Jira grooming, and automated unit testing with Jest.'
        ]
      }
    ],
    certifications: [
      'Meta Certified Front-End Developer Specialization',
      'AWS Certified Cloud Practitioner (Foundational)'
    ],
    achievements: [
      '1st Place Winner at Smart Campus Hackathon 2025 (140+ competing teams)',
      'Solved 450+ problems on LeetCode & GeeksforGeeks (Max Rating: 1840)'
    ],
    generalAnalysis: {
      overallScore: 88,
      scoreBreakdown: {
        contentQuality: 14,
        atsCompatibility: 18,
        skillsDepth: 18,
        projectsAndMetrics: 18,
        experienceQuality: 9,
        formattingAndStructure: 9,
        completeness: 5
      },
      summary: 'Exceptional campus resume with strong quantified project outcomes, categorized skills, and verified internship experience.',
      strengths: [
        'Measurable impact metrics in all project bullets (e.g. -45% latency, +30% load speed)',
        'Clear taxonomy of modern languages, frameworks, and databases',
        'Demonstrated production internship experience and active competitive programming rating'
      ],
      actionVerbsCount: 16,
      quantifiedMetricsCount: 7,
      issues: [
        {
          id: 'iss_1',
          category: 'Keywords',
          severity: 'Suggestion',
          current: 'Backend tech stack is heavily Node/TypeScript focused; missing mention of C#/.NET or Java enterprise paradigms if targeting traditional corporate drives.',
          why: 'Some enterprise placement drives filter specifically for Java/C# keywords in first-pass ATS screening.',
          suggestion: 'Maintain alternate tailored resume versions (like your Java & Spring resume) for enterprise IT recruiters.'
        }
      ],
      keywordDensityHighlights: [
        { keyword: 'React / TypeScript', count: 6, impact: 'High' },
        { keyword: 'Node.js / Express', count: 5, impact: 'High' },
        { keyword: 'PostgreSQL / SQL', count: 4, impact: 'High' },
        { keyword: 'Docker / Cloud', count: 3, impact: 'Medium' }
      ]
    }
  },
  {
    id: 'res_secondary_java',
    userId: 'usr_rohan_sharma',
    title: 'Java & Spring Boot Backend Resume',
    isPrimary: false,
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    fileName: 'Rohan_Sharma_Java_Backend.pdf',
    rawText: `ROHAN SHARMA - Java Backend Engineer
NIT Trichy, B.Tech CSE (2027) | CGPA: 8.64
Skills: Java 17, Spring Boot, Hibernate, Microservices, MySQL, Redis, Kafka, Docker, DSA, OOPs.
Projects: High-Throughput Order Management Engine, Distributed Key-Value Store in Java.`,
    personalInfo: {
      fullName: 'Rohan Sharma',
      email: 'rohan.sharma@campus.edu',
      phone: '+91 98765 43210'
    },
    education: [
      {
        institution: 'National Institute of Technology, Trichy',
        degree: 'B.Tech',
        field: 'Computer Science and Engineering',
        yearOfPassing: 2027,
        scoreOrCgpa: '8.64 CGPA'
      }
    ],
    skills: [
      { name: 'Java 17 / Core Java', category: 'Languages', level: 'Advanced' },
      { name: 'Spring Boot', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Hibernate / JPA', category: 'Frameworks & Libraries', level: 'Intermediate' },
      { name: 'MySQL', category: 'Databases', level: 'Advanced' },
      { name: 'Kafka', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Docker', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'DSA & OOPs', category: 'Core Concepts', level: 'Advanced' }
    ],
    projects: [
      {
        id: 'proj_java_1',
        title: 'High-Throughput Order Processing Engine',
        technologies: ['Java 17', 'Spring Boot', 'Kafka', 'MySQL', 'Redis'],
        description: 'Microservice-based order processing system handling 2,000 transactions/sec.',
        bullets: [
          'Architected an asynchronous order pipeline with Apache Kafka and Spring Boot, achieving throughput of 2,000 TPS.',
          'Engineered idempotency checks and distributed locking with Redis, preventing duplicate debit charges under network partitions.'
        ]
      }
    ],
    experience: [],
    certifications: ['Oracle Certified Associate, Java SE 8 Programmer'],
    achievements: ['Solved 450+ problems on LeetCode'],
    generalAnalysis: {
      overallScore: 78,
      scoreBreakdown: {
        contentQuality: 12,
        atsCompatibility: 16,
        skillsDepth: 16,
        projectsAndMetrics: 14,
        experienceQuality: 6,
        formattingAndStructure: 8,
        completeness: 4
      },
      summary: 'Solid backend resume with strong Java 17 and Spring Boot microservices emphasis.',
      strengths: ['Strong concurrency and messaging knowledge (Kafka, Redis)'],
      actionVerbsCount: 8,
      quantifiedMetricsCount: 3,
      issues: [],
      keywordDensityHighlights: []
    }
  }
];

const defaultOpportunities: OpportunitySummary[] = [
  {
    id: 'opp_great_devs',
    cacNumber: 'CAC/2026-27/084',
    driveTitle: 'Great Developers InfoTech - Campus Placement Drive 2026-27',
    company: {
      name: 'Great Developers InfoTech',
      website: 'https://greatdevelopers.infotech.com',
      industry: 'Enterprise Software & IT Consulting',
      about: 'Great Developers InfoTech is a global technology services provider engineering enterprise cloud solutions, modern web platforms, and intelligent automation for Fortune 500 enterprises.'
    },
    jobRole: 'Software Developer (.NET / Full-Stack)',
    jobType: 'Full-time',
    workMode: 'Work From Office',
    ctc: {
      salaryRange: '₹3.5 - 4.5 LPA',
      baseSalary: '₹3,50,000 / annum (Post-training)',
      stipendDuringTraining: '₹12,000 / month',
      trainingPeriod: '6 Months',
      serviceAgreementOrBond: '18 Months Service Agreement'
    },
    eligibilityCriteria: {
      passingBatch: [2026, 2027],
      eligibleBranches: ['CSE', 'IT', 'AIML', 'AIDS', 'Cyber Security', 'ECE'],
      minimumCgpa: 6.5,
      tenthTwelfthCriteria: '60% or above in 10th and 12th',
      allowedBacklogs: 0,
      otherCriteria: [
        'No active backlogs at the time of joining',
        'Strong problem solving and fundamental programming skills'
      ]
    },
    keyResponsibilities: [
      'Develop, test, and maintain enterprise software components using C#, .NET Core, and modern JavaScript/React.',
      'Design RESTful web services and integrate with relational database backends (SQL Server / PostgreSQL).',
      'Collaborate in agile sprint cycles, unit testing, bug triage, and continuous deployment workflows.',
      'Participate actively in client requirements gathering and technical documentation.'
    ],
    requiredSkills: [
      'C# or Core Java / OOPs',
      '.NET Core / Web APIs',
      'JavaScript / React.js',
      'SQL / Relational Databases',
      'Data Structures & Algorithms',
      'Git & Version Control'
    ],
    preferredSkills: [
      'Azure Cloud Basics',
      'Docker / Microservices',
      'Entity Framework Core',
      'Agile / Scrum methodology'
    ],
    selectionProcess: [
      {
        roundNumber: 1,
        name: 'Resume Shortlisting',
        description: 'Initial eligibility, branch, CGPA, and resume screening',
        isConfirmed: true,
        mode: 'Online'
      },
      {
        roundNumber: 2,
        name: 'Online Assessment (Aptitude & Coding)',
        description: '60 mins: 20 Quantitative/Logical MCQs + 2 Coding Problems in C++/Java/C#/Python',
        duration: '60 Minutes',
        isConfirmed: true,
        mode: 'Online'
      },
      {
        roundNumber: 3,
        name: 'Technical Interview (Round 1)',
        description: 'DSA, OOPs concepts, Database queries, Project walkthrough, and live coding on HackerRank',
        duration: '45 Minutes',
        isConfirmed: true,
        mode: 'Online'
      },
      {
        roundNumber: 4,
        name: 'HR & Managerial Discussion',
        description: 'Communication skills, cultural fit, willingness to relocate, and shift timing alignment',
        duration: '20 Minutes',
        isConfirmed: true,
        mode: 'Online'
      }
    ],
    applicationDeadline: {
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM',
      rawDeadlineText: '13 August 2026, 10:00 AM Sharp'
    },
    registrationLink: 'https://college-portal.edu/placements/cac-084-register',
    cacImportantPolicies: [
      '1. Mandatory Formal Dress Code: Candidates must attend all online and on-campus rounds in 100% formal attire with college ID card.',
      '2. Strict 2-Offer Policy: Once a candidate receives an offer ≥ ₹4.0 LPA, they will be de-registered from lower tier drives.',
      '3. Mandatory Acceptance: Selected students must sign and submit their Letter of Intent to CAC within 3 working days.',
      '4. Disciplinary Debarment: Unexcused absence after registering for Round 2 will result in debarment from the next 3 campus recruitment drives.'
    ],
    rawNoticeText: `CAC PLACEMENT NOTICE: CAC/2026-27/084
Company: Great Developers InfoTech
Role: Software Developer (.NET / Full-Stack)
Eligible Batches: 2026, 2027
Eligible Branches: CSE, IT, AIML, AIDS, Cyber Security, ECE
Eligibility: Min 6.5 CGPA, 0 active backlogs, 60% in 10th/12th
Package: ₹3.5 - 4.5 LPA (Stipend: ₹12,000/mo for 6 months training)
Work Mode: Work From Office
Selection Process: Resume Shortlisting -> Online Assessment (Coding + Aptitude) -> Technical Interview -> HR Round
Deadline: 13 August 2026, 10:00 AM

IMPORTANT CAC GUIDELINES:
- Mandatory formal attire and college ID card required.
- Students must submit accepted offer letter to CAC within 3 days.
- Debarment policy applicable for absenteeism.`,
    createdAt: new Date().toISOString()
  },
  {
    id: 'opp_cloudscale',
    cacNumber: 'CAC/2026-27/092',
    driveTitle: 'CloudScale Technologies - Cloud SDE Campus Drive',
    company: {
      name: 'CloudScale Technologies',
      website: 'https://cloudscale.io',
      industry: 'Cloud Infrastructure & High-Performance Computing',
      about: 'CloudScale Technologies builds high-throughput distributed cloud services and developer platforms empowering hyper-scale SaaS businesses.'
    },
    jobRole: 'Cloud Software Engineer (SDE-1)',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    ctc: {
      salaryRange: '₹8.5 - 10.0 LPA',
      baseSalary: '₹8,50,000 / annum',
      stipendDuringTraining: '₹35,000 / month (Internship)',
      trainingPeriod: '4 Months',
      serviceAgreementOrBond: 'No Bond'
    },
    eligibilityCriteria: {
      passingBatch: [2027],
      eligibleBranches: ['CSE', 'IT', 'AIML'],
      minimumCgpa: 7.5,
      tenthTwelfthCriteria: '70% throughout',
      allowedBacklogs: 0,
      otherCriteria: ['Strong foundation in Linux, networking, and distributed systems']
    },
    keyResponsibilities: [
      'Build resilient backend microservices with Go, TypeScript, and Docker/Kubernetes.',
      'Optimize low-latency database queries across PostgreSQL and Redis clusters.',
      'Implement automated telemetry, logging, and metrics with Prometheus and Grafana.'
    ],
    requiredSkills: [
      'TypeScript or Go or Python',
      'Docker & Containerization',
      'PostgreSQL / Redis',
      'REST APIs & WebSockets',
      'Data Structures & Algorithms',
      'Linux & Networking fundamentals'
    ],
    preferredSkills: [
      'Kubernetes / Helm',
      'AWS / GCP Cloud Services',
      'Kafka / Message Queues',
      'CI/CD Pipelines'
    ],
    selectionProcess: [
      {
        roundNumber: 1,
        name: 'Online Coding Challenge',
        description: '3 LeetCode Medium/Hard algorithmic problems on HackerEarth',
        duration: '90 Minutes',
        isConfirmed: true,
        mode: 'Online'
      },
      {
        roundNumber: 2,
        name: 'Technical Round 1 (System & DSA)',
        description: 'Live coding + System architecture & Linux deep-dive',
        duration: '60 Minutes',
        isConfirmed: true,
        mode: 'Online'
      },
      {
        roundNumber: 3,
        name: 'Bar Raiser / Founder Round',
        description: 'Values, engineering culture, and live scenario design',
        duration: '45 Minutes',
        isConfirmed: true,
        mode: 'Online'
      }
    ],
    applicationDeadline: {
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '05:00 PM',
      rawDeadlineText: 'In 6 days at 5:00 PM'
    },
    registrationLink: 'https://college-portal.edu/placements/cac-092-register',
    cacImportantPolicies: [
      'Dream Tier Opportunity: Offers from this drive supersede Standard tier selections.',
      'Offer letter must be submitted within 24 hours of release.'
    ],
    rawNoticeText: `CloudScale Technologies - Cloud SDE Drive. Batch: 2027. Branches: CSE/IT/AIML. Cutoff: 7.5 CGPA. CTC: 8.5-10 LPA.`,
    createdAt: new Date().toISOString()
  }
];

const defaultDrives: PlacementDriveItem[] = [
  {
    id: 'drv_great_devs',
    userId: 'usr_rohan_sharma',
    opportunity: defaultOpportunities[0],
    selectedResumeId: 'res_primary_mern',
    status: 'Interested',
    notes: 'Registered via CAC portal. Focus on C# OOP basics and practicing LeetCode medium questions.',
    jobMatchScore: 82,
    atsScore: 79,
    eligibilityStatus: 'Eligible',
    statusHistory: [
      {
        status: 'Saved',
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Saved notice from WhatsApp class group'
      },
      {
        status: 'Interested',
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Verified eligibility and started preparation roadmap'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'drv_cloudscale',
    userId: 'usr_rohan_sharma',
    opportunity: defaultOpportunities[1],
    selectedResumeId: 'res_primary_mern',
    status: 'Applied',
    notes: 'Primary dream tier drive. Online coding test scheduled for Saturday.',
    testDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    jobMatchScore: 91,
    atsScore: 88,
    eligibilityStatus: 'Eligible',
    statusHistory: [
      {
        status: 'Saved',
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        status: 'Applied',
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Submitted application on HackerEarth portal'
      }
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const defaultReminders: ReminderItem[] = [
  {
    id: 'rem_1',
    userId: 'usr_rohan_sharma',
    driveId: 'drv_great_devs',
    title: 'Great Developers InfoTech Application Closing',
    message: 'Application window closes in 24 hours at 10:00 AM. Ensure registration is completed on CAC portal.',
    targetDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    timingType: '1 day before',
    category: 'Application Deadline',
    isDelivered: false,
    isCompleted: false
  },
  {
    id: 'rem_2',
    userId: 'usr_rohan_sharma',
    driveId: 'drv_cloudscale',
    title: 'CloudScale Online Coding Round in 4 Days',
    message: '3 Medium/Hard algorithmic coding problems on HackerEarth. Revise Graph Traversals and Dynamic Programming.',
    targetDateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    timingType: 'Custom',
    category: 'Test Reminder',
    isDelivered: false,
    isCompleted: false
  }
];

const defaultCalendarEvents: CalendarEventItem[] = [
  {
    id: 'cal_1',
    userId: 'usr_rohan_sharma',
    driveId: 'drv_great_devs',
    title: 'Deadline: Great Developers InfoTech (CAC/084)',
    startDateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T10:00:00',
    category: 'Application Deadline',
    color: '#ef4444',
    description: 'Registration closes on college CAC portal at 10:00 AM sharp.',
    isCompleted: false
  },
  {
    id: 'cal_2',
    userId: 'usr_rohan_sharma',
    driveId: 'drv_cloudscale',
    title: 'Test: CloudScale Coding Round (HackerEarth)',
    startDateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T18:00:00',
    category: 'Coding Test',
    color: '#6366f1',
    description: '90-minute online coding assessment on HackerEarth platform.',
    isCompleted: false
  },
  {
    id: 'cal_3',
    userId: 'usr_rohan_sharma',
    title: 'Prep Task: Solve 5 SQL Subquery & Indexing Problems',
    startDateTime: new Date().toISOString().split('T')[0] + 'T15:00:00',
    category: 'Preparation Task',
    color: '#10b981',
    description: 'Practice high-frequency campus placement SQL queries.',
    isCompleted: false
  }
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_rohan_sharma',
    title: 'Upcoming Deadline Alert',
    message: 'Great Developers InfoTech application closes tomorrow at 10:00 AM. 1 day remaining.',
    category: 'Deadline Approaching',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionLink: '/tracker'
  },
  {
    id: 'notif_2',
    userId: 'usr_rohan_sharma',
    title: 'Skill Gap Identified for CloudScale',
    message: 'Kafka and Docker are critical for CloudScale SDE-1. Review the generated Day 3 preparation roadmap.',
    category: 'Skill Gap Alert',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    actionLink: '/roadmap'
  },
  {
    id: 'notif_3',
    userId: 'usr_rohan_sharma',
    title: 'Mock Interview Performance Report Ready',
    message: 'Your recent Technical Mock Interview scored 82/100! Your HireReady Score improved by +4 points.',
    category: 'Interview Performance',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    actionLink: '/interview'
  }
];

const defaultMockSessions: MockInterviewSession[] = [
  {
    id: 'mock_sample_1',
    userId: 'usr_rohan_sharma',
    companyName: 'CloudScale Technologies',
    role: 'Cloud Software Engineer (SDE-1)',
    interviewType: 'Technical',
    difficulty: 'Standard SDE-1',
    status: 'Completed',
    startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    currentTurnIndex: 3,
    turns: [
      {
        turnNumber: 1,
        question: 'Explain how Node.js manages asynchronous non-blocking I/O using the event loop and thread pool.',
        category: 'Core Architecture',
        userAnswer: 'Node.js is single threaded for JavaScript execution using V8. For I/O operations like file reading or network requests, it delegates work to the Libuv C++ library which uses a thread pool of 4 worker threads. When completed, callbacks are pushed to the microtask or macrotask queues.',
        evaluation: {
          score: 9,
          technicalAccuracyScore: 9,
          communicationScore: 9,
          completenessScore: 9,
          strengths: ['Accurately mentioned Libuv and worker thread pool', 'Distinguished microtasks vs macrotasks'],
          missingPoints: ['Could briefly mention how timer phases work in Libuv loop'],
          betterAnswer: 'Node.js uses a single execution thread powered by V8 engine and offloads expensive OS operations to Libuv...',
          improvementTip: 'Mentioning that epoll/kqueue are used for sockets without worker threads demonstrates senior-level depth.'
        },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        turnNumber: 2,
        question: 'In your CollabSpace project, how did you handle race conditions or concurrent edits by multiple users?',
        category: 'Project Architecture',
        userAnswer: 'We used WebSockets to broadcast changes and Redis Pub/Sub for syncing between multiple server instances. For document conflict resolution, we implemented basic operational transformation on text offsets.',
        evaluation: {
          score: 8,
          technicalAccuracyScore: 8,
          communicationScore: 8,
          completenessScore: 8,
          strengths: ['Clear explanation of Redis pub/sub message brokering', 'Directly answered the conflict resolution question'],
          missingPoints: ['Could elaborate on character offset transforms vs CRDTs'],
          betterAnswer: 'For distributed real-time collaboration, we decoupled client sockets via Redis pub/sub...',
          improvementTip: 'Compare OT (Operational Transformation) with CRDTs to show trade-off awareness.'
        },
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    report: {
      overallScore: 84,
      technicalScore: 86,
      communicationScore: 82,
      confidenceScore: 85,
      summary: 'Candidate demonstrated great foundational clarity on asynchronous architecture and real-time distributed systems.',
      strongAreas: ['Clear articulation of event loop internals', 'Honest, precise project walkthrough'],
      weakAreas: ['Low-level database transaction isolation edge cases'],
      topicsToRevise: ['Database indexing and B+ Tree depths', 'Linux memory management and virtual paging'],
      detailedFeedback: 'You communicate complex backend concepts with structure and confidence. Keep your project explanations focused on concrete technical trade-offs.'
    }
  }
];

const defaultDailyPlan: DailyPlanItem[] = [
  {
    id: 'dp_1',
    title: 'Revise C# & OOPs fundamentals for Great Developers InfoTech',
    estimatedMinutes: 30,
    category: 'Revision',
    reason: 'Application closes tomorrow; high-frequency topic in screening assessment.',
    driveName: 'Great Developers InfoTech',
    isDone: false
  },
  {
    id: 'dp_2',
    title: 'Solve 3 LeetCode Medium Graph BFS/DFS Problems',
    estimatedMinutes: 45,
    category: 'Practice',
    reason: 'CloudScale SDE-1 coding test heavily evaluates graph traversal patterns.',
    driveName: 'CloudScale Technologies',
    isDone: false
  },
  {
    id: 'dp_3',
    title: 'Refine 2-Minute STAR Pitch for CollabSpace Project',
    estimatedMinutes: 20,
    category: 'Project',
    reason: 'Project walkthrough is the core of round 1 technical interviews.',
    driveName: 'General Prep',
    isDone: true
  },
  {
    id: 'dp_4',
    title: 'Complete 1 Quick 5-Minute AI Mock Interview Session',
    estimatedMinutes: 15,
    category: 'Mock',
    reason: 'Practice real-time technical speaking to boost your HireReady Score.',
    driveName: 'Interview Readiness',
    isDone: false
  }
];

// In-Memory Database Singleton
class Database {
  private state: DatabaseState;

  constructor() {
    this.state = {
      profile: { ...defaultProfile },
      resumes: [...defaultResumes],
      opportunities: [...defaultOpportunities],
      drives: [...defaultDrives],
      reminders: [...defaultReminders],
      calendarEvents: [...defaultCalendarEvents],
      notifications: [...defaultNotifications],
      mockSessions: [...defaultMockSessions],
      dailyPlan: [...defaultDailyPlan],
      scoreWeights: {
        resumeQuality: 0.25,
        jobMatch: 0.30,
        skillReadiness: 0.20,
        interviewPerformance: 0.25
      }
    };
  }

  getProfile(): StudentProfile {
    return this.state.profile;
  }

  updateProfile(updates: Partial<StudentProfile>): StudentProfile {
    this.state.profile = { ...this.state.profile, ...updates };
    return this.state.profile;
  }

  getResumes(): Resume[] {
    return this.state.resumes;
  }

  getPrimaryResume(): Resume {
    const primary = this.state.resumes.find(r => r.isPrimary);
    return primary || this.state.resumes[0];
  }

  addResume(resume: Resume): Resume {
    if (resume.isPrimary) {
      this.state.resumes.forEach(r => { r.isPrimary = false; });
    }
    this.state.resumes.unshift(resume);
    return resume;
  }

  updateResume(id: string, updates: Partial<Resume>): Resume | null {
    const idx = this.state.resumes.findIndex(r => r.id === id);
    if (idx === -1) return null;
    if (updates.isPrimary) {
      this.state.resumes.forEach(r => { r.isPrimary = false; });
    }
    this.state.resumes[idx] = { ...this.state.resumes[idx], ...updates };
    return this.state.resumes[idx];
  }

  deleteResume(id: string): boolean {
    const prevLen = this.state.resumes.length;
    this.state.resumes = this.state.resumes.filter(r => r.id !== id);
    if (this.state.resumes.length > 0 && !this.state.resumes.some(r => r.isPrimary)) {
      this.state.resumes[0].isPrimary = true;
    }
    return this.state.resumes.length < prevLen;
  }

  getOpportunities(): OpportunitySummary[] {
    return this.state.opportunities;
  }

  getOpportunity(id: string): OpportunitySummary | undefined {
    return this.state.opportunities.find(o => o.id === id);
  }

  addOpportunity(opp: OpportunitySummary): OpportunitySummary {
    this.state.opportunities.unshift(opp);
    return opp;
  }

  getDrives(): PlacementDriveItem[] {
    return this.state.drives;
  }

  addDrive(drive: PlacementDriveItem): PlacementDriveItem {
    this.state.drives.unshift(drive);
    return drive;
  }

  updateDrive(id: string, updates: Partial<PlacementDriveItem>): PlacementDriveItem | null {
    const idx = this.state.drives.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.state.drives[idx] = { ...this.state.drives[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.state.drives[idx];
  }

  deleteDrive(id: string): boolean {
    const prevLen = this.state.drives.length;
    this.state.drives = this.state.drives.filter(d => d.id !== id);
    return this.state.drives.length < prevLen;
  }

  getReminders(): ReminderItem[] {
    return this.state.reminders;
  }

  addReminder(reminder: ReminderItem): ReminderItem {
    this.state.reminders.unshift(reminder);
    return reminder;
  }

  updateReminder(id: string, updates: Partial<ReminderItem>): ReminderItem | null {
    const idx = this.state.reminders.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.state.reminders[idx] = { ...this.state.reminders[idx], ...updates };
    return this.state.reminders[idx];
  }

  deleteReminder(id: string): boolean {
    const prevLen = this.state.reminders.length;
    this.state.reminders = this.state.reminders.filter(r => r.id !== id);
    return this.state.reminders.length < prevLen;
  }

  getCalendarEvents(): CalendarEventItem[] {
    return this.state.calendarEvents;
  }

  addCalendarEvent(event: CalendarEventItem): CalendarEventItem {
    this.state.calendarEvents.unshift(event);
    return event;
  }

  updateCalendarEvent(id: string, updates: Partial<CalendarEventItem>): CalendarEventItem | null {
    const idx = this.state.calendarEvents.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.state.calendarEvents[idx] = { ...this.state.calendarEvents[idx], ...updates };
    return this.state.calendarEvents[idx];
  }

  deleteCalendarEvent(id: string): boolean {
    const prevLen = this.state.calendarEvents.length;
    this.state.calendarEvents = this.state.calendarEvents.filter(e => e.id !== id);
    return this.state.calendarEvents.length < prevLen;
  }

  getNotifications(): NotificationItem[] {
    return this.state.notifications;
  }

  addNotification(notif: NotificationItem): NotificationItem {
    this.state.notifications.unshift(notif);
    return notif;
  }

  markNotificationRead(id: string): boolean {
    const item = this.state.notifications.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(): void {
    this.state.notifications.forEach(n => { n.isRead = true; });
  }

  getMockSessions(): MockInterviewSession[] {
    return this.state.mockSessions;
  }

  addMockSession(session: MockInterviewSession): MockInterviewSession {
    this.state.mockSessions.unshift(session);
    return session;
  }

  updateMockSession(id: string, updates: Partial<MockInterviewSession>): MockInterviewSession | null {
    const idx = this.state.mockSessions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.state.mockSessions[idx] = { ...this.state.mockSessions[idx], ...updates };
    return this.state.mockSessions[idx];
  }

  getDailyPlan(): DailyPlanItem[] {
    return this.state.dailyPlan;
  }

  setDailyPlan(plan: DailyPlanItem[]): void {
    this.state.dailyPlan = plan;
  }

  toggleDailyPlanItem(id: string): DailyPlanItem | null {
    const item = this.state.dailyPlan.find(p => p.id === id);
    if (item) {
      item.isDone = !item.isDone;
      return item;
    }
    return null;
  }

  getScoreWeights() {
    return this.state.scoreWeights;
  }

  updateScoreWeights(weights: Partial<DatabaseState['scoreWeights']>) {
    this.state.scoreWeights = { ...this.state.scoreWeights, ...weights };
    return this.state.scoreWeights;
  }

  calculateHireReadyScore(): HireReadyScoreData {
    const primaryResume = this.getPrimaryResume();
    const resumeScore = primaryResume?.generalAnalysis?.overallScore || 85;

    // Average match score across saved drives
    const driveScores = this.state.drives.map(d => d.jobMatchScore || 80);
    const jobMatchScore = driveScores.length > 0 
      ? Math.round(driveScores.reduce((a, b) => a + b, 0) / driveScores.length)
      : 82;

    // Skill readiness
    const skillReadinessScore = 80;

    // Average interview score
    const completedMocks = this.state.mockSessions.filter(s => s.status === 'Completed' && s.report);
    const interviewReadinessScore = completedMocks.length > 0
      ? Math.round(completedMocks.reduce((a, b) => a + (b.report?.overallScore || 80), 0) / completedMocks.length)
      : 84;

    const w = this.state.scoreWeights;
    const overallScore = Math.round(
      resumeScore * w.resumeQuality +
      jobMatchScore * w.jobMatch +
      skillReadinessScore * w.skillReadiness +
      interviewReadinessScore * w.interviewPerformance
    );

    return {
      overallScore: Math.min(100, Math.max(0, overallScore)),
      resumeScore,
      jobMatchScore,
      skillReadinessScore,
      interviewReadinessScore,
      weights: { ...w },
      recentChanges: [
        {
          factor: 'Interview Readiness',
          delta: +4,
          explanation: 'Your mock interview score improved to 84/100 after practicing asynchronous system questions.'
        },
        {
          factor: 'Job Match',
          delta: +3,
          explanation: 'Saved CloudScale Technologies drive with high 91% alignment to your primary resume.'
        }
      ]
    };
  }

  getAnalytics(): PlacementAnalytics {
    const drives = this.state.drives;
    const applied = drives.filter(d => ['Applied', 'Resume Shortlisted', 'Test Scheduled', 'Interview Scheduled', 'Selected', 'Offer Accepted'].includes(d.status)).length;
    const shortlisted = drives.filter(d => ['Resume Shortlisted', 'Test Scheduled', 'Interview Scheduled', 'Selected', 'Offer Accepted'].includes(d.status)).length;
    const interviewed = drives.filter(d => ['Interview Scheduled', 'Selected', 'Offer Accepted'].includes(d.status)).length;
    const selected = drives.filter(d => ['Selected', 'Offer Accepted'].includes(d.status)).length;

    const shortlistingRate = applied > 0 ? Math.round((shortlisted / applied) * 100) : 75;
    const interviewSuccessRate = interviewed > 0 ? Math.round((selected / interviewed) * 100) : 60;

    const avgMatch = drives.length > 0
      ? Math.round(drives.reduce((a, d) => a + (d.jobMatchScore || 80), 0) / drives.length)
      : 85;

    const primaryResume = this.getPrimaryResume();
    const avgResume = primaryResume?.generalAnalysis?.overallScore || 88;

    const completedMocks = this.state.mockSessions.filter(s => s.report);
    const avgMock = completedMocks.length > 0
      ? Math.round(completedMocks.reduce((a, s) => a + (s.report?.overallScore || 80), 0) / completedMocks.length)
      : 84;

    const statusCounts: Record<string, number> = {};
    drives.forEach(d => {
      statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
    });

    return {
      applicationsCount: applied || 2,
      shortlistingRate,
      interviewSuccessRate,
      averageJobMatchScore: avgMatch,
      averageResumeScore: avgResume,
      averageMockInterviewScore: avgMock,
      topMissingSkills: [
        { skill: 'C# / .NET Core', count: 3 },
        { skill: 'Docker & Kubernetes', count: 2 },
        { skill: 'Apache Kafka', count: 2 },
        { skill: 'System Design / Rate Limiting', count: 1 }
      ],
      preparationCompletionRate: 68,
      statusDistribution: Object.entries(statusCounts).map(([status, count]) => ({
        status: status as any,
        count
      })),
      scoreTrendHistory: [
        { date: 'Week 1', score: 68, event: 'Initial Resume Uploaded' },
        { date: 'Week 2', score: 73, event: 'Added Quantified Metrics & Projects' },
        { date: 'Week 3', score: 79, event: 'Completed Great Devs Preparation Sprint' },
        { date: 'Current', score: 84, event: 'Completed CloudScale Mock Interview' }
      ]
    };
  }

  resetToDemo(): void {
    this.state = {
      profile: { ...defaultProfile },
      resumes: [...defaultResumes],
      opportunities: [...defaultOpportunities],
      drives: [...defaultDrives],
      reminders: [...defaultReminders],
      calendarEvents: [...defaultCalendarEvents],
      notifications: [...defaultNotifications],
      mockSessions: [...defaultMockSessions],
      dailyPlan: [...defaultDailyPlan],
      scoreWeights: {
        resumeQuality: 0.25,
        jobMatch: 0.30,
        skillReadiness: 0.20,
        interviewPerformance: 0.25
      }
    };
  }
}

export const db = new Database();
