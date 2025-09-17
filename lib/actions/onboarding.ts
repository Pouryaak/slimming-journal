'use server';

import { createClient } from '@/lib/supabase/server';
import { FormInput } from '@/lib/validation/onboarding';
import { redirect } from 'next/navigation';
import { withUser } from './safe-actions';

export const completeOnboarding = withUser(async (user, data: FormInput) => {
  const supabase = await createClient();

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
});
