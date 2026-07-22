-- ==============================================================================
-- Migration: Admin Dashboard V2 Views, Triggers and RLS Policies
-- Created at: 2026-07-21
-- ==============================================================================

-- 0. Ensure subscriptions table exists
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
  plan_name TEXT DEFAULT 'Débutant',
  orders_limit INT DEFAULT 1000,
  orders_used INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 1. Add granted_admin_at column to merchants if not exists
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS granted_admin_at TIMESTAMPTZ;

-- Set granted_admin_at for existing admin accounts
UPDATE public.merchants 
SET granted_admin_at = COALESCE(granted_admin_at, created_at, NOW())
WHERE is_admin = true;

-- 2. Create trigger function to automatically set granted_admin_at when is_admin becomes true
CREATE OR REPLACE FUNCTION public.handle_merchant_admin_granted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin = true AND (OLD.is_admin IS NOT TRUE OR NEW.granted_admin_at IS NULL) THEN
    NEW.granted_admin_at := NOW();
  ELSIF NEW.is_admin = false THEN
    NEW.granted_admin_at := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_set_granted_admin_at ON public.merchants;
CREATE TRIGGER trg_set_granted_admin_at
  BEFORE INSERT OR UPDATE OF is_admin ON public.merchants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_merchant_admin_granted();

-- 3. Create view public.merchants_with_email
CREATE OR REPLACE VIEW public.merchants_with_email AS
SELECT 
  m.id,
  m.user_id,
  m.business_name,
  m.phone,
  m.plan,
  m.status,
  m.is_admin,
  m.created_at,
  m.granted_admin_at,
  u.email
FROM public.merchants m
LEFT JOIN auth.users u ON m.user_id = u.id;

-- Grant access on the view to authenticated users
GRANT SELECT ON public.merchants_with_email TO authenticated;

-- Create security function to query merchants_with_email only if public.is_admin() is true
CREATE OR REPLACE FUNCTION public.get_merchants_with_email_for_admin()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  business_name TEXT,
  phone TEXT,
  plan TEXT,
  status TEXT,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  granted_admin_at TIMESTAMPTZ,
  email TEXT
) AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN QUERY
    SELECT 
      m.id,
      m.user_id,
      m.business_name,
      m.phone,
      m.plan,
      m.status,
      m.is_admin,
      m.created_at,
      m.granted_admin_at,
      u.email::TEXT
    FROM public.merchants m
    LEFT JOIN auth.users u ON m.user_id = u.id
    ORDER BY m.created_at DESC;
  ELSE
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_merchants_with_email_for_admin TO authenticated;

-- 4. Enable admin RLS policies on orders, message_templates, subscriptions, whatsapp_messages
DROP POLICY IF EXISTS "Admins select all orders" ON public.orders;
CREATE POLICY "Admins select all orders" ON public.orders
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins select all message_templates" ON public.message_templates;
CREATE POLICY "Admins select all message_templates" ON public.message_templates
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins select all subscriptions" ON public.subscriptions;
CREATE POLICY "Admins select all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins select all whatsapp_messages" ON public.whatsapp_messages;
CREATE POLICY "Admins select all whatsapp_messages" ON public.whatsapp_messages
  FOR SELECT USING (public.is_admin());
