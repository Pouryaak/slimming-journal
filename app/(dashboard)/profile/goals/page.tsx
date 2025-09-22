import GoalsForm from '@/components/dashboard/profile/goals-form';
import { PageHeader } from '@/components/dashboard/profile/page-header';
import { getAuthenticatedUser } from '@/lib/actions/auth';
import { getProfile } from '@/lib/data/profiles';
import React from 'react';

const GoalsPage = async () => {
  const user = await getAuthenticatedUser();
  if (!user) {
    return <div>User not found.</div>;
  }

  const profile = await getProfile(user.id);

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="p-4">
      <PageHeader title="Goals" backLink="/profile" />

      <div className="text-muted-foreground text-center">
        <GoalsForm profile={profile} />
      </div>
    </div>
  );
};

export default GoalsPage;
