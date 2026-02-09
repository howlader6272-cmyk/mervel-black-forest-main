import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callAIGateway(prompt: string, apiKey: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${MAX_RETRIES}, prompt length: ${prompt.length}`);

      const response = await fetch(AI_GATEWAY_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [{ role: "user", content: prompt }],
          modalities: ["image", "text"],
        }),
      });

      if (response.status === 429) {
        throw Object.assign(new Error("Rate limit exceeded"), { status: 429 });
      }
      if (response.status === 402) {
        throw Object.assign(new Error("Payment required"), { status: 402 });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI gateway error (attempt ${attempt}): ${response.status}`, errorText);
        
        // Retry on 5xx errors
        if (response.status >= 500 && attempt < MAX_RETRIES) {
          console.log(`Retrying after ${RETRY_DELAY_MS * attempt}ms...`);
          await sleep(RETRY_DELAY_MS * attempt);
          lastError = new Error(`AI gateway ${response.status}`);
          continue;
        }
        throw Object.assign(new Error(`Image generation failed: ${response.status}`), { status: response.status });
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error("No image in response:", JSON.stringify(data).slice(0, 200));
        if (attempt < MAX_RETRIES) {
          console.log(`No image returned, retrying...`);
          await sleep(RETRY_DELAY_MS * attempt);
          lastError = new Error("No image returned");
          continue;
        }
        throw new Error("No image returned from AI model");
      }

      console.log(`Image generated successfully on attempt ${attempt}, data URL length: ${imageUrl.length}`);
      return imageUrl;
    } catch (err) {
      lastError = err as Error;
      // Don't retry on 429 or 402
      if ((err as any).status === 429 || (err as any).status === 402) {
        throw err;
      }
      if (attempt < MAX_RETRIES) {
        console.log(`Error on attempt ${attempt}, retrying: ${(err as Error).message}`);
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw lastError || new Error("All retry attempts failed");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'prompt' field" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageUrl = await callAIGateway(prompt, LOVABLE_API_KEY);

    return new Response(
      JSON.stringify({ imageUrl }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const status = (err as any).status || 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-image error:", message);

    return new Response(
      JSON.stringify({ error: message }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
