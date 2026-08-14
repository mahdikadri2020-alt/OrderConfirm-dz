-- Migration: Add 'needs_follow_up' to orders.status CHECK constraint
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'confirmed', 'rejected', 'no_reply', 'needs_follow_up'));
