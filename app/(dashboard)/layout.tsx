import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/data/profiles';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    redirect('/sign-in');
  }
  if (!profile.onboarded) {
    redirect('/welcome');
  }

  return <>{children}</>;
}
