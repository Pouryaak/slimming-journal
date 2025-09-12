'use client';

import Link from 'next/link';
// Import hooks from react-dom for Server Actions
import { useFormState, useFormStatus } from 'react-dom';

// Your Zod schema and type imports
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AuthSchema, AuthValues } from '@/lib/validation/auth';

// Your new Server Action and its return type
import { signUpUser, FormState } from '@/lib/data/auth';

// Shadcn UI component imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Card } from '@/components/ui/card';

/**
 * A separate component for the submit button.
 * It uses the useFormStatus hook to automatically track the form's pending state,
 * which simplifies the logic in the main component.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="h-11 w-full" disabled={pending}>
      {pending ? 'Creating account…' : 'Sign up'}
    </Button>
  );
}

export default function SignUpPage() {
  // The initial state for our form action
  const initialState: FormState = null;

  // Wire up the server action with useFormState
  const [state, formAction] = useFormState(signUpUser, initialState);

  // react-hook-form setup remains the same for client-side validation
  const form = useForm<AuthValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center p-5">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Create account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Start your Daily Calorie Journal today
          </p>
        </div>

        <Card className="rounded-xl border border-[--color-border] bg-[--color-card] p-4 sm:p-6">
          {/* We keep the react-hook-form provider for client-side validation UI */}
          <Form {...form}>
            {/* The action prop connects the form directly to the server action */}
            <form action={formAction} className="space-y-4">
              {/* Display server-side errors returned from the action */}
              {state?.error && (
                <div className="rounded-lg border border-[--color-border] bg-black/10 px-3 py-2 text-sm text-red-500">
                  {state.message}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        inputMode="email"
                        className="h-11"
                        {...field}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-11"
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
        </Card>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
