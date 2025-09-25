'use server';

import { revalidatePath } from 'next/cache';
import { DailyCheckin, WeeklyCheckin } from '../data/checkins';
import { createClient } from '../supabase/server';
import { DailyCheckinSchema, WeeklyCheckinSchema } from '../validation/checkin';
import { getAuthenticatedUser } from './auth';
import { withUser } from './safe-actions';
import { convertFieldsToNumber, getMonthDateRangeInUTC } from '../utils';
import { getProfile } from '../data/profiles';
import {
  prepareAndSendTelegramMessage,
  sendTelegramMessage,
} from '../notifications';

export type MonthlyCheckins = {
  daily: DailyCheckin[];
  weekly: WeeklyCheckin[];
};

export const getMonthlyCheckins = withUser(
  async (user, date: Date): Promise<MonthlyCheckins> => {
    const profile = await getProfile(user.id);
    const timeZone = profile?.time_zone || 'UTC';
    const { startDateUTC, endDateUTC } = getMonthDateRangeInUTC(date, timeZone);

    const supabase = await createClient();

    const [dailyResponse, weeklyResponse] = await Promise.all([
      supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateUTC.toISOString())
        .lte('date', endDateUTC.toISOString()),
      supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateUTC.toISOString())
        .lte('date', endDateUTC.toISOString()),
    ]);
    if (dailyResponse.error || weeklyResponse.error) {
      console.error(
        'Error fetching monthly checkins:',
        dailyResponse.error || weeklyResponse.error,
      );
      return { daily: [], weekly: [] };
    }

    return { daily: dailyResponse.data, weekly: weeklyResponse.data };
  },
);

export const upsertDailyCheckin = withUser(async (user, formData: FormData) => {
  const supabase = await createClient();

  const profile = await getProfile(user.id);
  const userName = profile?.name || 'A user';
  const userTimeZone = profile?.time_zone || 'UTC';

  const rawFormData = Object.fromEntries(formData.entries());

  console.log('rawFormData:', rawFormData);

  const numericData = convertFieldsToNumber(rawFormData, [
    'calories_goal',
    'calories_consumed',
    'protein_consumed_g',
    'carbs_consumed_g',
    'steps',
    'calories_burned',
    'fasting_hours',
    'water_ml',
  ]);

  console.log('Numeric Data:', numericData);

  const validatedFields = DailyCheckinSchema.safeParse(numericData);
  if (!validatedFields.success) {
    return {
      status: 'error',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log('validatedFields:', validatedFields);

  const { id, ...dataToUpsert } = validatedFields.data;

  let result;

  if (id) {
    result = await supabase
      .from('daily_checkins')
      .update(dataToUpsert)
      .eq('id', id)
      .eq('user_id', user.id);
  } else {
    result = await supabase
      .from('daily_checkins')
      .insert({ ...dataToUpsert, user_id: user.id });
  }

  if (result.error) {
    console.error('Error upserting daily checkin:', result.error);
    return { status: 'error', error: 'Failed to save your check-in.' };
  }

  prepareAndSendTelegramMessage(
    validatedFields.data as DailyCheckin,
    userName,
    userTimeZone,
  );

  revalidatePath('/check-in');
  revalidatePath('/dashboard');
  return {
    status: 'success',
    message: 'check-in successful',
    data: result.data,
  };
});

export const upsertWeeklyCheckin = withUser(
  async (user, formData: FormData) => {
    const supabase = await createClient();

    const rawFormData = Object.fromEntries(formData.entries());

    const numericData = convertFieldsToNumber(rawFormData, [
      'weight_kg',
      'body_fat_percentage',
      'muscle_mass_kg',
    ]);

    const validatedFields = WeeklyCheckinSchema.safeParse(numericData);
    if (!validatedFields.success) {
      return {
        status: 'error',
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, ...dataToUpsert } = validatedFields.data;

    let result;

    if (id) {
      result = await supabase
        .from('weekly_checkins')
        .update(dataToUpsert)
        .eq('id', id)
        .eq('user_id', user.id);
    } else {
      result = await supabase
        .from('weekly_checkins')
        .insert({ ...dataToUpsert, user_id: user.id });
    }

    if (result.error) {
      console.error('Error upserting weekly checkin:', result.error);
      return { status: 'error', error: 'Failed to save your check-in.' };
    }

    revalidatePath('/check-in');
    revalidatePath('/dashboard');
    return {
      status: 'success',
      message: 'check-in successful',
      data: result.data,
    };
  },
);
