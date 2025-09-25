'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyCheckinForm from '@/components/dashboard/check-in/daily-checkin-form';
import WeeklyCheckinForm from '@/components/dashboard/check-in/weekly-checkin-form';
import { useSearchParams, useRouter } from 'next/navigation';
import { Profile } from '@/lib/data/profiles';

export function CheckinTabs({
  checkins,
  date,
  profile,
}: {
  checkins: any;
  date: string;
  profile: Profile;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get('tab') ?? 'daily';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.replace(`?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="daily">Daily</TabsTrigger>
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
      </TabsList>

      <TabsContent value="daily">
        <DailyCheckinForm
          checkin={checkins?.daily ?? null}
          date={date}
          profile={profile}
        />
      </TabsContent>

      <TabsContent value="weekly">
        <WeeklyCheckinForm checkin={checkins?.weekly ?? null} date={date} />
      </TabsContent>
    </Tabs>
  );
}
