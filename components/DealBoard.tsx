import React, { useState, useMemo } from 'react';
import { BrandDeal, DealStatus, Platform } from '../types';
import { DealCard } from './DealCard';
import { Search, Plus, Sparkles, BarChart2, Clock, Zap, Instagram, Youtube, Mail, Globe, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DealBoardProps {
  deals: BrandDeal[];
  onNewDeal?: () => void;
}

const COLUMNS = [
  { status: DealStatus.DRAFT, label: 'Discovery' },
  { status: DealStatus.OUTREACH, label: 'Outreach' },
  { status: DealStatus.REPLIED, label: 'Replied' },
  { status: DealStatus.NEGOTIATING, label: 'Negotiating' },
  { status: DealStatus.SECURED, label: 'Secured' },
  { status: DealStatus.GHOSTED, label: 'Ghosted' },
];

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

const PLATFORM_ICONS: Record<string, any> = {
  [Platform.INSTAGRAM]: Instagram,
  [Platform.TIKTOK]: TikTokIcon,
  [Platform.YOUTUBE]: Youtube,
  [Platform.EMAIL]: Mail,
  [Platform.OTHER]: Globe,
};

export const DealBoard: React.FC<DealBoardProps> = ({ deals, onNewDeal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<DealStatus | 'ALL'>('ALL');
  const [quickFilter, setQuickFilter] = useState<'NONE' | 'FOLLOWUP' | 'NEGOTIATING'>('NONE');
  const [sortBy, setSortBy] = useState<'recent' | 'value'>('recent');

  const filteredDeals = useMemo(() => {
    return deals
      .filter(d => {
        const matchesSearch = d.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (d.contact && d.contact.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPlatform = platformFilter === 'ALL' || d.platform === platformFilter;
        const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;

        let matchesQuick = true;
        if (quickFilter === 'FOLLOWUP') {
          matchesQuick = new Date(d.nextFollowUpAt) < new Date() && d.status !== DealStatus.SECURED && d.status !== DealStatus.GHOSTED;
        } else if (quickFilter === 'NEGOTIATING') {
          matchesQuick = d.status === DealStatus.NEGOTIATING;
        }

        return matchesSearch && matchesPlatform && matchesStatus && matchesQuick;
      })
      .sort((a, b) => {
        if (sortBy === 'value') return (b.dealValue || 0) - (a.dealValue || 0);
        return new Date(b.lastContactedAt).getTime() - new Date(a.lastContactedAt).getTime();
      });
  }, [deals, searchTerm, platformFilter, statusFilter, quickFilter, sortBy]);

  const hasActiveFilters = searchTerm !== '' || platformFilter !== 'ALL' || statusFilter !== 'ALL' || quickFilter !== 'NONE';

  const resetFilters = () => {
    setSearchTerm('');
    setPlatformFilter('ALL');
    setStatusFilter('ALL');
    setQuickFilter('NONE');
  };

  return (
    <div className="p-4 md:p-8 relative min-h-screen">
      {/* Atmospheric Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-5s' }} />
      </div>

      <header className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 bg-blue-600 rounded text-[9px] font-black text-white uppercase tracking-tighter">Live</div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Pipeline</h1>
            </div>
            <p className="text-slate-500 font-medium text-xs md:text-sm">
              Managing {deals.length} active opportunities
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-blue-600 font-black">{deals.filter(d => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return new Date(d.lastContactedAt) > oneWeekAgo;
              }).length}</span> deals active this week
            </p>
          </div>

          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 md:py-4 rounded-2xl bg-white/50 backdrop-blur-md border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            <button
              onClick={onNewDeal}
              className="flex-1 md:flex-none bg-blue-600 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              New Deal
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by brand or contact..."
              className="w-full bg-white/50 backdrop-blur-md border border-slate-200 rounded-[1.2rem] md:rounded-[1.5rem] pl-11 pr-4 py-3.5 md:py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setPlatformFilter('ALL')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${platformFilter === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                All
              </button>
              {Object.values(Platform).map(p => {
                const Icon = PLATFORM_ICONS[p];
                return (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`flex-shrink-0 p-2 rounded-xl transition-all flex items-center gap-2 ${platformFilter === p ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                    title={p}
                  >
                    <Icon size={16} />
                  </button>
                )
              })}
            </div>

            <div className="flex items-center bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setQuickFilter(quickFilter === 'FOLLOWUP' ? 'NONE' : 'FOLLOWUP')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${quickFilter === 'FOLLOWUP' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {quickFilter === 'FOLLOWUP' && <Clock size={12} />}
                Overdue
              </button>
              <button
                onClick={() => setQuickFilter(quickFilter === 'NEGOTIATING' ? 'NONE' : 'NEGOTIATING')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${quickFilter === 'NEGOTIATING' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                {quickFilter === 'NEGOTIATING' && <Zap size={12} />}
                Active
              </button>
            </div>

            <div className="flex items-center bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl p-1 gap-1 overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                All Stages
              </button>
              {COLUMNS.map(col => (
                <button
                  key={col.status}
                  onClick={() => setStatusFilter(col.status)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === col.status ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className={`grid grid-cols-1 ${statusFilter === 'ALL' ? 'sm:grid-cols-2 lg:grid-cols-6' : 'max-w-xl mx-auto'} gap-6 md:gap-8 items-start relative z-10`}>
        {COLUMNS.filter(col => statusFilter === 'ALL' || col.status === statusFilter).map((col) => {
          const statusDeals = filteredDeals.filter(d => d.status === col.status);
          return (
            <div key={col.status} className="flex flex-col gap-4 md:gap-5 min-h-0 md:min-h-[500px]">
              <div className="flex items-center justify-between px-2 mb-1 md:mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {col.label}
                  </h2>
                  <span className="w-5 h-5 flex items-center justify-center bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                    {statusDeals.length}
                  </span>
                </div>
                <div className="w-8 h-px bg-slate-100 flex-1 ml-3" />
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout" initial={false}>
                  {statusDeals.map(deal => (
                    <motion.div
                      key={deal.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    >
                      <DealCard deal={deal} />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {statusDeals.length === 0 && (
                  <div className="border-2 border-dashed border-slate-100 rounded-[2rem] md:rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center group hover:border-blue-100 transition-colors">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors text-slate-300 group-hover:text-blue-400">
                      <Sparkles size={16} className="md:size-18" />
                    </div>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-300 uppercase tracking-widest">No leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
