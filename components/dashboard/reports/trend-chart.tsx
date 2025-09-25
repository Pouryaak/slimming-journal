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
import Lottie from 'lottie-react';
import noDataAnimation from '@/public/animations/no-data.json';

// Define the shape of the data this component expects
interface DataPoint {
  date: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  muscle_mass_kg: number | null;
}

interface TrendChartProps {
  data: DataPoint[];
  metricKey: 'weight_kg' | 'body_fat_percentage' | 'muscle_mass_kg';
  title: string;
  description: string;
  sign: string;
  popoverTitle: string;
}

export function TrendChart({
  data,
  metricKey,
  title,
  description,
  sign,
  popoverTitle,
}: TrendChartProps) {
  const formattedData = data
    .filter((d) => d[metricKey] !== null && typeof d[metricKey] === 'number')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .map((item) => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));

  if (formattedData.length < 2) {
    return (
      <Card className="mt-3">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 w-full flex-col items-center justify-center text-center">
            <Lottie
              animationData={noDataAnimation}
              loop={true}
              className="h-40 w-40"
            />
            <p className="text-muted-foreground mt-4">
              Not enough data to generate a trend chart yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full p-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" fontSize={12} tickMargin={8} />
              <YAxis
                domain={['auto', 'auto']}
                fontSize={12}
                tickFormatter={(v: number) => `${v}${sign}`}
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
                formatter={(value: number) => [
                  `${value} ${sign}`,
                  popoverTitle,
                ]}
              />
              <Line
                type="monotone"
                dataKey={metricKey}
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
