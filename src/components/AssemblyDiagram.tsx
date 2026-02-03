"use client";

import React from "react";
import { useAssemblyStore } from "@/lib/state/useAssemblyStore";
import { mockCatalog } from "@/data/mockCatalog";

const findLabel = (list: { id: string; label: string }[], id?: string): string => {
  if (!id) {
    return "Select";
  }
  return list.find((item) => item.id === id)?.label ?? "Select";
};

const angleDegrees = (id?: string): number => {
  if (!id) {
    return 0;
  }
  return mockCatalog.hoseEndAngles.find((angle) => angle.id === id)?.degrees ?? 0;
};

const hoseColor = (id?: string): string => {
  switch (id) {
    case "black-nylon":
      return "#333333";
    case "blue":
      return "#1e4bd8";
    case "stainless":
      return "#c9c9c9";
    default:
      return "#d7d7d7";
  }
};

const endColor = (id?: string): string => {
  switch (id) {
    case "black":
      return "#333333";
    case "blue-red":
      return "#1e4bd8";
    case "clear":
      return "#e6e6e6";
    default:
      return "#bdbdbd";
  }
};

interface EndCapProps {
  label: string;
  angleText: string;
  color: string;
  position: "left" | "right";
}

const EndCap = ({ label, angleText, color, position }: EndCapProps) => (
  <div className="flex flex-col items-center gap-2 sm:w-32">
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
      {label}
    </span>
    <div
      className="relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-lg border border-border shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
      style={{ backgroundColor: color }}
    >
      <div
        className={`absolute ${position === "left" ? "left-1" : "right-1"} h-6 w-3 rounded-md bg-[#5d5d5d]`}
      />
      <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-text">
        {angleText}
      </span>
    </div>
  </div>
);

const HoseSegment = ({
  color,
  sizeLabel,
  lengthInches,
  minLength,
  maxLength,
}: {
  color: string;
  sizeLabel: string;
  lengthInches?: number;
  minLength: number;
  maxLength: number;
}) => {
  const ticks = Array.from({ length: 8 }, (_, index) => index);
  const range = maxLength - minLength || 1;
  const ratio =
    typeof lengthInches === "number"
      ? Math.min(Math.max((lengthInches - minLength) / range, 0), 1)
      : 0.5;
  const widthPercent = Math.round(20 + ratio * 80);
  const lengthLabel =
    typeof lengthInches === "number" ? `${lengthInches}` : "Length not selected";
  const lengthSuffix = typeof lengthInches === "number" ? "in" : "";

  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-text">
        Hose
      </span>
      <div className="w-full">
        <div className="mx-auto w-full" style={{ width: `${widthPercent}%` }}>
          <div className="relative flex w-full items-center gap-2">
            <div className="h-3 w-6 rounded-full bg-[#8a8a8a]" />
            <div
              className="h-4 flex-1 rounded-full border border-border shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
              style={{ backgroundColor: color }}
            />
            <div className="h-3 w-6 rounded-full bg-[#8a8a8a]" />
          </div>
          <div className="mt-2 flex w-full items-end justify-between">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="block h-3 w-px bg-[#a0a0a0]"
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-text">
        {sizeLabel !== "Select" ? sizeLabel : "Select size"}
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#363636]">
        Flare-to-Flare Length: {lengthLabel} {lengthSuffix}
      </span>
    </div>
  );
};

