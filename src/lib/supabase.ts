// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export type Link = {
  id?: number | string;
  code: string;
  url: string;
  total_clicks: number;
  created_at?: string | null;
  last_clicked?: string | null;
};

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').toString();
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').toString();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
