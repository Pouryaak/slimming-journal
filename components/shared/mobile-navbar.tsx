// components/shared/mobile-navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, BarChart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function MobileNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/check-in', label: 'Check-in', icon: PlusCircle },
    { href: '/reports', label: 'Reports', icon: BarChart },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-background fixed bottom-0 w-full border-t">
      <div className="flex h-21 items-center justify-around pb-5">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/dashboard'
              ? pathname === link.href
              : pathname.startsWith(link.href);
          return (
            <Link
              href={link.href}
              key={link.label}
              className="flex h-full flex-1 items-center justify-center"
            >
              <Button
                variant="ghost"
                className={cn(
                  'flex h-full flex-col items-center gap-1 px-2 py-1',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <link.icon className="h-6 w-6" />
                <span className="text-xs">{link.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
