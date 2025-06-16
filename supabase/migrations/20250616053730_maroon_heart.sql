/*
  # Add API Key Support for Figma Plugin

  1. Changes
    - Add api_key column to profiles table
    - Create unique index on api_key for fast lookups
    - Add RLS policy for API key authentication

  2. Security
    - API keys are unique and indexed for performance
    - RLS policies ensure users can only access their own data via API key
*/

-- Add api_key column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE;

-- Create index for fast API key lookups
CREATE INDEX IF NOT EXISTS idx_profiles_api_key ON profiles(api_key) WHERE api_key IS NOT NULL;

-- Add RLS policy for API key authentication
CREATE POLICY "API key access to own profile" ON profiles
  FOR SELECT USING (
    api_key IS NOT NULL AND 
    api_key = current_setting('request.headers', true)::json->>'x-api-key'
  );

-- Add RLS policy for API key access to projects
CREATE POLICY "API key access to own projects" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = projects.owner_id 
      AND profiles.api_key IS NOT NULL
      AND profiles.api_key = current_setting('request.headers', true)::json->>'x-api-key'
    )
  );

-- Add RLS policy for API key access to UX debts
CREATE POLICY "API key access to own ux_debts" ON ux_debts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN profiles ON profiles.id = projects.owner_id
      WHERE projects.id = ux_debts.project_id 
      AND profiles.api_key IS NOT NULL
      AND profiles.api_key = current_setting('request.headers', true)::json->>'x-api-key'
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
      AND profiles.api_key = current_setting('request.headers', true)::json->>'x-api-key'
    )
  );