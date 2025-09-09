import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StepProps } from '@/lib/validation/onboarding';
import Lottie from 'lottie-react';
import React from 'react';
import weightLiftAnimation from '@/public/animations/weights-lift.json';

const StepFour = ({ form }: StepProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6">
      <div>
        <Lottie
          animationData={weightLiftAnimation}
          loop={true}
          className="h-48 w-48"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Your goal</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Set a target and weekly change.
        </p>
      </div>

      <FormField
        control={form.control}
        name="goalWeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Goal weight ({form.watch('unitSystem') === 'metric' ? 'kg' : 'lb'}
              )
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
        name="weeklyWeightGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Weekly change (
              {form.watch('unitSystem') === 'metric' ? 'kg/wk' : 'lb/wk'})
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="decimal"
                className="h-11"
                placeholder="-0.5"
                {...field}
                value={field.value as string | number}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
};

export default StepFour;
