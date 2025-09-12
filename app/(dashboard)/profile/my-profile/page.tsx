import { PageHeader } from '@/components/dashboard/profile/page-header';
import React from 'react';

const MyProfilePage = () => {
  return (
    <div className="p-4">
      <PageHeader title="My Profile" />

      <div className="text-muted-foreground text-center">
        <p>Profile update form will be here.</p>
      </div>
    </div>
  );
};

export default MyProfilePage;
