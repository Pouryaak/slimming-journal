'use server';

import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

type ActionResponse<R> = { error: string } | R;

export async function withUser<T, R>(
  action: (user: User, payload: T) => Promise<R>,
) {
  return async (payload: T): Promise<ActionResponse<R>> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Authentication is required to perform this action.' };
    }

    return action(user, payload);
  };
}
