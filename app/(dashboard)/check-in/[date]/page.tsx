import { CheckinTabs } from '@/components/dashboard/check-in/checkin-tabs';
import { PageHeader } from '@/components/dashboard/profile/page-header';

import { getCheckinSpecificDate } from '@/lib/data/checkins';
import React from 'react';

const page = async ({ params }: { params: { date: string } }) => {
  const checkins = await getCheckinSpecificDate(params.date);
  const date = params.date;

  return (
    <div className="space-y-6 p-4">
      <PageHeader
        backLink="/check-in"
        title={`Check-in for ${new Date(date).toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}`}
      />

      <CheckinTabs checkins={checkins} date={date} />
    </div>
  );
};

export default page;
