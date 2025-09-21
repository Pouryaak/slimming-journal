'use server';

import { createClient } from '@/lib/supabase/server';
import { FormInput } from '@/lib/validation/onboarding';
import { redirect } from 'next/navigation';
import { withUser } from './safe-actions';
import { cookies, headers } from 'next/headers';

type FormInputWithTZ = FormInput & { timeZone?: string };

export const completeOnboarding = withUser(
  async (user, data: FormInputWithTZ) => {
    const supabase = await createClient();

    const hdrs = await headers();
    const cookieStore = await cookies();

    const tzFromForm = data.timeZone?.trim();
    const tzFromHeader = hdrs.get('x-timezone') ?? hdrs.get('x-tz');
    const tzFromCookie = cookieStore.get('tz')?.value;

    const timeZone =
      (tzFromForm && tzFromForm.length > 0 ? tzFromForm : undefined) ??
      (tzFromHeader && tzFromHeader.length > 0 ? tzFromHeader : undefined) ??
      (tzFromCookie && tzFromCookie.length > 0 ? tzFromCookie : undefined) ??
      'Europe/Copenhagen';

    const { error } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        height_cm: data.height,
        weight_kg: data.weight,
        goal_weight_kg: data.goalWeight,
        weekly_weight_goal_kg: data.weeklyWeightGoal,
        unit_system: data.unitSystem,
        week_start: data.weekStart,
        time_zone: timeZone,
        onboarded: true,
      })
      .eq('id', user.id);

    if (error) {
      console.error('Supabase error:', error.message);
      return {
        status: 'error',
        error: 'Sorry, we could not update your profile. Please try again.',
      };
    }

    redirect('/');
  },
);
