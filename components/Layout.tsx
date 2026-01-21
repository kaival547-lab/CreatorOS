import React, { useState } from 'react';
import { LayoutDashboard, Plus, LogOut, ShieldCheck, Zap, Menu, X, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.Node;
  isPro: boolean;
  togglePro: () => void;
  onNewDeal: () => void;
  onLogout: () => void;
  triggerFeedback: (type: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isPro, togglePro, onNewDeal, onLogout, triggerFeedback }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Deal Board', icon: LayoutDashboard },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-[10px]">C</div>
            Creator OS
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">v1.0 FREE BETA</p>
            <span className="bg-amber-500/10 text-amber-600 text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
              🧪 BETA
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="p-4 flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${location.pathname === item.to
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
        <button
          onClick={togglePro}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isPro
            ? 'bg-white text-blue-600 border-blue-100 shadow-sm'
            : 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'
            }`}
        >
          <Zap size={14} fill={isPro ? "currentColor" : "none"} />
          {isPro ? 'Beta: All Features Unlocked' : 'Enable Beta Mode'}
        </button>

        <button
          onClick={() => {
            onNewDeal();
            setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-black transition-all shadow-sm active:scale-95"
        >
          <Plus size={16} />
          New Deal
        </button>

        <button
          onClick={() => {
            triggerFeedback('general');
            setIsMobileMenuOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold transition-all"
        >
          <MessageSquare size={14} />
          Give Feedback
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-shrink-0 flex-col justify-between shadow-sm z-50">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-white z-[70] lg:hidden shadow-2xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex-shrink-0 flex items-center justify-between px-4 z-40">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[12px] font-bold">C</div>
            <span className="font-bold text-gray-900">Creator OS</span>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[#fafafa]">
          {children}
        </main>
      </div>
    </div>
  );
};
