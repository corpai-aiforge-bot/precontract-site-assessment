// frontend/pages/api/latest-project.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    let query = supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(1);

    if (id) {
      query = supabase.from('projects').select('*').eq('id', id).limit(1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[latest-project] Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error('[latest-project] Unexpected error:', err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
}
