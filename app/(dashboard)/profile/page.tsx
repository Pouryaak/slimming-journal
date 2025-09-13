import Link from 'next/link';
import { ChevronRight, User, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfilePage() {
  const menuItems = [
    {
      href: '/profile/my-profile',
      title: 'My Profile',
      description: 'Update your name, email, and password',
      icon: User,
    },
    {
      href: '/profile/goals',
      title: 'Goals',
      description: 'Manage your weight and nutrition targets',
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:bg-muted/50 flex items-center gap-4 p-4 transition-colors"
                >
                  <item.icon className="text-muted-foreground h-6 w-6" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="text-muted-foreground h-5 w-5" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
