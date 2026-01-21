import React, { useState } from 'react';
import { BrandDeal, BriefAnalysisResult } from '../types';
import { analyzeBriefWithGemini } from '../services/geminiService';
import { FileText, Loader2, AlertTriangle, CheckSquare, MessageCircle, FileCheck, ShieldAlert, Zap } from 'lucide-react';

interface BriefTranslatorProps {
  deal: BrandDeal;
  updateDeal: (updates: Partial<BrandDeal>) => void;
  onResult?: () => void;
}

export const BriefTranslator: React.FC<BriefTranslatorProps> = ({ deal, updateDeal, onResult }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!deal.briefAnalysis);
  const [briefText, setBriefText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!briefText.trim()) return;

    setLoading(true);
    try {
      const result = await analyzeBriefWithGemini(briefText);
      updateDeal({ briefAnalysis: result });
      setShowForm(false);
      if (onResult) onResult();
    } catch (err) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!deal.briefAnalysis && !showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3 group"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
          <FileText size={20} className="opacity-40 group-hover:opacity-100" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Initialize Brief Scanner</span>
      </button>
    );
  }

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-4 md:p-5 bg-slate-50/50 border border-slate-100 rounded-2xl md:rounded-[1.5rem] text-sm min-h-[150px] md:min-h-[180px] focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-medium placeholder:text-slate-300"
            placeholder="Paste the brand email or brief content here..."
            value={briefText}
            onChange={e => setBriefText(e.target.value)}
          />
          <div className="flex gap-2 md:gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading || !briefText} className="flex-1 bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={14} /> : <><ShieldAlert size={14} /> Scan Brief</>}
            </button>
          </div>
        </form>
      </div>
    );
  }

  const { summary, redFlags, checklist, questionsToAsk } = deal.briefAnalysis!;

  return (
    <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Red Flags - Surface Risk First! */}
      {redFlags.length > 0 && (
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center gap-2 px-1 text-red-500">
            <ShieldAlert size={14} />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest pt-0.5">High Potential Risk</span>
          </div>
          <div className="bg-red-50/50 rounded-xl md:rounded-2xl border border-red-100 p-4 md:p-5 space-y-3">
            {redFlags.map((flag, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-start gap-3 text-xs md:text-[12px] font-bold text-red-700">
                  <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                  {flag.split(': ')[0]}
                </div>
                {flag.includes(': ') && (
                  <p className="ml-7 text-[10px] text-red-600/70 font-medium italic leading-tight">
                    {flag.split(': ').slice(1).join(': ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="space-y-1.5 md:space-y-2">
        <div className="flex items-center gap-2 px-1 text-slate-400">
          <FileCheck size={14} />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest pt-0.5">Abstract</span>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 p-4 md:p-5 text-xs md:text-[13px] font-medium text-slate-700 leading-relaxed shadow-sm">
          {summary}
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-1.5 md:space-y-2">
        <div className="flex items-center gap-2 px-1 text-slate-400">
          <CheckSquare size={14} />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest pt-0.5">Execution Checklist</span>
        </div>
        <div className="bg-white rounded-xl md:rounded-2xl border border-slate-100 p-4 md:p-5 space-y-3 shadow-sm">
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 md:gap-3 group/check">
              <div className="w-5 h-5 rounded-md border-2 border-slate-100 group-hover/check:border-blue-200 transition-colors flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 bg-blue-600 scale-0 group-hover/check:scale-100 transition-transform rounded-[2px]" />
              </div>
              <span className="text-xs md:text-[12px] font-medium text-slate-600 group-hover/check:text-slate-900 transition-colors">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tactical Questions */}
      <div className="space-y-1.5 md:space-y-2">
        <div className="flex items-center gap-2 px-1 text-blue-500">
          <MessageCircle size={14} />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest pt-0.5">Tactical Rebuttals</span>
        </div>
        <div className="bg-blue-50/50 rounded-xl md:rounded-2xl border border-blue-100 p-4 md:p-5 space-y-3">
          {questionsToAsk.map((q, idx) => (
            <div key={idx} className="text-xs md:text-[12px] font-bold text-blue-800 italic leading-snug">
              "{q}"
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="text-[9px] md:text-[10px] font-black text-slate-300 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-2 pt-2"
      >
        <Zap size={12} />
        Re-scan Brief
      </button>
    </div>
  );
};
