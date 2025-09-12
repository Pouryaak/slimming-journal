'use client';

import Lottie from 'lottie-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { StatsCard } from './stats-card';
import { Flame, Target, Footprints, Droplets } from 'lucide-react';

import { Profile } from '@/lib/data/profiles';
import { DailyCheckin } from '@/lib/data/checkins';

// Import your downloaded Lottie animation
import successAnimation from '@/public/animations/done.json';

interface CheckedInStateProps {
  profile: Profile | null;
  todaysCheckin: DailyCheckin | null;
  // We'll calculate the real streak later.
  streak?: number;
}

export function CheckedInState({
  profile,
  todaysCheckin,
  streak = 0,
}: CheckedInStateProps) {
  if (!todaysCheckin || !profile) {
    return null;
  }

  const calorieDifference =
    todaysCheckin.calories_consumed -
    (todaysCheckin.calories_goal + todaysCheckin.calories_burned);
  const calorieDescription =
    calorieDifference <= 0
      ? `Under budget. Great job!`
      : `${calorieDifference} kcal over budget.`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="items-center text-center">
          <Lottie
            animationData={successAnimation}
            loop={false}
            className="h-40 w-40"
          />
          <CardTitle className="text-2xl">
            All done for today, {profile.name}!
          </CardTitle>
          <CardDescription>
            You&apos;ve logged your check-in. Keep up the great work.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Today&apos;s Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Calorie Deficit/Surplus"
            value={`${calorieDifference > 0 ? '+' : ''}${calorieDifference} kcal`}
            icon={Target}
            description={calorieDescription}
          />
          <StatsCard
            title="Calories Burned"
            value={todaysCheckin.calories_burned}
            icon={Flame}
            description="From workouts"
          />
          <StatsCard
            title="Steps"
            value={todaysCheckin.steps}
            icon={Footprints}
            description="Total for the day"
          />
          <StatsCard
            title="Water Intake"
            value={`${todaysCheckin.water_ml} ml`}
            icon={Droplets}
            description="Stay hydrated!"
          />
        </div>
      </div>
    </div>
  );
}
