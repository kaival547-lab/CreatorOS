export enum Platform {
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  YOUTUBE = 'YouTube',
  EMAIL = 'Email Newsletter',
  OTHER = 'Other'
}

export enum DealStatus {
  DRAFT = 'Discovery',
  OUTREACH = 'Outreach',
  REPLIED = 'Replied',
  NEGOTIATING = 'Negotiating',
  SECURED = 'Secured',
  GHOSTED = 'Ghosted'
}

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'note' | 'follow_up' | 'rate_check' | 'brief_analysis';
  date: string; // ISO string
  description: string;
  metadata?: any;
}

export interface RateCheckResult {
  suggestedLow: number;
  suggestedHigh: number;
  confidenceScore: number; // 0-100
  explanation: string;
  suggestedReply?: string; // New: copy-paste ready reply
  timestamp: string;
}

export interface BriefAnalysisResult {
  summary: string;
  redFlags: string[];
  checklist: string[];
  questionsToAsk: string[];
  timestamp: string;
}

export interface BrandDeal {
  id: string;
  brandName: string;
  platform: Platform;
  contact: string;
  status: DealStatus;
  dealValue?: number;
  lastContactedAt: string; // ISO String
  nextFollowUpAt: string; // ISO String
  followUpIntervalDays: number; // New field
  followUpCount: number;
  notes: string;

  // Attached Features
  rateCheck?: RateCheckResult;
  briefAnalysis?: BriefAnalysisResult;
  timeline: TimelineEvent[];
}

export interface RateCheckInput {
  platform: Platform;
  followers: number;
  avgViews: number;
  engagementRate: number; // percentage as number
  contentType: string; // e.g., "Reel", "Integration"
  usageRights: string;
  exclusivity: string;
}

export type DealActionType =
  | 'FOLLOW_UP'
  | 'REVIEW_RISKS'
  | 'CHECK_RATE'
  | 'LOG_NOTES'
  | 'GHOSTED_CLOSURE'
  | 'NONE';

export interface DealAction {
  label: string;
  type: DealActionType;
  description: string;
}

export function getDealAction(deal: BrandDeal): DealAction {
  const today = new Date();
  const nextFollowUp = new Date(deal.nextFollowUpAt);

  // Rule 1: Ghosted state (Emotional relief)
  // If explicitly ghosted
  if (deal.status === DealStatus.GHOSTED) {
    return { label: 'Clear mental space', type: 'GHOSTED_CLOSURE', description: 'This deal is closed. You did your part.' };
  }

  // Rule 2: Potential Ghosting (3+ follow-ups sent, still open)
  if (deal.followUpCount >= 3 && deal.status !== DealStatus.SECURED) {
    return { label: 'Mark as Ghosted', type: 'GHOSTED_CLOSURE', description: '3+ follow-ups sent. Time to move on?' };
  }

  // Rule 3: Overdue follow-up
  if (nextFollowUp <= today && deal.status !== DealStatus.SECURED) {
    return { label: 'Follow up today', type: 'FOLLOW_UP', description: 'Time to nudge the brand.' };
  }

  // Rule 4: Unreviewed Risks
  if (deal.briefAnalysis && deal.briefAnalysis.redFlags.length > 0) {
    return { label: 'Review ⚠️ Risks', type: 'REVIEW_RISKS', description: 'Red flags detected in brief.' };
  }

  // Rule 5: Replied but no rate check
  if (deal.status === DealStatus.REPLIED && !deal.rateCheck) {
    return { label: 'Check your rate', type: 'CHECK_RATE', description: 'Know your worth before replying.' };
  }

  // Rule 6: Negotiating but no recent notes (simulated by checking if notes are empty/placeholder)
  if (deal.status === DealStatus.NEGOTIATING && (!deal.notes || deal.notes.length < 10)) {
    return { label: 'Log deal notes', type: 'LOG_NOTES', description: 'Keep track of what was discussed.' };
  }

  // Fallback
  if (deal.status === DealStatus.OUTREACH) {
    return { label: 'Waiting on brand', type: 'NONE', description: 'Ball is in their court.' };
  }

  return { label: 'Keep it up!', type: 'NONE', description: 'Stay organized.' };
}
