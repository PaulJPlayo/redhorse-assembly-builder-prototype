"use client";

import type { StepDefinition } from "@/types/assembly";

interface StepperProps {
  steps: StepDefinition[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

const getStepState = (index: number, currentStep: number): "complete" | "current" | "upcoming" => {
  if (index < currentStep) {
    return "complete";
  }
  if (index === currentStep) {
    return "current";
  }
  return "upcoming";
};

const stateStyles: Record<ReturnType<typeof getStepState>, string> = {
  complete: "border-text bg-text text-white",
  current: "border-primary bg-white text-primary",
  upcoming: "border-border bg-white text-muted-text",
};

const labelStyles: Record<ReturnType<typeof getStepState>, string> = {
  complete: "text-text",
  current:
    "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary",
  upcoming: "text-muted-text",
};

export const Stepper = ({ steps, currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="w-full overflow-x-auto pb-3 pt-2">
      <div className="flex min-w-[900px] items-center gap-4 px-2">
        {steps.map((step, index) => {
          const state = getStepState(index, currentStep);
          const canClick = Boolean(onStepClick) && index <= currentStep;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => (canClick ? onStepClick?.(index) : undefined)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                canClick ? "hover:opacity-80" : "cursor-default"
              }`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-base font-semibold ${
                  stateStyles[state]
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`relative text-sm font-semibold uppercase tracking-[0.16em] ${labelStyles[state]}`}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
