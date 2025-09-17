import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
