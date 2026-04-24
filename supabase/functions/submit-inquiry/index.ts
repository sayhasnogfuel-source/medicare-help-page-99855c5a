import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function clean(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await req.json();
    const fullName = clean(body.fullName, 80);
    const businessName = clean(body.businessName, 80);
    const email = clean(body.email, 120);
    const phone = clean(body.phone, 30);
    const niche = clean(body.niche, 60);
    const states = clean(body.states, 120);
    const hasBranding = clean(body.hasBranding, 16);
    const goals = clean(body.goals, 800);
    const contactMethod = clean(body.contactMethod, 16);
    const notes = clean(body.notes, 500);

    if (!fullName || !businessName || !email || !phone || !niche || !states || !goals) {
      throw new Error("Missing required fields");
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid email");

    // Optional: link to authenticated user if present
    let userId: string | null = null;
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id ?? null;
    }

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        user_id: userId,
        full_name: fullName,
        business_name: businessName,
        email,
        phone,
        niche,
        states,
        has_branding: hasBranding || "no",
        goals,
        contact_method: contactMethod || "email",
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ inquiryId: data.id }), {
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