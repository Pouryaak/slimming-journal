// components/profile/profile-form.tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; // You'll need to define your Zod schema here or import it

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Profile, ProfileFormState } from '@/lib/data/profiles'; // Import the Profile type
import { updateProfile } from '@/lib/actions/profile';
import { ProfileUpdateSchema } from '@/lib/validation/profile';
import { toast } from 'sonner';
import { useActionState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  profile: Profile; // The form will receive the current profile data
}

// TODO: Define your Zod schema here

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const initialState: ProfileFormState = null;
  const [state, formAction] = useActionState(updateProfile, initialState);

  type FormValues = z.infer<typeof ProfileUpdateSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      name: profile.name || '',
      height_cm: profile.height_cm || 170,
      unit_system: profile.unit_system || 'metric',
      week_start: profile.week_start || 'monday',
      password: '',
    },
  });

  useEffect(() => {
    if (!state) return;

    if (state.status === 'success') {
      form.clearErrors();
      toast.success('Profile Saved!', { description: state.message });
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
    <Form {...form}>
      <form action={formAction} className="space-y-6">
        {state?.status === 'error' && typeof state.error === 'string' && (
          <div className="text-sm text-red-500">{state.error}</div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height_cm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input type="number" inputMode="decimal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unit_system"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Units</FormLabel>
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={field.value === 'metric' ? 'default' : 'outline'}
                  onClick={() => field.onChange('metric')}
                >
                  Metric
                </Button>
                <Button
                  type="button"
                  variant={field.value === 'imperial' ? 'default' : 'outline'}
                  onClick={() => field.onChange('imperial')}
                >
                  Imperial
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="week_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Week Starts On</FormLabel>
              <input type="hidden" {...field} />
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex items-center gap-6"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="monday" />
                    </FormControl>
                    <FormLabel className="font-normal">Monday</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="saturday" />
                    </FormControl>
                    <FormLabel className="font-normal">Saturday</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Leave blank to keep current"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}
