-- Migration: Add push_subscriptions table for merchant Web Push Notifications
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated to insert and select push_subscriptions
CREATE POLICY "Allow select push_subscriptions" ON public.push_subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow insert push_subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update push_subscriptions" ON public.push_subscriptions FOR UPDATE USING (true);
CREATE POLICY "Allow delete push_subscriptions" ON public.push_subscriptions FOR DELETE USING (true);
