// app/(dashboard)/reports/page.tsx
import { PageHeader } from '@/components/dashboard/profile/page-header';
import { getWeightTrendData } from '@/lib/data/checkins';
import { WeightTrendChart } from '@/components/dashboard/reports/weight-trend-chart';

export default async function ReportsPage() {
  const weightData = await getWeightTrendData();

  return (
    <div className="p-4">
      <PageHeader title="My Progress" backLink="/" />
      <div className="mt-6">
        <WeightTrendChart data={weightData} />
      </div>
    </div>
  );
}
