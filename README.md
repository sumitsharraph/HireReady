# 🎓 HireReady — Campus Placement Intelligence & Preparation Platform

**HireReady** is a comprehensive, production-ready AI platform designed specifically for college students and placement cell candidates preparing for campus recruitment drives, CAC (Corporate Advisory & Placement Cell) circulars, ATS resume matching, AI mock interviews, and personalized preparation roadmaps.

---

## 🚀 Key Features

1. **AI Notice Parser**: Automatically extracts Company details, CTC breakdown, Eligibility criteria (Branch, CGPA, Backlogs), Selection rounds, and Application deadlines from raw notices copied from WhatsApp groups, email, or circulars.
2. **Resume Intelligence & 100-Point ATS**: Multi-resume management (Full-Stack, Backend, Data Science, Premade placement templates), action verb analysis, quantified metrics scoring, and deep ATS compatibility diagnostics.
3. **Role & Opportunity Matching**: Calculates overall fit score (0–100%), highlights missing skills, and matches against student profiles.
4. **Day-by-Day Preparation Roadmap**: Generates a timeline with resources, syllabus targets, and daily checklist items.
5. **Interview Question Generator**: 15+ company and role-specific interview questions categorized into Technical, System Design, Coding, and HR behavioral questions.
6. **AI Mock Interviewer (Voice & Text)**: Real-time conversational interview turns with AI scoring (Accuracy, Communication, Completeness) and detailed final feedback reports.
7. **Placement Drive Tracker & Kanban**: Track applications across Saved, Applied, Shortlisted, Online Assessment, Interview, and Offered stages.
8. **Deadlines & Calendar**: Synchronized calendar with deadline countdowns, browser push notifications, and customizable alert intervals.
9. **Dark / Light Mode**: Reactive high-contrast theme support with system preference auto-detection.
10. **Google Account & Student Profile Sync**: Integrated authentication and profile configuration for eligibility criteria checks.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Recharts, Canvas Confetti
- **Backend / API**: Node.js, Express, Serverless (`/api`)
- **AI Engine**: Google Gemini API (`@google/genai`) with reliable heuristic fallbacks
- **Bundler & Build**: Vite, esbuild, TypeScript

---

## 📦 How to Push to GitHub

Follow these simple steps in your terminal:

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "feat: complete HireReady placement intelligence platform"

# 4. Rename main branch
git branch -M main

# 5. Connect to your GitHub repository
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🌐 Deploy to Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Import your GitHub repository.
3. In **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key from Google AI Studio)*
4. Click **Deploy**.
5. *Vercel will automatically build the frontend and deploy the serverless `/api` routes!*

---

## ⚡ Deploy to Netlify

1. Go to [Netlify](https://www.netlify.com) and click **"Add new site" -> "Import an existing project"**.
2. Select your GitHub repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Under **Environment variables**, set:
   - `GEMINI_API_KEY`: *(Your Gemini API key)*
6. Click **Deploy Site**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
