import { supabase } from './supabase';
import type { BrandDeal, TimelineEvent } from '../types';

// ==================== DEALS ====================

export async function getDeals(userId: string): Promise<BrandDeal[]> {
    const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (dealsError) throw dealsError;
    if (!dealsData) return [];

    // Fetch timeline events for all deals
    const dealIds = dealsData.map(d => d.id);
    const { data: eventsData, error: eventsError } = await supabase
        .from('timeline_events')
        .select('*')
        .in('deal_id', dealIds)
        .order('created_at', { ascending: true });

    if (eventsError) throw eventsError;

    // Map database records to BrandDeal type
    return dealsData.map(deal => ({
        id: deal.id,
        brandName: deal.brand_name,
        platform: deal.platform as any,
        contact: deal.contact || '',
        status: deal.status as any,
        dealValue: deal.deal_value || undefined,
        lastContactedAt: deal.last_contacted_at,
        nextFollowUpAt: deal.next_follow_up_at,
        followUpIntervalDays: deal.follow_up_interval_days,
        followUpCount: deal.follow_up_count,
        notes: deal.notes || '',
        rateCheck: deal.rate_check as any,
        briefAnalysis: deal.brief_analysis as any,
        timeline: (eventsData || [])
            .filter(e => e.deal_id === deal.id)
            .map(e => ({
                id: e.id,
                type: e.type as any,
                date: e.created_at,
                description: e.description,
                metadata: e.metadata as any
            }))
    }));
}

export async function createDeal(userId: string, deal: Omit<BrandDeal, 'id' | 'timeline'>): Promise<BrandDeal> {
    const { data, error } = await supabase
        .from('deals')
        .insert({
            user_id: userId,
            brand_name: deal.brandName,
            platform: deal.platform,
            contact: deal.contact || null,
            status: deal.status,
            deal_value: deal.dealValue || null,
            last_contacted_at: deal.lastContactedAt,
            next_follow_up_at: deal.nextFollowUpAt,
            follow_up_interval_days: deal.followUpIntervalDays,
            follow_up_count: deal.followUpCount,
            notes: deal.notes || null,
            rate_check: deal.rateCheck as any || null,
            brief_analysis: deal.briefAnalysis as any || null
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        brandName: data.brand_name,
        platform: data.platform as any,
        contact: data.contact || '',
        status: data.status as any,
        dealValue: data.deal_value || undefined,
        lastContactedAt: data.last_contacted_at,
        nextFollowUpAt: data.next_follow_up_at,
        followUpIntervalDays: data.follow_up_interval_days,
        followUpCount: data.follow_up_count,
        notes: data.notes || '',
        rateCheck: data.rate_check as any,
        briefAnalysis: data.brief_analysis as any,
        timeline: []
    };
}

export async function updateDeal(dealId: string, updates: Partial<BrandDeal>): Promise<void> {
    const dbUpdates: any = {
        updated_at: new Date().toISOString()
    };

    if (updates.brandName !== undefined) dbUpdates.brand_name = updates.brandName;
    if (updates.platform !== undefined) dbUpdates.platform = updates.platform;
    if (updates.contact !== undefined) dbUpdates.contact = updates.contact || null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.dealValue !== undefined) dbUpdates.deal_value = updates.dealValue || null;
    if (updates.lastContactedAt !== undefined) dbUpdates.last_contacted_at = updates.lastContactedAt;
    if (updates.nextFollowUpAt !== undefined) dbUpdates.next_follow_up_at = updates.nextFollowUpAt;
    if (updates.followUpIntervalDays !== undefined) dbUpdates.follow_up_interval_days = updates.followUpIntervalDays;
    if (updates.followUpCount !== undefined) dbUpdates.follow_up_count = updates.followUpCount;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes || null;
    if (updates.rateCheck !== undefined) dbUpdates.rate_check = updates.rateCheck as any || null;
    if (updates.briefAnalysis !== undefined) dbUpdates.brief_analysis = updates.briefAnalysis as any || null;

    const { error } = await supabase
        .from('deals')
        .update(dbUpdates)
        .eq('id', dealId);

    if (error) throw error;
}

export async function deleteDeal(dealId: string): Promise<void> {
    const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);

    if (error) throw error;
}

// ==================== TIMELINE EVENTS ====================

export async function addTimelineEvent(
    dealId: string,
    event: Omit<TimelineEvent, 'id' | 'date'>
): Promise<TimelineEvent> {
    const { data, error } = await supabase
        .from('timeline_events')
        .insert({
            deal_id: dealId,
            type: event.type,
            description: event.description,
            metadata: event.metadata as any || null
        })
        .select()
        .single();

    if (error) throw error;

    return {
        id: data.id,
        type: data.type as any,
        date: data.created_at,
        description: data.description,
        metadata: data.metadata as any
    };
}

// ==================== FEEDBACK ====================

export async function submitFeedback(userId: string, type: string, value: string, comment?: string): Promise<void> {
    const { error } = await supabase
        .from('user_feedback')
        .insert({
            user_id: userId,
            type,
            value,
            comment: comment || null
        });

    if (error) throw error;
}
