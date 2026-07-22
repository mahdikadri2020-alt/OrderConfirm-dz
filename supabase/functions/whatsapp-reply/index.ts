// Supabase Edge Function: /webhook/whatsapp-reply
// Receives customer reply status from n8n, updates order status and logs incoming message.

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
    const body = await req.json();
    const { order_id, merchant_id, reply_text, status } = body;

    // status can be 'confirmed', 'rejected', or 'no_reply'
    if (!order_id || !status) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants: order_id et status ('confirmed', 'rejected', 'no_reply')" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isConfirmed = status === "confirmed";
    const updatePayload: any = {
      status: status,
    };

    if (isConfirmed) {
      updatePayload.confirmed_at = new Date().toISOString();
    }

    // 1. Update Order Status in Supabase
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", order_id)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Log Incoming Message
    if (reply_text) {
      await supabase.from("whatsapp_messages").insert([
        {
          order_id,
          merchant_id: merchant_id || updatedOrder.merchant_id,
          message_content: reply_text,
          direction: "incoming",
          status: "read"
        }
      ]);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Statut de la commande mis à jour: ${status}`,
        order: updatedOrder
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
