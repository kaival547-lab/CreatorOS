import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            setError('An account with this email already exists. Please sign in instead.');
            setIsSignUp(false);
          } else {
            onLogin();
            navigate('/');
          }
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          onLogin();
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/#/reset-password`
      });

      if (resetError) throw resetError;

      setResetSuccess(true);
      setTimeout(() => {
        setShowResetPassword(false);
        setResetEmail('');
        setResetSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-onyx flex items-center justify-center p-4 md:p-6 relative overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse-soft" style={{ animationDelay: '-3s' }} />
      </div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showResetPassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetPassword(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl w-full max-w-md shadow-2xl relative z-10 border border-white/10"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Reset Password</h2>
                  <button
                    onClick={() => setShowResetPassword(false)}
                    className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {resetSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 md:p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
                  >
                    <CheckCircle size={24} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-emerald-200 font-bold mb-1">Email Sent!</p>
                      <p className="text-xs text-emerald-300/70">Check your inbox for instructions.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-5 md:space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@creator.os"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-600"
                        required
                        disabled={loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 md:px-5 md:py-2.5 rounded-2xl border border-white/10 mb-6 md:mb-8 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-[10px] md:text-xs shadow-lg shadow-blue-600/20">C</div>
            <span className="font-black text-xs md:text-sm tracking-tight text-white">Creator<span className="text-blue-500 italic">OS</span></span>
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2 md:mb-3 uppercase">
            {isSignUp ? 'Create Account' : 'Secure Access'}
          </h1>
          <p className="text-slate-400 font-medium text-xs md:text-sm">
            {isSignUp ? 'Join the creator intelligence layer.' : 'Sign in to the creator intelligence layer.'}
          </p>
        </div>

        <div className="glass-card rounded-[2rem] md:rounded-[2.5rem] border-white/10 p-8 md:p-10 bg-white/5 shadow-2xl">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
              >
                <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                <p className="text-xs md:text-sm text-red-200 font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2 block">Identity (Email)</label>
              <input
                id="email"
                type="email"
                placeholder="you@creator.os"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-600"
                required
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center px-2">
                <label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Security Key</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-[9px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm text-white focus:ring-4 focus:ring-blue-500/10 focus:bg-white/10 focus:border-blue-500 transition-all outline-none font-medium placeholder:text-slate-600"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 md:py-5 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Initialize Session')}
              {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 md:mt-10 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
          {isSignUp ? 'Already have an account?' : 'New to the OS?'}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            disabled={loading}
            className="text-blue-500 hover:text-blue-400 underline decoration-2 underline-offset-4 transition-colors disabled:opacity-50"
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
