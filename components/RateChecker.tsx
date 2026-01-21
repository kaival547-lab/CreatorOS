import React, { useState } from 'react';
import { BrandDeal, RateCheckInput, RateCheckResult } from '../types';
import { checkRateWithGemini } from '../services/geminiService';
import { Loader2, TrendingUp, CheckCircle2, Target, Zap, Sparkles, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RateCheckerProps {
  deal: BrandDeal;
  updateDeal: (updates: Partial<BrandDeal>) => void;
  onResult?: () => void;
}

export const RateChecker: React.FC<RateCheckerProps> = ({ deal, updateDeal, onResult }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(!deal.rateCheck);

  const [inputs, setInputs] = useState<RateCheckInput>({
    platform: deal.platform,
    followers: 0,
    avgViews: 0,
    engagementRate: 0,
    contentType: 'Integration',
    usageRights: 'Digital 30 Days',
    exclusivity: 'None',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await checkRateWithGemini(inputs);
      updateDeal({ rateCheck: result });
      setShowForm(false);
      if (onResult) onResult();
    } catch (err) {
      console.error(err);
      alert("Failed to get rate check. Ensure API Key is configured.");
    } finally {
      setLoading(false);
    }
  };

  if (!deal.rateCheck && !showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[1.5rem] text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-3 group"
      >
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
          <Target size={20} className="opacity-40 group-hover:opacity-100" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Initialize Rate Auditor</span>
      </button>
    )
  }

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-2">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Followers</label>
              <input type="number" required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-bold" value={inputs.followers || ''} onChange={e => setInputs({ ...inputs, followers: Number(e.target.value) })} placeholder="50k" />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Avg Views</label>
              <input type="number" required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-bold" value={inputs.avgViews || ''} onChange={e => setInputs({ ...inputs, avgViews: Number(e.target.value) })} placeholder="20k" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Engagement %</label>
              <input type="number" step="0.1" required className="w-full bg-slate-50/50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-bold" value={inputs.engagementRate || ''} onChange={e => setInputs({ ...inputs, engagementRate: Number(e.target.value) })} placeholder="3.5" />
            </div>
            <div className="space-y-2">
              <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Format</label>
              <select className="w-full bg-slate-50/50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-bold appearance-none cursor-pointer" value={inputs.contentType} onChange={e => setInputs({ ...inputs, contentType: e.target.value })}>
                <option>Integration</option>
                <option>Dedicated Video</option>
                <option>Story Set</option>
                <option>Reel / TikTok</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Usage Clauses</label>
            <input type="text" className="w-full bg-slate-50/50 border border-slate-100 rounded-xl md:rounded-2xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-bold" value={inputs.usageRights} onChange={e => setInputs({ ...inputs, usageRights: e.target.value })} placeholder="30 days digital organic..." />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all flex justify-center items-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={14} /> : <><Zap size={14} /> Calculate Rate</>}
          </button>
        </form>
      </div>
    );
  }

  const data = [
    { name: 'Low', value: deal.rateCheck!.suggestedLow },
    { name: 'High', value: deal.rateCheck!.suggestedHigh }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2">
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div>
          <h3 className="font-black text-slate-900 text-base md:text-lg tracking-tight leading-none">${deal.rateCheck!.suggestedLow.toLocaleString()} — ${deal.rateCheck!.suggestedHigh.toLocaleString()}</h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Recommended fee range</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Confidence</span>
          <div className="flex items-center gap-1.5 text-emerald-600 font-black text-xs md:text-sm">
            <CheckCircle2 size={14} className="md:size-[16px]" />
            {deal.rateCheck!.confidenceScore}%
          </div>
        </div>
      </div>

      <div className="h-20 md:h-24 w-full mb-6 md:mb-8 bg-slate-50/30 rounded-xl md:rounded-2xl p-3 md:p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={10} margin={{ right: 20 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={30} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'rgba(255,255,255,0.5)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="value" radius={[0, 10, 10, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#93c5fd' : '#2563eb'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-50/50 p-4 md:p-5 rounded-xl md:rounded-2xl text-[11px] md:text-[12px] font-medium text-slate-600 leading-relaxed italic border border-slate-100/50 mb-4 md:mb-5">
        <Sparkles size={14} className="text-blue-500 mb-2" />
        "{deal.rateCheck!.explanation}"
      </div>

      {deal.rateCheck!.suggestedReply && (
        <div className="bg-blue-600 rounded-[1.5rem] p-5 md:p-6 mb-6 md:mb-8 text-white shadow-xl shadow-blue-600/20 group relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="flex items-center gap-2 mb-3 relative z-10">
            <MessageSquare size={14} className="text-blue-200" />
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-100">Reply-Ready Copy</span>
          </div>
          <p className="text-xs md:text-sm font-bold leading-relaxed mb-4 relative z-10">
            "{deal.rateCheck!.suggestedReply}"
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(deal.rateCheck!.suggestedReply!);
            }}
            className="w-full bg-white text-blue-600 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 relative z-10 active:scale-95 shadow-lg"
          >
            Copy to Clipboard
          </button>
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="text-[9px] md:text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors flex items-center gap-2"
      >
        <TrendingUp size={12} />
        Adjust Metrics
      </button>
    </div>
  );
};
