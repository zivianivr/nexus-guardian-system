-- Create system configuration table for persistent settings
CREATE TABLE public.system_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  config_key TEXT NOT NULL,
  config_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, config_key)
);

-- Enable RLS
ALTER TABLE public.system_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own configs" 
ON public.system_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own configs" 
ON public.system_configs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own configs" 
ON public.system_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own configs" 
ON public.system_configs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create WhatsApp agents table
CREATE TABLE public.whatsapp_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  api_key TEXT,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for WhatsApp agents
ALTER TABLE public.whatsapp_agents ENABLE ROW LEVEL SECURITY;

-- Create policies for WhatsApp agents
CREATE POLICY "Users can view their own agents" 
ON public.whatsapp_agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own agents" 
ON public.whatsapp_agents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
ON public.whatsapp_agents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agents" 
ON public.whatsapp_agents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_system_configs_updated_at
BEFORE UPDATE ON public.system_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_agents_updated_at
BEFORE UPDATE ON public.whatsapp_agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();