-- Add missing currency column to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';