import z from 'zod';

export const DailyCheckinSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  date: z.string(),
  calories_goal: z.number().nullable(),
  calories_consumed: z.number().nullable(),
  protein_consumed_g: z.number().nullable(),
  carbs_consumed_g: z.number().nullable(),
  steps: z.number().nullable(),
  calories_burned: z.number().nullable(),
  fasting_hours: z.number().nullable(),
  water_ml: z.number().nullable(),
  created_at: z.string(),
});
