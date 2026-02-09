"use client";

import Image from "next/image";
import { useState } from "react";
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
  const [diagramExpanded, setDiagramExpanded] = useState(true);
  const mobileDockHeight = diagramExpanded
    ? "h-[clamp(260px,40dvh,520px)]"
    : "h-[clamp(140px,18dvh,180px)]";

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex min-h-[100dvh] w-full flex-col gap-6 px-6 pb-6 pt-6 lg:px-10 lg:pb-16 xl:px-12">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Image
              src="/brand/redhorse-logo.png"
              alt="Redhorse Performance"
              width={300}
              height={40}
              priority
              className="h-6 w-auto max-w-[min(74vw,300px)] sm:h-7"
            />
            <p className="sr-only">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </header>

        <div className="flex w-full justify-center">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={onStepClick} />
        </div>

        <div className="grid min-h-0 flex-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="flex min-h-0 min-w-0 flex-col gap-4 lg:gap-6">
            <main className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-y-auto rounded-xl border border-border bg-white p-4 shadow-[0_12px_26px_rgba(0,0,0,0.12)] sm:p-7 lg:min-h-[calc(100vh-220px)] lg:overflow-visible">
              <div className="sr-only">
                <p>{steps[currentStep]?.label}</p>
                <h2>{title}</h2>
                {helper ? <p>{helper}</p> : null}
              </div>

              <div
                className={`min-w-0 ${
                  primaryAction || secondaryAction ? "pb-20 sm:pb-0" : ""
                }`}
              >
                {children}
              </div>

              {(primaryAction || secondaryAction) && (
                <div className="sticky bottom-0 z-[60] mt-8 flex w-full min-w-0 max-w-full flex-col gap-3 border-t border-border bg-white/95 px-2 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:static sm:z-auto sm:border-t-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0 sm:backdrop-blur-none sm:flex-row sm:items-center sm:justify-between">
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
              <section
                className={`flex h-full w-full min-w-0 max-w-full shrink-0 flex-col overflow-hidden border-t border-border bg-[#f1f1f1] pb-[env(safe-area-inset-bottom)] transition-[height] duration-200 ease-out ${mobileDockHeight}`}
              >
                <div className="flex items-center justify-between border-b border-border bg-white/85 px-4 py-2 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
                    Assembly Diagram
                  </p>
                  <button
                    type="button"
                    onClick={() => setDiagramExpanded((prev) => !prev)}
                    className="rounded-md border border-border bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text transition hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    {diagramExpanded ? "Collapse" : "Expand"}
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-2">
                  <AssemblyDiagram />
                </div>
              </section>
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
