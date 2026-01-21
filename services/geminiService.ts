import { supabase } from "../lib/supabase";
import { RateCheckInput, RateCheckResult, BriefAnalysisResult } from "../types";

export const checkRateWithGroq = async (input: RateCheckInput): Promise<RateCheckResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-service', {
      body: {
        action: 'check-rate',
        data: input
      }
    });

    if (error) throw error;

    return {
      suggestedLow: data.suggestedLow || 500,
      suggestedHigh: data.suggestedHigh || 1500,
      confidenceScore: data.confidenceScore || 50,
      explanation: data.explanation || "Analysis completed",
      suggestedReply: data.suggestedReply || "Thanks for the offer! Based on the scope, my rate would be around $X. Let me know if that works.",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Rate check failed", error);
    return {
      suggestedLow: 500,
      suggestedHigh: 1500,
      confidenceScore: 50,
      explanation: "Unable to connect to AI. Showing fallback estimate based on general market data.",
      timestamp: new Date().toISOString()
    };
  }
};

export const analyzeBriefWithGroq = async (briefText: string): Promise<BriefAnalysisResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-service', {
      body: {
        action: 'analyze-brief',
        data: { briefText }
      }
    });

    if (error) throw error;

    return {
      summary: data.summary || "Could not analyze brief automatically.",
      redFlags: data.redFlags || ["Analysis service currently unavailable."],
      checklist: data.checklist || ["Review brief manually"],
      questionsToAsk: data.questionsToAsk || ["What are the usage rights?"],
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Brief analysis failed", error);
    return {
      summary: "Could not analyze brief automatically.",
      redFlags: ["Analysis service currently unavailable. Check for generic red flags like 'Perpetual Rights'."],
      checklist: ["Review brief manually", "Check payment terms", "Check usage rights"],
      questionsToAsk: ["What are the usage rights?", "When is the payment due?"],
      timestamp: new Date().toISOString()
    };
  }
};

// Export with backward compatible names
export const checkRateWithGemini = checkRateWithGroq;
export const analyzeBriefWithGemini = analyzeBriefWithGroq;
