import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeeklyCheckin } from '@/lib/data/checkins';
import { Weight, Percent, Dumbbell, SquarePen } from 'lucide-react';
import Link from 'next/link';

interface WeeklyDetailsProps {
  checkin: WeeklyCheckin;
}

export function WeeklyDetailsCard({ checkin }: WeeklyDetailsProps) {
  const stats = [
    {
      label: 'Weight',
      value: `${checkin.weight_kg} kg`,
      icon: Weight,
    },
    {
      label: 'Body Fat',
      value: `${checkin.body_fat_percentage}%`,
      icon: Percent,
    },
    {
      label: 'Muscle Mass',
      value: `${checkin.muscle_mass_kg} kg`,
      icon: Dumbbell,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Summary</span>
          <Button variant="outline" asChild>
            <Link href={`/check-in/${checkin.date}?tab=weekly`}>
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
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <stat.icon className="text-muted-foreground h-5 w-5" />
                <span className="font-medium">{stat.label}</span>
              </div>
              <span className="text-muted-foreground font-mono">
                {stat.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
