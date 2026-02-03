"use client";

import type { StepDefinition, SummaryRow } from "@/types/assembly";
import { Stepper } from "@/components/Stepper";
import { SummaryPanel } from "@/components/SummaryPanel";
import { AssemblyDiagram } from "@/components/AssemblyDiagram";

interface WizardAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface WizardShellProps {
  title: string;
  helper?: string;
  steps: StepDefinition[];
  currentStep: number;
  onStepClick?: (index: number) => void;
  primaryAction?: WizardAction;
  secondaryAction?: WizardAction;
  children: React.ReactNode;
  summaryRows: SummaryRow[];
  remainingCount: number;
}

export const WizardShell = ({
  title,
  helper,
  steps,
  currentStep,
  onStepClick,
  primaryAction,
  secondaryAction,
  children,
  summaryRows,
  remainingCount,
}: WizardShellProps) => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="flex w-full flex-col gap-6 px-6 pb-28 pt-6 lg:px-10 lg:pb-16 xl:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
              Redhorse Performance
            </p>
            <h1 className="mt-2 text-4xl font-bold uppercase tracking-[0.06em] text-text sm:text-5xl xl:text-6xl">
              Custom Hose Assembly Builder
            </h1>
            <p className="mt-2 text-sm text-muted-text">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </header>

        <div className="flex w-full justify-center">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="flex flex-col gap-6">
            <main className="rounded-xl border border-border bg-white p-7 shadow-[0_12px_26px_rgba(0,0,0,0.12)] lg:min-h-[calc(100vh-220px)]">
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
                  {steps[currentStep]?.label}
                </p>
                <h2 className="text-3xl font-bold uppercase tracking-[0.05em] text-text md:text-4xl xl:text-5xl">
                  {title}
                </h2>
                {helper ? <p className="text-sm text-muted-text">{helper}</p> : null}
              </div>

              <div className="mt-6">{children}</div>

              {(primaryAction || secondaryAction) && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {secondaryAction ? (
                    <button
                      type="button"
                      onClick={secondaryAction.onClick}
                      disabled={secondaryAction.disabled}
                      className={`w-full rounded-lg border px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto ${
                        secondaryAction.disabled
                          ? "border-border text-muted-text"
                          : "border-border bg-white text-text hover:bg-surface"
                      }`}
                    >
                      {secondaryAction.label}
                    </button>
                  ) : (
                    <span />
                  )}
                  {primaryAction ? (
                    <button
                      type="button"
                      onClick={primaryAction.onClick}
                      disabled={primaryAction.disabled}
                      className={`w-full rounded-lg px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto ${
                        primaryAction.disabled
                          ? "bg-surface text-muted-text"
                          : "bg-primary text-white hover:bg-[#c91b2b]"
                      }`}
                    >
                      {primaryAction.label}
                    </button>
                  ) : null}
                </div>
              )}
            </main>

            <div className="hidden lg:block">
              <AssemblyDiagram />
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <SummaryPanel rows={summaryRows} remainingCount={remainingCount} />
          </aside>
        </div>
      </div>
    </div>
  );
};
