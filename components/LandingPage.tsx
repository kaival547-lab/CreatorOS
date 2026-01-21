import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Zap, TrendingUp,
  ChevronRight, Brain, Target,
  Globe, MessageSquare, ArrowRight, ShieldAlert,
  Instagram, Youtube, Mail, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-brand-onyx text-white selection:bg-blue-500/30 selection:text-blue-200 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-soft" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 md:px-8 py-4 md:py-6 flex items-center justify-between backdrop-blur-xl border-b border-white/5 bg-brand-onyx/40">
        <div className="flex items-center gap-2 md:gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform duration-500">
            C
          </div>
          <span className="font-black text-xl md:text-2xl tracking-tighter">
            Creator<span className="text-blue-500 italic">OS</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {['Problem', 'Use Cases', 'How It Works', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">{item}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')} className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Sign In</button>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-slate-950 px-5 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-white/5"
          >
            Get Started
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-6 h-0.5 bg-current" />
              <div className="w-4 h-0.5 bg-current ml-auto" />
            </div>}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[73px] bottom-0 z-[49] bg-brand-onyx/95 backdrop-blur-2xl lg:hidden p-8 border-t border-white/5"
          >
            <div className="flex flex-col gap-8">
              {['Problem', 'Use Cases', 'How It Works', 'Pricing'].map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-black tracking-tighter text-slate-200 hover:text-blue-500 transition-colors uppercase"
                >
                  {item}
                </motion.a>
              ))}
              <div className="h-px bg-white/10 w-full" />
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => navigate('/login')}
                className="text-left text-lg font-black uppercase tracking-widest text-slate-500 hover:text-white"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-16 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 md:px-5 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 md:mb-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            <Sparkles size={12} className="md:size-3.5" />
            Built for creators who already do brand deals
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-[1.2] sm:leading-[1.1] md:leading-[0.95] tracking-tighter mb-6 md:mb-10 px-2 md:px-0"
          >
            Stop losing brand deals to <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600 italic">forgetfulness, bad rates, and hidden terms.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-xl text-slate-400 mb-8 md:mb-14 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Creator OS helps solo creators track brand deals, price confidently, and spot risky briefs — without spreadsheets or stress.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl text-xs md:text-sm font-black uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group active:scale-95"
            >
              Join the Free Beta
              <ArrowRight size={18} className="md:size-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
            <a href="#how-it-works" className="text-slate-300 font-black hover:text-white transition-colors uppercase tracking-widest text-[9px] md:text-[10px]">
              How it works
            </a>
          </motion.div>
        </motion.div>

        {/* Dashboard Peek - Focused on Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 1, type: 'spring' }}
          className="mt-16 md:mt-32 relative group"
        >
          <div className="absolute inset-0 bg-blue-600/20 rounded-[2rem] md:rounded-[4rem] blur-[60px] md:blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 -z-10" />
          <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-2 md:p-3 border-white/10 bg-white/5 shadow-2xl overflow-hidden">
            <div className="bg-brand-onyx rounded-[2.1rem] md:rounded-[2.8rem] aspect-square md:aspect-[21/9] relative overflow-hidden flex flex-col items-center justify-start md:justify-center">
              <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-center bg-white/5 border-b border-white/5">
                <div className="flex gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Deal Pipeline</span>
                </div>
                <div className="h-4 md:h-6 w-24 md:w-48 bg-white/10 rounded-full" />
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-600/50" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full px-6 md:px-12 mt-20 md:mt-12">
                {[
                  { label: 'Outreach', count: 3, color: 'bg-blue-500' },
                  { label: 'Negotiating', count: 2, color: 'bg-indigo-500' },
                  { label: 'In Review', count: 4, color: 'bg-amber-500' },
                  { label: 'Follow-up Needed', count: 1, color: 'bg-red-500' }
                ].map((col, i) => (
                  <div key={i} className={`space-y-3 md:space-y-4 ${i >= 2 ? 'hidden md:block' : ''}`}>
                    <div className="flex items-center justify-between px-1 md:px-2">
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{col.label}</span>
                      <span className="text-[8px] md:text-[10px] font-black text-slate-400">{col.count}</span>
                    </div>
                    {[1, 2].slice(0, col.count).map(j => (
                      <div key={j} className="glass-card rounded-xl md:rounded-2xl p-3 md:p-4 border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${col.color}`} />
                          <div className="h-2 md:h-3 w-12 md:w-20 bg-white/10 rounded-full" />
                        </div>
                        <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-blue-600/20 rounded-full blur-[40px] md:blur-[80px]" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Section 2 — The Problem (Emotional Validation) */}
      <section id="problem" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">
              You're not disorganized. <br />
              <span className="text-slate-500">You're just using the wrong tools.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium mb-8 md:mb-12">
              This isn’t a motivation problem — it’s a system problem.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {[
              { text: "Brand DMs live in too many places", icon: <MessageSquare size={18} className="md:size-5 text-blue-500" /> },
              { text: "You forget to follow up", icon: <Zap size={18} className="md:size-5 text-indigo-500" /> },
              { text: "You guess your rates", icon: <TrendingUp size={18} className="md:size-5 text-emerald-500" /> },
              { text: "You skim briefs and hope for the best", icon: <ShieldAlert size={18} className="md:size-5 text-red-500" /> }
            ].map((bullet, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                  {bullet.icon}
                </div>
                <span className="text-base md:text-lg font-bold text-slate-200">{bullet.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — The Core Idea (Deal-Centric Framing) */}
      <section className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6 md:mb-8">
            Everything revolves around one thing: <br />
            <span className="text-blue-500 italic uppercase">the brand deal.</span>
          </h2>
          <p className="text-base md:text-xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
            Status, follow-ups, pricing, and briefs live together. One deal = one place. No dashboards you don’t need.
          </p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="space-y-8 md:space-y-12">
              {[
                { label: "Status", text: "Track exactly where you are in the conversation." },
                { label: "Follow-ups", text: "Never let a lead go cold because you forgot to reply." },
                { label: "Rates", text: "Benchmarked against real industry data." },
                { label: "Briefs", text: "Scanned for red flags before you sign." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 md:gap-6">
                  <div className="text-blue-500 font-black text-[10px] md:text-xs uppercase tracking-widest pt-1 shrink-0">{item.label}</div>
                  <div className="text-base md:text-lg font-bold text-slate-300">{item.text}</div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 bg-blue-600/5 border-blue-500/10">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5" />
                    <div className="space-y-2">
                      <div className="h-3 md:h-4 w-24 md:w-32 bg-white/10 rounded-full" />
                      <div className="h-2 md:h-3 w-16 md:w-20 bg-white/5 rounded-full" />
                    </div>
                  </div>
                  <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-blue-500/10 text-[9px] md:text-[10px] font-black uppercase text-blue-400">Negotiating</div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div className="p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-1.5 md:mb-2">Next Step</div>
                    <div className="text-xs md:text-sm font-bold">Follow up on brief feedback in 2 days</div>
                  </div>
                  <div className="flex gap-3 md:gap-4">
                    <div className="flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-1.5 md:mb-2">Target Rate</div>
                      <div className="text-base md:text-lg font-black">$2,500</div>
                    </div>
                    <div className="flex-1 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 mb-1.5 md:mb-2">Risk Score</div>
                      <div className="text-base md:text-lg font-black text-emerald-500">Low</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — Use Cases (Not Features) */}
      <section id="use-cases" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 md:mb-6">In the Moment</h2>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter">BUILT FOR REAL WORKFLOWS.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              headline: "“I got a brand DM and don’t want to forget it.”",
              copy: "Log the brand in 10 seconds. We’ll remind you when it’s time to follow up.",
              icon: <MessageSquare size={18} className="md:size-5 text-blue-500" />
            },
            {
              headline: "“They asked my rate and I’m panicking.”",
              copy: "Sanity-check your rate and reply with confidence — without guessing.",
              icon: <TrendingUp size={18} className="md:size-5 text-indigo-500" />
            },
            {
              headline: "“This brief feels risky but I can’t tell why.”",
              copy: "Translate brand briefs into plain English and spot red flags fast.",
              icon: <ShieldAlert size={18} className="md:size-5 text-red-500" />
            }
          ].map((useCase, i) => (
            <div key={i} className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border-white/5 bg-white/5 flex flex-col gap-6 md:gap-8">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                {useCase.icon}
              </div>
              <h4 className="text-xl md:text-2xl font-black tracking-tight leading-tight">{useCase.headline}</h4>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">{useCase.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5 — How It Works (3 Steps) */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">
              3 steps to a <br />
              <span className="text-blue-500">clean pipeline.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-400 font-medium mb-8 md:mb-12">
              You don’t need to use this every day. It works when you need it.
            </p>
          </div>
          <div className="space-y-10 md:space-y-16">
            {[
              { step: "01", title: "Add a brand deal", desc: "Just the name and status. No complex onboarding." },
              { step: "02", title: "Get intelligence", desc: "Receive reminders, pricing guidance, and brief insights when needed." },
              { step: "03", title: "Close or move on", desc: "Keep your mental load low and your focus on creating." }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 md:gap-8 group">
                <div className="text-4xl md:text-5xl font-black text-white/5 group-hover:text-blue-500/20 transition-colors duration-500 leading-none">{step.step}</div>
                <div>
                  <h4 className="text-lg md:text-xl font-black mb-1.5 md:mb-2 tracking-tight">{step.title}</h4>
                  <p className="text-slate-400 text-sm md:text-base font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 — What Creator OS Is NOT (Trust Builder) */}
      <section className="py-32 px-8 max-w-7xl mx-auto z-10 bg-white/[0.01] rounded-[4rem] mb-32 border border-white/5">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tight mb-8">It’s a decision-support system for brand deals.</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["Not a CRM", "Not a marketplace", "Not a content calendar", "Not a legal tool"].map((tag, i) => (
              <div key={i} className="px-6 py-3 rounded-full bg-red-500/5 border border-red-500/10 text-xs font-black uppercase tracking-widest text-slate-500">
                {tag}
              </div>
            ))}
          </div>
          <p className="text-slate-400 font-medium">
            We focus on one thing: helping you make better decisions on the deals you're already doing.
          </p>
        </div>
      </section>

      {/* Section 7 — Pricing (Simple, Honest) */}
      <section id="pricing" className="py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 md:mb-6">Pricing</h2>
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter">SIMPLE FOR SOLO CREATORS.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border-white/5 bg-white/5 flex flex-col">
            <div className="mb-6 md:mb-8">
              <h4 className="text-xl md:text-2xl font-black mb-1 md:mb-2">Free</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black">$0</span>
                <span className="text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-widest">/forever</span>
              </div>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12 flex-1">
              {[
                "5 active deals",
                "Limited rate checks",
                "Limited brief translations",
                "Basic reminders"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 md:gap-3 text-slate-300 text-sm md:text-base font-medium">
                  <ChevronRight size={14} className="md:size-4 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-xs md:text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Get started free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="glass-card rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border-blue-500/20 bg-blue-600/5 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 md:top-8 right-4 md:right-8 px-3 md:px-4 py-1 rounded-full bg-blue-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white">Recommended</div>
            <div className="mb-6 md:mb-8">
              <h4 className="text-xl md:text-2xl font-black mb-1 md:mb-2">Pro</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black">$19</span>
                <span className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest">/month</span>
              </div>
            </div>
            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-12 flex-1">
              {[
                "Unlimited deals",
                "Unlimited reminders",
                "Unlimited rate checks",
                "Unlimited brief translations",
                "PDF exports",
                "Priority support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2 md:gap-3 text-slate-200 text-sm md:text-base font-medium">
                  <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <ShieldCheck size={10} className="md:size-3 text-blue-400" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-xl md:rounded-2xl bg-blue-600 text-white text-xs md:text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20"
            >
              Go Pro Now
            </button>
            <p className="text-center text-[8px] md:text-[10px] font-bold text-slate-500 mt-4 md:mt-6 uppercase tracking-widest">Cancel anytime. No contracts.</p>
          </div>
        </div>
      </section>

      {/* Section 8 — Social Proof (Lightweight MVP) */}
      <section className="py-32 px-8 max-w-7xl mx-auto z-10 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: "Finally stopped forgetting follow-ups.", author: "Full-time Creator" },
            { quote: "Helped me realize I was undercharging by thousands.", author: "YT Finance Host" },
            { quote: "Caught exclusivity I would’ve missed in a 40-page brief.", author: "Lifestyle Influencer" }
          ].map((testimonial, i) => (
            <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 italic text-slate-300 font-medium relative">
              <span className="text-4xl text-blue-500/20 absolute top-4 left-4 font-serif">“</span>
              <p className="mb-6 relative z-10">"{testimonial.quote}"</p>
              <footer className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 not-italic">— {testimonial.author}</footer>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9 — Final CTA */}
      <section className="py-24 md:py-48 px-4 md:px-8 relative overflow-hidden text-center z-10">
        <div className="absolute inset-0 bg-blue-600/5 -z-10" />
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 md:mb-10 leading-[1.1] md:leading-none lowercase">
            Stop handling brand deals <br />
            <span className="italic text-blue-500 uppercase">in your head.</span>
          </h2>
          <p className="text-base md:text-xl text-slate-400 font-medium mb-8 md:mb-12 max-w-xl mx-auto">
            Built for creators who already do brand deals. Join 1,500+ peers using Creator OS.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-slate-950 px-10 md:px-14 py-5 md:py-7 rounded-[1.5rem] md:rounded-[2.5rem] text-xs md:text-sm font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 md:gap-4 mx-auto"
          >
            Get started free
            <ArrowRight size={18} className="md:size-5" />
          </button>
          <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-6 md:mt-8">No credit card required · Setup in 30 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-8 opacity-50">
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white font-black">C</div>
          <span className="font-black text-lg tracking-tighter">CreatorOS</span>
        </div>
        <div className="flex justify-center gap-10 mb-10">
          {['Privacy', 'Terms', 'Docs', 'Twitter', 'Contact'].map(item => (
            <a key={item} href="#" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">{item}</a>
          ))}
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-600">© 2026 CREATOR OPERATING SYSTEM · ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};
