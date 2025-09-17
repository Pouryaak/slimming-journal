'use client';

import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateProfileGoals } from '@/lib/actions/profile';
import { Profile, ProfileFormState } from '@/lib/data/profiles';
import { ProfileUpdateGoalsSchema } from '@/lib/validation/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

interface ProfileFormProps {
  profile: Profile;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

const GoalsForm = ({ profile }: ProfileFormProps) => {
  const initialState: ProfileFormState = null;
  const [state, formAction] = useActionState(updateProfileGoals, initialState);

  type FormValues = z.infer<typeof ProfileUpdateGoalsSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileUpdateGoalsSchema),
    defaultValues: {
      weight_kg: profile.weight_kg || 70,
      goal_weight_kg: profile.goal_weight_kg || 65,
      weekly_weight_goal_kg: profile.weekly_weight_goal_kg || 0,
      base_calories: profile.base_calories || 2000,
    },
  });

  useEffect(() => {
    if (!state) return;

    if (state.status === 'success') {
      form.clearErrors();
      toast.success('Goals Saved!', { description: state.message });
    } else if (state.status === 'error') {
      const description =
        typeof state.error === 'string'
          ? state.error
          : 'Please check the form for errors.';
      toast.error('Update Failed', { description });

      if (typeof state.error === 'object') {
        Object.entries(state.error).forEach(([key, value]) => {
          if (value) {
            form.setError(key as keyof FormValues, {
              type: 'server',
              message: value[0],
            });
          }
        });
      }
    }
  }, [state, form]);

  return (
    <div>
      <Form {...form}>
        <form action={formAction} className="space-y-6">
          {state?.status === 'error' && typeof state.error === 'string' && (
            <div className="text-sm text-red-500">{state.error}</div>
          )}
          <FormField
            control={form.control}
            name="weight_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input placeholder="Your weight" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="goal_weight_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Weight</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your goal weight"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weekly_weight_goal_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weekly Weight Goal</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your weekly weight goal"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="base_calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Daily Base Calories</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your daily base calories"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton />
        </form>
      </Form>
    </div>
  );
};

export default GoalsForm;
