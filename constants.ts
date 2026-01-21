import { DealStatus, Platform } from "./types";

export const STATUS_COLORS: Record<DealStatus, string> = {
  [DealStatus.DRAFT]: "bg-gray-100 text-gray-700 border-gray-200",
  [DealStatus.OUTREACH]: "bg-blue-50 text-blue-700 border-blue-200",
  [DealStatus.REPLIED]: "bg-purple-50 text-purple-700 border-purple-200 animate-pulse-slow", // subtle pulse for action
  [DealStatus.NEGOTIATING]: "bg-orange-50 text-orange-700 border-orange-200",
  [DealStatus.SECURED]: "bg-green-50 text-green-700 border-green-200",
  [DealStatus.GHOSTED]: "bg-red-50 text-red-700 border-red-200 opacity-75",
};

export const PLATFORM_ICONS: Record<Platform, string> = {
  [Platform.INSTAGRAM]: "camera",
  [Platform.TIKTOK]: "music",
  [Platform.YOUTUBE]: "video",
  [Platform.EMAIL]: "mail",
  [Platform.OTHER]: "globe",
};

export const MOCK_INITIAL_DEALS = [
  {
    id: "1",
    brandName: "Bloom Nutrition",
    platform: Platform.TIKTOK,
    contact: "sarah@bloom.com",
    status: DealStatus.REPLIED,
    lastContactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    nextFollowUpAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(), // in 1 day
    followUpIntervalDays: 3,
    followUpCount: 1,
    notes: "They liked the initial concept. Waiting on budget approval.",
    timeline: [
        { id: 't1', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), description: 'Draft created' },
        { id: 't2', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), description: 'Moved to Pitched' },
        { id: 't3', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), description: 'Moved to Replied' },
    ]
  },
  {
    id: "2",
    brandName: "NordVPN",
    platform: Platform.YOUTUBE,
    contact: "marketing@nordvpn.com",
    status: DealStatus.NEGOTIATING,
    dealValue: 2500,
    lastContactedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    nextFollowUpAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    followUpIntervalDays: 7,
    followUpCount: 2,
    notes: "Trying to get them to drop the 6 month exclusivity clause.",
    timeline: [
        { id: 't1', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), description: 'Draft created' },
        { id: 't2', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), description: 'Moved to Pitched' },
        { id: 't3', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), description: 'Moved to Replied' },
        { id: 't4', type: 'rate_check', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), description: 'Performed Rate Check' },
        { id: 't5', type: 'status_change', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), description: 'Moved to Negotiating' },
    ],
    rateCheck: {
        suggestedLow: 2000,
        suggestedHigh: 3500,
        confidenceScore: 85,
        explanation: "Standard rate for tech sponsors on mid-sized channels.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
    }
  },
   {
    id: "3",
    brandName: "GymShark",
    platform: Platform.INSTAGRAM,
    contact: "partnerships@gymshark.com",
    status: DealStatus.DRAFT,
    lastContactedAt: new Date().toISOString(), 
    nextFollowUpAt: new Date().toISOString(),
    followUpIntervalDays: 7,
    followUpCount: 0,
    notes: "",
    timeline: [
        { id: 't1', type: 'status_change', date: new Date().toISOString(), description: 'Draft created' },
    ]
  }
];
