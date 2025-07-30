import { supabase } from '../lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function submitForm({
  metadata,
  services,
  riskScore,
  riskCategory,
  elevation,
  coastalDistance,
}: {
  metadata: any;
  services: string[];
  riskScore: number;
  riskCategory: string;
  elevation: number;
  coastalDistance: number;
}) {
  try {
    // Check if client already exists based on email
    const { data: existingClient, error: lookupError } = await supabase
      .from('projects')
      .select('client_id')
      .eq('email', metadata.email)
      .limit(1);

    let client_id = existingClient?.[0]?.client_id;
    if (!client_id) {
      client_id = uuidv4();
    }

    const { data, error } = await supabase.from('projects').insert([
      {
        ...metadata,
        client_id,
        services: services.join(', '),
        submitted_at: new Date().toISOString(),
        risk_score: riskScore,
        risk_category: riskCategory,
        elevation,
        coastal_distance: coastalDistance,
      },
    ]).select('id'); // <- return id of inserted row

    if (error || !data || !data[0]?.id) {
      return {
        success: false,
        error: error?.message || 'Insert failed or missing ID',
      };
    }

    return {
      success: true,
      projectId: data[0].id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unknown error',
    };
  }
}
