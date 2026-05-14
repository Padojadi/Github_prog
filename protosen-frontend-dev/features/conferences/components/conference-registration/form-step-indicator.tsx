import React from "react";
import { CheckCircleIcon } from "lucide-react";

type Step = {
  id: number;
  label: string;
};

type StepIndicatorProps = {
  steps: readonly Step[];
  currentStep: number;
  totalSteps: number;
};

const FormStepIndicator = ({
  steps,
  currentStep,
  totalSteps,
}: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
                  ${
                    step.id <= currentStep
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 text-slate-400"
                  }`}
              >
                {step.id < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-check-big-icon lucide-circle-check-big"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                {step.label}
              </div>
            </div>
            {step.id < totalSteps && (
              <div
                className={`flex-grow h-0.5 mx-2 ${
                  step.id < currentStep ? "bg-primary" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormStepIndicator;
