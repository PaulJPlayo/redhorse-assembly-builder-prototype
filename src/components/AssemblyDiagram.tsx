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
        .filter(Boolean)
    : [];

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

      <div className="mt-4 rounded-lg border border-surface bg-bg p-4">
        <svg
          viewBox="0 0 640 160"
          className="h-40 w-full"
          role="img"
          aria-label="Assembly diagram preview"
        >
          <rect x="120" y="72" width="400" height="16" rx="8" fill={hoseFill} />
          <rect x="160" y="66" width="40" height="28" rx="6" fill="#8a8a8a" />
          <rect x="440" y="66" width="40" height="28" rx="6" fill="#8a8a8a" />

          <g transform={`translate(120,80) rotate(${angleA * -1})`}>
            <rect x="-80" y="-14" width="80" height="28" rx="10" fill={endFill} />
            <rect x="-98" y="-8" width="18" height="16" rx="6" fill="#5d5d5d" />
          </g>

          <g transform={`translate(520,80) rotate(${angleB})`}>
            <rect x="0" y="-14" width="80" height="28" rx="10" fill={endFill} />
            <rect x="80" y="-8" width="18" height="16" rx="6" fill="#5d5d5d" />
          </g>

          <text x="120" y="130" textAnchor="middle" fontSize="12" fill="#363636">
            Hose End A
          </text>
          <text x="320" y="130" textAnchor="middle" fontSize="12" fill="#363636">
            Hose
          </text>
          <text x="520" y="130" textAnchor="middle" fontSize="12" fill="#363636">
            Hose End B
          </text>
        </svg>
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
