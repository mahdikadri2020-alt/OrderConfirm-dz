-- Migration: Add timeout_status column to merchants table
ALTER TABLE public.merchants 
  ADD COLUMN IF NOT EXISTS timeout_status TEXT DEFAULT 'needs_follow_up';
