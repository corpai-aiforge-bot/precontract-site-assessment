// frontend/pages/api/approve-services.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { project_id, approved_services } = req.body;

  if (!project_id || !Array.isArray(approved_services)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const { error } = await supabase
    .from('projects')
    .update({
      approved_services,
      approval_status: 'approved',
      approval_timestamp: new Date().toISOString(),
    })
    .eq('id', project_id);

  if (error) {
    console.error('[approve-services] Supabase error:', error);
    return res.status(500).json({ error: 'Supabase update failed' });
  }

  res.status(200).json({ success: true });
}
