import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 4) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid order ID or phone number (min 4 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmed = query.trim();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const selectFields = "id, customer_name, customer_phone, items, subtotal, discount, total, status, shipping_address, created_at";

    // Check if input looks like a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trimmed);

    // For UUID: return single order. For phone: return up to 10 orders.
    let orders: any[] = [];

    // Try exact UUID match first
    if (isUUID) {
      const result = await supabase
        .from("orders")
        .select(selectFields)
        .eq("id", trimmed)
        .maybeSingle();

      if (!result.error && result.data) {
        orders = [result.data];
      }
    }

    // If no UUID match, try phone number matches (return up to 10)
    if (orders.length === 0) {
      // Try exact phone match
      const phoneResult = await supabase
        .from("orders")
        .select(selectFields)
        .eq("customer_phone", trimmed)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!phoneResult.error && phoneResult.data && phoneResult.data.length > 0) {
        orders = phoneResult.data;
      }
    }

    // Try partial phone match (last digits)
    if (orders.length === 0 && trimmed.length >= 4) {
      const phonePartialResult = await supabase
        .from("orders")
        .select(selectFields)
        .ilike("customer_phone", `%${trimmed}`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!phonePartialResult.error && phonePartialResult.data && phonePartialResult.data.length > 0) {
        orders = phonePartialResult.data;
      }
    }

    if (orders.length === 0) {
      return new Response(
        JSON.stringify({ error: "No order found with this ID or phone number" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Collect all unique product_ids from all orders for image lookup
    const allProductIds = new Set<string>();
    for (const order of orders) {
      const items = order.items as any[];
      for (const item of items) {
        if (item.product_id) allProductIds.add(item.product_id);
      }
    }

    let productImageMap: Record<string, string> = {};
    if (allProductIds.size > 0) {
      const { data: products } = await supabase
        .from("products")
        .select("slug, image_url")
        .in("slug", Array.from(allProductIds));

      if (products) {
        for (const p of products) {
          if (p.image_url) productImageMap[p.slug] = p.image_url;
        }
      }
    }

    // Map orders to response format
    const mappedOrders = orders.map((data) => {
      const maskedName = data.customer_name.length > 3
        ? data.customer_name[0] + "***" + data.customer_name.slice(-1)
        : data.customer_name;

      const orderItems = data.items as any[];

      return {
        id: data.id,
        short_id: data.id.slice(0, 8).toUpperCase(),
        customer_name: maskedName,
        items: orderItems.map((item: any) => ({
          product_id: item.product_id || null,
          name: item.name,
          volume: item.volume,
          quantity: item.quantity,
          image: item.image_url || productImageMap[item.product_id] || null,
        })),
        subtotal: Number(data.subtotal),
        discount: Number(data.discount),
        total: Number(data.total),
        status: data.status,
        shipping_address: data.shipping_address,
        created_at: data.created_at,
      };
    });

    return new Response(
      JSON.stringify({
        orders: mappedOrders,
        // Keep backward compat: also return first order as "order"
        order: mappedOrders[0],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
