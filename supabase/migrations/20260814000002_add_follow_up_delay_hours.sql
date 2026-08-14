-- Migration: Add follow_up_delay_hours to merchants table
ALTER TABLE public.merchants 
  ADD COLUMN IF NOT EXISTS follow_up_delay_hours INTEGER DEFAULT 2;
