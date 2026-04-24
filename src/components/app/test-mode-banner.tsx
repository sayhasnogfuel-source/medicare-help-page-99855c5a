import { isPaymentsTestMode } from "@/lib/stripe";

export function TestModeBanner() {
  if (!isPaymentsTestMode()) return null;
  return (
    <div className="w-full border-b border-amber-300/60 bg-amber-100 px-4 py-2 text-center text-xs text-amber-900 sm:text-sm">
      <strong>Test mode</strong> — payments aren't real. Use card{" "}
      <code className="rounded bg-amber-200/70 px-1.5 py-0.5 font-mono">4242 4242 4242 4242</code>{" "}
      with any future expiry & CVC.
    </div>
  );
}
