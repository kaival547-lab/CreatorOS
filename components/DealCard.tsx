import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandDeal, DealStatus, Platform } from '../types';
import {
  Mail, Youtube, Instagram, Globe,
  ArrowRight, Target, AlertCircle, Clock, Zap
} from 'lucide-react';
import { getDealAction } from '../types';
import { motion } from 'framer-motion';

interface DealCardProps {
  deal: BrandDeal;
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

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const navigate = useNavigate();
  const isOverdue = new Date(deal.nextFollowUpAt) < new Date() &&
    deal.status !== DealStatus.SECURED &&
    deal.status !== DealStatus.GHOSTED;

  const action = getDealAction(deal);

  const daysSinceLastContact = Math.floor((new Date().getTime() - new Date(deal.lastContactedAt).getTime()) / (1000 * 60 * 60 * 24));

  const getSilenceColor = (days: number) => {
    if (days >= 8) return 'text-slate-400 opacity-60';
    if (days >= 4) return 'text-amber-500';
    return 'text-slate-400';
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/deal/${deal.id}`)}
      className="glass-card rounded-[2rem] p-5 cursor-pointer flex flex-col gap-4 interactive-glow group"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${deal.status === DealStatus.SECURED ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
            {deal.platform === Platform.INSTAGRAM && <Instagram size={20} />}
            {deal.platform === Platform.TIKTOK && <TikTokIcon size={20} />}
            {deal.platform === Platform.YOUTUBE && <Youtube size={20} />}
            {deal.platform === Platform.EMAIL && <Mail size={20} />}
            {deal.platform === Platform.OTHER && <Globe size={20} />}
          </div>
          <div>
            <h3 className="font-black text-slate-900 leading-tight tracking-tight uppercase text-xs">{deal.brandName}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-1.5 h-1.5 rounded-full ${isOverdue ? 'bg-red-500 animate-pulse' : 'bg-slate-200'}`} />
              <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                {deal.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm ${action.type === 'FOLLOW_UP' ? 'bg-red-500 text-white' :
              action.type === 'REVIEW_RISKS' ? 'bg-amber-500 text-white' :
                action.type === 'CHECK_RATE' ? 'bg-blue-600 text-white' :
                  action.type === 'LOG_NOTES' ? 'bg-indigo-600 text-white' :
                    'bg-slate-100 text-slate-400'
            }`}>
            {action.type !== 'NONE' && <Zap size={8} />}
            {action.label}
          </div>
          <div className={`text-[8px] font-bold uppercase tracking-tight flex items-center gap-1 ${getSilenceColor(daysSinceLastContact)}`}>
            <Clock size={8} />
            {daysSinceLastContact === 0 ? 'Today' : `${daysSinceLastContact}d silence`}
          </div>
        </div>
      </div>

      {deal.dealValue && (
        <div className="bg-slate-50/50 rounded-2xl p-3 flex items-center justify-between group-hover:bg-white transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
              <Target size={14} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</span>
          </div>
          <span className="text-sm font-black text-slate-900 tracking-tight">
            ${deal.dealValue.toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mt-1 px-1">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Follow Up</span>
          <span className={`text-[11px] font-bold ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
            {new Date(deal.nextFollowUpAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
          <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};
