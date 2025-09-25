import z from 'zod';

const uiNumber = (inner: z.ZodNumber) =>
  z.preprocess((v) => (v === '' ? undefined : v), inner);

export const DailyCheckinSchema = z.object({
  id: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().uuid().optional(),
  ),
  date: z.string().date(),
  calories_goal: uiNumber(z.number().int().min(0)),
  calories_consumed: uiNumber(z.number().int().min(0)),
  protein_consumed_g: uiNumber(z.number().int().min(0)),
  carbs_consumed_g: uiNumber(z.number().int().min(0)),
  steps: uiNumber(z.number().int().min(0)),
  calories_burned: uiNumber(z.number().int().min(0)),
  fasting_hours: uiNumber(z.number().min(0)),
  water_ml: uiNumber(z.number().int().min(0)),
});

export type DailyCheckinInput = z.input<typeof DailyCheckinSchema>;
export type DailyCheckinOutput = z.output<typeof DailyCheckinSchema>;

export const WeeklyCheckinSchema = z.object({
  id: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().uuid().optional(),
  ),
  date: z.string().date(),
  weight_kg: uiNumber(z.number().min(0)),
  muscle_mass_kg: uiNumber(z.number().int().min(0)),
  body_fat_percentage: uiNumber(z.number().min(0).max(100)),
});

export type WeeklyCheckinInput = z.input<typeof WeeklyCheckinSchema>;
