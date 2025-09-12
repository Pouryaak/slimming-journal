// lib/data/checkins.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export type DailyCheckin = {
  id: string;
  user_id: string;
  date: string;
  calories_goal: number;
  calories_consumed: number;
  protein_consumed_g: number;
  carbs_consumed_g: number;
  steps: number;
  calories_burned: number;
  fasting_hours: number;
  water_ml: number;
  created_at: string;
};

export async function getTodaysCheckin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();

  if (error) {
    console.error('Error fetching daily checkin:', error);
    return null;
  }

  return data;
}
