import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

type ActionResponse<R> = { error: string } | R;

export function withUser<T, R>(
  action:
    | ((user: User, payload: T) => Promise<R>)
    | ((user: User) => Promise<R>),
) {
  return async (payload?: T): Promise<ActionResponse<R>> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Authentication is required.' };
    }

    if (action.length === 2) {
      return (action as (user: User, payload: T) => Promise<R>)(
        user,
        payload as T,
      );
    } else {
      return (action as (user: User) => Promise<R>)(user);
    }
  };
}
