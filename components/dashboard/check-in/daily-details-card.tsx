import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyCheckin } from '@/lib/data/checkins';
import {
  Flame,
  Footprints,
  Droplets,
  Target,
  Utensils,
  Dumbbell as Barbell,
  SquarePen,
} from 'lucide-react';
import Link from 'next/link';

interface DailyDetailsProps {
  checkin: DailyCheckin;
}
export function DailyDetailsCard({ checkin }: DailyDetailsProps) {
  const stats = [
    {
      label: 'Calories',
      value: `${checkin.calories_consumed?.toLocaleString()} / ${checkin.calories_goal?.toLocaleString()} kcal`,
      icon: Target,
      className:
        (checkin.calories_consumed ?? 0) > (checkin.calories_goal ?? 0)
          ? 'text-red-500'
          : 'text-green-500',
    },
    {
      label: 'Protein',
      value: `${checkin.protein_consumed_g} g`,
      icon: Barbell,
    },
    {
      label: 'Carbs',
      value: `${checkin.carbs_consumed_g} g`,
      icon: Utensils,
    },
    {
      label: 'Steps',
      value: checkin.steps?.toLocaleString(),
      icon: Footprints,
    },
    {
      label: 'Water',
      value: `${checkin.water_ml?.toLocaleString()} glasses`,
      icon: Droplets,
    },
    {
      label: 'Calories Burned',
      value: `${checkin.calories_burned?.toLocaleString()} kcal`,
      icon: Flame,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Summary</span>
          <Button variant="outline" asChild>
            <Link href={`/check-in/${checkin.date}?tab=daily`}>
              <SquarePen />
              Edit
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex items-center gap-3">
                <stat.icon className="text-muted-foreground h-5 w-5" />
                <span className="font-medium">{stat.label}</span>
              </div>
              <span
                className={`text-gray-400 ${stat.className ?? ''} font-mono`}
              >
                {stat.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
