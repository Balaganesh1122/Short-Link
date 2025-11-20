// inside src/api/links.ts
import { supabase, Link } from '../lib/supabase';
import { generateCode, isValidUrl, isValidCode } from '../lib/utils';


export async function createLink(url: string, customCode?: string): Promise<{ success: boolean; data?: Link; error?: string; status: number }> {
  if (!isValidUrl(url)) {
    return { success: false, error: 'Invalid URL', status: 400 };
  }

  let code = customCode;

  if (code) {
    if (!isValidCode(code)) {
      return { success: false, error: 'Invalid code format', status: 400 };
    }

    const { data: existing } = await supabase
      .from('links')
      .select('code')
      .eq('code', code)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Code already exists', status: 409 };
    }
  } else {
    let attempts = 0;
    while (attempts < 10) {
      code = generateCode();
      const { data: existing } = await supabase
        .from('links')
        .select('code')
        .eq('code', code)
        .maybeSingle();

      if (!existing) break;
      attempts++;
    }

    if (attempts === 10) {
      return { success: false, error: 'Failed to generate unique code', status: 500 };
    }
  }

  const { data, error } = await supabase
    .from('links')
    .insert({ code: code!, url, total_clicks: 0 })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message, status: 500 };
  }

  return { success: true, data, status: 201 };
}

export async function getAllLinks(): Promise<{ success: boolean; data?: Link[]; error?: string; status: number }> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, status: 500 };
  }

  return { success: true, data: data || [], status: 200 };
}

export async function getLink(code: string): Promise<{ success: boolean; data?: Link; error?: string; status: number }> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('code', code)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message, status: 500 };
  }

  if (!data) {
    return { success: false, error: 'Link not found', status: 404 };
  }

  return { success: true, data, status: 200 };
}

export async function deleteLink(code: string): Promise<{ success: boolean; error?: string; status: number }> {
  const { data } = await supabase
    .from('links')
    .select('code')
    .eq('code', code)
    .maybeSingle();

  if (!data) {
    return { success: false, error: 'Link not found', status: 404 };
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('code', code);

  if (error) {
    return { success: false, error: error.message, status: 500 };
  }

  return { success: true, status: 204 };
}

export async function trackClick(code: string): Promise<{ success: boolean; url?: string; error?: string; status: number }> {
  const { data, error } = await supabase
    .from('links')
    .select('url, total_clicks')
    .eq('code', code)
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: 'Link not found', status: 404 };
  }

  const { error: updateError } = await supabase
    .from('links')
    .update({
      total_clicks: data.total_clicks + 1,
      last_clicked: new Date().toISOString()
    })
    .eq('code', code);

  if (updateError) {
    return { success: false, error: updateError.message, status: 500 };
  }

  return { success: true, url: data.url, status: 302 };
}
