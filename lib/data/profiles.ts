import { createClient } from '@/lib/supabase/server';

// Profile type based on our table
export type Profile = {
  id: string;
  onboarded: boolean;
  name: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  goal_weight_kg: number | null;
  base_calories: number | null;
  weekly_weight_goal_kg: number | null;
  unit_system: 'metric' | 'imperial';
  week_start: 'sunday' | 'monday';
  created_at: string;
  updated_at: string;
};

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[getProfile] error', error.message);
    return null;
  }

  return data as Profile;
}
