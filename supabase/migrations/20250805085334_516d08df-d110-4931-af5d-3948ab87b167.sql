-- Create survey_responses table to store all survey data
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age_range TEXT NOT NULL,
  gender TEXT NOT NULL,
  relationship_status TEXT NOT NULL,
  relationship_other TEXT,
  support_systems TEXT NOT NULL,
  support_other TEXT,
  stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public survey)
CREATE POLICY "Anyone can submit survey responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading (for admin purposes)
CREATE POLICY "Allow reading survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (true);