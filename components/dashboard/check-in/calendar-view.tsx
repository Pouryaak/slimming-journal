'use client';

import { Calendar } from '@/components/ui/calendar';
import React, { useMemo, useState } from 'react';
import { MonthlyCheckins } from '@/lib/actions/checkins';
import { Button } from '@/components/ui/button';
import { DailyDetailsCard } from './daily-details-card';
import { WeeklyDetailsCard } from './weekly-details-card';
import Link from 'next/link';
import { formatDateForURL } from '@/lib/utils';

interface CalendarViewProps {
  initialCheckins: MonthlyCheckins;
}

const CalendarView = ({ initialCheckins }: CalendarViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [monthlyCheckins, setMonthlyCheckins] = useState(initialCheckins);

  const checkinUrl = (tab: 'daily' | 'weekly') =>
    date ? `/check-in/${formatDateForURL(date)}?tab=${tab}` : '#';

  const dailyDates = useMemo(
    () => monthlyCheckins.daily.map((c) => new Date(c.date)),
    [monthlyCheckins.daily],
  );
  console.log('DATES FOR MODIFIER:', dailyDates);
  const weeklyDates = useMemo(
    () => monthlyCheckins.weekly.map((c) => new Date(c.date)),
    [monthlyCheckins.weekly],
  );

  const modifiers = { daily: dailyDates, weekly: weeklyDates };
  const selectedDateDailyEntries = monthlyCheckins.daily.find(
    (c) => date && new Date(c.date).toDateString() === date.toDateString(),
  );
  const selectedDateWeeklyEntries = monthlyCheckins.weekly.find(
    (c) => date && new Date(c.date).toDateString() === date.toDateString(),
  );

  console.log(initialCheckins);

  return (
    <div>
      <div className="flex w-full flex-col items-center">
        <div className="w-full rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            modifiers={modifiers}
            modifiersClassNames={{
              daily: 'day-with-daily-dot',
              weekly: 'day-with-weekly-dot',
            }}
            className="w-full"
          />
        </div>

        <div className="mt-8 w-full max-w-md space-y-4">
          {!selectedDateDailyEntries && !selectedDateWeeklyEntries && (
            <p className="text-muted-foreground text-center">
              No entry for this day.
            </p>
          )}
          {selectedDateDailyEntries ? (
            <>
              <DailyDetailsCard checkin={selectedDateDailyEntries} />
            </>
          ) : (
            <div className="text-center">
              <Button size="lg" asChild className="mt-4">
                <Link href={checkinUrl('daily')}>Add Daily Check-in</Link>
              </Button>
            </div>
          )}
          {selectedDateWeeklyEntries ? (
            <>
              <WeeklyDetailsCard checkin={selectedDateWeeklyEntries} />
            </>
          ) : (
            <div className="text-center">
              {!selectedDateWeeklyEntries && (
                <Button size="lg" asChild className="mt-4">
                  <Link href={checkinUrl('weekly')}>Add Weekly Check-in</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
