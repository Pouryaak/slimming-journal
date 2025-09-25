export type ActionState<T> =
  | {
      status: 'success';
      message: string;
      data?: T;
    }
  | {
      status: 'error';
      error: string | { [key: string]: string[] | undefined };
    }
  | null;

export type WeeklyReportData = {
  userName: string;

  // Reporting window
  startDate: Date;
  endDate: Date;
  firstWeek: boolean;

  // Body metrics (current + week-over-week deltas)
  wt_now: number | null; // kg
  wt_delta: number | null; // kg (current - previous)
  bf_now: number | null; // %
  bf_delta: number | null; // percentage points (current - previous)
  muscle_now: number | null; // kg
  muscle_delta: number | null; // kg (current - previous)

  // Adherence aggregates over the window
  numDays: number; // number of days included in the window
  cal_ok_days: number; // days within ±10% of calorie target
  protein_avg: number; // g/day
  steps_avg: number; // steps/day
  water_avg_l: number; // liters/day
  fasting_avg_h: number; // hours/day
};
