// Supabase Edge Function: /functions/v1/send-push-notification
// Sends native VAPID Web Push Notifications to subscribed merchant devices via FCM / APNs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import webpush from "npm:web-push@3.6.7"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "https://vqdfmbiqlbwfvvgjkops.supabase.co";
const SUPABASE_SECRET_KEY = Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") ?? "BD6TK3sWhcfkHvDAfc5dio2LW4FjUcJqG8z5YImM-SL9w00NSRNJ5PKYvMJIAfHfbUmjSHcZz-s-N3U15DmySF4";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") ?? "HdriHYVHRPaQvPhMHudJTtoVSp5srLGMBWQQS7mIodw";
const VAPID_SUBJECT = "mailto:support@orderconfirm.dz";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

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

    // 1. Fetch active push subscriptions for this merchant from Supabase
    const { data: subs, error: subError } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("merchant_id", merchant_id);

    if (subError) throw subError;

    const notificationPayload = JSON.stringify({
      title: title || "OrderConfirm ⚡",
      body: body || "Nouvelle mise à jour de commande disponible",
      icon: icon || "/official-logo-192.png",
      url: url || "/app"
    });

    console.log(`Dispatching Web Push Notification to merchant ${merchant_id} (${subs?.length || 0} subscriptions)...`);

    let sentCount = 0;
    let failedCount = 0;

    if (subs && subs.length > 0) {
      for (const sub of subs) {
        try {
          if (!sub.endpoint || sub.endpoint.includes('push.orderconfirm.dz')) {
            continue; // Skip dummy mock endpoints
          }

          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };

          await webpush.sendNotification(pushSubscription, notificationPayload);
          sentCount++;
        } catch (err: any) {
          console.error(`Error delivering push to endpoint ${sub.endpoint}:`, err);
          failedCount++;
          // If subscription expired (404/410), clean up stale subscription from DB
          if (err.statusCode === 404 || err.statusCode === 410) {
            await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent_count: sentCount,
        failed_count: failedCount,
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
