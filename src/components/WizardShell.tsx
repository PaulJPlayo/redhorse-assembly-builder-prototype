"use client";

import Image from "next/image";
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
      <div className="flex min-h-[100dvh] w-full flex-col gap-6 px-6 pb-3 pt-6 sm:pb-6 lg:px-10 lg:pb-16 xl:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <a
              href="https://www.redhorseperformance.com/"
              aria-label="Go to Redhorse Performance"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Image
                src="/brand/redhorse-logo.png"
                alt="Redhorse Performance"
                width={300}
                height={40}
                priority
                className="h-6 w-auto max-w-[min(74vw,300px)] sm:h-7"
              />
            </a>
            <p className="sr-only">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </header>

        <div className="flex w-full justify-center">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
        </div>

        <div className="grid min-h-0 items-start gap-5 lg:gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="flex min-w-0 flex-col gap-3 lg:gap-4">
            <main className="flex w-full min-w-0 max-w-full flex-col overflow-visible rounded-xl border border-border bg-white p-4 shadow-[0_12px_26px_rgba(0,0,0,0.12)] sm:p-7">
              <div className="sr-only">
                <p>{steps[currentStep]?.label}</p>
                <h2>{title}</h2>
                {helper ? <p>{helper}</p> : null}
              </div>

              <div className="min-w-0">{children}</div>

              {(primaryAction || secondaryAction) && (
                <div className="mt-4 flex w-full min-w-0 max-w-full flex-col gap-3 border-t border-border pt-3 pb-[calc(8px+env(safe-area-inset-bottom))] sm:mt-6 sm:border-t-0 sm:pb-0 sm:pt-0 sm:flex-row sm:items-center sm:justify-between">
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

            <div className="lg:hidden">
              <AssemblyDiagram />
            </div>

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
