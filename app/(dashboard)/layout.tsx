import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/data/profiles';
import { MobileNavbar } from '@/components/shared/mobile-navbar';

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

  return (
    <>
      <main className="p-2 pb-21">{children}</main>

      <MobileNavbar />
    </>
  );
}
