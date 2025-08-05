-- Create clients table to match the app's Client interface
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  coaching_goal TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sessions table to match the app's Session interface  
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  session_number INTEGER NOT NULL,
  focus_area TEXT,
  summary TEXT,
  action_items TEXT[], -- Array for action items
  due_amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table to match the app's Payment interface
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  payment_method TEXT NOT NULL DEFAULT 'Bank Transfer',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients table
CREATE POLICY "Coaches can view their own clients" 
ON public.clients FOR SELECT 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can create clients" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own clients" 
ON public.clients FOR UPDATE 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own clients" 
ON public.clients FOR DELETE 
USING (auth.uid() = coach_id);

-- RLS Policies for sessions table
CREATE POLICY "Coaches can view their own sessions" 
ON public.sessions FOR SELECT 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can create sessions" 
ON public.sessions FOR INSERT 
WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own sessions" 
ON public.sessions FOR UPDATE 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own sessions" 
ON public.sessions FOR DELETE 
USING (auth.uid() = coach_id);

-- RLS Policies for payments table
CREATE POLICY "Coaches can view their own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can create payments" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their own payments" 
ON public.payments FOR UPDATE 
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can delete their own payments" 
ON public.payments FOR DELETE 
USING (auth.uid() = coach_id);

-- Create indexes for better performance
CREATE INDEX idx_clients_coach_id ON public.clients(coach_id);
CREATE INDEX idx_sessions_coach_id ON public.sessions(coach_id);
CREATE INDEX idx_sessions_client_id ON public.sessions(client_id);
CREATE INDEX idx_payments_coach_id ON public.payments(coach_id);
CREATE INDEX idx_payments_session_id ON public.payments(session_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();