
import { useState } from 'react';

export function useStepNavigation() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const nextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep
  };
}
