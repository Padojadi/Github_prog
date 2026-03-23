export interface Step {
  id: number;
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ currentStep, steps }: StepperProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
      <ol className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const stepNumber = step.id;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li key={step.id} className="flex flex-col items-center">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full border-2
                  ${
                    isActive
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : isCompleted
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-muted bg-background"
                  }
                `}
              >
                {isCompleted ? "✓" : stepNumber}
              </div>
              <span
                className={`
                  mt-2 text-sm font-medium hidden md:inline-block
                  ${
                    isActive || isCompleted
                      ? "text-indigo-500"
                      : "text-muted-foreground"
                  }
                `}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
