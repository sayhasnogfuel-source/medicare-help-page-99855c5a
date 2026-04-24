import { useCallback } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  priceId: string;
  returnUrl: string;
}

export function StripeEmbeddedCheckoutForm({ priceId, returnUrl }: Props) {
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { priceId, returnUrl, environment: getStripeEnvironment() },
    });
    if (error) throw new Error(error.message);
    if (!data?.clientSecret) throw new Error(data?.error || "Failed to create checkout session");
    return data.clientSecret;
  }, [priceId, returnUrl]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
