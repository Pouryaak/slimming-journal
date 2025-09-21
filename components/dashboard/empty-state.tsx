// components/dashboard/empty-state.tsx
'use client'; // This component will have a button that eventually triggers a client-side action (opening a dialog)

import Lottie from 'lottie-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import sleepingAnimation from '@/public/animations/sleep.json';
import Link from 'next/link';

interface EmptyStateProps {
  name?: string | null;
  streak?: number;
}

export function EmptyState({ name = 'friend', streak = 0 }: EmptyStateProps) {
  const today = new Date().toISOString().slice(0, 10);
  const checkinUrl = `/check-in/${today}`;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-center text-center">
        <Lottie
          animationData={sleepingAnimation}
          loop={true}
          className="h-48 w-48"
        />
        <CardTitle className="text-2xl">
          Ready to log your day, {name}?
        </CardTitle>
        <CardDescription>Log your check-in to end your day.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button size="lg" asChild>
          <Link href={checkinUrl}>Do Today&apos;s Check-in</Link>
        </Button>
        <p className="text-muted-foreground text-sm">
          🔥 Current Streak: {streak} days
        </p>
      </CardContent>
    </Card>
  );
}