const ExtrasOverlay = ({ labels }: { labels: string[] }) => {
  if (!labels.length) {
    return null;
  }
  return (
    <div className="pointer-events-none absolute inset-3 rounded-lg border border-primary/30 bg-primary/5">
      <div className="flex flex-wrap items-start gap-2 p-3">
        {labels.map((label) => (
          <span
            key={label}
            className="rounded-full border border-primary/40 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const AssemblyDiagram = () => {
  const { state } = useAssemblyStore();
  const { selections } = state;

  const hoseTypeLabel = findLabel(mockCatalog.hoseTypes, selections.hoseTypeId);
  const hoseSizeLabel = findLabel(mockCatalog.hoseSizes, selections.hoseSizeId);
  const hoseColorLabel = findLabel(mockCatalog.hoseColors, selections.hoseColorId);
  const endStyleLabel = findLabel(mockCatalog.hoseEndStyles, selections.hoseEndStyleId);
  const endColorLabel = findLabel(mockCatalog.hoseEndColors, selections.hoseEndColorId);
  const angleALabel = findLabel(mockCatalog.hoseEndAngles, selections.hoseEndAngleAId);
  const angleBLabel = findLabel(mockCatalog.hoseEndAngles, selections.hoseEndAngleBId);

  const hoseFill = hoseColor(selections.hoseColorId);
  const endFill = endColor(selections.hoseEndColorId);
  const angleA = angleDegrees(selections.hoseEndAngleAId);
  const angleB = angleDegrees(selections.hoseEndAngleBId);

  const extrasLabels = selections.extras.length
    ? selections.extras
        .map((extraId) => mockCatalog.extras.find((extra) => extra.id === extraId)?.label)
        .filter((label): label is string => Boolean(label))
    : [];

  const hasSelections = Boolean(
    selections.hoseTypeId ||
      selections.hoseColorId ||
      selections.hoseSizeId ||
      selections.hoseEndStyleId ||
      selections.hoseEndColorId ||
      selections.hoseEndAngleAId ||
      selections.hoseEndAngleBId ||
      selections.lengthInches ||
      selections.extras.length,
  );

  const angleAText = selections.hoseEndAngleAId ? `${angleA}°` : "Angle";
  const angleBText = selections.hoseEndAngleBId ? `${angleB}°` : "Angle";


  return (
    <section className="rounded-xl border border-border bg-white p-5 shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
            Assembly Diagram
          </p>
          <h3 className="mt-1 text-lg font-semibold text-text">Live Configuration Preview</h3>
        </div>
        <div className="text-right text-xs font-semibold uppercase tracking-[0.2em] text-muted-text">
          {selections.lengthInches ? `${selections.lengthInches}\"` : "Length"}
        </div>
      </header>

      <div
        className="relative mt-4 rounded-lg border border-surface bg-[#f1f1f1] p-4"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(211,211,211,0.9) 45%, rgba(255,255,255,0.6) 70%, rgba(192,192,192,0.9) 100%), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%), repeating-linear-gradient(120deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 6px)",
          backgroundBlendMode: "overlay, screen, normal",
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <EndCap label="End A" angleText={angleAText} color={endFill} position="left" />
          <HoseSegment
            color={hoseFill}
            sizeLabel={hoseSizeLabel}
            lengthInches={selections.lengthInches}
            minLength={mockCatalog.length.min}
            maxLength={mockCatalog.length.max}
          />
          <EndCap label="End B" angleText={angleBText} color={endFill} position="right" />
        </div>

        <ExtrasOverlay labels={extrasLabels} />

        {!hasSelections ? (
          <div className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e82133]">
            Select options to preview the assembly
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 text-xs text-muted-text sm:grid-cols-2">
        <div>
          <p className="font-semibold uppercase tracking-[0.18em]">Hose End A</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {endStyleLabel} · {endColorLabel}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em]">{angleALabel}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.18em]">Hose End B</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {endStyleLabel} · {endColorLabel}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em]">{angleBLabel}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.18em]">Hose</p>
          <p className="mt-1 text-sm font-semibold text-text">
            {hoseTypeLabel}
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em]">
            {hoseSizeLabel} · {hoseColorLabel}
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.18em]">Extras</p>
          {extrasLabels.length ? (
            <div className="mt-1 flex flex-wrap gap-2">
              {extrasLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm font-semibold text-text">Select extras</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-text">
        Preview is illustrative
      </p>
    </section>
  );
};
