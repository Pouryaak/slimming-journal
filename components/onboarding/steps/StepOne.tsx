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
import welcomeAnimation from '@/public/animations/welcome-animation.json';

const StepOne = ({ form }: StepProps) => {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6">
      <div>
        <Lottie
          animationData={welcomeAnimation}
          loop={true}
          className="h-65 w-65"
        />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-semibold">Welcome!</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Let’s personalize your Daily Calorie Journal.
        </p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your name</FormLabel>
            <FormControl>
              <Input
                className="h-11"
                placeholder="e.g., Alex"
                autoComplete="name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="h-10" />
    </section>
  );
};

export default StepOne;
