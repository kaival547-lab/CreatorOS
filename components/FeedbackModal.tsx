import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Sparkles, Zap, Star } from 'lucide-react';

export type FeedbackType = 'post_creation' | 'reminder_utility' | 'ai_value' | 'general';

interface FeedbackOption {
    label: string;
    value: string;
}

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: FeedbackType;
    onFeedbackSubmit: (type: FeedbackType, value: string, text?: string) => void;
}

const FEEDBACK_CONTENT: Record<FeedbackType, {
    icon: React.ElementType;
    title: string;
    question: string;
    options: FeedbackOption[];
    color: string;
}> = {
    post_creation: {
        icon: Star,
        title: 'Quick Check',
        question: 'What made you save this deal?',
        options: [
            { label: 'Afraid I’d forget', value: 'avoid_forgetting' },
            { label: 'Pricing unsure', value: 'pricing_uncertain' },
            { label: 'Just organizing', value: 'organizing' },
            { label: 'Other', value: 'other' },
        ],
        color: 'bg-blue-600',
    },
    reminder_utility: {
        icon: Zap,
        title: 'Was this useful?',
        question: 'Did this reminder help you?',
        options: [
            { label: 'Yes — I would’ve forgotten', value: 'yes_critical' },
            { label: 'Yes — but I already knew', value: 'yes_redundant' },
            { label: 'Not really', value: 'no' },
        ],
        color: 'bg-amber-500',
    },
    ai_value: {
        icon: Sparkles,
        title: 'AI Feedback',
        question: 'Did this change what you’ll say to the brand?',
        options: [
            { label: 'Yes', value: 'yes' },
            { label: 'A little', value: 'maybe' },
            { label: 'No', value: 'no' },
        ],
        color: 'bg-indigo-600',
    },
    general: {
        icon: MessageSquare,
        title: 'Your Voice',
        question: 'What almost stopped you from using this?',
        options: [
            { label: 'Too complicated', value: 'complicated' },
            { label: 'Missing features', value: 'missing_features' },
            { label: 'Not sure about value', value: 'value_unsure' },
            { label: 'Something else...', value: 'other' },
        ],
        color: 'bg-emerald-600',
    }
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, type, onFeedbackSubmit }) => {
    const content = FEEDBACK_CONTENT[type];
    const [selected, setSelected] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!selected) return;
        onFeedbackSubmit(type, selected, comment);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setSelected(null);
            setComment('');
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl"
                >
                    {isSubmitted ? (
                        <div className="p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                                <Star fill="currentColor" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">Thank you!</h3>
                            <p className="text-slate-500 font-medium">Your feedback helps shape Creator OS.</p>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${content.color} text-white rounded-xl flex items-center justify-center shadow-lg`}>
                                        <content.icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{content.title}</span>
                                </div>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-slate-950 mb-6 tracking-tight leading-tight">
                                {content.question}
                            </h2>

                            <div className="space-y-3 mb-8">
                                {content.options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setSelected(option.value)}
                                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm ${selected === option.value
                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                            : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            {(selected === 'other' || type === 'general') && (
                                <div className="mb-8">
                                    <textarea
                                        placeholder={type === 'general' ? "Any other thoughts or suggestions?" : "Tell us more..."}
                                        className="w-full p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all text-sm font-medium resize-none h-24"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </div>
                            )}

                            <button
                                disabled={!selected}
                                onClick={handleSubmit}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${selected
                                    ? 'bg-slate-950 text-white shadow-xl hover:scale-[1.02] active:scale-95'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Send Feedback
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
