import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Send,
  CheckCircle2,
  Award,
  BarChart3,
  RotateCcw,
  Building2,
  HelpCircle,
  AlertTriangle,
  Play,
  StopCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import type { MockInterviewSession, MockInterviewTurn, MockInterviewReport } from '../../types';

export const MockInterviewView: React.FC = () => {
  const { opportunities, activeOpportunity, refreshAllData } = useApp();
  const { sendLocalAlert } = useNotification();

  const [activeSession, setActiveSession] = useState<MockInterviewSession | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmittingTurn, setIsSubmittingTurn] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [pastSessions, setPastSessions] = useState<MockInterviewSession[]>([]);

  // Setup form state
  const [companyName, setCompanyName] = useState(activeOpportunity?.company.name || 'CloudScale Technologies');
  const [role, setRole] = useState(activeOpportunity?.jobRole || 'Cloud Software Engineer (SDE-1)');
  const [interviewType, setInterviewType] = useState<'Technical' | 'Project Walkthrough' | 'Behavioral / HR' | 'System Architecture'>('Technical');
  const [difficulty, setDifficulty] = useState('Standard SDE-1');

  // Active turn state
  const [userAnswer, setUserAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Load past history
  const loadHistory = async () => {
    try {
      const history = await api.getMockHistory();
      setPastSessions(history);
      const inProgress = history.find(s => s.status === 'In Progress');
      if (inProgress) {
        setActiveSession(inProgress);
      }
    } catch (err) {
      console.error('Failed to load past sessions:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Browser Speech Synthesis (TTS Voice)
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Browser Speech Recognition (STT Voice)
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      sendLocalAlert('Voice Input Unsupported', 'Your browser does not support Web Speech recognition. Please type your answer.', 'warning');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      sendLocalAlert('Microphone Active', 'Speak clearly into your microphone...', 'info');
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  // 1. Start Interview Session
  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    try {
      const session = await api.startMockInterview({
        companyName,
        role,
        interviewType,
        difficulty
      });
      setActiveSession(session);
      setUserAnswer('');
      sendLocalAlert('Mock Interview Started', `Connected to AI Interviewer for ${companyName} (${role}).`, 'success');
      // Speak opening question
      if (session.turns[0]?.question) {
        setTimeout(() => speakText(session.turns[0].question), 600);
      }
    } catch (err: any) {
      sendLocalAlert('Failed to Start', err.message, 'error');
    } finally {
      setIsStarting(false);
    }
  };

  // 2. Submit Turn Answer
  const handleSubmitTurn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !userAnswer.trim() || isSubmittingTurn) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmittingTurn(true);
    const turnNumber = activeSession.turns.length;
    try {
      const { session, evaluation, nextQuestion } = await api.submitMockTurn(
        activeSession.id,
        userAnswer,
        turnNumber
      );
      setActiveSession(session);
      setUserAnswer('');
      sendLocalAlert('Answer Evaluated', `Scored ${evaluation.score}/10 on Turn ${turnNumber}.`, 'success');

      // Speak next question if available
      if (nextQuestion?.question && session.turns.length <= 5) {
        setTimeout(() => speakText(nextQuestion.question), 700);
      }
    } catch (err: any) {
      sendLocalAlert('Evaluation Error', err.message, 'error');
    } finally {
      setIsSubmittingTurn(false);
    }
  };

  // 3. Complete and Generate Final Report
  const handleFinishInterview = async () => {
    if (!activeSession) return;
    setIsFinishing(true);
    try {
      const { session, report } = await api.finishMockInterview(activeSession.id);
      setActiveSession(session);
      await loadHistory();
      await refreshAllData();

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      sendLocalAlert('Interview Complete!', `Overall Score: ${report.overallScore}/100. HireReady Score updated!`, 'success');
    } catch (err: any) {
      sendLocalAlert('Failed to Finish', err.message, 'error');
    } finally {
      setIsFinishing(false);
    }
  };

  const currentTurn = activeSession?.turns[activeSession.turns.length - 1];
  const isCompleted = activeSession?.status === 'Completed';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <Mic className="w-3.5 h-3.5" />
            <span>Interactive Voice & Text Simulator</span>
          </div>
          <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
            AI Placement Mock Interviewer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
            Practice realistic campus placement interviews in real-time. Features Web Speech AI audio questions, voice speech recognition, turn-by-turn scoring, and 100-point final performance diagnostics.
          </p>
        </div>

        {activeSession && (
          <button
            onClick={() => {
              stopSpeaking();
              setActiveSession(null);
            }}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm transition-colors self-start sm:self-auto"
          >
            Exit / New Session
          </button>
        )}
      </div>

      {/* View 1: Setup New Mock Interview */}
      {!activeSession && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Setup Form (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-3">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Configure AI Mock Interview</span>
            </div>

            <form onSubmit={handleStartSession} className="space-y-4 text-xs">
              {/* Company & Role Preset */}
              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Great Developers InfoTech, CloudScale, Google"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1.5">Target Placement Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Software Developer (.NET / Full-Stack), SDE-1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Interview Round Type</label>
                  <select
                    value={interviewType}
                    onChange={e => setInterviewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
                  >
                    <option value="Technical">Technical Round 1 (DSA & Core CS)</option>
                    <option value="Project Walkthrough">Project & Architecture Walkthrough</option>
                    <option value="System Architecture">System & Low-Level Design</option>
                    <option value="Behavioral / HR">HR & Cultural Fit Round</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1.5">Interviewer Rigor</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium"
                  >
                    <option value="Standard SDE-1">Standard Campus SDE-1</option>
                    <option value="Fast-Paced High Rigor">Fast-Paced Product Company</option>
                    <option value="Supportive & Mentoring">Supportive & Exploratory</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-900 space-y-1">
                <p className="text-[11px] leading-relaxed font-medium">
                  🎙️ <strong>Features:</strong> Audio question playback via Web Speech API, live voice answer transcription, and progressive multi-turn questioning.
                </p>
              </div>

              <button
                type="submit"
                disabled={isStarting}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 active:scale-95 text-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isStarting ? 'Setting up Interview Room...' : 'Start 5-Turn AI Mock Interview'}</span>
              </button>
            </form>
          </div>

          {/* Past Sessions History (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Past Mock Performance Records</span>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {pastSessions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-medium">
                  No completed mock sessions yet. Start your first session to track improvements!
                </div>
              ) : (
                pastSessions.map(s => (
                  <div
                    key={s.id}
                    onClick={() => setActiveSession(s)}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-white cursor-pointer transition-all space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{s.companyName}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{s.role}</p>
                      </div>
                      <span className="font-sans text-sm font-black text-emerald-600">
                        {s.report?.overallScore ? `${s.report.overallScore}/100` : `${s.turns.length} Turns`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>{s.interviewType} • {s.difficulty}</span>
                      <span>{new Date(s.startedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 2: Active Real-Time Interview Session */}
      {activeSession && !isCompleted && (
        <div className="space-y-6">
          {/* Active Banner */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{activeSession.companyName} • {activeSession.role}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {activeSession.interviewType} Round • Question {activeSession.turns.length} of 5
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFinishInterview}
                disabled={isFinishing}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-100 transition-all disabled:opacity-50"
              >
                <FileCheck className="w-4 h-4" />
                <span>{isFinishing ? 'Compiling Report...' : 'End & Generate Scorecard'}</span>
              </button>
            </div>
          </div>

          {/* Interview Conversation Stream */}
          <div className="space-y-5">
            {activeSession.turns.map((turn, index) => (
              <div key={turn.turnNumber} className="space-y-4">
                {/* AI Interviewer Question Box */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                        Interviewer Question {turn.turnNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{turn.category}</span>
                    </div>

                    <button
                      onClick={() => (isSpeaking ? stopSpeaking() : speakText(turn.question))}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
                      title="Audio Speech Output"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-indigo-600 animate-pulse' : 'text-slate-500'}`} />
                      <span className="text-[11px]">{isSpeaking ? 'Stop Audio' : 'Play Voice'}</span>
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-900 leading-relaxed">{turn.question}</p>
                </div>

                {/* Candidate's Answer (if answered) */}
                {turn.userAnswer && (
                  <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/60 border border-indigo-100 space-y-2 ml-4">
                    <span className="text-xs font-bold text-indigo-900">Your Answer:</span>
                    <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">{turn.userAnswer}</p>
                  </div>
                )}

                {/* Turn Evaluation Diagnostic (if evaluated) */}
                {turn.evaluation && (
                  <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 ml-4 text-xs shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>AI Turn Assessment</span>
                      </span>
                      <div className="flex items-center gap-2 font-bold">
                        <span className="text-slate-500 font-medium">Score:</span>
                        <span className="text-emerald-700 text-sm">{turn.evaluation.score}/10</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Strengths */}
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="font-bold text-emerald-900 block">Strengths:</span>
                        <ul className="text-slate-800 space-y-0.5 list-disc list-inside font-medium">
                          {turn.evaluation.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Missing Points */}
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                        <span className="font-bold text-amber-900 block">Missing Coverage:</span>
                        <ul className="text-slate-800 space-y-0.5 list-disc list-inside font-medium">
                          {turn.evaluation.missingPoints.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Better Model Answer */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="font-bold text-indigo-900 block">Exemplary Answer Framework:</span>
                      <p className="text-slate-700 leading-relaxed font-medium">{turn.evaluation.betterAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Answering Box for Latest Turn */}
          {currentTurn && !currentTurn.userAnswer && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>Your Answer to Question {currentTurn.turnNumber}:</span>
                </label>

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-rose-500" />}
                  <span>{isListening ? 'Recording... (Click to Stop)' : 'Voice Input (Mic)'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type or dictate your technical/behavioral answer. Be structured, use STAR framework for projects, and mention metrics..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 resize-none leading-relaxed font-medium"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  {userAnswer.length > 0 ? `${userAnswer.split(' ').filter(Boolean).length} words` : 'Speak or type naturally'}
                </span>

                <button
                  onClick={handleSubmitTurn}
                  disabled={isSubmittingTurn || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingTurn ? 'Evaluating Answer...' : 'Submit Answer'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View 3: Completed Mock Interview Final Report */}
      {activeSession && isCompleted && activeSession.report && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in zoom-in-95 duration-300">
          {/* Report Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Interview Evaluation Complete
                </span>
                <span className="text-xs text-slate-500 font-medium">{activeSession.interviewType}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {activeSession.companyName} — {activeSession.role}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">{activeSession.report.summary}</p>
            </div>

            <button
              onClick={() => setActiveSession(null)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all self-start md:self-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Mock Session</span>
            </button>
          </div>

          {/* 4 Score Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Overall Score</span>
              <div className="font-sans text-3xl font-black text-emerald-600 mt-1">
                {activeSession.report.overallScore}/100
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Technical Accuracy</span>
              <div className="font-sans text-3xl font-black text-indigo-600 mt-1">
                {activeSession.report.technicalScore}/100
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Communication Clarity</span>
              <div className="font-sans text-3xl font-black text-cyan-600 mt-1">
                {activeSession.report.communicationScore}/100
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Confidence & Structure</span>
              <div className="font-sans text-3xl font-black text-amber-600 mt-1">
                {activeSession.report.confidenceScore}/100
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Observed Candidate Strengths</span>
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed font-medium">
                {activeSession.report.strongAreas.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Areas Needing Revision</span>
              </span>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside leading-relaxed font-medium">
                {activeSession.report.topicsToRevise.map((top, i) => (
                  <li key={i}>{top}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Recruiter Feedback */}
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2 text-xs">
            <span className="font-bold text-indigo-900 block">Recruiter Comprehensive Debrief:</span>
            <p className="text-slate-800 leading-relaxed font-medium">{activeSession.report.detailedFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};
