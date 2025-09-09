import Lottie from 'lottie-react';
import React from 'react';
import winnerAnimation from '@/public/animations/confetti.json';

const StepFive = () => {
  return (
    <section className="flex h-full flex-col items-center justify-center gap-6 p-5">
      <div>
        <Lottie
          animationData={winnerAnimation}
          loop={true}
          className="h-48 w-48"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Yohooo! All set!</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          We’ll save your preferences and take you to your dashboard.
        </p>
      </div>
    </section>
  );
};

export default StepFive;
