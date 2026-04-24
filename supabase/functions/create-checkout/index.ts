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
    const environment = (body.environment === "live" ? "live" : "sandbox") as StripeEnv;

    if (!/^[a-zA-Z0-9_-]+$/.test(priceId)) throw new Error("Invalid priceId");
    if (!returnUrl.startsWith("http")) throw new Error("Invalid returnUrl");

    // Get authenticated user
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) throw new Error("Unauthorized");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const stripe = createStripeClient(environment);

    // Resolve human-readable priceId via lookup_keys
    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!prices.data.length) throw new Error("Price not found");
    const stripePrice = prices.data[0];

    // Check if user already has an active subscription in this env
    const { data: existing } = await supabase
      .from("subscriptions")
      .select("status, stripe_customer_id")
      .eq("user_id", user.id)
      .eq("environment", environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing && ["active", "trialing", "past_due"].includes(existing.status)) {
      throw new Error("You already have an active subscription. Manage it from the billing page.");
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: returnUrl,
      customer_email: existing?.stripe_customer_id ? undefined : user.email ?? undefined,
      ...(existing?.stripe_customer_id && { customer: existing.stripe_customer_id }),
      subscription_data: {
        trial_period_days: 7,
        metadata: { userId: user.id },
      },
      metadata: { userId: user.id },
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
