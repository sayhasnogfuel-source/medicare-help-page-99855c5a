import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { corsHeaders } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const priceId = String(body.priceId || "");
    const returnUrl = String(body.returnUrl || "");
    const customerEmail = body.customerEmail ? String(body.customerEmail) : undefined;
    const inquiryId = body.inquiryId ? String(body.inquiryId) : undefined;
    const businessName = body.businessName ? String(body.businessName) : undefined;
    const environment = (body.environment === "live" ? "live" : "sandbox") as StripeEnv;

    if (!/^[a-zA-Z0-9_-]+$/.test(priceId)) throw new Error("Invalid priceId");
    if (!returnUrl.startsWith("http")) throw new Error("Invalid returnUrl");

    // Optional: link the deposit to a signed-in user.
    let userId: string | undefined;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id;
    }

    const stripe = createStripeClient(environment);

    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "payment",
      ui_mode: "embedded",
      return_url: returnUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      metadata: {
        type: "custom_website_deposit",
        ...(inquiryId && { inquiryId }),
        ...(businessName && { businessName }),
        ...(userId && { userId }),
      },
      payment_intent_data: {
        metadata: {
          type: "custom_website_deposit",
          ...(inquiryId && { inquiryId }),
          ...(businessName && { businessName }),
          ...(userId && { userId }),
        },
      },
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});