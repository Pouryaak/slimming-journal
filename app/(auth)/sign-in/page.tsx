'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

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
import { AuthSchema, AuthValues } from '@/lib/validation/auth';
import { signInWithEmailPassword } from '@/lib/data/auth';

export default function SignInPage() {
  const router = useRouter();
  const [topError, setTopError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AuthValues>({
    resolver: zodResolver(AuthSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  async function onSubmit(values: AuthValues) {
    setTopError(null);

    startTransition(async () => {
      const res = await signInWithEmailPassword(values);
      if (!res.ok) {
        setTopError(res.message);
        return;
      }
      router.replace('/');
    });
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center p-5">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to your Slimming Journal
          </p>
        </div>

        <Card className="rounded-xl border border-[--color-border] bg-[--color-card] p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {topError && (
                <div className="rounded-lg border border-[--color-border] bg-black/10 px-3 py-2 text-sm">
                  {topError}
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
                        autoComplete="current-password"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isPending || form.formState.isSubmitting}
              >
                {isPending || form.formState.isSubmitting
                  ? 'Signing in…'
                  : 'Sign in'}
              </Button>
            </form>
          </Form>
        </Card>

        <p className="text-muted-foreground text-center text-sm">
          Don’t have an account?{' '}
          <Link href="/sign-up" className="underline underline-offset-4">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
