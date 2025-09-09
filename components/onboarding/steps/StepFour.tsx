import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { StepProps } from '@/lib/validation/onboarding';
import Lottie from 'lottie-react';
import React from 'react';
import dietListAnimation from '@/public/animations/diet-list.json';

type WeekStart = 'saturday' | 'monday';

const StepThree = ({ form }: StepProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6">
      <div>
        <Lottie
          animationData={dietListAnimation}
          loop={true}
          className="h-48 w-48"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Choose how your week starts.
        </p>
      </div>

      <FormField
        control={form.control}
        name="weekStart"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Week starts on</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={cn(
                    'h-10 rounded border',
                    field.value === 'saturday'
                      ? 'border-[--color-border] bg-black/10'
                      : 'border-transparent bg-transparent',
                  )}
                  onClick={() =>
                    form.setValue('weekStart', 'saturday' as WeekStart)
                  }
                >
                  Saturday
                </button>
                <button
                  type="button"
                  className={cn(
                    'h-10 rounded border',
                    field.value === 'monday'
                      ? 'border-[--color-border] bg-black/10'
                      : 'border-transparent bg-transparent',
                  )}
                  onClick={() => form.setValue('weekStart', 'monday')}
                >
                  Monday
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
};

export default StepThree;
