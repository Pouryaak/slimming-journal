'use client';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <OnboardingFlow />
      </div>
    </main>
  );
}
