-- ==============================================================================
-- Migration: Automatic Merchant Row Creation Trigger on Signup
-- Created at: 2026-07-21
-- ==============================================================================

-- 1. Create SECURITY DEFINER function to handle merchant creation on auth signup
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

  -- Insert default French message template for new merchant
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

-- 2. Create trigger on auth.users AFTER INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_merchant_signup();
