-- ==============================================================================
-- OrderConfirm Database Schema for Supabase (PostgreSQL)
-- Platform: Automatic WhatsApp Order Confirmation for COD E-commerce
-- ==============================================================================

-- 1. MERCHANTS TABLE (Linked 1:1 to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT,
  plan TEXT DEFAULT 'debutant',
  status TEXT DEFAULT 'active',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ORDERS TABLE (Linked to Merchants)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  product TEXT NOT NULL,
  price NUMERIC NOT NULL,
  wilaya TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'no_reply')),
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

-- 3. WHATSAPP MESSAGES TABLE (Linked to Orders)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('outgoing', 'incoming')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. MESSAGE TEMPLATES TABLE (Linked to Merchants)
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  template_text TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SUBSCRIPTIONS TABLE (Linked to Merchants)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  orders_limit INTEGER,
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  status TEXT DEFAULT 'active'
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_merchants_user_id ON public.merchants(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON public.orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_order_id ON public.whatsapp_messages(order_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_merchant_id ON public.message_templates(merchant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_merchant_id ON public.subscriptions(merchant_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Merchants select own profile" ON public.merchants;
DROP POLICY IF EXISTS "Merchants insert own profile" ON public.merchants;
DROP POLICY IF EXISTS "Merchants update own profile" ON public.merchants;
DROP POLICY IF EXISTS "Merchants delete own profile" ON public.merchants;

DROP POLICY IF EXISTS "Merchants select own orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants update own orders" ON public.orders;
DROP POLICY IF EXISTS "Merchants delete own orders" ON public.orders;

DROP POLICY IF EXISTS "Merchants select own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Merchants insert own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Merchants update own whatsapp messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Merchants delete own whatsapp messages" ON public.whatsapp_messages;

DROP POLICY IF EXISTS "Merchants select own message templates" ON public.message_templates;
DROP POLICY IF EXISTS "Merchants insert own message templates" ON public.message_templates;
DROP POLICY IF EXISTS "Merchants update own message templates" ON public.message_templates;
DROP POLICY IF EXISTS "Merchants delete own message templates" ON public.message_templates;

DROP POLICY IF EXISTS "Merchants select own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Merchants insert own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Merchants update own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Merchants delete own subscriptions" ON public.subscriptions;

-- Merchants Policies (user_id = auth.uid())
CREATE POLICY "Merchants select own profile" ON public.merchants
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Merchants insert own profile" ON public.merchants
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Merchants update own profile" ON public.merchants
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Merchants delete own profile" ON public.merchants
  FOR DELETE USING (user_id = auth.uid());

-- Orders Policies
CREATE POLICY "Merchants select own orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = orders.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants insert own orders" ON public.orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = orders.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants update own orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = orders.merchant_id
        AND merchants.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = orders.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants delete own orders" ON public.orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = orders.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- WhatsApp Messages Policies
CREATE POLICY "Merchants select own whatsapp messages" ON public.whatsapp_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.merchants ON orders.merchant_id = merchants.id
      WHERE orders.id = whatsapp_messages.order_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants insert own whatsapp messages" ON public.whatsapp_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.merchants ON orders.merchant_id = merchants.id
      WHERE orders.id = whatsapp_messages.order_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants update own whatsapp messages" ON public.whatsapp_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.merchants ON orders.merchant_id = merchants.id
      WHERE orders.id = whatsapp_messages.order_id
        AND merchants.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.merchants ON orders.merchant_id = merchants.id
      WHERE orders.id = whatsapp_messages.order_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants delete own whatsapp messages" ON public.whatsapp_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.merchants ON orders.merchant_id = merchants.id
      WHERE orders.id = whatsapp_messages.order_id
        AND merchants.user_id = auth.uid()
    )
  );

-- Message Templates Policies
CREATE POLICY "Merchants select own message templates" ON public.message_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = message_templates.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants insert own message templates" ON public.message_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = message_templates.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants update own message templates" ON public.message_templates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = message_templates.merchant_id
        AND merchants.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = message_templates.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants delete own message templates" ON public.message_templates
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = message_templates.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- Subscriptions Policies
CREATE POLICY "Merchants select own subscriptions" ON public.subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = subscriptions.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants insert own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = subscriptions.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants update own subscriptions" ON public.subscriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = subscriptions.merchant_id
        AND merchants.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = subscriptions.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Merchants delete own subscriptions" ON public.subscriptions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = subscriptions.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- REALTIME SUBSCRIPTION FOR ORDERS
-- ==============================================================================
ALTER TABLE public.orders REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;

-- ==============================================================================
-- AUTOMATIC SIGNUP TRIGGER FOR MERCHANTS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_merchant_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.merchants (
    user_id,
    business_name,
    phone,
    plan,
    status
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'business_name', 'Ma Boutique E-Commerce'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'debutant',
    'active'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    business_name = EXCLUDED.business_name,
    phone = EXCLUDED.phone;

  -- Insert default message template for new merchant
  INSERT INTO public.message_templates (
    merchant_id,
    template_text,
    is_default
  )
  SELECT 
    m.id,
    'Bonjour {customer_name} 👋, merci pour votre commande de {product} pour un montant de {price} DA. Veuillez répondre par *1* pour CONFIRMER votre livraison à {wilaya} ({address}) ou *2* pour ANNULER.',
    true
  FROM public.merchants m
  WHERE m.user_id = NEW.id
  ON CONFLICT DO NOTHING;

  -- Insert default active subscription for new merchant
  INSERT INTO public.subscriptions (
    merchant_id,
    plan_name,
    orders_limit,
    status
  )
  SELECT 
    m.id,
    'debutant',
    1000,
    'active'
  FROM public.merchants m
  WHERE m.user_id = NEW.id
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_merchant_signup();
