import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient, getWebhookSecret } from "../_shared/stripe.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function tsToIso(ts: number | null | undefined): string | null {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

const PLAN_TOTALS: Record<string, number> = {
  starter_monthly: 100,
  pro_monthly: 500,
};

function planNameFromLookup(lookup: string | null | undefined): "starter" | "pro" | null {
  if (lookup === "starter_monthly") return "starter";
  if (lookup === "pro_monthly") return "pro";
  return null;
}

async function syncCreditsForUser(
  userId: string,
  lookupKey: string | null | undefined,
  cycleEndIso: string | null,
  status: string,
) {
  const planName = planNameFromLookup(lookupKey);
  // Active or trialing → grant the plan's credit allotment.
  // Canceled / unpaid / past_due → leave existing credits but downgrade plan label
  // when the period ends (we just keep what they have).
  if (!planName) return;
  if (status === "active" || status === "trialing") {
    const total = PLAN_TOTALS[lookupKey ?? ""] ?? 0;
    await supabase
      .from("user_credits")
      .upsert(
        {
          user_id: userId,
          plan: planName,
          credits: total,
          plan_total: total,
          cycle_started_at: new Date().toISOString(),
          cycle_ends_at: cycleEndIso,
        },
        { onConflict: "user_id" },
      );
  }
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

  // Reset credit allotment on new period / activation.
  await syncCreditsForUser(userId, lookupKey, periodEnd, sub.status);
}

async function recordDepositPayment(
  paymentIntent: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    metadata?: Record<string, string>;
    receipt_email?: string | null;
    latest_charge?: string | null;
  },
  environment: StripeEnv,
) {
  const meta = paymentIntent.metadata ?? {};
  if (meta.type !== "custom_website_deposit") return;

  const inquiryId = meta.inquiryId || null;
  const businessName = meta.businessName || null;
  const userId = meta.userId || null;

  await supabase
    .from("deposits")
    .upsert(
      {
        inquiry_id: inquiryId,
        user_id: userId,
        email: paymentIntent.receipt_email ?? null,
        business_name: businessName,
        environment,
        stripe_payment_intent_id: paymentIntent.id,
        amount_cents: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        paid_at: paymentIntent.status === "succeeded" ? new Date().toISOString() : null,
      },
      { onConflict: "stripe_payment_intent_id" },
    );

  if (inquiryId) {
    await supabase
      .from("inquiries")
      .update({
        deposit_status: paymentIntent.status === "succeeded" ? "paid" : "failed",
      })
      .eq("id", inquiryId);
  }
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
        const session = event.data.object as {
          subscription?: string;
          mode?: string;
          payment_intent?: string;
          metadata?: Record<string, string>;
        };
        if (session.subscription) {
          await upsertSubscriptionFromStripe(stripe, environment, session.subscription);
        }
        // One-time payment (deposit) flow — fetch the PI and record it.
        if (session.mode === "payment" && session.payment_intent) {
          const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
          await recordDepositPayment(
            {
              id: pi.id,
              amount: pi.amount,
              currency: pi.currency,
              status: pi.status,
              metadata: pi.metadata as Record<string, string>,
              receipt_email: pi.receipt_email,
            },
            environment,
          );
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
      case "payment_intent.succeeded":
      case "payment_intent.payment_failed": {
        const pi = event.data.object as {
          id: string;
          amount: number;
          currency: string;
          status: string;
          metadata?: Record<string, string>;
          receipt_email?: string | null;
        };
        await recordDepositPayment(pi, environment);
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
