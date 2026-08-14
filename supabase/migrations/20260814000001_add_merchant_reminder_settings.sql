-- Migration: Add reminder customization columns to merchants table
ALTER TABLE public.merchants 
  ADD COLUMN IF NOT EXISTS reminders_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS max_reminders_count INTEGER DEFAULT 2;
