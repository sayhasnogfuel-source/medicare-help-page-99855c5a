-- =========================
-- user_credits: per-user, per-plan credit balance refreshed by webhook on subscription renewal
-- =========================
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'trial', -- trial | starter | pro
  credits INTEGER NOT NULL DEFAULT 10,
  plan_total INTEGER NOT NULL DEFAULT 10,
  cycle_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  cycle_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credits"
  ON public.user_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own credits"
  ON public.user_credits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own credits"
  ON public.user_credits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create trial credits row when a new auth user is created.
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, plan, credits, plan_total, cycle_ends_at)
  VALUES (NEW.id, 'trial', 10, 10, now() + interval '7 days')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();

-- =========================
-- inquiries: custom-website lead form submissions
-- =========================
CREATE TABLE public.inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  niche TEXT NOT NULL,
  states TEXT NOT NULL,
  has_branding TEXT NOT NULL,
  goals TEXT NOT NULL,
  contact_method TEXT NOT NULL,
  notes TEXT,
  deposit_status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone (signed in or not) may submit an inquiry.
CREATE POLICY "Anyone can submit an inquiry"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Owners (when signed in) may view their own inquiries.
CREATE POLICY "Users view their own inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE TRIGGER trg_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_inquiries_email ON public.inquiries(email);
CREATE INDEX idx_inquiries_user_id ON public.inquiries(user_id);

-- =========================
-- deposits: $206 (or other one-time) payments tied to inquiries
-- =========================
CREATE TABLE public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  business_name TEXT,
  environment TEXT NOT NULL DEFAULT 'sandbox',
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  stripe_checkout_session_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL, -- succeeded | failed | refunded
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own deposits"
  ON public.deposits FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE TRIGGER trg_deposits_updated_at
  BEFORE UPDATE ON public.deposits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_deposits_inquiry_id ON public.deposits(inquiry_id);
CREATE INDEX idx_deposits_user_id ON public.deposits(user_id);