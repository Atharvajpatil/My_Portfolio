/*
# Create contact_messages table

1. New Tables
- `contact_messages`: stores messages submitted by visitors from the portfolio contact form.
  - `id` uuid primary key
  - `name` text (visitor's name)
  - `email` text (visitor's email, for replies)
  - `message` text (the message body)
  - `ip` text (best-effort requester ip, nullable)
  - `created_at` timestamptz
2. Security
- Enable RLS on `contact_messages`.
- Grant INSERT to anon + authenticated (anyone can submit a message).
- Grant SELECT to service_role only (edge function reads them to forward by email).
- Public can NOT read messages back.
3. Notes
- Recipient inbox is f20260168@hyderabad.bits-pilani.ac.in (handled in edge function env, not stored here).
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  ip text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON contact_messages TO anon, authenticated;
GRANT SELECT ON contact_messages TO service_role;

DROP POLICY IF EXISTS "anon_insert_contact_message" ON contact_messages;
CREATE POLICY "anon_insert_contact_message"
ON contact_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);
