import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DealBoard } from './components/DealBoard';
import { DealDetail } from './components/DealDetail';
import { NewDealModal } from './components/NewDealModal';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { BrandDeal, TimelineEvent, DealStatus } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import { getDeals, createDeal, updateDeal, addTimelineEvent, submitFeedback } from './lib/api';
import { FeedbackModal, FeedbackType } from './components/FeedbackModal';

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- User Profile / Tier ---
  const [isPro, setIsPro] = useState<boolean>(() => {
    // During Free Beta, everyone is Pro
    const stored = localStorage.getItem('creator-os-pro');
    return stored === null ? true : stored === 'true';
  });

  const togglePro = () => {
    const newVal = !isPro;
    setIsPro(newVal);
    localStorage.setItem('creator-os-pro', String(newVal));
    addNotification({
      id: Math.random().toString(),
      message: newVal ? "Pro Mode Activated! 🚀" : "Switched to Free Tier",
      type: 'info'
    });
  };

  // --- App Data State ---
  const [deals, setDeals] = useState<BrandDeal[]>([]);
  const [dealsLoading, setDealsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string, message: string, type: 'alert' | 'info' }[]>([]);

  // --- Feedback State ---
  const [feedbackState, setFeedbackState] = useState<{ isOpen: boolean, type: FeedbackType }>({
    isOpen: false,
    type: 'post_creation'
  });

  const triggerFeedback = (type: FeedbackType) => {
    // Manual feedback (general) bypasses the throttle
    if (type !== 'general') {
      const lastFeedback = localStorage.getItem('last-feedback-time');
      const now = Date.now();
      if (lastFeedback && now - parseInt(lastFeedback) < 1000 * 60 * 30) return; // 30 mins
    }

    setFeedbackState({ isOpen: true, type });
  };

  const handleFeedbackSubmit = async (type: FeedbackType, value: string, text?: string) => {
    if (!userId) return;
    try {
      await submitFeedback(userId, type, value, text);
      localStorage.setItem('last-feedback-time', Date.now().toString());
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  const addNotification = (notif: { id: string, message: string, type: 'alert' | 'info' }) => {
    setNotifications(prev => [...prev, notif]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 5000);
  };

  // Check authentication status on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load deals when user is authenticated
  useEffect(() => {
    if (isAuthenticated && userId) {
      loadDeals();
    } else {
      setDeals([]);
    }
  }, [isAuthenticated, userId]);

  const loadDeals = async () => {
    if (!userId) return;

    setDealsLoading(true);
    try {
      const dealsData = await getDeals(userId);
      setDeals(dealsData);
    } catch (error: any) {
      console.error('Error loading deals:', error);
      addNotification({
        id: Math.random().toString(),
        message: 'Failed to load deals: ' + error.message,
        type: 'alert'
      });
    } finally {
      setDealsLoading(false);
    }
  };

  // Check for overdue follow-ups
  useEffect(() => {
    if (!isAuthenticated || deals.length === 0) return;

    const now = new Date();
    const overdueCount = deals.filter(d =>
      d.status !== DealStatus.SECURED &&
      d.status !== DealStatus.GHOSTED &&
      new Date(d.nextFollowUpAt) < now
    ).length;

    if (overdueCount > 0) {
      addNotification({
        id: 'follow-up-alert',
        message: `You have ${overdueCount} deal${overdueCount > 1 ? 's' : ''} that need follow-up!`,
        type: 'alert'
      });
    }
  }, [isAuthenticated, deals]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserId(null);
    setDeals([]);
  };

  const handleCreateDeal = async (newDealData: any) => {
    if (!userId) return;

    // Free tier limit removed during Beta
    /*
    if (!isPro && deals.length >= 5) {
      addNotification({
        id: 'tier-limit',
        message: "You've reached the free limit of 5 deals. Upgrade to Pro for unlimited!",
        type: 'alert'
      });
      return;
    }
    */

    try {
      const intervalDays = newDealData.followUpIntervalDays || 7;
      const newDeal: Omit<BrandDeal, 'id' | 'timeline'> = {
        brandName: newDealData.brandName,
        platform: newDealData.platform,
        contact: newDealData.contact || '',
        status: newDealData.status || DealStatus.DRAFT,
        notes: newDealData.notes || '',
        dealValue: newDealData.dealValue,
        lastContactedAt: new Date().toISOString(),
        nextFollowUpAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * intervalDays).toISOString(),
        followUpIntervalDays: intervalDays,
        followUpCount: 0,
      };

      const createdDeal = await createDeal(userId, newDeal);

      // Add initial timeline event
      const initialEvent = await addTimelineEvent(createdDeal.id, {
        type: 'status_change',
        description: 'Deal Created'
      });

      setDeals([{ ...createdDeal, timeline: [initialEvent] }, ...deals]);
      setIsModalOpen(false);

      addNotification({
        id: Math.random().toString(),
        message: `Deal with ${newDealData.brandName} created successfully!`,
        type: 'info'
      });
    } catch (error: any) {
      console.error('Error creating deal:', error);
      addNotification({
        id: Math.random().toString(),
        message: 'Failed to create deal: ' + error.message,
        type: 'alert'
      });
      throw error;
    }
  };


  const handleUpdateDeal = async (id: string, updates: Partial<BrandDeal>) => {
    try {
      await updateDeal(id, updates);

      setDeals(deals.map(d => {
        if (d.id === id) {
          const updated = { ...d, ...updates };

          // Auto-timestamp status changes in timeline if not already done by components
          if (updates.status && updates.status !== d.status) {
            const event: TimelineEvent = {
              id: Math.random().toString(36).substr(2, 9),
              date: new Date().toISOString(),
              type: 'status_change',
              description: `Status changed to ${updates.status}`
            };
            updated.timeline = [...updated.timeline, event];
          }

          return updated;
        }
        return d;
      }));
    } catch (error: any) {
      console.error('Error updating deal:', error);
      addNotification({
        id: Math.random().toString(),
        message: 'Failed to update deal: ' + error.message,
        type: 'alert'
      });
    }
  };

  const handleAddTimelineEvent = (dealId: string, event: Omit<TimelineEvent, 'id' | 'date'>) => {
    setDeals(deals.map(d => {
      if (d.id === dealId) {
        const newEvent: TimelineEvent = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          ...event
        };

        const updatedDeal = { ...d, timeline: [...d.timeline, newEvent] };

        // If it's a follow-up, update the next follow-up date and count
        if (event.type === 'follow_up') {
          updatedDeal.followUpCount = (d.followUpCount || 0) + 1;
          updatedDeal.lastContactedAt = new Date().toISOString();
          updatedDeal.nextFollowUpAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * d.followUpIntervalDays).toISOString();

          // Ghosting logic: if followUpCount >= 3, maybe suggest ghosting
          if (updatedDeal.followUpCount >= 3) {
            addNotification({
              id: `ghosting-${d.id}`,
              message: `It's been 3 follow-ups for ${d.brandName}. Consider marking as Ghosted?`,
              type: 'info'
            });
          }
        }

        return updatedDeal;
      }
      return d;
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-500 font-bold text-sm tracking-widest uppercase animate-pulse">Initializing OS...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="relative">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed top-4 left-1/2 z-[100] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] border ${n.type === 'alert' ? 'bg-red-600 text-white border-red-500' : 'bg-white text-gray-900 border-gray-100'
                }`}
            >
              <Bell size={18} className={n.type === 'alert' ? 'text-white' : 'text-blue-600'} />
              <span className="flex-1 text-sm font-medium">{n.message}</span>
              <button onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}>
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <Routes>
          {/* Public Routes */}
          <Route path="/landing" element={
            !isAuthenticated ? <LandingPage /> : <Navigate to="/" replace />
          } />

          <Route path="/login" element={
            !isAuthenticated ? <AuthPage onLogin={handleLogin} /> : <Navigate to="/" replace />
          } />

          {/* Protected Routes */}
          <Route path="/*" element={
            isAuthenticated ? (
              <Layout isPro={isPro} togglePro={togglePro} onNewDeal={() => setIsModalOpen(true)} onLogout={handleLogout} triggerFeedback={triggerFeedback}>
                <Routes>
                  <Route path="/" element={<DealBoard deals={deals} onNewDeal={() => setIsModalOpen(true)} />} />
                  <Route
                    path="/deal/:id"
                    element={
                      <DealDetail
                        deals={deals}
                        isPro={isPro}
                        updateDeal={handleUpdateDeal}
                        addTimelineEvent={handleAddTimelineEvent}
                        triggerFeedback={triggerFeedback}
                      />
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <NewDealModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onCreate={handleCreateDeal}
                  onCreated={() => triggerFeedback('post_creation')}
                />
              </Layout>
            ) : (
              <Navigate to="/landing" replace />
            )
          } />
        </Routes>

        <FeedbackModal
          isOpen={feedbackState.isOpen}
          onClose={() => setFeedbackState(prev => ({ ...prev, isOpen: false }))}
          type={feedbackState.type}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </div>
    </HashRouter>
  );
};

export default App;
