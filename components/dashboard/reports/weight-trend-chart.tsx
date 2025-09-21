// components/reports/weight-trend-chart.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

// Define the shape of the data this component expects
interface WeightDataPoint {
  date: string;
  weight_kg: number | null;
}

interface WeightTrendChartProps {
  data: WeightDataPoint[];
}

export function WeightTrendChart({ data }: WeightTrendChartProps) {
  // Recharts needs the data to be formatted for the X-axis labels
  const formattedData = data
    .filter((d) => d.weight_kg !== null && typeof d.weight_kg === 'number')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .map((item) => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));

  console.log(formattedData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Trend ( 3 months )</CardTitle>
        <CardDescription>
          Your weight progress from weekly check-ins.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" fontSize={12} tickMargin={8} />
              <YAxis
                domain={['auto', 'auto']}
                fontSize={12}
                tickFormatter={(v: number) => `${v}kg`}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--popover)',
                  border: `1px solid var(--border)`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 16px rgb(0 0 0 / 0.08)',
                }}
                labelStyle={{
                  color: 'var(--muted-foreground)',
                  fontWeight: 500,
                }}
                itemStyle={{
                  color: 'var(--light-accent-color)',
                  fontWeight: 600,
                }}
                formatter={(value: number) => [`${value} kg`, 'Weight']}
              />
              <Line
                type="monotone"
                dataKey="weight_kg"
                // Use a solid, known-good color to verify visibility
                stroke="var(--light-accent-color, #4f46e5)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls
                strokeLinecap="round"
                strokeLinejoin="round"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
