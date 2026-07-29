// Supabase Edge Function: /webhook/new-order
// Receives new order from WooCommerce/Shopify/Custom API, stores order in Supabase, and triggers n8n workflow.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SECRET_KEY = Deno.env.get("SUPABASE_SECRET_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL") ?? "https://n8n.srv1797289.hstgr.cloud/webhook/send-whatsapp-confirm";

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = req.headers.get("x-api-key");
    const body = await req.json();
    const { merchant_id, customer_name, customer_phone, product, price, wilaya, address } = body;

    if (!merchant_id || !customer_name || !customer_phone || !product || !price || !wilaya) {
      return new Response(
        JSON.stringify({ error: "Champs obligatoires manquants: merchant_id, customer_name, customer_phone, product, price, wilaya" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch merchant settings (delay)
    const { data: merchant } = await supabase
      .from("merchants")
      .select("initial_send_delay_minutes")
      .eq("id", merchant_id)
      .maybeSingle();

    const delayMinutes = Number(merchant?.initial_send_delay_minutes ?? 0);

    // 2. Insert order into Database (Trigger sets scheduled_send_at automatically)
    const { data: newOrder, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          merchant_id,
          customer_name,
          customer_phone,
          product,
          price,
          wilaya,
          address: address || "",
          status: "pending",
          initial_message_sent: false
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Fetch default template for merchant
    const { data: template } = await supabase
      .from("message_templates")
      .select("template_text")
      .eq("merchant_id", merchant_id)
      .eq("is_default", true)
      .maybeSingle();

    const defaultText = template?.template_text || 
      "Bonjour {customer_name} 👋, merci pour votre commande de {product} ({price} DA). Répondez *1* pour CONFIRMER la livraison à {wilaya} ou *2* pour ANNULER.";

    const formattedMessage = defaultText
      .replace(/{customer_name}/g, customer_name)
      .replace(/{product}/g, product)
      .replace(/{price}/g, price.toString())
      .replace(/{wilaya}/g, wilaya)
      .replace(/{address}/g, address || "");

    // 4. Trigger Instant send if delay is 0, otherwise leave for scheduled n8n cron
    let n8nResponseStatus = "scheduled";
    if (delayMinutes === 0) {
      try {
        let isSuccess = false;
        if (N8N_WEBHOOK_URL) {
          const wahaRes = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: newOrder.id,
              merchant_id,
              customer_phone,
              message: formattedMessage,
              created_at: newOrder.created_at
            })
          });
          isSuccess = wahaRes.ok;
        }

        const finalStatus = isSuccess ? "sent" : "failed";

        await supabase.from("whatsapp_messages").insert([
          {
            order_id: newOrder.id,
            merchant_id,
            message_content: formattedMessage,
            direction: "outgoing",
            status: finalStatus
          }
        ]);

        if (isSuccess) {
          await supabase.from("orders").update({ initial_message_sent: true }).eq("id", newOrder.id);
          n8nResponseStatus = "triggered_immediate";
        } else {
          n8nResponseStatus = "failed_waha";
        }
      } catch (n8nErr) {
        console.error("n8n instant call failed:", n8nErr);
        await supabase.from("whatsapp_messages").insert([
          {
            order_id: newOrder.id,
            merchant_id,
            message_content: `[Connection Failed]: ${formattedMessage}`,
            direction: "outgoing",
            status: "failed"
          }
        ]);
        n8nResponseStatus = "queued_retry";
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Commande enregistrée et webhook n8n déclenché avec succès",
        order: newOrder,
        whatsapp_status: n8nResponseStatus
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
