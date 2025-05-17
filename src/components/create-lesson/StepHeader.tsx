
import React from 'react';
import { CheckCircle } from "lucide-react";

interface StepHeaderProps {
  currentStep: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({ currentStep }) => {
  return (
    <div className="grid grid-cols-8 mb-8">
      <div className={`relative p-2 text-center ${currentStep === 1 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 1 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        1. Škola
      </div>
      <div className={`relative p-2 text-center ${currentStep === 2 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 2 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        2. Prostředí
      </div>
      <div className={`relative p-2 text-center ${currentStep === 3 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 3 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        3. Přípravná
      </div>
      <div className={`relative p-2 text-center ${currentStep === 4 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 4 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        4. Hlavní
      </div>
      <div className={`relative p-2 text-center ${currentStep === 5 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 5 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        5. Závěrečná
      </div>
      <div className={`relative p-2 text-center ${currentStep === 6 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 6 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        6. Vybavení
      </div>
      <div className={`relative p-2 text-center ${currentStep === 7 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 7 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        7. Čas
      </div>
      <div className={`relative p-2 text-center ${currentStep === 8 ? "border-b-2 border-primary" : ""}`}>
        {currentStep > 8 && (
          <CheckCircle className="h-4 w-4 absolute top-0 right-0 text-green-500" />
        )}
        8. Role
      </div>
    </div>
  );
};

export default StepHeader;
