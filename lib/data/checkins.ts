// lib/data/checkins.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { getStartOfWeek } from '../utils';
import { getProfile } from './profiles';

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

export async function getThisWeekCheckin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getProfile(user.id);

  const startOfWeek = getStartOfWeek(
    new Date(),
    profile?.week_start || 'monday',
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const { data, error } = await supabase
    .from('weekly_checkins')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startOfWeek.toISOString().slice(0, 10))
    .lte('date', endOfWeek.toISOString().slice(0, 10))
    .maybeSingle();

  if (error) {
    console.error('Error fetching this week checkins:', error);
    return null;
  }

  return data;
}

export async function getCheckinSpecificDate(date: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (error) {
    console.error('Error fetching check-in for specific date:', error);
    return null;
  }

  return data;
}

export type DailyCheckin = {
  id: string;
  user_id: string;
  date: string;
  calories_goal: number | null;
  calories_consumed: number | null;
  protein_consumed_g: number | null;
  carbs_consumed_g: number | null;
  steps: number | null;
  calories_burned: number | null;
  fasting_hours: number | null;
  water_ml: number | null;
  created_at: string;
};

export type WeeklyCheckin = {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  muscle_mass_kg: number | null;
  progress_photo_url: string | null;
  created_at: string;
};
