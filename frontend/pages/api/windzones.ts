// pages/api/windzones.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

interface WindZone {
  id: string;
  name: string;
  region?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { lat, lng } = req.query;

  if (lat && lng) {
    // Specific wind zone for a given lat/lng (for ui1.tsx)
    try {
      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: 'Invalid lat or lng' });
      }

      const { data, error } = await supabase
        .from('wind_zones')
        .select('name')
        .contains('geometry', {
          type: 'Point',
          coordinates: [longitude, latitude], // GeoJSON: [lng, lat]
        })
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch wind zone' });
      }
      if (!data) {
        return res.status(404).json({ error: 'No wind zone found for this location' });
      }

      return res.status(200).json({ windZone: data.name });
    } catch (error) {
      console.error('Error fetching wind zone:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  // Fetch all wind zones (for WindzoneOverlay.tsx)
  try {
    const { data, error } = await supabase
      .from('wind_zones')
      .select('id, name, region');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch wind zones' });
    }

    return res.status(200).json(data || []);
  } catch (error) {
    console.error('Error fetching all wind zones:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}