import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const PAGE_PROMPTS: Record<string, string> = {
  "shipping-policy": `You are a content writer for MERVEL, a luxury perfume brand based in Bangladesh. Write a professional, detailed Shipping Policy page in markdown format. Include:
- Domestic shipping within Bangladesh (delivery times, costs)
- International shipping options
- Order processing times
- Tracking information
- Shipping restrictions for perfumes
- Packaging and handling care
Keep the tone luxurious and professional. Use proper markdown headings (##, ###). Write in English.`,

  returns: `You are a content writer for MERVEL, a luxury perfume brand based in Bangladesh. Write a professional, detailed Returns & Refund Policy page in markdown format. Include:
- Return eligibility and timeframe (e.g., 7-14 days)
- Conditions for returns (unopened, sealed products)
- Refund process and timeline
- Exchange policy
- Damaged or defective items
- How to initiate a return
Keep the tone luxurious, customer-friendly and professional. Use proper markdown headings (##, ###). Write in English.`,

  contact: `You are a content writer for MERVEL, a luxury perfume brand based in Bangladesh. Write a professional Contact Us page in markdown format. Include:
- Brand introduction (1-2 sentences)
- Email: support@mervel.com
- Phone: +880 1234-567890
- Business hours
- Social media links (Facebook, LinkedIn)
- Physical address in Bangladesh
- A warm invitation to reach out
Keep the tone luxurious and welcoming. Use proper markdown headings (##, ###). Write in English.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pageType } = await req.json();

    if (!pageType || !PAGE_PROMPTS[pageType]) {
      return new Response(
        JSON.stringify({ error: "Invalid page type. Use: shipping-policy, returns, or contact" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "user", content: PAGE_PROMPTS[pageType] },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate content" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "No content returned" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ content }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("generate-page-content error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
