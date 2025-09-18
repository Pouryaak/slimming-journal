'use client';

import { Calendar } from '@/components/ui/calendar';
import React, { useMemo, useState } from 'react';
import { PageHeader } from '../profile/page-header';
import { MonthlyCheckins } from '@/lib/actions/checkins';
import { Button } from '@/components/ui/button';
import { DailyDetailsCard } from './daily-details-card';
import { WeeklyDetailsCard } from './weekly-details-card';

interface CalendarViewProps {
  initialCheckins: MonthlyCheckins;
}

const CalendarView = ({ initialCheckins }: CalendarViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [monthlyCheckins, setMonthlyCheckins] = useState(initialCheckins);

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
    <div className="p-4">
      <div className="flex w-full flex-col items-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={modifiers}
          modifiersClassNames={{
            daily: 'day-with-daily-dot',
            weekly: 'day-with-weekly-dot',
          }}
          className="w-full rounded-md border"
        />

        <div className="mt-8 w-full max-w-md space-y-4">
          {selectedDateDailyEntries || selectedDateWeeklyEntries ? (
            <>
              {selectedDateDailyEntries && (
                <DailyDetailsCard checkin={selectedDateDailyEntries} />
              )}
              {selectedDateWeeklyEntries && (
                <WeeklyDetailsCard checkin={selectedDateWeeklyEntries} />
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No entry for this day.</p>
              <Button variant="outline" className="mt-4">
                Add Check-in
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
