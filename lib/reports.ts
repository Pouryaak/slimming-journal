import { createClient } from './supabase/server';
import { DailyCheckin, WeeklyCheckin } from './data/checkins';
import { Profile } from './data/profiles';
import { WeeklyReportData } from './types';

function formatDelta(num: number | null | undefined, units: string): string {
  if (num === null || num === undefined || Number.isNaN(num)) return '—';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)} ${units}`;
}

function fmt(num: number | null | undefined, units = '', digits = 1): string {
  if (num === null || num === undefined || Number.isNaN(num)) return '—';
  return `${num.toFixed(digits)}${units ? ' ' + units : ''}`;
}

export async function generateWeeklyReport(
  currentCheckin: WeeklyCheckin,
): Promise<WeeklyReportData | string> {
  const supabase = await createClient();
  const userId = currentCheckin.user_id;

  const [profileRes, previousCheckinRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('weekly_checkins')
      .select('*')
      .eq('user_id', userId)
      .lt('date', currentCheckin.date)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileRes.error || previousCheckinRes.error) {
    console.error(
      'Error fetching base data for report:',
      profileRes.error || previousCheckinRes.error,
    );
    return 'Could not generate report due to a data fetching error.';
  }

  const profile = profileRes.data as Profile;
  const previousCheckin = previousCheckinRes.data as WeeklyCheckin | null;

  const endDate = new Date(currentCheckin.date);
  const sevenDaysAgo = new Date(endDate);
  sevenDaysAgo.setDate(endDate.getDate() - 6);

  let startDate = new Date(sevenDaysAgo);
  if (previousCheckin?.date) {
    const prevEnd = new Date(previousCheckin.date);
    prevEnd.setDate(prevEnd.getDate() + 1);
    if (prevEnd > startDate) startDate = prevEnd;
  }

  const startISO = startDate.toISOString().slice(0, 10);
  const endISO = endDate.toISOString().slice(0, 10);

  const dailyCheckinsRes = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startISO)
    .lte('date', endISO);

  if (dailyCheckinsRes.error) {
    console.error('Error fetching daily_checkins:', dailyCheckinsRes.error);
    return 'Could not generate report due to a data fetching error.';
  }

  const dailyCheckins = (dailyCheckinsRes.data as DailyCheckin[]) || [];

  const wt_now = currentCheckin.weight_kg ?? null;
  const bf_now = currentCheckin.body_fat_percentage ?? null;
  const muscle_now = currentCheckin.muscle_mass_kg ?? null;

  const wt_prev = previousCheckin?.weight_kg ?? null;
  const bf_prev = previousCheckin?.body_fat_percentage ?? null;
  const muscle_prev = previousCheckin?.muscle_mass_kg ?? null;

  const wt_delta =
    wt_now !== null && wt_prev !== null ? wt_now - wt_prev : null;

  const bf_delta =
    bf_now !== null && bf_prev !== null ? bf_now - bf_prev : null;

  const muscle_delta =
    muscle_now !== null && muscle_prev !== null
      ? muscle_now - muscle_prev
      : null;

  const numDays = Math.max(dailyCheckins.length, 1);

  const totals = dailyCheckins.reduce(
    (acc, day) => {
      const cal = day.calories_consumed ?? 0;
      const goal = day.calories_goal ?? 0;
      const prot = day.protein_consumed_g ?? 0;
      const steps = day.steps ?? 0;
      const water = day.water_ml ?? 0;
      const fast = day.fasting_hours ?? 0;

      acc.net_kcal_sum += cal - goal;
      acc.protein_sum += prot;
      acc.steps_sum += steps;
      acc.water_sum += water;
      acc.fasting_h_sum += fast;

      if (goal > 0) {
        const lower = goal * 0.9;
        const upper = goal * 1.1;
        if (cal >= lower && cal <= upper) acc.cal_ok_days++;
      }
      return acc;
    },
    {
      net_kcal_sum: 0,
      protein_sum: 0,
      steps_sum: 0,
      water_sum: 0,
      fasting_h_sum: 0,
      cal_ok_days: 0,
    },
  );

  const protein_avg = totals.protein_sum / numDays;
  const steps_avg = totals.steps_sum / numDays;
  const water_avg_l = totals.water_sum / numDays;
  const fasting_avg_h = totals.fasting_h_sum / numDays;

  return {
    userName: profile.name || 'User',
    startDate,
    endDate,
    firstWeek: !previousCheckin,
    wt_now,
    wt_delta,
    bf_now,
    bf_delta,
    muscle_now,
    muscle_delta,
    numDays,
    cal_ok_days: totals.cal_ok_days,
    protein_avg,
    steps_avg,
    water_avg_l,
    fasting_avg_h,
  };
}

export function formatReportForTelegram(data: WeeklyReportData): string {
  const {
    userName,
    startDate,
    endDate,
    firstWeek,
    wt_now,
    wt_delta,
    bf_now,
    bf_delta,
    muscle_now,
    muscle_delta,
    numDays,
    cal_ok_days,
    protein_avg,
    steps_avg,
    water_avg_l,
    fasting_avg_h,
  } = data;

  const week_start = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const week_end = endDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  const message = `
*${userName}'s WEEKLY CHECK-IN* ✅ (${week_start} - ${week_end})

*Body*
⚖️ Weight: ${fmt(wt_now, 'kg')} (${firstWeek ? 'First check-in!' : formatDelta(wt_delta, 'kg')})
🔥 Body fat: ${fmt(bf_now, '%')} (${firstWeek ? '—' : formatDelta(bf_delta, '%')})
💪 Muscle: ${fmt(muscle_now, 'kg')} (${firstWeek ? '—' : formatDelta(muscle_delta, 'kg')})

*Adherence*
🎯 Calories on target: ${cal_ok_days}/${numDays} days
🍗 Protein: avg ${Number.isFinite(protein_avg) ? Math.round(protein_avg) : '—'} g/d
👟 Steps: avg ${Math.round(steps_avg).toLocaleString('en-US')}/d
💧 Water: avg ${Number.isFinite(water_avg_l) ? water_avg_l.toFixed(1) : '—'} L/d
⏳ Fasting: avg ${Number.isFinite(fasting_avg_h) ? fasting_avg_h.toFixed(1) : '—'} h
`.trim();

  return message;
}
