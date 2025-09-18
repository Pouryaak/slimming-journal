import { upsertDailyCheckin } from '@/lib/actions/checkins';
import { DailyCheckin } from '@/lib/data/checkins';
import { ProfileFormState } from '@/lib/data/profiles';
import React, { useActionState } from 'react';

const DailyCheckinForm = ({ checkin }: { checkin: DailyCheckin | null }) => {
  const initialState: ProfileFormState = null;
  const [state, formAction] = useActionState(upsertDailyCheckin, initialState);
  return <div>daily-checkin-form</div>;
};

export default DailyCheckinForm;
