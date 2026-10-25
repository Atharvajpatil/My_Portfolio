/*
# Create saved_ideas table

1. New Tables
- `saved_ideas`: stores project concepts visitors save from the AI Playground prompt simulator.
  - `id` uuid primary key
  - `prompt` text (the visitor's input prompt)
  - `title` text (generated idea title)
  - `category` text (generated idea category)
  - `description` text (generated idea description)
  - `stack` text[] (suggested tech stack)
  - `created_at` timestamptz
2. Security
- Enable RLS on `saved_ideas`.
- Grant INSERT + SELECT to anon + authenticated (any visitor can save and read their saved concepts).
- No UPDATE/DELETE for the public.
3. Notes
- This is intentionally public/shared single-tenant data (a lightweight idea archive).
*/

CREATE TABLE IF NOT EXISTS saved_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  stack text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_ideas ENABLE ROW LEVEL SECURITY;

GRANT INSERT, SELECT ON saved_ideas TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_saved_idea" ON saved_ideas;
CREATE POLICY "anon_insert_saved_idea"
ON saved_ideas FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_saved_ideas" ON saved_ideas;
CREATE POLICY "anon_select_saved_ideas"
ON saved_ideas FOR SELECT
TO anon, authenticated
USING (true);
