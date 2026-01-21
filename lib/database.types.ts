export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            deals: {
                Row: {
                    id: string
                    user_id: string
                    brand_name: string
                    platform: string
                    contact: string | null
                    status: string
                    deal_value: number | null
                    last_contacted_at: string
                    next_follow_up_at: string
                    follow_up_interval_days: number
                    follow_up_count: number
                    notes: string | null
                    rate_check: Json | null
                    brief_analysis: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    brand_name: string
                    platform: string
                    contact?: string | null
                    status: string
                    deal_value?: number | null
                    last_contacted_at: string
                    next_follow_up_at: string
                    follow_up_interval_days?: number
                    follow_up_count?: number
                    notes?: string | null
                    rate_check?: Json | null
                    brief_analysis?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    brand_name?: string
                    platform?: string
                    contact?: string | null
                    status?: string
                    deal_value?: number | null
                    last_contacted_at?: string
                    next_follow_up_at?: string
                    follow_up_interval_days?: number
                    follow_up_count?: number
                    notes?: string | null
                    rate_check?: Json | null
                    brief_analysis?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            timeline_events: {
                Row: {
                    id: string
                    deal_id: string
                    type: string
                    description: string
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    deal_id: string
                    type: string
                    description: string
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    deal_id?: string
                    type?: string
                    description?: string
                    metadata?: Json | null
                    created_at?: string
                }
            }
        }
    }
}
