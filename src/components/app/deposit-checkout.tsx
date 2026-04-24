import { useCallback } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  priceId: string;
  returnUrl: string;
  customerEmail?: string;
  inquiryId?: string;
  businessName?: string;
}

export function DepositCheckoutForm({
  priceId,
  returnUrl,
  customerEmail,
  inquiryId,
  businessName,
}: Props) {
  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-deposit-checkout", {
      body: {
        priceId,
        returnUrl,
        environment: getStripeEnvironment(),
        customerEmail,
        inquiryId,
        businessName,
      },
    });
    if (error) throw new Error(error.message);
    if (!data?.clientSecret) throw new Error(data?.error || "Failed to create checkout session");
    return data.clientSecret;
  }, [priceId, returnUrl, customerEmail, inquiryId, businessName]);

  return (
    <div id="deposit-checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}