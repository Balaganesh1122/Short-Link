/*
  # Create links table for short URL service

  1. New Tables
    - `links`
      - `code` (text, primary key) - The short code identifier
      - `url` (text, not null) - The target URL to redirect to
      - `total_clicks` (integer, default 0) - Number of times the link has been clicked
      - `last_clicked` (timestamptz, nullable) - ISO timestamp of the last click
      - `created_at` (timestamptz, default now()) - When the link was created

  2. Security
    - Enable RLS on `links` table
    - Add policy for public to read all links
    - Add policy for public to insert links
    - Add policy for public to update click tracking
    - Add policy for public to delete links

  3. Notes
    - Code must be unique and match pattern [A-Za-z0-9]{6,8}
    - Public access required for redirect functionality
*/

CREATE TABLE IF NOT EXISTS links (
  code text PRIMARY KEY CHECK (code ~ '^[A-Za-z0-9]{6,8}$'),
  url text NOT NULL,
  total_clicks integer DEFAULT 0 NOT NULL,
  last_clicked timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read links"
  ON links FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert links"
  ON links FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update links"
  ON links FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete links"
  ON links FOR DELETE
  USING (true);

  