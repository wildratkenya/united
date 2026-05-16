import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name, stations, location_type, location_name } = req.body;

  if (!email || !password || !name || !stations?.length) {
    return res.status(400).json({ error: 'email, password, name, and stations are required' });
  }
  if (!location_type || !location_name) {
    return res.status(400).json({ error: 'location_type and location_name are required' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, stations, role: 'worker' },
  });

  if (authError) {
    return res.status(400).json({ error: authError.message });
  }

  const userId = authData.user?.id;
  if (!userId) {
    return res.status(500).json({ error: 'User created but no ID returned' });
  }

  const { error: profileError } = await supabase
    .from('worker_profiles')
    .insert({
      user_id: userId,
      email,
      name,
      stations,
      is_active: true,
      location_type,
      location_name,
    });

  if (profileError) {
    return res.status(500).json({ error: `Profile creation failed: ${profileError.message}` });
  }

  return res.status(200).json({ success: true, userId });
}
