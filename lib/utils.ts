import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { startOfMonth, endOfMonth } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStartOfWeek(
  date: Date,
  startDay: 'monday' | 'saturday',
): Date {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  const startDayIndex = startDay === 'monday' ? 1 : 6;

  let diff = dayOfWeek - startDayIndex;
  if (diff < 0) {
    diff += 7;
  }

  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function convertFieldsToNumber<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[],
): T {
  const newObj = { ...obj };
  for (const key of keys) {
    if (newObj[key] !== undefined && newObj[key] !== '') {
      newObj[key] = Number(newObj[key]) as any;
    }
  }
  return newObj;
}

export const normalize = (v: unknown) =>
  v === undefined || v === null ? '' : (v as string | number);

export const todayDateString = () => {
  const today = new Date().toISOString().slice(0, 10);
  return today;
};

export function formatDateForURL(date: Date): string {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split('T')[0];
}

export function getTodayInTimezone(timeZone: string = 'UTC'): string {
  const today = new Date();

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timeZone,
  });

  return formatter.format(today);
}

export function getMonthDateRangeInUTC(date: Date, timeZone: string) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const startDateUTC = fromZonedTime(start, timeZone);
  const endDateUTC = fromZonedTime(end, timeZone);

  return { startDateUTC, endDateUTC };
}
