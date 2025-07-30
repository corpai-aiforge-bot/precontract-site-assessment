// frontend/pages/api/store-project.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for insert access
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = req.body;

  try {
    const { error } = await supabase.from('projects').insert([{ ...data }]);
    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('[store-project] Insert failed:', err.message);
    return res.status(500).json({ error: 'Failed to store project data' });
  }
}
