import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.24.1";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { action, data } = await req.json();
        const apiKey = Deno.env.get('GROQ_API_KEY');

        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'GROQ_API_KEY is not set' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });

        const MODEL_NAME = "llama-3.3-70b-versatile";

        if (action === 'check-rate') {
            const input = data;
            const prompt = `Act as a Creator Economy pricing expert (Talent Manager). 
Analyze the following creator metrics and deal terms to suggest a FAIR MARKET price range.

Platform: ${input.platform}
Followers: ${input.followers}
Average Views: ${input.avgViews}
Engagement Rate: ${input.engagementRate}%
Deliverable Type: ${input.contentType}
Usage Rights: ${input.usageRights}
Exclusivity: ${input.exclusivity}

STRICT GUIDELINES:
1. Base rate should consider industry standard CPMs (e.g., $20-40 for Video, $10-20 for Stories).
2. Add multipliers for Usage Rights (e.g., +20% for 30 days digital organic).
3. Add multipliers for Exclusivity (e.g., +30% per month of exclusivity).
4. Provide a realistic fee range (USD).
5. Confidence score (0-100) based on standard industry alignment.
6. Plain-english explanation citing why you chose those numbers.
7. A "suggestedReply": A short, polite, and confident copy-paste ready message for the creator to send back to the brand.

Response must be valid JSON with this exact structure:
{
  "suggestedLow": number,
  "suggestedHigh": number,
  "confidenceScore": number,
  "explanation": "string",
  "suggestedReply": "string"
}`;

            const response = await client.chat.completions.create({
                model: MODEL_NAME,
                messages: [
                    { role: "system", content: "You are a creator economy pricing expert. Always respond with valid JSON only." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });

            const text = response.choices[0]?.message?.content || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);

            return new Response(
                JSON.stringify(result),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        if (action === 'analyze-brief') {
            const { briefText } = data;
            const prompt = `Act as a legal-focused Talent Manager for a top creator. 
Analyze this brand brief/email script for "Toxic Terms" and "Unfair Requests".

Brief Text:
"${briefText.substring(0, 5000)}"

STRICT ANALYSIS CATEGORIES:
- RED FLAGS: Look for "Perpetual Usage", "Work for Hire", "No Exclusivity Cap", "Late Payment (>Net 60)", "Indemnity issues".
- RED FLAGS DETAIL: For each red flag, add a one-sentence "Why this matters" explanation.
- SUMMARY: 2-3 sentences max on what is actually being asked.
- CHECKLIST: List 3-5 tactical creator To-Dos (e.g., "Film unboxing", "Post story on Friday").
- QUESTIONS: 3 critical questions to ask the brand to avoid scope creep.

Response must be valid JSON with this exact structure:
{
  "summary": "string",
  "redFlags": ["RED FLAG: Why it matters"],
  "checklist": ["string"],
  "questionsToAsk": ["string"]
}`;

            const response = await client.chat.completions.create({
                model: MODEL_NAME,
                messages: [
                    { role: "system", content: "You are a legal-focused talent manager for creators. Always respond with valid JSON only." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
            });

            const text = response.choices[0]?.message?.content || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const result = JSON.parse(jsonMatch ? jsonMatch[0] : text);

            return new Response(
                JSON.stringify(result),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ error: 'Invalid action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
