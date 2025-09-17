import { PageHeader } from '@/components/dashboard/profile/page-header';
import { ProfileForm } from '@/components/dashboard/profile/profile-form';
import { getAuthenticatedUser } from '@/lib/actions/auth';
import { getProfile } from '@/lib/data/profiles';
import React from 'react';

const MyProfilePage = async () => {
  const user = await getAuthenticatedUser();
  if (!user) {
    return <div>User not found.</div>;
  }

  const profile = await getProfile(user.id);

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  console.log('RAW PROFILE DATA FROM DB:', profile);

  return (
    <div className="p-4">
      <PageHeader title="My Profile" />

      <div className="text-muted-foreground text-center">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
};

export default MyProfilePage;
