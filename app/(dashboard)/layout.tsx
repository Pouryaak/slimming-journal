import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('[LAYOUT] user', user?.id);

  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
