import { CheckedInState } from '@/components/dashboard/checked-in-state';
import { EmptyState } from '@/components/dashboard/empty-state';
import { getAuthenticatedUser } from '@/lib/actions/auth';
import { getTodaysCheckin } from '@/lib/data/checkins';
import { getProfile } from '@/lib/data/profiles';
import React from 'react';

const DashboardPage = async () => {
  const user = await getAuthenticatedUser();

  if (!user) {
    return <div>User not found.</div>;
  }

  const [profile, todaysCheckin] = await Promise.all([
    getProfile(user.id),
    getTodaysCheckin(),
  ]);

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Good Morning, {profile.name || 'User'}!
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s your summary for today.
      </p>

      <div className="pt-4">
        {todaysCheckin ? (
          <CheckedInState profile={profile} todaysCheckin={todaysCheckin} />
        ) : (
          <EmptyState name={profile?.name} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
