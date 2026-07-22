-- ==============================================================================
-- Migration: Add Admin Role & Admin RLS Policies
-- Created at: 2026-07-21
-- ==============================================================================

-- 1. Add is_admin column to merchants table
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Security helper function to verify if the current auth.uid() is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.merchants
    WHERE merchants.user_id = auth.uid()
      AND merchants.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Admin RLS Policies for Merchants table
DROP POLICY IF EXISTS "Admins can select all merchants" ON public.merchants;
CREATE POLICY "Admins can select all merchants" ON public.merchants
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all merchants" ON public.merchants;
CREATE POLICY "Admins can update all merchants" ON public.merchants
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Admin RLS Policies for Orders table
DROP POLICY IF EXISTS "Admins can select all orders" ON public.orders;
CREATE POLICY "Admins can select all orders" ON public.orders
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5. Admin RLS Policies for Subscriptions table
DROP POLICY IF EXISTS "Admins can select all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can select all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can update all subscriptions" ON public.subscriptions
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. Admin RLS Policies for Whatsapp Messages table
DROP POLICY IF EXISTS "Admins can select all whatsapp messages" ON public.whatsapp_messages;
CREATE POLICY "Admins can select all whatsapp messages" ON public.whatsapp_messages
  FOR SELECT USING (public.is_admin());

-- 7. Admin RLS Policies for Message Templates table
DROP POLICY IF EXISTS "Admins can select all message templates" ON public.message_templates;
CREATE POLICY "Admins can select all message templates" ON public.message_templates
  FOR SELECT USING (public.is_admin());
