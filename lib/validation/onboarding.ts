import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const OnboardingSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  unitSystem: z.enum(['metric', 'imperial']),
  height: z.coerce.number().positive('Enter a valid height'),
  weight: z.coerce.number().positive('Enter a valid weight'),
  goalWeight: z.coerce.number().positive('Enter a valid goal weight'),
  weeklyWeightGoal: z.coerce
    .number()
    .min(-5)
    .max(5)
    .refine((n) => Math.abs(n) > 0, 'Weekly change can’t be 0'),
  weekStart: z.enum(['saturday', 'monday']),
});

export type Schema = typeof OnboardingSchema;
export type FormInput = z.input<Schema>;
export type FormOutput = z.output<Schema>;

export interface StepProps {
  form: UseFormReturn<FormInput>;
}
