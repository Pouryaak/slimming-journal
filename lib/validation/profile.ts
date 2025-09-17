import { z } from 'zod';

export const ProfileUpdateSchema = z
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

export const ProfileUpdateGoalsSchema = z.object({
  weight_kg: z.number().min(30, 'Weight must be at least 30 kg'),
  goal_weight_kg: z.number().min(30, 'Goal weight must be at least 30 kg'),
  weekly_weight_goal_kg: z
    .number()
    .min(-5, 'Weekly goal weight should be less than -5 kg')
    .max(5, 'Weekly goal weight should not be more than 5 kg'),
  base_calories: z.number().min(1000, 'Base calories must be at least 1000'),
});
