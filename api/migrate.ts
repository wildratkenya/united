import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return res.status(500).json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY env' });

    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    const results: string[] = [];

    // Try running migration via auth.admin (some projects have this)
    const addType = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.worker_profiles ADD COLUMN IF NOT EXISTS location_type text;`,
    });
    if (addType.error) results.push(`location_type: ${addType.error.message}`);
    else results.push('location_type: OK');

    const addName = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.worker_profiles ADD COLUMN IF NOT EXISTS location_name text;`,
    });
    if (addName.error) results.push(`location_name: ${addName.error.message}`);
    else results.push('location_name: OK');

    return res.status(200).json({ results });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
