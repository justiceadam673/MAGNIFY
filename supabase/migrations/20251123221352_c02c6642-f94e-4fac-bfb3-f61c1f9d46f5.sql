-- Create enums for vision types and tracker frequency
CREATE TYPE vision_type AS ENUM ('gods-will', 'personal', 'financial');
CREATE TYPE tracker_frequency AS ENUM ('daily', 'weekly');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  accent_color TEXT DEFAULT '#4B0082',
  tracker_default tracker_frequency DEFAULT 'daily',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create visions table
CREATE TABLE public.visions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type vision_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tracker_frequency tracker_frequency DEFAULT 'daily',
  reminder_time TIME,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on visions
ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;

-- Visions policies
CREATE POLICY "Users can view own visions"
  ON public.visions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own visions"
  ON public.visions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visions"
  ON public.visions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visions"
  ON public.visions FOR DELETE
  USING (auth.uid() = user_id);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_id UUID NOT NULL REFERENCES public.visions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Users can view goals for their visions"
  ON public.goals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = goals.vision_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create goals for their visions"
  ON public.goals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = goals.vision_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update goals for their visions"
  ON public.goals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = goals.vision_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete goals for their visions"
  ON public.goals FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.visions
      WHERE visions.id = goals.vision_id
      AND visions.user_id = auth.uid()
    )
  );

-- Create tracker_entries table
CREATE TABLE public.tracker_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('done', 'skipped', 'partial')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(goal_id, date)
);

-- Enable RLS on tracker_entries
ALTER TABLE public.tracker_entries ENABLE ROW LEVEL SECURITY;

-- Tracker entries policies
CREATE POLICY "Users can view tracker entries for their goals"
  ON public.tracker_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.goals
      JOIN public.visions ON visions.id = goals.vision_id
      WHERE goals.id = tracker_entries.goal_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tracker entries for their goals"
  ON public.tracker_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.goals
      JOIN public.visions ON visions.id = goals.vision_id
      WHERE goals.id = tracker_entries.goal_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tracker entries for their goals"
  ON public.tracker_entries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.goals
      JOIN public.visions ON visions.id = goals.vision_id
      WHERE goals.id = tracker_entries.goal_id
      AND visions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tracker entries for their goals"
  ON public.tracker_entries FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.goals
      JOIN public.visions ON visions.id = goals.vision_id
      WHERE goals.id = tracker_entries.goal_id
      AND visions.user_id = auth.uid()
    )
  );

-- Create journals table
CREATE TABLE public.journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vision_id UUID REFERENCES public.visions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT,
  mood_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on journals
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

-- Journals policies
CREATE POLICY "Users can view own journals"
  ON public.journals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journals"
  ON public.journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals"
  ON public.journals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals"
  ON public.journals FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_visions
  BEFORE UPDATE ON public.visions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_goals
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_journals
  BEFORE UPDATE ON public.journals
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();