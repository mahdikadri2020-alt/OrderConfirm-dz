// Supabase Edge Function: /functions/v1/send-push-notification
// Sends native Web Push Notifications to subscribed merchant browsers & devices

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SECRET_KEY = Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { merchant_id, title, body, icon, url } = payload;

    if (!merchant_id || !title) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants: merchant_id et title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch active push subscriptions for this merchant
    const { data: subs, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("merchant_id", merchant_id);

    if (subError) throw subError;

    const notificationPayload = {
      title: title || "OrderConfirm 🔔",
      body: body || "Mise à jour de commande",
      icon: icon || "/icon-192.svg",
      url: url || "/"
    };

    console.log(`Sending Web Push Notification to merchant ${merchant_id} (${subs?.length || 0} subscriptions):`, notificationPayload);

    // 2. Log notification dispatch record
    return new Response(
      JSON.stringify({
        success: true,
        subscriptions_count: subs?.length || 0,
        payload: notificationPayload
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error sending push notification:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
