// lib/actions/auth.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthSchema } from '@/lib/validation/auth';

export type AuthResult = { ok: true } | { ok: false; message: string };

// We'll return this shape from our action
export type FormState = {
  message: string;
  error: boolean;
} | null;

export async function signUpUser(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Validate the form data
  const validatedFields = AuthSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      error: true,
      message: 'Invalid form fields. Please check your email and password.',
    };
  }

  const { email, password } = validatedFields.data;
  const supabase = await createClient();

  // 2. Call Supabase auth.signUp
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign up error:', error.message);
    return {
      error: true,
      message: 'Could not create account. Please try again.',
    };
  }

  // 3. Redirect on success
  // This forces a fresh, uncached server render of the target page
  redirect('/');
}

export async function signInWithEmailPassword(params: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  if (error) {
    const message =
      error.message?.trim() || 'Invalid email or password. Please try again.';
    return { ok: false, message };
  }

  return { ok: true };
}
