/*
  # Fix API Key Migration - Only Add Missing Components

  1. Changes
    - Check and add api_key column only if it doesn't exist
    - Check and add unique constraint only if it doesn't exist
    - Drop and recreate policies to avoid conflicts
    - Create index only if it doesn't exist

  2. Security
    - Maintains existing RLS policies
    - Ensures API key authentication works properly
*/

-- Add api_key column to profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'api_key'
  ) THEN
    ALTER TABLE profiles ADD COLUMN api_key TEXT;
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_api_key_key' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_api_key_key UNIQUE (api_key);
  END IF;
END $$;

-- Create index for fast API key lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON profiles(api_key) WHERE api_key IS NOT NULL;

-- Drop existing API key policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "API key access to own profile" ON profiles;
DROP POLICY IF EXISTS "API key access to own projects" ON projects;
DROP POLICY IF EXISTS "API key access to own ux_debts" ON ux_debts;
DROP POLICY IF EXISTS "API key insert to own ux_debts" ON ux_debts;

-- Add RLS policy for API key authentication on profiles
CREATE POLICY "API key access to own profile" ON profiles
  FOR SELECT USING (
    api_key IS NOT NULL AND 
    api_key = ((current_setting('request.headers', true))::json->>'x-api-key')
  );

-- Add RLS policy for API key access to projects
CREATE POLICY "API key access to own projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = projects.owner_id 
      AND profiles.api_key IS NOT NULL
      AND profiles.api_key = ((current_setting('request.headers', true))::json->>'x-api-key')
    )
  );

-- Add RLS policy for API key access to UX debts (read)
CREATE POLICY "API key access to own ux_debts" ON ux_debts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN profiles ON profiles.id = projects.owner_id
      WHERE projects.id = ux_debts.project_id 
      AND profiles.api_key IS NOT NULL
      AND profiles.api_key = ((current_setting('request.headers', true))::json->>'x-api-key')
    )
  );

-- Add RLS policy for API key insert access to UX debts
CREATE POLICY "API key insert to own ux_debts" ON ux_debts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN profiles ON profiles.id = projects.owner_id
      WHERE projects.id = ux_debts.project_id 
      AND profiles.api_key IS NOT NULL
      AND profiles.api_key = ((current_setting('request.headers', true))::json->>'x-api-key')
    )
  );