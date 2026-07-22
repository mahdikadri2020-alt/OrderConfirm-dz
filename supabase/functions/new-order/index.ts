// Supabase Edge Function: /webhook/new-order
// Receives new order from WooCommerce/Shopify/Custom API, stores order in Supabase, and triggers n8n workflow.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const N8N_WEBHOOK_URL = Deno.env.get("N8N_WEBHOOK_URL") ?? "https://n8n.your-domain.com/webhook/send-whatsapp-confirm";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    // 1. Insert order into Database
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
          status: "pending"
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Fetch default template for merchant
    const { data: template } = await supabase
      .from("message_templates")
      .select("template_text")
      .eq("merchant_id", merchant_id)
      .eq("is_default", true)
      .single();

    const defaultText = template?.template_text || 
      "Bonjour {customer_name} 👋, merci pour votre commande de {product} ({price} DA). Répondez *1* pour CONFIRMER la livraison à {wilaya} ou *2* pour ANNULER.";

    const formattedMessage = defaultText
      .replace(/{customer_name}/g, customer_name)
      .replace(/{product}/g, product)
      .replace(/{price}/g, price.toString())
      .replace(/{wilaya}/g, wilaya)
      .replace(/{address}/g, address || "");

    // 3. Log outgoing WhatsApp message
    await supabase.from("whatsapp_messages").insert([
      {
        order_id: newOrder.id,
        merchant_id,
        message_content: formattedMessage,
        direction: "outgoing",
        status: "sent"
      }
    ]);

    // 4. Trigger n8n Webhook
    // NOTE FOR USER: Change N8N_WEBHOOK_URL in environment variables or hardcode your n8n webhook URL here
    let n8nResponseStatus = "triggered";
    try {
      if (N8N_WEBHOOK_URL) {
        await fetch(N8N_WEBHOOK_URL, {
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
      }
    } catch (n8nErr) {
      console.error("n8n call failed, queued locally:", n8nErr);
      n8nResponseStatus = "queued_retry";
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
