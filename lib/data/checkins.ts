// lib/data/checkins.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { getStartOfWeek } from '../utils';
import { getProfile } from './profiles';
import { getAuthenticatedUser } from '../actions/auth';

export async function getTodaysCheckin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  console.log(today);

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .maybeSingle();

  console.log(data);

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
  const user = await getAuthenticatedUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();

  // Run both queries at the same time for better performance
  const [dailyResponse, weeklyResponse] = await Promise.all([
    supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .maybeSingle(),
    supabase
      .from('weekly_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .maybeSingle(),
  ]);

  if (dailyResponse.error || weeklyResponse.error) {
    console.error(
      'Error fetching check-in for specific date:',
      dailyResponse.error || weeklyResponse.error,
    );

    return null;
  }

  return {
    daily: dailyResponse.data,
    weekly: weeklyResponse.data,
  };
}

export async function getWeightTrendData() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return [];
  }

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const startDate = threeMonthsAgo.toISOString().slice(0, 10);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('weekly_checkins')
    .select('date, weight_kg, body_fat_percentage, muscle_mass_kg')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching weight trend data:', error);
    return [];
  }

  return data.filter(
    (item): item is { date: string; weight_kg: number } =>
      item.weight_kg !== null,
  );
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
