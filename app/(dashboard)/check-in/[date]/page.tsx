import DailyCheckinForm from '@/components/dashboard/check-in/daily-checkin-form';
import { getCheckinSpecificDate } from '@/lib/data/checkins';
import React from 'react';

const page = async ({ params }: { params: { date: string } }) => {
  const checkin = await getCheckinSpecificDate(params.date);
  return (
    <div>
      <DailyCheckinForm checkin={checkin} />
    </div>
  );
};

export default page;
