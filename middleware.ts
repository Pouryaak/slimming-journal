// middleware.ts
// Purpose:
// 1) Refresh Supabase auth tokens via cookies (Edge-safe).
// 2) Light auth gate for /(dashboard)/** paths: redirect unauthenticated users to /sign-in.

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|avif|css|js|txt|map)$/);

  const response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user ?? null;

  console.log('[MIDDLEWARE] user', user?.id);

  const isDashboard = pathname.startsWith('/dashboard') || pathname === '/';
  if (isDashboard && !user && !isAuthPage && !isPublicAsset) {
    const redirectTo = encodeURIComponent(pathname + (search || ''));
    const url = new URL(`/sign-in?redirectTo=${redirectTo}`, request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/sign-in', '/sign-up'],
};
