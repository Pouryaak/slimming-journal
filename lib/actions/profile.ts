'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { withUser } from './safe-actions';
import { revalidatePath } from 'next/cache';
import { ProfileFormState } from '../data/profiles';
import {
  ProfileUpdateGoalsSchema,
  ProfileUpdateSchema,
} from '../validation/profile';

export const updateProfile = withUser(
  async (user, formData: FormData): Promise<ProfileFormState> => {
    console.log('formData:', formData);

    const supabase = await createClient();
    const rawFormData = Object.fromEntries(formData.entries());
    const numericFormData = {
      ...rawFormData,
      height_cm: Number(rawFormData.height_cm),
    };

    const validatedFields = ProfileUpdateSchema.safeParse(numericFormData);

    if (!validatedFields.success) {
      return {
        status: 'error',
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, height_cm, unit_system, password, week_start } =
      validatedFields.data;

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ name, height_cm, unit_system, week_start })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return { status: 'error', error: 'Failed to update profile.' };
    }

    if (password) {
      const { error: authError } = await supabase.auth.updateUser({ password });

      if (authError) {
        console.error('Password update error:', authError);
        return { status: 'error', error: 'Failed to update password.' };
      }
    }

    revalidatePath('/profile/my-profile');
    return { status: 'success', message: 'Profile updated successfully!' };
  },
);

export const updateProfileGoals = withUser(
  async (user, formData: FormData): Promise<ProfileFormState> => {
    const supabase = await createClient();
    const rawFormData = Object.fromEntries(formData.entries());

    const numericFormData = {
      ...rawFormData,
      weight_kg: Number(rawFormData.weight_kg),
      goal_weight_kg: Number(rawFormData.goal_weight_kg),
      weekly_weight_goal_kg: Number(rawFormData.weekly_weight_goal_kg),
      base_calories: Number(rawFormData.base_calories),
    };

    const validatedFields = ProfileUpdateGoalsSchema.safeParse(numericFormData);

    if (!validatedFields.success) {
      return {
        status: 'error',
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { weight_kg, goal_weight_kg, weekly_weight_goal_kg, base_calories } =
      validatedFields.data;

    const { error: goalsError } = await supabase
      .from('profiles')
      .update({
        weight_kg,
        goal_weight_kg,
        weekly_weight_goal_kg,
        base_calories,
      })
      .eq('id', user.id);

    if (goalsError) {
      console.error('Profile goals update error:', goalsError);
      return { status: 'error', error: 'Failed to update profile goals.' };
    }

    revalidatePath('/profile/goals');
    return {
      status: 'success',
      message: 'Profile goals updated successfully!',
    };
  },
);
