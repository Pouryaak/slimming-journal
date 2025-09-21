// This is now a Server Component - no 'use client' needed.

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export function PageHeader({
  title,
  backLink = '/profile',
}: {
  title: string;
  backLink: string;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 flex-shrink-0"
        asChild
      >
        <Link href={backLink}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Profile</span>
        </Link>
      </Button>
      <h1 className="truncate text-xl font-bold">{title}</h1>
    </div>
  );
}
