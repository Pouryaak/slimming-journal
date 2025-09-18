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
