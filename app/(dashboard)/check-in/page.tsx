import CalendarView from '@/components/dashboard/check-in/calendar-view';
import { getMonthlyCheckins } from '@/lib/actions/checkins';
import React from 'react';

const Page = async () => {
  const initialCheckins = await getMonthlyCheckins(null, new Date());
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Check Ins</h1>

      <CalendarView initialCheckins={initialCheckins} />
    </div>
  );
};

export default Page;
