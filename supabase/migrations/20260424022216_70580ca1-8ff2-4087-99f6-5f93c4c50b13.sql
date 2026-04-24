DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;

CREATE POLICY "Anyone can submit a valid inquiry"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(coalesce(email, '')) > 3
    AND email LIKE '%@%'
    AND length(coalesce(full_name, '')) > 0
    AND length(coalesce(business_name, '')) > 0
    AND length(coalesce(niche, '')) > 0
  );