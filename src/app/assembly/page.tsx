"use client";

import Image from "next/image";
import { useMemo } from "react";
import { WizardShell } from "@/components/WizardShell";
import { OptionGrid } from "@/components/OptionGrid";
import { OptionCard } from "@/components/OptionCard";
import { ASSEMBLY_STEPS, type StepId } from "@/types/assembly";
import { AssemblyProvider, useAssemblyStore } from "@/lib/state/useAssemblyStore";
import { bcClient } from "@/lib/bc/bcClient";
import {
  buildSummaryRows,
  calculateRemainingConfigurations,
  formatCurrency,
} from "@/lib/rules/filterCatalog";
import { deriveNextOptions, isStepComplete } from "@/lib/rules/deriveNextOptions";
import {
  getHoseEndAngleImageSrc,
  getHoseEndColorImageSrc,
  getHoseEndStyleImageSrc,
  getHoseTypeImageSrc,
} from "@/lib/assembly/imageResolver";
import assemblyLengthImage from "@/assets/reference/assembly-length.png";

const catalog = bcClient.getCatalog();

const StepContent = () => {
  const { state, dispatch } = useAssemblyStore();
  const step = ASSEMBLY_STEPS[state.stepIndex];
  const stepOptions = useMemo(
    () => deriveNextOptions(catalog, state.selections, step.id),
    [state.selections, step.id],
  );

  const summaryRows = useMemo(
    () => buildSummaryRows(catalog, state.selections),
    [state.selections],
  );
  const remainingCount = useMemo(
    () => calculateRemainingConfigurations(catalog, state.selections),
    [state.selections],
  );

  const canProceed = isStepComplete(step.id, state.selections);
  const isLastStep = state.stepIndex === ASSEMBLY_STEPS.length - 1;

  const handleNext = () => {
    if (!canProceed) {
      return;
    }
    if (isLastStep) {
      dispatch({ type: "SHOW_SUMMARY", value: true });
      return;
    }
    dispatch({ type: "NEXT_STEP" });
  };

  const handleBack = () => {
    if (state.showSummary) {
      dispatch({ type: "SHOW_SUMMARY", value: false });
      return;
    }
    dispatch({ type: "PREV_STEP" });
  };

  const handleReset = () => dispatch({ type: "RESET" });

  const handleStepClick = (index: number) => {
    if (index <= state.stepIndex) {
      dispatch({ type: "GO_TO_STEP", index });
    }
  };

  const renderOptions = (stepId: StepId) => {
    const useDesktopCarousel = stepOptions.options.length > 4;
    const selectedHoseTypeId = state.selections.hoseTypeId;
    const selectedHoseType = selectedHoseTypeId
      ? catalog.hoseTypes.find((hoseType) => hoseType.id === selectedHoseTypeId)
      : undefined;
    const selectedEndStyleId = state.selections.hoseEndStyleId;
    const selectedEndStyle = selectedEndStyleId
      ? catalog.hoseEndStyles.find((style) => style.id === selectedEndStyleId)
      : undefined;
    const selectedEndColorId = state.selections.hoseEndColorId;
    const selectedEndColor = selectedEndColorId
      ? catalog.hoseEndColors.find((color) => color.id === selectedEndColorId)
      : undefined;
    const selectedHoseTypeImageSrc = selectedHoseTypeId
      ? getHoseTypeImageSrc(selectedHoseTypeId)
      : undefined;

    return (
      <div key={stepId} className="w-full min-w-0 max-w-full">
        <OptionGrid
          className={useDesktopCarousel ? undefined : stepOptions.gridClassName}
          desktopCarousel={useDesktopCarousel}
        >
          {stepOptions.options.map((option, index) => {
            const disabled = "disabled" in option ? option.disabled : false;
            const priceLabel = option.price ? `+${formatCurrency(option.price)}` : undefined;
            const imageSrc =
              stepId === "hoseType"
                ? getHoseTypeImageSrc(option.id)
                : stepId === "hoseSize"
                  ? selectedHoseTypeImageSrc
                  : stepId === "hoseEndStyle"
                    ? getHoseEndStyleImageSrc(option.id)
                    : stepId === "hoseEndColor"
                      ? getHoseEndColorImageSrc(selectedEndStyleId, option.id)
                      : stepId === "hoseEndAngleA"
                        ? getHoseEndAngleImageSrc(selectedEndStyleId, selectedEndColorId, option)
                  : undefined;
            const imageAlt =
              stepId === "hoseType"
                ? `${option.label} photo`
                : stepId === "hoseSize" && imageSrc
                  ? `Hose preview for ${selectedHoseType?.label ?? selectedHoseTypeId ?? "unknown"} (${option.id})`
                  : stepId === "hoseEndStyle" && imageSrc
                    ? `${option.label} photo`
                    : stepId === "hoseEndColor" && imageSrc
                      ? `${option.label} color for ${selectedEndStyle?.label ?? selectedEndStyleId ?? "unknown style"}`
                      : stepId === "hoseEndAngleA" && imageSrc
                        ? `${option.label} angle in ${selectedEndColor?.label ?? selectedEndColorId ?? "selected color"} for ${selectedEndStyle?.label ?? selectedEndStyleId ?? "unknown style"}`
                  : undefined;

            const selectedId = {
              hoseType: state.selections.hoseTypeId,
              hoseColor: state.selections.hoseColorId,
              hoseSize: state.selections.hoseSizeId,
              hoseEndStyle: state.selections.hoseEndStyleId,
              hoseEndColor: state.selections.hoseEndColorId,
              hoseEndAngleA: state.selections.hoseEndAngleAId,
              hoseEndAngleB: state.selections.hoseEndAngleBId,
              extras: undefined,
              assemblyLength: undefined,
            }[stepId];

            const selected =
              stepId === "extras"
                ? state.selections.extras.includes(option.id)
                : selectedId === option.id;

            const onSelect = () => {
              switch (stepId) {
                case "hoseType":
                  dispatch({ type: "SELECT_HOSE_TYPE", id: option.id });
                  break;
                case "hoseColor":
                  dispatch({ type: "SELECT_HOSE_COLOR", id: option.id });
                  break;
                case "hoseSize":
                  dispatch({ type: "SELECT_HOSE_SIZE", id: option.id });
                  break;
                case "hoseEndStyle":
                  dispatch({ type: "SELECT_HOSE_END_STYLE", id: option.id });
                  break;
                case "hoseEndColor":
                  dispatch({ type: "SELECT_HOSE_END_COLOR", id: option.id });
                  break;
                case "hoseEndAngleA":
                  dispatch({ type: "SELECT_HOSE_END_ANGLE_A", id: option.id });
                  break;
                case "hoseEndAngleB":
                  dispatch({ type: "SELECT_HOSE_END_ANGLE_B", id: option.id });
                  break;
                case "extras":
                  dispatch({ type: "TOGGLE_EXTRA", id: option.id });
                  break;
                default:
                  break;
              }
            };

            return (
              <div
                key={option.id}
                className={`h-[216px] max-w-[min(360px,calc(100vw-56px))] shrink-0 basis-[86%] snap-start animate-fade-up sm:h-auto ${
                  useDesktopCarousel
                    ? "sm:shrink-0 sm:basis-[calc((100%_-_3rem)/4)] sm:max-w-[calc((100%_-_3rem)/4)] sm:snap-start"
                    : "sm:max-w-none sm:basis-auto sm:shrink sm:snap-none"
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <OptionCard
                  title={option.label}
                  subtitle={option.description}
                  selected={selected}
                  disabled={Boolean(disabled)}
                  onSelect={onSelect}
                  priceLabel={priceLabel}
                  imageSrc={imageSrc}
                  imageAlt={imageAlt}
                />
              </div>
            );
          })}
        </OptionGrid>
      </div>
    );
  };

  const renderLengthInput = () => {
    const { lengthRule } = stepOptions;
    if (!lengthRule) {
      return null;
    }

    const value = state.selections.lengthInches;
    const hasValue = typeof value === "number" && !Number.isNaN(value);
    const stepFactor = 1 / lengthRule.step;
    const isValid =
      hasValue &&
      value >= lengthRule.min &&
      value <= lengthRule.max &&
      Math.abs(Math.round(value * stepFactor) - value * stepFactor) < 1e-6;

    return (
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Image
            src={assemblyLengthImage}
            alt="Assembly length diagram"
            className="h-auto w-full rounded-xl border border-border bg-white"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div className="rounded-xl border border-border bg-white px-6 py-8 text-center shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
              Length (flare to flare)
            </p>
            <p className="mt-3 text-5xl font-bold text-text">
              {hasValue ? value.toFixed(1).replace(/\.0$/, "") : "--"}
              <span className="text-2xl">{lengthRule.unit}</span>
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
              Enter length in inches
            </label>
            <input
              type="number"
              min={lengthRule.min}
              max={lengthRule.max}
              step={lengthRule.step}
              value={value ?? ""}
              onChange={(event) => {
                const nextValue = event.target.value;
                if (nextValue === "") {
                  dispatch({ type: "SET_LENGTH", length: undefined });
                  return;
                }
                dispatch({ type: "SET_LENGTH", length: Number(nextValue) });
              }}
              className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-lg font-semibold text-text shadow-[0_8px_18px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-2 text-xs text-muted-text">
              Range {lengthRule.min}&quot; - {lengthRule.max}&quot; in {lengthRule.step}&quot;
              increments.
            </p>
            {!isValid && hasValue ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Enter a valid length.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const totalRow = summaryRows.find((row) => row.emphasize);
    const rows = summaryRows.filter((row) => !row.emphasize);

    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-white p-6 shadow-[0_12px_26px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-[minmax(92px,1fr)_minmax(0,1.35fr)_minmax(86px,1fr)] border-b border-surface text-xs font-semibold uppercase tracking-[0.2em] text-muted-text sm:grid-cols-[160px_1fr_120px]">
            <div className="min-w-0 p-3"> </div>
            <div className="min-w-0 p-3"> </div>
            <div className="min-w-0 p-3 text-right">SKU</div>
          </div>
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[minmax(92px,1fr)_minmax(0,1.35fr)_minmax(86px,1fr)] border-b border-surface text-sm sm:grid-cols-[160px_1fr_120px]"
            >
              <div className="min-w-0 p-3 font-semibold uppercase text-muted-text">{row.label}</div>
              <div className="min-w-0 p-3 break-words text-text">{row.value}</div>
              <div className="min-w-0 max-w-full break-all p-3 text-right font-mono text-[11px] text-text">
                {row.sku ?? ""}
              </div>
            </div>
          ))}
          {totalRow ? (
            <div className="grid grid-cols-[minmax(92px,1fr)_minmax(0,1.35fr)_minmax(86px,1fr)] border border-primary/20 bg-accent text-sm font-semibold sm:grid-cols-[160px_1fr_120px]">
              <div className="min-w-0 p-3 uppercase text-text">{totalRow.label}</div>
              <div className="min-w-0 p-3 text-text"> </div>
              <div className="min-w-0 p-3 text-right text-text">{totalRow.value}</div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => dispatch({ type: "SHOW_SUMMARY", value: false })}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-text transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Edit Configuration
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-muted-text transition hover:border-primary hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  const primaryAction = state.showSummary
    ? undefined
    : {
        label: isLastStep ? "Review Summary" : "Next Step",
        onClick: handleNext,
        disabled: !canProceed,
      };

  const secondaryAction =
    state.showSummary || state.stepIndex === 0
      ? undefined
      : {
          label: "Back",
          onClick: handleBack,
        };

  return (
    <WizardShell
      title={state.showSummary ? "Assembly Summary" : stepOptions.definition.title}
      helper={state.showSummary ? undefined : stepOptions.helper}
      steps={ASSEMBLY_STEPS}
      currentStep={state.stepIndex}
      onStepClick={handleStepClick}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      summaryRows={summaryRows}
      remainingCount={remainingCount}
    >
      {state.showSummary ? (
        renderSummary()
      ) : stepOptions.stepId === "assemblyLength" ? (
        renderLengthInput()
      ) : (
        renderOptions(stepOptions.stepId)
      )}
    </WizardShell>
  );
};

export default function AssemblyPage() {
  return (
    <AssemblyProvider>
      <StepContent />
    </AssemblyProvider>
  );
}
