import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function tsToIso(ts: number | null | undefined): string | null {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function upsertSubscriptionFromStripe(
  stripe: ReturnType<typeof createStripeClient>,
  environment: StripeEnv,
  subscriptionId: string,
) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] });
  const userId = sub.metadata?.userId;
  if (!userId) {
    console.warn("Subscription has no userId metadata", subscriptionId);
    return;
  }
  const item = sub.items.data[0];
  const stripePrice = item.price;
  const lookupKey = stripePrice.lookup_key;

  const periodEnd = tsToIso((item as { current_period_end?: number }).current_period_end ?? (sub as { current_period_end?: number }).current_period_end);

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      environment,
      stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      stripe_subscription_id: sub.id,
      price_id: lookupKey ?? stripePrice.id,
      product_id: typeof stripePrice.product === "string" ? stripePrice.product : stripePrice.product.id,
      status: sub.status,
      current_period_end: periodEnd,
      trial_end: tsToIso(sub.trial_end),
      cancel_at_period_end: sub.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" },
  );
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const url = new URL(req.url);
  const environment = (url.searchParams.get("env") === "live" ? "live" : "sandbox") as StripeEnv;
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await req.text();
  const stripe = createStripeClient(environment);
  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, getWebhookSecret(environment));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return new Response(`Webhook error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as { subscription?: string };
        if (session.subscription) {
          await upsertSubscriptionFromStripe(stripe, environment, session.subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as { id: string };
        await upsertSubscriptionFromStripe(stripe, environment, sub.id);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as { subscription?: string };
        if (invoice.subscription) {
          await upsertSubscriptionFromStripe(stripe, environment, invoice.subscription);
        }
        break;
      }
      default:
        // ignore
        break;
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook handler error", message);
    return new Response(`Handler error: ${message}`, { status: 500 });
  }
});
