import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

type ActionState = object | null;

export function withUser<T, S extends ActionState>(
  action: (user: User, payload: T) => Promise<S>,
) {
  return async (previousState: S | null, payload?: T): Promise<S> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('[withUser HOF] User check:', user);

    if (!user) {
      return { status: 'error', error: 'Authentication is required.' } as S;
    }

    if (action.length === 2) {
      return (action as (user: User, payload: T) => Promise<S>)(
        user,
        payload as T,
      );
    } else {
      return (action as (user: User) => Promise<S>)(user);
    }
  };
}
