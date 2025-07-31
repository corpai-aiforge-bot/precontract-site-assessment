// pages/api/benchmarks.ts
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat or lng parameters' });
  }

  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Invalid lat or lng parameters' });
  }

  try {
    const { data, error } = await supabase
      .from('benchmarks')
      .select('mark_no, latitude, longitude, height, marktype')
      .eq('gone', 'N')
      .not('height', 'is', null)
      .order('geom', {
        ascending: true,
        referenced: `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`,
      })
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch benchmark' });
    }

    if (!data) {
      return res.status(404).json({ error: 'No benchmark found' });
    }

    res.status(200).json({
      mark_no: data.mark_no,
      latitude: data.latitude,
      longitude: data.longitude,
      height: data.height,
      marktype: data.marktype,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}