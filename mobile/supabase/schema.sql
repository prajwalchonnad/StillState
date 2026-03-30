-- Create Enums
CREATE TYPE user_role AS ENUM ('PARENT', 'CHILD');
CREATE TYPE app_category AS ENUM ('GAMING', 'SOCIAL_MEDIA', 'EDUCATION', 'ENTERTAINMENT', 'OTHER');
CREATE TYPE task_type AS ENUM ('PHYSICAL', 'CREATIVE', 'EDUCATIONAL', 'SOCIAL', 'MINDFULNESS');
CREATE TYPE reward_type AS ENUM ('BADGE', 'MILESTONE', 'STREAK');
CREATE TYPE alert_type AS ENUM ('EYE_BREAK', 'USAGE_WARNING', 'RESTRICTED_MODE', 'ACHIEVEMENT');
CREATE TYPE severity_level AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- Users Extension (Profiles)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  parent_id UUID REFERENCES public.users(id),
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage Logs
CREATE TABLE public.usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  app TEXT NOT NULL,
  category app_category NOT NULL,
  duration INT NOT NULL, -- seconds
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type task_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  points INT DEFAULT 100,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rewards
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type reward_type NOT NULL,
  name TEXT NOT NULL,
  threshold INT NOT NULL,
  earned BOOLEAN DEFAULT false,
  earned_at TIMESTAMPTZ
);

-- Alerts
CREATE TABLE public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  type alert_type NOT NULL,
  severity severity_level NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Setup (Row Level Security)

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Policies for Users
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Parents can view their children's profiles" ON public.users FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Policies for Usage Logs
CREATE POLICY "Users can insert their own usage" ON public.usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own usage" ON public.usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parents can view children's usage" ON public.usage_logs FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
);

-- Policies for Tasks
CREATE POLICY "Users can view their tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parents can view children's tasks" ON public.tasks FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
);
CREATE POLICY "Users can complete their tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Parents can create tasks for children" ON public.tasks FOR INSERT WITH CHECK (
  user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
);

-- Policies for Rewards
CREATE POLICY "Users can view their rewards" ON public.rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parents can view children's rewards" ON public.rewards FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
);

-- Policies for Alerts
CREATE POLICY "Users can view their alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Parents can view children's alerts" ON public.alerts FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE parent_id = auth.uid())
);
CREATE POLICY "Users can update their own alerts (read status)" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Setup logic for User creation
-- A trigger to automatically insert a row into public.users when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', 'User'), 
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'CHILD'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
