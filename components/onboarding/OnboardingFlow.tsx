'use client';

import {
  FormInput,
  FormOutput,
  OnboardingSchema,
} from '@/lib/validation/onboarding';
import type { CarouselApi } from '@/components/ui/carousel';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext, // optional arrows if you want
  // CarouselPrevious,
} from '@/components/ui/carousel';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import { Button } from '../ui/button';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import StepFive from './steps/StepFive';
import { completeOnboarding } from '@/lib/actions/onboarding';
import { toast } from 'sonner';

const OnboardingFlow = () => {
  const [step, setStep] = React.useState(0);
  const [api, setApi] = React.useState<CarouselApi>();
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<FormInput>({
    resolver: zodResolver<FormInput, any, FormOutput>(OnboardingSchema),
    defaultValues: {
      name: '',
      unitSystem: 'metric',
      height: 170,
      weight: 70,
      goalWeight: 68,
      weeklyWeightGoal: -0.5,
      weekStart: 'monday',
    },
  });
  const stepFields: (keyof FormInput)[][] = [
    ['name'],
    ['height', 'weight', 'unitSystem'],
    ['goalWeight', 'weeklyWeightGoal'],
    ['weekStart'],
    [],
  ];

  interface StepProps {
    form: UseFormReturn<FormInput>;
  }

  const steps: {
    component: React.ComponentType<any>;
    props: Partial<StepProps>;
  }[] = [
    { component: StepOne, props: { form } },
    { component: StepTwo, props: { form } },
    { component: StepThree, props: { form } },
    { component: StepFour, props: { form } },
    { component: StepFive, props: {} },
  ];

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setStep(api.selectedScrollSnap());

    api.on('select', () => {
      setStep(api.selectedScrollSnap());
    });
  }, [api]);

  async function onNext(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const result = await form.trigger(stepFields[step]);
    if (!result) return;
    api?.scrollNext();
  }
  async function onSubmit(data: FormInput) {
    startTransition(async () => {
      const result = await completeOnboarding(data);

      if (result?.error) {
        toast.error('Something went wrong', {
          description: result.error,
        });
      }
    });
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {steps.map((stepItem, index) => (
                <CarouselItem key={index}>
                  <stepItem.component {...(stepItem.props as any)} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex w-full items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              disabled={step === 0}
              onClick={(e) => {
                e.preventDefault();
                api?.scrollPrev();
              }}
              size="lg"
            >
              Back
            </Button>
            {step === 4 ? (
              <Button size="lg" type="submit" disabled={isPending}>
                {isPending
                  ? 'Creating your account'
                  : `Let's start our journey 🚀`}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                disabled={step === 4}
                onClick={(e) => onNext(e)}
                type="button"
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OnboardingFlow;
