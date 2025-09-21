'use client';

import { upsertDailyCheckin } from '@/lib/actions/checkins';
import { DailyCheckin } from '@/lib/data/checkins';
import { ProfileFormState } from '@/lib/data/profiles';
import {
  DailyCheckinInput,
  DailyCheckinSchema,
} from '@/lib/validation/checkin';
import React, { useActionState, useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NumberField from '@/components/shared/number-field';
import { normalize } from '@/lib/utils';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

interface DailyCheckinFormProps {
  checkin: DailyCheckin | null;
  date: string;
}

const DailyCheckinForm = ({ checkin, date }: DailyCheckinFormProps) => {
  const initialState: ProfileFormState = null;
  const [state, formAction] = useActionState(upsertDailyCheckin, initialState);
  const router = useRouter();

  const form = useForm<DailyCheckinInput>({
    resolver: zodResolver(
      DailyCheckinSchema,
    ) as unknown as Resolver<DailyCheckinInput>,
    defaultValues: {
      id: checkin?.id ?? undefined,
      date: checkin?.date ?? date,
      calories_goal: checkin?.calories_goal ?? 2000,
      calories_consumed: checkin?.calories_consumed ?? '',
      protein_consumed_g: checkin?.protein_consumed_g ?? '',
      carbs_consumed_g: checkin?.carbs_consumed_g ?? '',
      steps: checkin?.steps ?? '',
      calories_burned: checkin?.calories_burned ?? '',
      fasting_hours: checkin?.fasting_hours ?? '',
      water_ml: checkin?.water_ml ?? '',
    },
  });

  console.log('React Hook Form Errors:', form.formState.errors);

  useEffect(() => {
    if (!state) return;

    if (state.status === 'success') {
      form.clearErrors();
      form.reset();
      toast.success('Check-in Saved!', { description: state.message });
      router.push('/check-in');
    } else if (state.status === 'error') {
      const description =
        typeof state.error === 'string'
          ? state.error
          : 'Please check the form for errors.';
      toast.error('Update Failed', { description });

      if (typeof state.error === 'object' && state.error) {
        Object.entries(state.error).forEach(([key, value]) => {
          if (value) {
            form.setError(key as keyof DailyCheckinInput, {
              type: 'server',
              message: (value as string[])[0],
            });
          }
        });
      }
    }
  }, [state, form]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Check-in — {date}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <Input
                  type="hidden"
                  {...field}
                  value={normalize(field.value)}
                />
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <Input
                  type="hidden"
                  {...field}
                  value={normalize(field.value)}
                />
              )}
            />

            {/* Goal (visible, since users often tweak it) */}
            <FormField
              control={form.control}
              name="calories_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="cal-goal">Daily Calorie Goal</FormLabel>
                  <FormControl>
                    <NumberField
                      field={field}
                      id="cal-goal"
                      placeholder="kcal"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="calories_consumed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="cal-eaten">Calories Eaten</FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="cal-eaten"
                        placeholder="kcal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="protein_consumed_g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="prot">Protein (g)</FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="prot"
                        placeholder="grams"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="carbs_consumed_g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="carbs">Carbs (g)</FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="carbs"
                        placeholder="grams"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="calories_burned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="burned">Calories Burned</FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="burned"
                        placeholder="kcal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="steps">Steps</FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="steps"
                        placeholder="e.g., 10000"
                        step={100}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="water_ml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="water">Water (ml)</FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="water"
                        placeholder="e.g., 2000"
                        step={50}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="fasting_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fast">Fasting (hours)</FormLabel>
                  <FormControl>
                    <NumberField
                      field={field}
                      id="fast"
                      placeholder="e.g., 16"
                      step={0.5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DailyCheckinForm;
