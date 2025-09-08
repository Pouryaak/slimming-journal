import { createClient } from '@/lib/supabase/client';

export type AuthResult = { ok: true } | { ok: false; message: string };

export async function signInWithEmailPassword(params: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = createClient();

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

export async function signUpWithEmailPassword(params: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });

  if (error) {
    const message =
      error.message?.trim() || 'Unable to sign up. Please try again.';
    return { ok: false, message };
  }

  return { ok: true };
}
