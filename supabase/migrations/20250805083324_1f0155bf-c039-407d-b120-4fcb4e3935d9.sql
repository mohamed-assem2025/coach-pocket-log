-- Add missing columns to match the app's data model

-- Add coaching_goal to clients table (coachingGoal in TypeScript)
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS coaching_goal TEXT;

-- Add missing columns to sessions table
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS session_number INTEGER;

ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS focus_area TEXT;

ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS summary TEXT;

ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS action_items TEXT[];

ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS due_amount NUMERIC;

ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';