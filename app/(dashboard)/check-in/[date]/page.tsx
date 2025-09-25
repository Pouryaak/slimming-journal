import { CheckinTabs } from '@/components/dashboard/check-in/checkin-tabs';
import { PageHeader } from '@/components/dashboard/profile/page-header';
import { getAuthenticatedUser } from '@/lib/actions/auth';

import { getCheckinSpecificDate } from '@/lib/data/checkins';
import { getProfile } from '@/lib/data/profiles';
import React from 'react';

const page = async ({ params }: { params: { date: string } }) => {
  const checkins = await getCheckinSpecificDate(params.date);
  const date = params.date;

  const user = await getAuthenticatedUser();
  if (!user) {
    return <div>User not found.</div>;
  }

  const profile = await getProfile(user.id);

  if (!profile) {
    return <div>Profile not found.</div>;
  }

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

      <CheckinTabs checkins={checkins} date={date} profile={profile} />
    </div>
  );
};

export default page;
