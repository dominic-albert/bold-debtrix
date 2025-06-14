/*
  # Add Foreign Key Constraint for UX Debts

  1. Changes
    - Add foreign key constraint between ux_debts.project_id and projects.id
    - This enables PostgREST to automatically join these tables

  2. Security
    - Maintains existing RLS policies
    - No changes to existing permissions
*/

-- Add foreign key constraint to enable automatic joins
ALTER TABLE ux_debts 
ADD CONSTRAINT fk_ux_debts_project_id 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;