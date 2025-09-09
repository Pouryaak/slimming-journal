import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { StepProps } from '@/lib/validation/onboarding';
import Lottie from 'lottie-react';
import React from 'react';
import weightScaleAnimation from '@/public/animations/weight-scale.json';

const StepTwo = ({ form }: StepProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6">
      <div>
        <Lottie
          animationData={weightScaleAnimation}
          loop={true}
          className="h-48 w-48"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Tell us about your body</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          We’ll use this to tailor your goals.
        </p>
      </div>

      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Height ({form.watch('unitSystem') === 'metric' ? 'cm' : 'in'})
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="decimal"
                className="h-11"
                {...field}
                value={field.value as string | number}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Weight ({form.watch('unitSystem') === 'metric' ? 'kg' : 'lb'})
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="decimal"
                className="h-11"
                {...field}
                value={field.value as string | number}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="unitSystem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Units</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={cn(
                    'h-10 rounded border',
                    field.value === 'metric'
                      ? 'border-[--color-border] bg-black/10'
                      : 'border-transparent bg-transparent',
                  )}
                  onClick={() => form.setValue('unitSystem', 'metric')}
                >
                  Metric
                </button>
                <button
                  type="button"
                  className={cn(
                    'h-10 rounded border',
                    field.value === 'imperial'
                      ? 'border-[--color-border] bg-black/10'
                      : 'border-transparent bg-transparent',
                  )}
                  onClick={() => form.setValue('unitSystem', 'imperial')}
                >
                  Imperial
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

export default StepTwo;
