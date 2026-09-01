import React, { useState } from 'react';
import {
  FileSearch,
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  GraduationCap,
  ListChecks,
  AlertCircle,
  CheckCircle2,
  BookmarkPlus,
  ArrowRight,
  ShieldAlert,
  Clock,
  Send,
  ExternalLink
} from 'lucide-react';
import { sampleNotices } from '../../data/sampleNotices';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import type { OpportunitySummary } from '../../types';

export const NoticeParserView: React.FC = () => {
  const {
    parseNoticeAndSelect,
    activeOpportunity,
    setActiveOpportunity,
    saveDriveFromOpportunity,
    setActiveView
  } = useApp();
  const { sendLocalAlert } = useNotification();

  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<OpportunitySummary | null>(activeOpportunity);

  const handleLoadSample = (sample: typeof sampleNotices[0]) => {
    setRawText(sample.rawText);
    sendLocalAlert('Sample Notice Loaded', `Loaded circular for ${sample.title}. Click "Extract Placement Intelligence" to process.`, 'info');
  };

  const handleParse = async () => {
    if (!rawText.trim() || rawText.trim().length < 20) {
      sendLocalAlert('Input Required', 'Please paste a placement circular or select a sample notice.', 'warning');
      return;
    }

    setIsParsing(true);
    try {
      const summary = await parseNoticeAndSelect(rawText);
      setParsedResult(summary);
    } catch (err: any) {
      sendLocalAlert('Parsing Error', err.message || 'Failed to extract notice data.', 'error');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveToDrives = async () => {
    if (!parsedResult) return;
    await saveDriveFromOpportunity(parsedResult, 'Saved');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <FileSearch className="w-3.5 h-3.5" />
          <span>Circular & Notice Intelligence</span>
        </div>
        <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
          College Placement-Drive Notice Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          Paste any raw, unstructured college placement notice, CAC email circular, or WhatsApp announcement.
          HireReady extracts company info, eligibility, compensation breakdown, selection rounds, and distinguishes strict college policies.
        </p>
      </div>

      {/* 1-Click Sample Notices Chips */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Quick Test with Realistic Campus Circulars:</span>
          <span className="text-[11px] text-slate-400 font-medium">Click any card to auto-populate</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleNotices.map(s => (
            <button
              key={s.id}
              onClick={() => handleLoadSample(s)}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-200 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 font-medium">
                <span className="font-bold text-indigo-700">{s.package}</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold">{s.tag}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 truncate">
                {s.companyName}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.role}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Textarea Box */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <span>Raw Notice Text (WhatsApp message, email, or circular text)</span>
          </label>
          {rawText && (
            <button
              onClick={() => setRawText('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        <textarea
          rows={6}
          value={rawText}
          onChange={e => setRawText(e.target.value)}
          placeholder="Paste unstructured campus recruitment circular here..."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors leading-relaxed placeholder:text-slate-400"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-slate-400 font-medium">
            {rawText.length > 0 ? `${rawText.length} characters entered` : 'Supports messy formatting, missing fields, and multiple roles'}
          </span>
          <button
            id="parser-extract-btn"
            onClick={handleParse}
            disabled={isParsing || !rawText.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 active:scale-95"
          >
            <Sparkles className={`w-4 h-4 ${isParsing ? 'animate-spin' : ''}`} />
            <span>{isParsing ? 'Extracting with Gemini 2.5...' : 'Extract Placement Intelligence'}</span>
          </button>
        </div>
      </div>

      {/* Parsed Output Display */}
      {parsedResult && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
          {/* Top Header Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {parsedResult.cacNumber || 'CAC PLACEMENT'}
                </span>
                <span className="text-xs text-slate-500 font-medium">{parsedResult.company.industry || 'Technology'}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1.5">{parsedResult.company.name}</h2>
              <p className="text-xs text-slate-600 font-medium">{parsedResult.jobRole} • {parsedResult.workMode}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSaveToDrives}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <BookmarkPlus className="w-4 h-4 text-indigo-600" />
                <span>Save to My Drives</span>
              </button>
              <button
                onClick={() => {
                  setActiveOpportunity(parsedResult);
                  setActiveView('matching');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
              >
                <span>Check Match & ATS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Compensation & Bond */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs border-b border-slate-200 pb-2.5">
                <DollarSign className="w-4 h-4" />
                <span>Compensation & Training</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Package Range:</span>
                  <p className="font-sans font-bold text-slate-900 text-sm mt-0.5">{parsedResult.ctc.salaryRange}</p>
                </div>
                {parsedResult.ctc.stipendDuringTraining && (
                  <div>
                    <span className="text-slate-400 font-medium">Internship/Training Stipend:</span>
                    <p className="font-medium text-slate-800">{parsedResult.ctc.stipendDuringTraining}</p>
                  </div>
                )}
                {parsedResult.ctc.trainingPeriod && (
                  <div>
                    <span className="text-slate-400 font-medium">Training Duration:</span>
                    <p className="text-slate-800 font-medium">{parsedResult.ctc.trainingPeriod}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 font-medium">Service Agreement / Bond:</span>
                  <p className="text-amber-800 font-bold">{parsedResult.ctc.serviceAgreementOrBond || 'No Bond Stated'}</p>
                </div>
              </div>
            </div>

            {/* Academic Eligibility */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs border-b border-slate-200 pb-2.5">
                <GraduationCap className="w-4 h-4" />
                <span>Eligibility Criteria</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Eligible Batches:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{parsedResult.eligibilityCriteria.passingBatch.join(', ')}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Branches:</span>
                  <p className="text-slate-800 font-medium">{parsedResult.eligibilityCriteria.eligibleBranches.join(', ')}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">CGPA Cutoff:</span>
                  <p className="font-bold text-emerald-700">{parsedResult.eligibilityCriteria.minimumCgpa} / 10.0</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Backlogs Allowed:</span>
                  <p className="font-medium text-slate-800">{parsedResult.eligibilityCriteria.allowedBacklogs} Active</p>
                </div>
              </div>
            </div>

            {/* Deadline & Link */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs border-b border-slate-200 pb-2.5">
                <Calendar className="w-4 h-4" />
                <span>Registration Deadline</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>{parsedResult.applicationDeadline?.rawDeadlineText || 'Check Circular'}</span>
                  </div>
                </div>
                {parsedResult.registrationLink && (
                  <div>
                    <span className="text-slate-400 font-medium">Portal Link:</span>
                    <a
                      href={parsedResult.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 truncate block underline flex items-center gap-1 mt-0.5 font-medium"
                    >
                      <span className="truncate">{parsedResult.registrationLink}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selection Rounds */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-cyan-800 font-bold text-xs border-b border-slate-200 pb-2.5">
              <ListChecks className="w-4 h-4" />
              <span>Selection Rounds & Evaluation Pipeline</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {parsedResult.selectionProcess.map((round) => (
                <div key={round.roundNumber} className="p-4 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">Round {round.roundNumber} ({round.mode})</span>
                  <h4 className="font-bold text-slate-900 mt-1">{round.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug font-medium">{round.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CRITICAL DISTINCTION: College / CAC Policies vs Company Spec */}
          {parsedResult.cacImportantPolicies && parsedResult.cacImportantPolicies.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Strict College / CAC Policy Notice (Mandatory Compliance)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-900/90 list-disc list-inside">
                {parsedResult.cacImportantPolicies.map((policy, idx) => (
                  <li key={idx} className="leading-relaxed font-medium">{policy}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills & Responsibilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-800">Required Technical Skills:</span>
              <div className="flex flex-wrap gap-1.5">
                {parsedResult.requiredSkills.map((sk, i) => (
                  <span key={i} className="text-xs px-3 py-1 rounded-full bg-white text-indigo-800 border border-slate-200 font-semibold shadow-2xs">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <span className="text-xs font-bold text-slate-800">Key Responsibilities:</span>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside leading-relaxed font-medium">
                {parsedResult.keyResponsibilities.slice(0, 3).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
