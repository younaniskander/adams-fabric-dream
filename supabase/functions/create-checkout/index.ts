import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LineItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const FREE_SAMPLE_COUPON_ID = "M2GxWeE3";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, currency = "egp" } = (await req.json()) as {
      items: LineItem[];
      currency?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.name || !item.quantity || item.quantity <= 0) {
        return new Response(
          JSON.stringify({ error: `Invalid item: ${JSON.stringify(item)}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const origin = req.headers.get("origin") || "https://adams-fabric-dream.lovable.app";

    const paidItems = items.filter((item) => item.price > 0);
    const freeItems = items.filter((item) => item.price <= 0);
    const allFree = paidItems.length === 0;

    // For free-only orders, assign a nominal price (1 EGP) and apply 100% coupon
    const lineItems = allFree
      ? freeItems.map((item) => {
          const hasValidImage = item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"));
          return {
            price_data: {
              currency,
              product_data: {
                name: `${item.name} (عينة مجانية)`,
                ...(hasValidImage ? { images: [item.image] } : {}),
              },
              unit_amount: 100, // 1 EGP nominal price, will be discounted to 0
            },
            quantity: item.quantity,
          };
        })
      : items.filter((i) => i.price > 0).map((item) => {
          const hasValidImage = item.image && (item.image.startsWith("http://") || item.image.startsWith("https://"));
          return {
            price_data: {
              currency,
              product_data: {
                name: item.name,
                ...(hasValidImage ? { images: [item.image] } : {}),
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          };
        });

    const sessionParams: any = {
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/gallery`,
    };

    // Apply 100% coupon for free-only orders
    if (allFree) {
      sessionParams.discounts = [{ coupon: FREE_SAMPLE_COUPON_ID }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
