// app/(dashboard)/reports/page.tsx
import { PageHeader } from '@/components/dashboard/profile/page-header';
import { getWeightTrendData } from '@/lib/data/checkins';
import { TrendChart } from '@/components/dashboard/reports/trend-chart';

export default async function ReportsPage() {
  const weightData = await getWeightTrendData();

  return (
    <div className="p-4">
      <PageHeader title="My Progress" backLink="/" />
      <div className="mt-6">
        <TrendChart
          data={weightData}
          metricKey="weight_kg"
          title="Weight Trend ( 3 months )"
          description="Your weight progress from weekly check-ins"
          sign="kg"
          popoverTitle="Weight"
        />
        <TrendChart
          data={weightData}
          metricKey="body_fat_percentage"
          title="Body Fat Percentage Trend ( 3 months )"
          description="Your body fat percentage progress from weekly check-ins"
          sign="%"
          popoverTitle="Body Fat Percentage"
        />
        <TrendChart
          data={weightData}
          metricKey="muscle_mass_kg"
          title="Muscle Mass Trend ( 3 months )"
          description="Your muscle mass progress from weekly check-ins"
          sign="kg"
          popoverTitle="Muscle Mass"
        />
      </div>
    </div>
  );
}
