import React, { useState } from 'react';
import {
  Scale,
  Building2,
  DollarSign,
  GraduationCap,
  ShieldAlert,
  ListChecks,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNotification } from '../../context/NotificationContext';
import type { OpportunitySummary } from '../../types';

export const CompareDrivesView: React.FC = () => {
  const { opportunities, setActiveOpportunity, setActiveView } = useApp();
  const { sendLocalAlert } = useNotification();

  const [selectedIds, setSelectedIds] = useState<string[]>([
    opportunities[0]?.id || '',
    opportunities[1]?.id || ''
  ].filter(Boolean));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        sendLocalAlert('Comparison Limit', 'Select at least 2 opportunities to compare.', 'warning');
        return;
      }
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      if (selectedIds.length >= 4) {
        sendLocalAlert('Comparison Limit', 'Maximum 4 opportunities can be compared simultaneously.', 'warning');
        return;
      }
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const comparedOpportunities = opportunities.filter(o => selectedIds.includes(o.id));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
          <Scale className="w-3.5 h-3.5" />
          <span>Decision Matrix Engine</span>
        </div>
        <h1 className="text-2xl font-sans font-extrabold text-slate-900 tracking-tight">
          Campus Drive Comparison Matrix
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed font-medium">
          Evaluate multiple placement circulars side-by-side: Compare CTC breakdown, training stipends, bonds, selection rounds, and technical alignment.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-sm">
        <span className="text-xs font-bold text-slate-900">Select 2 to 4 Placement Opportunities to Compare:</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {opportunities.map(o => {
            const isSelected = selectedIds.includes(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggleSelect(o.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{o.company.name}</span>
                <span className="text-[10px] font-sans text-indigo-200 font-black">({o.ctc.salaryRange})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="rounded-3xl bg-white border border-slate-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-48 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                Evaluation Criterion
              </th>
              {comparedOpportunities.map(opp => (
                <th key={opp.id} className="p-4 min-w-[240px] text-slate-900">
                  <span className="text-[10px] font-bold text-indigo-700 block">{opp.cacNumber || 'CAC DRIVE'}</span>
                  <div className="font-extrabold text-base text-slate-900">{opp.company.name}</div>
                  <div className="text-slate-500 font-medium text-xs">{opp.jobRole}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {/* Compensation */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Annual CTC</span>
              </td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4 font-sans font-black text-emerald-600 text-sm">
                  {opp.ctc.salaryRange}
                </td>
              ))}
            </tr>

            {/* Training Stipend */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500">Internship Stipend</td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4 text-slate-800 font-sans font-medium">
                  {opp.ctc.stipendDuringTraining || 'Direct Full-Time Employment'}
                </td>
              ))}
            </tr>

            {/* Service Bond */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Service Agreement / Bond</span>
              </td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4 font-bold text-amber-700">
                  {opp.ctc.serviceAgreementOrBond || 'No Bond Required'}
                </td>
              ))}
            </tr>

            {/* Minimum CGPA */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>CGPA Cutoff</span>
              </td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4 font-sans font-bold text-slate-900">
                  {opp.eligibilityCriteria.minimumCgpa} / 10.0
                </td>
              ))}
            </tr>

            {/* Eligible Branches */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500">Eligible Branches</td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4 text-slate-700 text-[11px] leading-relaxed font-medium">
                  {opp.eligibilityCriteria.eligibleBranches.join(', ')}
                </td>
              ))}
            </tr>

            {/* Work Mode */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500">Work Mode</td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4 text-slate-800 font-medium">
                  {opp.workMode}
                </td>
              ))}
            </tr>

            {/* Selection Pipeline */}
            <tr className="hover:bg-slate-50/70">
              <td className="p-4 font-bold text-slate-500 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-sky-600" />
                <span>Evaluation Rounds</span>
              </td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4">
                  <div className="space-y-1 text-[11px]">
                    {opp.selectionProcess.map(r => (
                      <div key={r.roundNumber} className="text-slate-700 font-medium">
                        <strong className="text-indigo-600 font-bold">R{r.roundNumber}:</strong> {r.name}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr className="bg-slate-50/50">
              <td className="p-4 font-bold text-slate-500">Action</td>
              {comparedOpportunities.map(opp => (
                <td key={opp.id} className="p-4">
                  <button
                    onClick={() => {
                      setActiveOpportunity(opp);
                      setActiveView('matching');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all text-xs"
                  >
                    <span>Analyze Fit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
