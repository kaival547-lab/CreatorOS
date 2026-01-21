import React, { useState } from 'react';
import { Platform, DealStatus, BrandDeal } from '../types';
import { X, Clock, Sparkles, Building2, UserCircle2, MessageSquareText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (deal: Omit<BrandDeal, 'id' | 'timeline' | 'lastContactedAt' | 'nextFollowUpAt' | 'followUpCount'>) => Promise<void>;
  onCreated?: () => void;
}

export const NewDealModal: React.FC<NewDealModalProps> = ({ isOpen, onClose, onCreate, onCreated }) => {
  const [mode, setMode] = useState<'NORMAL' | 'PANIC'>('NORMAL');
  const [formData, setFormData] = useState({
    brandName: '',
    platform: Platform.TIKTOK,
    contact: '',
    notes: '',
    followUpIntervalDays: 7,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'PANIC') {
        await onCreate({
          brandName: formData.brandName,
          platform: Platform.OTHER,
          contact: 'Pending...',
          status: DealStatus.DRAFT,
          notes: 'Quick save. Reminder set.',
          followUpIntervalDays: 3,
        });
      } else {
        await onCreate({
          ...formData,
          status: DealStatus.DRAFT,
          notes: formData.notes
        });
      }

      setFormData({ brandName: '', platform: Platform.TIKTOK, contact: '', notes: '', followUpIntervalDays: 7 });
      setMode('NORMAL');
      if (onCreated) onCreated();
      onClose(); // Only close on success
    } catch (error) {
      console.error("Submission failed", error);
      // Keep modal open, App.tsx handles the error toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header/Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 md:px-8 py-8 md:py-10 text-white relative flex-shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 md:top-6 right-4 md:right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="md:size-20 text-blue-100" />
                </div>
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">Genesis</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Initiate Deal</h2>
              <p className="text-blue-100/70 text-xs md:text-sm mt-1">Transform an opportunity into a partnership.</p>
            </div>

            <div className="flex border-b border-gray-100">
              <button
                type="button"
                onClick={() => setMode('NORMAL')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'NORMAL' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Normal Entry
              </button>
              <button
                type="button"
                onClick={() => setMode('PANIC')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'PANIC' ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50/30' : 'text-gray-400 hover:text-gray-600'}`}
              >
                ⚡ Panic Save
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 pb-8 md:pb-10 space-y-5 md:space-y-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div className="relative group">
                  <label htmlFor="brandName" className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    <Building2 size={12} /> Brand Identity
                  </label>
                  <input
                    id="brandName"
                    required
                    autoFocus
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all outline-none font-medium placeholder:text-gray-300"
                    value={formData.brandName}
                    onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Athletic Greens"
                  />
                </div>

                <AnimatePresence mode="wait">
                  {mode === 'NORMAL' ? (
                    <motion.div
                      key="normal-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="platform" className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Main Platform
                          </label>
                          <div className="relative">
                            <select
                              id="platform"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none appearance-none cursor-pointer font-medium"
                              value={formData.platform}
                              onChange={e => setFormData({ ...formData, platform: e.target.value as Platform })}
                            >
                              {Object.values(Platform).map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <Clock size={12} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="followUp" className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                            Follow-up cycle
                          </label>
                          <div className="relative">
                            <select
                              id="followUp"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none appearance-none cursor-pointer font-medium"
                              value={formData.followUpIntervalDays}
                              onChange={e => setFormData({ ...formData, followUpIntervalDays: Number(e.target.value) })}
                            >
                              <option value={3}>3 Days · High Prio</option>
                              <option value={5}>5 Days · Standard</option>
                              <option value={7}>7 Days · Relaxed</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                              <Clock size={12} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="contact" className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                          <UserCircle2 size={12} /> POC Information
                        </label>
                        <input
                          id="contact"
                          required={mode === 'NORMAL'}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all outline-none font-medium placeholder:text-gray-300"
                          value={formData.contact}
                          onChange={e => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="Email or LinkedIn URL"
                        />
                      </div>

                      <div>
                        <label htmlFor="notes" className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                          <MessageSquareText size={12} /> Strategic Context
                        </label>
                        <textarea
                          id="notes"
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all outline-none min-h-[80px] md:min-h-[100px] font-medium resize-none placeholder:text-gray-300"
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Add initial outreach notes or campaign goals..."
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="panic-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="py-4 px-6 bg-orange-50 rounded-2xl border border-orange-100"
                    >
                      <p className="text-[11px] font-bold text-orange-700 leading-relaxed italic">
                        "Save now, think later. We'll set a 3-day follow-up reminder automatically."
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:flex-1 px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:flex-[2] py-3.5 md:py-4 rounded-xl md:rounded-2xl text-sm font-bold shadow-xl transition-all tracking-wide order-1 sm:order-2 disabled:opacity-70 disabled:cursor-wait ${mode === 'PANIC' ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20 text-white' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white'}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    mode === 'PANIC' ? '⚡ Quick Save' : 'Confirm & Start'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
