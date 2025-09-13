'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { withUser } from './safe-actions';
import { revalidatePath } from 'next/cache';
import { he } from 'zod/locales';

const ProfileUpdateSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    height_cm: z.number().positive(),
    unit_system: z.enum(['metric', 'imperial']),
    week_start: z.enum(['saturday', 'monday']),
  })
  .and(
    z.object({
      password: z
        .string()
        .min(6, 'New password must be at least 6 characters')
        .optional()
        .or(z.literal('')),
    }),
  );

const ProfileUpdateGoalsSchema = z.object({
  weight_kg: z.number().min(30, 'Weight must be at least 30 kg'),
  goal_weight_kg: z.number().min(30, 'Goal weight must be at least 30 kg'),
  weekly_weight_goal_kg: z
    .number()
    .min(-5, 'Weekly goal weight should be less than -5 kg')
    .max(5, 'Weekly goal weight should not be more than 5 kg'),
  base_calories: z.number().min(1000, 'Base calories must be at least 1000'),
});

export const updateProfile = withUser(async (user, formData: FormData) => {
  const supabase = await createClient();
  const rawFormData = Object.fromEntries(formData.entries());

  const numericFormData = {
    ...rawFormData,
    height_cm: Number(rawFormData.height_cm),
  };

  const validatedFields = ProfileUpdateSchema.safeParse(numericFormData);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { name, height_cm, unit_system, password } = validatedFields.data;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, height_cm, unit_system })
    .eq('id', user.id);

  if (profileError) {
    console.error('Profile update error:', profileError);
    return { error: 'Failed to update profile.' };
  }

  if (password) {
    const { error: authError } = await supabase.auth.updateUser({ password });

    if (authError) {
      console.error('Password update error:', authError);
      return { error: 'Failed to update password.' };
    }
  }

  revalidatePath('/profile/my-profile');
  return { success: 'Profile updated successfully!' };
});

export const updateProfileGoals = withUser(async (user, formData: FormData) => {
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
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { weight_kg, goal_weight_kg, weekly_weight_goal_kg, base_calories } =
    validatedFields.data;

  const { error: goalsError } = await supabase
    .from('profile')
    .update({ weight_kg, goal_weight_kg, weekly_weight_goal_kg, base_calories })
    .eq('id', user.id);

  if (goalsError) {
    console.error('Profile goals update error:', goalsError);
    return { error: 'Failed to update profile goals.' };
  }

  revalidatePath('/profile/goals');
  return { success: 'Profile goals updated successfully!' };
});
