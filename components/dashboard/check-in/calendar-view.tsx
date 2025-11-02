'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { MonthlyCheckins, getMonthlyCheckins } from '@/lib/actions/checkins';
import { formatDateForURL } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DailyDetailsCard } from './daily-details-card';
import { WeeklyDetailsCard } from './weekly-details-card';

interface CalendarViewProps {
  initialCheckins: MonthlyCheckins;
}

const CalendarView = ({ initialCheckins }: CalendarViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [monthlyCheckins, setMonthlyCheckins] = useState(initialCheckins);
  const [isLoading, setIsLoading] = useState(false);
  const initialMonthRef = useRef<Date>(new Date());

  // Fetch check-ins when month changes
  useEffect(() => {
    const fetchMonthData = async () => {
      // Check if it's the initial month
      const isInitialMonth =
        month.getMonth() === initialMonthRef.current.getMonth() &&
        month.getFullYear() === initialMonthRef.current.getFullYear();

      if (isInitialMonth) {
        // Restore initial check-ins when navigating back to the initial month
        setMonthlyCheckins(initialCheckins);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getMonthlyCheckins(null, month);
        setMonthlyCheckins(data);
      } catch (error) {
        console.error('Error fetching monthly checkins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthData();
  }, [month, initialCheckins]);

  const handleMonthChange = (newMonth: Date) => {
    setMonth(newMonth);
  };

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
            month={month}
            onMonthChange={handleMonthChange}
            modifiers={modifiers}
            modifiersClassNames={{
              daily: 'day-with-daily-dot',
              weekly: 'day-with-weekly-dot',
            }}
            className="w-full ![--cell-size:3rem]"
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
