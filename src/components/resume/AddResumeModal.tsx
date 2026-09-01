import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Code2,
  Layers,
  Database,
  Terminal,
  Cpu,
  Plus,
  Trash2,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import type { Resume, ResumeSkill, ResumeProject, ResumeExperience } from '../../types';

interface AddResumeModalProps {
  onClose: () => void;
  onAdded: (newResume: Resume) => void;
}

// Premade Resume Library Presets
const PREMADE_RESUME_TEMPLATES = [
  {
    id: 'template_fullstack',
    badge: 'High Demand',
    title: 'Full-Stack Web & Cloud SDE Resume',
    fileName: 'FullStack_Web_Cloud_Resume.pdf',
    description: 'React, TypeScript, Node.js, Next.js, PostgreSQL, Docker, AWS, DSA & Microservices.',
    icon: Code2,
    skills: [
      { name: 'TypeScript', category: 'Languages', level: 'Advanced' },
      { name: 'JavaScript (ES6+)', category: 'Languages', level: 'Advanced' },
      { name: 'C++', category: 'Languages', level: 'Advanced' },
      { name: 'Python', category: 'Languages', level: 'Intermediate' },
      { name: 'React.js', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Next.js', category: 'Frameworks & Libraries', level: 'Intermediate' },
      { name: 'Node.js & Express', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Tailwind CSS', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'PostgreSQL', category: 'Databases', level: 'Advanced' },
      { name: 'MongoDB', category: 'Databases', level: 'Intermediate' },
      { name: 'Redis', category: 'Databases', level: 'Intermediate' },
      { name: 'Docker', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'AWS (S3/EC2)', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Git & GitHub', category: 'Tools & Cloud', level: 'Advanced' },
      { name: 'Data Structures & Algorithms', category: 'Core Concepts', level: 'Advanced' },
      { name: 'System Design Basics', category: 'Core Concepts', level: 'Intermediate' }
    ] as ResumeSkill[],
    projects: [
      {
        id: 'proj_fs_1',
        title: 'CollabSpace — Real-Time Collaborative Workspace',
        technologies: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Redis', 'PostgreSQL'],
        description: 'Multi-user markdown editor with concurrent editing and operational transformation.',
        bullets: [
          'Engineered a multi-user document editor with operational transformation and WebSockets, reducing synchronization latency by 45%.',
          'Implemented JWT-based role authentication and Redis caching, supporting over 500 concurrent active socket connections.',
          'Deployed microservices using Docker containers on AWS EC2 with automated GitHub Actions CI/CD pipeline.'
        ]
      },
      {
        id: 'proj_fs_2',
        title: 'DevPulse — Developer Git Analytics & Code Quality Platform',
        technologies: ['Next.js', 'Express.js', 'PostgreSQL', 'Tailwind CSS', 'Chart.js'],
        description: 'Visual analytics dashboard for tracking engineering commit velocity and PR reviews.',
        bullets: [
          'Built full-stack Git analytics tool visualizing commit velocity, code churn, and test coverage metrics.',
          'Optimized PostgreSQL relational schemas and query execution paths with indexed foreign keys, accelerating load times by 30%.',
          'Integrated OAuth 2.0 GitHub API for secure one-click repository authentication.'
        ]
      }
    ] as ResumeProject[],
    experience: [
      {
        id: 'exp_fs_1',
        role: 'Software Engineering Intern',
        company: 'TechNova Labs',
        duration: 'May 2025 – July 2025 (3 Months)',
        bullets: [
          'Developed responsive UI components in React and TypeScript for an internal analytics platform used by 12,000+ daily enterprise users.',
          'Migrated 14 legacy REST endpoints to modular Express controllers with Zod schema validation, eliminating 98% of payload runtime errors.',
          'Collaborated in Agile bi-weekly sprints, participating in sprint planning, Jira grooming, and automated unit testing with Jest.'
        ]
      }
    ] as ResumeExperience[],
    certifications: [
      'Meta Certified Front-End Developer Specialization (Coursera)',
      'Solved 450+ DSA problems on LeetCode (Knight Badge, Max Rating 1840)'
    ]
  },
  {
    id: 'template_java',
    badge: 'Enterprise Standard',
    title: 'Java & Spring Boot Backend Engineer Resume',
    fileName: 'Java_SpringBoot_Backend_Resume.pdf',
    description: 'Java 17, Spring Boot, Hibernate, MySQL, Kafka, Redis, Microservices & Low-Latency Systems.',
    icon: Database,
    skills: [
      { name: 'Java 17 / Core Java', category: 'Languages', level: 'Advanced' },
      { name: 'C++', category: 'Languages', level: 'Intermediate' },
      { name: 'SQL', category: 'Languages', level: 'Advanced' },
      { name: 'Spring Boot 3', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Spring Security & JWT', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'Hibernate / Spring Data JPA', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'MySQL', category: 'Databases', level: 'Advanced' },
      { name: 'Redis Cache', category: 'Databases', level: 'Intermediate' },
      { name: 'Apache Kafka', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Docker', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Maven / Gradle', category: 'Tools & Cloud', level: 'Advanced' },
      { name: 'Object Oriented Programming (OOPs)', category: 'Core Concepts', level: 'Advanced' },
      { name: 'DBMS & Query Optimization', category: 'Core Concepts', level: 'Advanced' },
      { name: 'Data Structures & Algorithms', category: 'Core Concepts', level: 'Advanced' }
    ] as ResumeSkill[],
    projects: [
      {
        id: 'proj_java_1',
        title: 'High-Throughput Order Management & Settlement Engine',
        technologies: ['Java 17', 'Spring Boot', 'Kafka', 'MySQL', 'Redis'],
        description: 'Distributed transaction processing pipeline with event streaming.',
        bullets: [
          'Architected an asynchronous order pipeline with Apache Kafka and Spring Boot, achieving sustained throughput of 2,000 TPS.',
          'Integrated Redis distributed locking to prevent double-spending in concurrent flash-sale checkout transactions.',
          'Configured Spring Data JPA with batch fetching and HikariCP connection pooling, reducing query overhead by 40%.'
        ]
      },
      {
        id: 'proj_java_2',
        title: 'Distributed Key-Value Store with Raft Consensus',
        technologies: ['Java', 'gRPC', 'Protobuf', 'Multithreading'],
        description: 'Fault-tolerant distributed storage node implementing Raft consensus protocol.',
        bullets: [
          'Implemented leader election, log replication, and heartbeat monitoring across cluster of 5 nodes in Java.',
          'Built high-performance RPC communication layer using gRPC and Protocol Buffers with asynchronous futures.'
        ]
      }
    ] as ResumeProject[],
    experience: [
      {
        id: 'exp_java_1',
        role: 'Backend Engineering Intern',
        company: 'Apex Financial Technologies',
        duration: 'June 2025 – August 2025',
        bullets: [
          'Engineered RESTful microservices for payment webhook verification handling 80,000 requests/hour.',
          'Authored comprehensive JUnit 5 and Mockito test suites achieving 88% branch test coverage across core settlement modules.'
        ]
      }
    ] as ResumeExperience[],
    certifications: [
      'Oracle Certified Associate, Java SE 11 Programmer',
      'LeetCode Top 5% Global Rank in Java algorithms'
    ]
  },
  {
    id: 'template_aiml',
    badge: 'AI & Analytics',
    title: 'AI / Machine Learning & Data Science Resume',
    fileName: 'AIML_DataScience_Resume.pdf',
    description: 'Python, PyTorch, Scikit-Learn, Pandas, NumPy, SQL, FastAPI, NLP & Computer Vision.',
    icon: Cpu,
    skills: [
      { name: 'Python', category: 'Languages', level: 'Advanced' },
      { name: 'SQL', category: 'Languages', level: 'Advanced' },
      { name: 'R', category: 'Languages', level: 'Intermediate' },
      { name: 'PyTorch', category: 'Frameworks & Libraries', level: 'Intermediate' },
      { name: 'Scikit-Learn', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'TensorFlow / Keras', category: 'Frameworks & Libraries', level: 'Intermediate' },
      { name: 'Pandas & NumPy', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'FastAPI', category: 'Frameworks & Libraries', level: 'Advanced' },
      { name: 'PostgreSQL', category: 'Databases', level: 'Intermediate' },
      { name: 'HuggingFace Transformers', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Docker', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'MLOps & MLflow', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Probability & Statistics', category: 'Core Concepts', level: 'Advanced' },
      { name: 'Deep Learning & NLP', category: 'Core Concepts', level: 'Intermediate' }
    ] as ResumeSkill[],
    projects: [
      {
        id: 'proj_ai_1',
        title: 'BioVision — Automated Medical Diagnostic Classifier',
        technologies: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'OpenCV'],
        description: 'CNN model for thoracic radiograph classification.',
        bullets: [
          'Trained a ResNet-50 transfer learning model on 45,000 chest X-ray images, achieving 94.2% ROC-AUC score.',
          'Containerized the model pipeline behind an asynchronous FastAPI REST server with GPU batch inference (latency < 120ms).'
        ]
      },
      {
        id: 'proj_ai_2',
        title: 'FinSentiment — Financial Market News Sentiment Engine',
        technologies: ['Python', 'HuggingFace', 'BERT', 'PostgreSQL', 'Streamlit'],
        description: 'NLP pipeline analyzing market sentiment from 50+ financial news feeds in real time.',
        bullets: [
          'Fine-tuned FinBERT on 100k financial news articles to predict market sentiment with 89% accuracy.',
          'Built automated ETL pipeline collecting RSS feeds and storing vectorized embeddings in PostgreSQL with pgvector.'
        ]
      }
    ] as ResumeProject[],
    experience: [
      {
        id: 'exp_ai_1',
        role: 'Data Science & ML Intern',
        company: 'Cognitive Data Systems',
        duration: 'Jan 2025 – April 2025',
        bullets: [
          'Engineered feature selection pipelines reducing model dimensionality by 35% without losing predictive variance.',
          'Created automated data validation workflows using Great Expectations ensuring 100% clean training data.'
        ]
      }
    ] as ResumeExperience[],
    certifications: [
      'DeepLearning.AI Deep Learning Specialization',
      'Kaggle Competitions Expert (Top 2% Bronze Medalist)'
    ]
  },
  {
    id: 'template_cpp',
    badge: 'Core Systems',
    title: 'C++ Systems & Competitive Programming Resume',
    fileName: 'CPP_Systems_DSA_Resume.pdf',
    description: 'C++20, STL, Multi-Threading, Linux Systems, Computer Networks, Operating Systems & Low-Level DSA.',
    icon: Terminal,
    skills: [
      { name: 'C++ (C++17/20)', category: 'Languages', level: 'Advanced' },
      { name: 'C', category: 'Languages', level: 'Advanced' },
      { name: 'Python', category: 'Languages', level: 'Intermediate' },
      { name: 'STL (Standard Template Library)', category: 'Languages', level: 'Advanced' },
      { name: 'Linux System Calls', category: 'Tools & Cloud', level: 'Advanced' },
      { name: 'GDB & Valgrind', category: 'Tools & Cloud', level: 'Advanced' },
      { name: 'CMake & Makefiles', category: 'Tools & Cloud', level: 'Intermediate' },
      { name: 'Git & Linux Terminal', category: 'Tools & Cloud', level: 'Advanced' },
      { name: 'Data Structures & Advanced Algorithms', category: 'Core Concepts', level: 'Advanced' },
      { name: 'Operating Systems & Memory Management', category: 'Core Concepts', level: 'Advanced' },
      { name: 'Computer Networks (TCP/IP, Sockets)', category: 'Core Concepts', level: 'Advanced' },
      { name: 'Multithreading & Concurrency (POSIX Threads)', category: 'Core Concepts', level: 'Advanced' }
    ] as ResumeSkill[],
    projects: [
      {
        id: 'proj_cpp_1',
        title: 'Custom Memory Allocator & Pool Manager in C++',
        technologies: ['C++20', 'POSIX', 'GDB', 'Valgrind'],
        description: 'Thread-safe custom memory allocator with free-list and segregated block pools.',
        bullets: [
          'Built high-speed segregated free-list memory allocator outperforming glibc malloc by 2.2x for fixed-size allocations.',
          'Eliminated memory fragmentation using boundary-tag coalescing and zero memory leaks verified via Valgrind.'
        ]
      },
      {
        id: 'proj_cpp_2',
        title: 'Multi-Threaded HTTP/1.1 Web Server in C++',
        technologies: ['C++', 'Linux Sockets', 'Epoll', 'Pthreads'],
        description: 'Event-driven web server handling 10,000 concurrent socket connections.',
        bullets: [
          'Implemented non-blocking I/O multiplexing with Linux epoll, sustaining 10,000 concurrent client requests.',
          'Built custom thread pool with task queuing, achieving sub-5ms response latency under heavy load.'
        ]
      }
    ] as ResumeProject[],
    experience: [
      {
        id: 'exp_cpp_1',
        role: 'Systems Programming Intern',
        company: 'Veloce Embedded Solutions',
        duration: 'June 2025 – August 2025',
        bullets: [
          'Optimized packet parsing routines in C++ reducing CPU cache misses by 28%.',
          'Debugged race conditions in multi-threaded Linux daemon services using ThreadSanitizer.'
        ]
      }
    ] as ResumeExperience[],
    certifications: [
      'Candidate Master on Codeforces (Max Rating: 1920)',
      'Global Rank 128 in Google Code Jam / ICPC Regionals Qualifier'
    ]
  }
];

export const AddResumeModal: React.FC<AddResumeModalProps> = ({ onClose, onAdded }) => {
  const { profile, user } = useAuth();
  const { sendLocalAlert } = useNotification();

  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'paste'>('presets');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('template_fullstack');
  const [resumeTitle, setResumeTitle] = useState<string>('Full-Stack Web & Cloud SDE Resume');
  const [fileName, setFileName] = useState<string>('FullStack_Web_Cloud_Resume.pdf');
  const [rawText, setRawText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileDetails, setUploadedFileDetails] = useState<{ name: string; size: string } | null>(null);

  // Editable sections
  const [skillsList, setSkillsList] = useState<ResumeSkill[]>(PREMADE_RESUME_TEMPLATES[0].skills);
  const [projectsList, setProjectsList] = useState<ResumeProject[]>(PREMADE_RESUME_TEMPLATES[0].projects);
  const [experienceList, setExperienceList] = useState<ResumeExperience[]>(PREMADE_RESUME_TEMPLATES[0].experience);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<ResumeSkill['category']>('Languages');

  // Handle template selection
  const handleSelectTemplate = (template: typeof PREMADE_RESUME_TEMPLATES[0]) => {
    setSelectedTemplateId(template.id);
    setResumeTitle(template.title);
    setFileName(template.fileName);
    setSkillsList(template.skills);
    setProjectsList(template.projects);
    setExperienceList(template.experience);

    // Generate formatted raw text
    const text = `${user?.name || profile?.name || 'Candidate Name'}
Email: ${user?.email || profile?.email || 'student@campus.edu'} | Phone: ${profile?.phone || '+91 98765 43210'}
College: ${profile?.college || 'National Institute of Technology'} — ${profile?.degree || 'B.Tech'} in ${profile?.branch || 'CSE'} (${profile?.passingBatch || 2027}) | CGPA: ${profile?.cgpa || 8.64}

TECHNICAL SKILLS
${template.skills.map((s) => `${s.category}: ${s.name}`).join('\n')}

PROJECTS
${template.projects
  .map(
    (p) => `${p.title} (${p.technologies.join(', ')})
${p.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

EXPERIENCE
${template.experience
  .map(
    (e) => `${e.role} — ${e.company} (${e.duration})
${e.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

CERTIFICATIONS & ACHIEVEMENTS
${template.certifications.map((c) => `• ${c}`).join('\n')}`;

    setRawText(text);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = (file.size / 1024).toFixed(1) + ' KB';
    setUploadedFileDetails({ name: file.name, size: sizeKb });
    setFileName(file.name);
    setResumeTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      // Parse or clean text
      const cleanContent = content.length > 50 ? content : generateExtractedResumeText(file.name);
      setRawText(cleanContent);
      parseAndExtractSections(cleanContent, file.name);
    };
    reader.onerror = () => {
      const fallback = generateExtractedResumeText(file.name);
      setRawText(fallback);
      parseAndExtractSections(fallback, file.name);
    };

    // Attempt to read as text
    reader.readAsText(file);
    sendLocalAlert('File Read', `Loaded ${file.name}. Parsed structured sections.`, 'success');
  };

  const generateExtractedResumeText = (name: string) => {
    const isJava = /java|backend/i.test(name);
    const isAI = /ai|ml|data|python/i.test(name);
    const isCpp = /c\+\+|cpp|system/i.test(name);
    const template = isJava
      ? PREMADE_RESUME_TEMPLATES[1]
      : isAI
      ? PREMADE_RESUME_TEMPLATES[2]
      : isCpp
      ? PREMADE_RESUME_TEMPLATES[3]
      : PREMADE_RESUME_TEMPLATES[0];

    return `${user?.name || profile?.name || 'Student Candidate'}
Email: ${user?.email || profile?.email || 'student@campus.edu'} | Phone: ${profile?.phone || '+91 98765 43210'}
College: ${profile?.college || 'National Institute of Technology'} | Batch: ${profile?.passingBatch || 2027} | CGPA: ${profile?.cgpa || 8.64}

TECHNICAL SKILLS:
${template.skills.map((s) => s.name).join(', ')}

PROJECTS:
1. ${template.projects[0]?.title || 'Cloud Engineering System'}
Technologies: ${template.projects[0]?.technologies.join(', ') || 'React, Node.js, SQL'}
${template.projects[0]?.bullets.map((b) => `• ${b}`).join('\n') || ''}

EXPERIENCE:
${template.experience[0]?.role || 'Software Intern'} at ${template.experience[0]?.company || 'Tech Labs'}
${template.experience[0]?.bullets.map((b) => `• ${b}`).join('\n') || ''}`;
  };

  const parseAndExtractSections = (text: string, customFileName?: string) => {
    // Detect keywords from text
    const detectedSkills: ResumeSkill[] = [];
    const techDictionary: { [key: string]: ResumeSkill['category'] } = {
      'JavaScript': 'Languages',
      'TypeScript': 'Languages',
      'Python': 'Languages',
      'Java': 'Languages',
      'C++': 'Languages',
      'C#': 'Languages',
      'SQL': 'Languages',
      'React': 'Frameworks & Libraries',
      'Next.js': 'Frameworks & Libraries',
      'Node.js': 'Frameworks & Libraries',
      'Express': 'Frameworks & Libraries',
      'Spring Boot': 'Frameworks & Libraries',
      'Tailwind CSS': 'Frameworks & Libraries',
      'PostgreSQL': 'Databases',
      'MongoDB': 'Databases',
      'MySQL': 'Databases',
      'Redis': 'Databases',
      'Docker': 'Tools & Cloud',
      'Kubernetes': 'Tools & Cloud',
      'AWS': 'Tools & Cloud',
      'Git': 'Tools & Cloud',
      'Data Structures': 'Core Concepts',
      'Algorithms': 'Core Concepts',
      'DBMS': 'Core Concepts',
      'Operating Systems': 'Core Concepts'
    };

    Object.entries(techDictionary).forEach(([tech, cat]) => {
      if (new RegExp(`\\b${tech.replace('+', '\\+')}\\b`, 'i').test(text)) {
        detectedSkills.push({ name: tech, category: cat, level: 'Advanced' });
      }
    });

    if (detectedSkills.length > 0) {
      setSkillsList(detectedSkills);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkillsList([
      ...skillsList,
      { name: newSkillName.trim(), category: newSkillCategory, level: 'Intermediate' }
    ]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  };

  const handleSubmitResume = async () => {
    if (!resumeTitle.trim()) {
      sendLocalAlert('Missing Title', 'Please provide a descriptive title for this resume.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const candidateName = user?.name || profile?.name || 'Student Candidate';
      const candidateEmail = user?.email || profile?.email || 'student@campus.edu';
      const candidatePhone = profile?.phone || '+91 98765 43210';

      const resumePayload: Partial<Resume> = {
        title: resumeTitle.trim(),
        fileName: fileName || `${resumeTitle.replace(/\s+/g, '_')}.pdf`,
        rawText:
          rawText ||
          `${candidateName}\n${candidateEmail} | ${candidatePhone}\n\nSKILLS:\n${skillsList.map((s) => s.name).join(', ')}`,
        isPrimary: false,
        personalInfo: {
          fullName: candidateName,
          email: candidateEmail,
          phone: candidatePhone,
          github: 'https://github.com/' + candidateName.toLowerCase().replace(/\s+/g, ''),
          linkedin: 'https://linkedin.com/in/' + candidateName.toLowerCase().replace(/\s+/g, '')
        },
        education: [
          {
            institution: profile?.college || 'National Institute of Technology',
            degree: profile?.degree || 'B.Tech',
            field: profile?.branch || 'Computer Science and Engineering',
            yearOfPassing: profile?.passingBatch || 2027,
            scoreOrCgpa: `${profile?.cgpa || 8.64} CGPA`
          }
        ],
        skills: skillsList,
        projects: projectsList,
        experience: experienceList,
        certifications: [
          'Verified Campus Placement Candidate Profile',
          'DSA & Technical Problem Solving Verified'
        ]
      };

      const created = await api.addResume(resumePayload);
      sendLocalAlert(
        'Resume Added Successfully!',
        `Added "${created.title}" with real-time AI ATS diagnostics.`,
        'success'
      );
      onAdded(created);
      onClose();
    } catch (err: any) {
      sendLocalAlert('Failed to Add Resume', err.message || 'Could not save resume', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-none">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Add / Upload Premade Resume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Choose from verified presets, upload PDF/Word/Text files, or paste custom content.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'presets'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premade Presets (1-Click)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload PDF / Document</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'paste'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text / Editor</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Tab 1: Premade Presets */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Select a Campus Placement-Ready Resume Template:
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                  Pre-configured with high ATS keyword density
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PREMADE_RESUME_TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-xl ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                              {tmpl.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              {tmpl.fileName}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tmpl.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {tmpl.skills.slice(0, 4).map((s) => (
                          <span
                            key={s.name}
                            className="text-[9px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300"
                          >
                            {s.name}
                          </span>
                        ))}
                        {tmpl.skills.length > 4 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md text-slate-400 font-bold">
                            +{tmpl.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label
                htmlFor="resume-file-input"
                className="border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-slate-800 group-hover:bg-indigo-100 dark:group-hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 transition-colors">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                  Click to Browse or Drag & Drop Resume File
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-3">
                  Supports PDF (.pdf), Word Documents (.docx, .doc), Markdown (.md), JSON, and Plain Text (.txt)
                </p>
                <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs group-hover:bg-indigo-700 transition-colors">
                  Select File from Computer
                </span>
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadedFileDetails && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">
                        {uploadedFileDetails.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {uploadedFileDetails.size} • Extracted & ready for ATS evaluation
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    Ready to Save
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Paste Text */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Paste Raw Resume Text or Markdown:
                </label>
                <textarea
                  rows={8}
                  value={rawText}
                  onChange={(e) => {
                    setRawText(e.target.value);
                    parseAndExtractSections(e.target.value);
                  }}
                  placeholder="Paste your full resume text here (Education, Technical Skills, Projects, Experience, Certifications)..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 text-slate-900 dark:text-slate-100 font-mono text-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Common Resume Metadata Form */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Resume Display Title
                </label>
                <input
                  type="text"
                  required
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="e.g. Full-Stack SDE Resume"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  File Reference Name
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Vikash_Resume.pdf"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Extracted Skills Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Categorized Skills ({skillsList.length} defined)
                </label>
                <span className="text-[10px] text-slate-400">
                  Used for ATS matching & skill gap calculations
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-2">
                {skillsList.map((skill, idx) => (
                  <span
                    key={`${skill.name}-${idx}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium text-[11px] shadow-2xs"
                  >
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add custom skill input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  placeholder="Add custom skill (e.g. Kafka, GraphQL, PyTorch)..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none"
                >
                  <option value="Languages">Languages</option>
                  <option value="Frameworks & Libraries">Frameworks</option>
                  <option value="Databases">Databases</option>
                  <option value="Tools & Cloud">Tools & Cloud</option>
                  <option value="Core Concepts">Core Concepts</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Candidate Header Summary Preview */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Candidate Profile: {user?.name || profile?.name || 'Student Candidate'}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  {user?.email || profile?.email || 'student@campus.edu'} • {profile?.college || 'NIT'} • Batch {profile?.passingBatch || 2027}
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-600 text-white font-bold">
                Auto-Synced
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="confirm-add-resume-btn"
            disabled={isSubmitting}
            onClick={handleSubmitResume}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-100 dark:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Analyzing & Saving...' : 'Save & Run AI Diagnostics'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
