'use client';

import { Button } from '@/components/ui/button';
import { upsertWeeklyCheckin } from '@/lib/actions/checkins';
import { WeeklyCheckin } from '@/lib/data/checkins';
import { ProfileFormState } from '@/lib/data/profiles';
import {
  WeeklyCheckinInput,
  WeeklyCheckinSchema,
} from '@/lib/validation/checkin';
import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import NumberField from '@/components/shared/number-field';
import { Input } from '@/components/ui/input';
import { normalize } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

interface WeeklyCheckinFormProps {
  checkin: WeeklyCheckin | null;
  date: string;
}

const WeeklyCheckinForm = ({ checkin, date }: WeeklyCheckinFormProps) => {
  const initialState: ProfileFormState = null;
  const [state, formAction] = useActionState(upsertWeeklyCheckin, initialState);

  const form = useForm<WeeklyCheckinInput>({
    resolver: zodResolver(
      WeeklyCheckinSchema,
    ) as unknown as Resolver<WeeklyCheckinInput>,
    defaultValues: {
      id: checkin?.id ?? undefined,
      date: checkin?.date ?? date,
      weight_kg: checkin?.weight_kg ?? '',
      muscle_mass_kg: checkin?.muscle_mass_kg ?? '',
      body_fat_percentage: checkin?.body_fat_percentage ?? '',
    },
  });

  useEffect(() => {
    if (!state) return;

    if (state.status === 'success') {
      form.clearErrors();
      toast.success('Check-in Saved!', { description: state.message });
    } else if (state.status === 'error') {
      const description =
        typeof state.error === 'string'
          ? state.error
          : 'Please check the form for errors.';
      toast.error('Update Failed', { description });

      if (typeof state.error === 'object' && state.error) {
        Object.entries(state.error).forEach(([key, value]) => {
          if (value) {
            form.setError(key as keyof WeeklyCheckinInput, {
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
        <CardTitle>Weekly Check-in — {date}</CardTitle>
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
              name="weight_kg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="weight_kg">Weight (kg)</FormLabel>
                  <FormControl>
                    <NumberField
                      field={field}
                      id="weight_kg"
                      placeholder="kg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="muscle_mass_kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="muscle_mass_kg">
                      Muscle Mass (kg)
                    </FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="muscle_mass_kg"
                        placeholder="kg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="body_fat_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="body_fat_percentage">
                      Body Fat (%)
                    </FormLabel>
                    <FormControl>
                      <NumberField
                        field={field}
                        id="body_fat_percentage"
                        placeholder="%"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <SubmitButton />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WeeklyCheckinForm;
