import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BrandDeal, DealStatus, TimelineEvent } from '../types';
import {
  ArrowLeft, Clock, Calendar, CheckCircle, AlertCircle,
  MessageSquare, ExternalLink, Globe, User, ShieldCheck,
  Zap, Share2, MoreHorizontal, FileText, ChevronRight,
  Brain, ShieldAlert, Download, Target,
  Sparkles, History, Kanban, Instagram, Youtube, Mail, DollarSign, Trash2
} from 'lucide-react';
import { RateChecker } from './RateChecker';
import { BriefTranslator } from './BriefTranslator';
import { getDealAction } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface DealDetailProps {
  deals: BrandDeal[];
  isPro: boolean;
  updateDeal: (id: string, updates: Partial<BrandDeal>) => void;
  addTimelineEvent: (dealId: string, event: Omit<TimelineEvent, 'id' | 'date'>) => void;
  triggerFeedback: (type: any) => void;
}

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13-.09-.26-.18-.38-.28-.01 3.16 0 6.32-.01 9.48-.05 1.06-.31 2.15-.81 3.09-.54 1.14-1.39 2.15-2.45 2.87-1.11.75-2.45 1.15-3.79 1.17-1.37.04-2.78-.29-3.95-1.01-1.16-.71-2.09-1.8-2.61-3.05-.53-1.28-.59-2.73-.25-4.06.33-1.35 1.12-2.58 2.22-3.41 1.09-.83 2.5-1.25 3.84-1.18v4.22c-.89-.04-1.83.18-2.52.79-.65.57-.88 1.54-.62 2.37.24.78.96 1.4 1.76 1.55.85.11 1.75-.15 2.34-.78.53-.56.67-1.38.65-2.14V0h-.01z" />
  </svg>
);

