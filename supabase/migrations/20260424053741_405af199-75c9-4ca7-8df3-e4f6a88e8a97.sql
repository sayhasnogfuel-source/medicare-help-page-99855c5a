-- Ensure new users get a user_credits row on signup
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;

CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_credits();

-- Backfill any existing users who don't yet have a user_credits row
INSERT INTO public.user_credits (user_id, plan, credits, plan_total, cycle_ends_at)
SELECT u.id, 'trial', 10, 10, now() + interval '7 days'
FROM auth.users u
LEFT JOIN public.user_credits c ON c.user_id = u.id
WHERE c.id IS NULL;