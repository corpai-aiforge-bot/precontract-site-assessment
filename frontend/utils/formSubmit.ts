// frontend/utils/formSubmit.ts
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
    // Try to find existing client_id for this email
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
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