export const DealDetail: React.FC<DealDetailProps> = ({ deals, isPro, updateDeal, addTimelineEvent, triggerFeedback }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const deal = deals.find(d => d.id === id);

  if (!deal) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-400">Deal not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Back to Board</button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: DealStatus) => {
    updateDeal(deal.id, { status: newStatus });
  };

  const showGhostPrompt = deal.followUpCount >= 3 &&
    deal.status !== DealStatus.SECURED &&
    deal.status !== DealStatus.GHOSTED &&
    deal.status !== DealStatus.REPLIED;

  const action = getDealAction(deal);

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto pb-32">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-12">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-white transition-all shadow-sm">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Back to board</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isPro && (
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-950 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/40 hover:scale-105 active:scale-95 transition-all">
              <Download size={14} />
              <span className="md:inline">Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Action Engine - "The One Big Thing" */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb - 10 p - 6 rounded - [2rem] border transition - all flex flex - col md: flex - row items - center justify - between gap - 6 ${action.type === 'FOLLOW_UP' ? 'bg-red-50 border-red-100' :
          action.type === 'REVIEW_RISKS' ? 'bg-amber-50 border-amber-100' :
            action.type === 'CHECK_RATE' ? 'bg-blue-50 border-blue-100' :
              action.type === 'LOG_NOTES' ? 'bg-indigo-50 border-indigo-100' :
                action.type === 'GHOSTED_CLOSURE' ? 'bg-slate-50 border-slate-100' :
                  'bg-emerald-50 border-emerald-100'
          } `}
      >
        <div className="flex items-center gap-4">
          <div className={`w - 12 h - 12 rounded - 2xl flex items - center justify - center shadow - sm ${action.type === 'FOLLOW_UP' ? 'bg-red-500 text-white' :
            action.type === 'REVIEW_RISKS' ? 'bg-amber-500 text-white' :
              action.type === 'CHECK_RATE' ? 'bg-blue-600 text-white' :
                action.type === 'LOG_NOTES' ? 'bg-indigo-600 text-white' :
                  action.type === 'GHOSTED_CLOSURE' ? 'bg-slate-400 text-white' :
                    'bg-emerald-500 text-white'
            } `}>
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Recommended Next Action</h3>
            <p className="text-xl font-black text-slate-900 tracking-tight">{action.label}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <p className="text-sm font-bold text-slate-500 italic md:text-right flex-1 md:max-w-xs">{action.description}</p>
          {action.type !== 'NONE' && (
            <div className="bg-white/50 backdrop-blur-sm p-2 rounded-xl border border-white">
              <ChevronRight className="text-slate-400" />
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Intelligence Dashboard */}
        <div className="lg:col-span-8 space-y-10">
          {/* Main Info Card */}
          <div className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none">
              <Target size={120} className="md:size-[180px]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <div className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2">
                  {deal.platform === 'Instagram' && <Instagram size={10} />}
                  {deal.platform === 'TikTok' && <TikTokIcon size={10} />}
                  {deal.platform === 'YouTube' && <Youtube size={10} />}
                  {deal.platform === 'Email' && <Mail size={10} />}
                  {deal.platform === 'Other' && <Globe size={10} />}
                  {deal.platform}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 cursor-default transition-colors">{deal.contact}</div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-950 tracking-tighter mb-8 md:mb-10 leading-[1.1] md:leading-[0.9] lg:max-w-xl">
                {deal.brandName}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50/70 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white hover:bg-white transition-colors group">
                  <span className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 group-hover:text-slate-400 transition-colors">Phase</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                    <span className="font-bold text-slate-900 capitalize text-sm">{deal.status.toLowerCase()}</span>
                  </div>
                </div>
                <div className="bg-slate-50/70 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white hover:bg-white transition-colors group">
                  <span className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 group-hover:text-slate-400 transition-colors">Proposed</span>
                  <span className="font-black text-slate-950 text-lg md:text-xl tracking-tight">${deal.dealValue?.toLocaleString() || '---'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white hover:bg-white transition-colors group">
                  <span className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 group-hover:text-slate-400 transition-colors">Outreach</span>
                  <span className="font-black text-slate-950 text-lg md:text-xl tracking-tight">{deal.followUpCount} Sent</span>
                </div>
                <div className="bg-slate-50/70 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white hover:bg-white transition-colors group">
                  <span className="block text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 group-hover:text-slate-400 transition-colors">Engagement</span>
                  <span className="font-black text-slate-950 text-lg md:text-xl tracking-tight">{new Date(deal.lastContactedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Tools Section */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Brain size={18} className="md:size-[22px]" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h2>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-200" />)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border-t-4 border-t-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Zap size={20} className="md:size-24" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950 text-sm md:text-base tracking-tight leading-none">Rate Auditor</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Market Comparison</p>
                    </div>
                  </div>
                  {deal.rateCheck && <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center animate-pulse"><Sparkles size={14} className="md:size-16" /></div>}
                </div>
                <RateChecker deal={deal} updateDeal={(updates) => updateDeal(deal.id, updates)} onResult={() => triggerFeedback('ai_value')} />
              </div>

              <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border-t-4 border-t-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShieldAlert size={20} className="md:size-24" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950 text-sm md:text-base tracking-tight leading-none">Brief Scanner</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Risk & Compliance</p>
                    </div>
                  </div>
                </div>
                <BriefTranslator deal={deal} updateDeal={(updates) => updateDeal(deal.id, updates)} onResult={() => triggerFeedback('ai_value')} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="lg:col-span-4 space-y-10">
          <div className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 md:mb-10 px-2">
              <div className="flex items-center gap-3">
                <History size={18} className="text-slate-300 md:size-5" />
                <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Activity Log</h2>
              </div>
              <div className="text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-widest">{deal.timeline.length} Events</div>
            </div>

            <div className="relative pl-6 md:pl-7 space-y-8 md:space-y-10">
              {/* Vertical Line */}
              <div className="absolute left-[7px] md:left-[8px] top-2 bottom-2 w-[1px] bg-slate-100" />

              {deal.timeline.map((event, idx) => (
                <div key={event.id} className="relative group/item">
                  <div className={`absolute - left - [26px] md: -left - [27px] top - 1.5 w - 3.5 h - 3.5 md: w - 4 md: h - 4 rounded - full border - 4 border - white shadow - sm transition - all duration - 500 ${idx === 0 ? 'bg-blue-600 scale-110' : 'bg-slate-200 group-hover/item:bg-slate-400'} `} />
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover/item:text-slate-400 transition-colors">
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                      {event.type === 'follow_up' && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 text-[7px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                          <MessageSquare size={8} /> Outreach
                        </div>
                      )}
                    </div>
                    <p className="text-sm md:text-[14px] font-bold text-slate-800 leading-tight tracking-tight">{event.description}</p>
                  </div>
                </div>
              )).reverse()}
            </div>

            <div className="mt-10 md:mt-14 space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 px-2 mb-2 md:mb-4">
                <Zap size={14} className="text-amber-500 md:size-4" />
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Quick Stage Jump</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { status: DealStatus.OUTREACH, icon: <Mail size={12} />, color: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' },
                  { status: DealStatus.REPLIED, icon: <MessageSquare size={12} />, color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white' },
                  { status: DealStatus.NEGOTIATING, icon: <Clock size={12} />, color: 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white' },
                  { status: DealStatus.SECURED, icon: <CheckCircle size={12} />, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' },
                  { status: DealStatus.GHOSTED, icon: <AlertCircle size={12} />, color: 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' }
                ].map((action) => (
                  <button
                    key={action.status}
                    onClick={() => handleStatusChange(action.status)}
                    className={`flex items - center gap - 2 px - 3 md: px - 4 py - 2 md: py - 2.5 rounded - xl text - [8px] md: text - [9px] font - black uppercase tracking - widest transition - all active: scale - 95 ${deal.status === action.status ? action.color.split(' ').slice(2).join(' ') + ' shadow-lg' : action.color.split(' ').slice(0, 2).join(' ')} `}
                  >
                    {action.icon}
                    {action.status}
                  </button>
                ))}
              </div>

              <button
                onClick={() => addTimelineEvent(deal.id, { type: 'follow_up', description: 'Follow-up email sent' })}
                className="w-full bg-slate-950 text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/30 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 group"
              >
                <MessageSquare size={14} className="md:size-16 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Log Manual Follow-up
              </button>
            </div>
          </div>

          {showGhostPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="premium-gradient rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 md:p-10 opacity-10 rotate-12 pointer-events-none">
                <ShieldAlert size={60} className="md:size-[80px]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                    <ShieldAlert size={20} className="md:size-[22px]" />
                  </div>
                  <h3 className="font-black text-xs md:text-sm uppercase tracking-[0.15em] text-white">Cold Case Alert</h3>
                </div>
                <p className="text-slate-300 text-[11px] md:text-xs font-bold leading-relaxed mb-8 italic opacity-70">
                  "Most creators get ghosted on 30–40% of pitches. Marking this as Ghosted clears mental space and keeps your focus on fresh budgets."
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleStatusChange(DealStatus.GHOSTED)}
                    className="w-full bg-white text-slate-950 py-3.5 md:py-4 rounded-xl md:rounded-[1.25rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    Mark as Ghosted
                  </button>
                  <button
                    onClick={() => addTimelineEvent(deal.id, { type: 'follow_up', description: 'Final outreach attempt sent' })}
                    className="w-full bg-white/5 border border-white/10 text-white/50 py-3.5 md:py-4 rounded-xl md:rounded-[1.25rem] text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                  >
                    Single Last Outreach
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};