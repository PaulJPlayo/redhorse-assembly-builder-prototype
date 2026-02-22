"use client";

import React from "react";
import { useAssemblyStore } from "@/lib/state/useAssemblyStore";
import { mockCatalog } from "@/data/mockCatalog";
import { getHoseEndStyleImageSrc, getHoseTypeImageSrc } from "@/lib/assembly/imageResolver";

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
    case "nylon":
    case "black":
      return "#333333";
    case "black-poly-carbon-lined":
      return "#202428";
    case "black-poly-non-carbon-lined":
      return "#1f1f1f";
    case "blue":
      return "#1e4bd8";
    case "stainless":
    case "stainless-carbon-lined":
    case "stainless-non-carbon-lined":
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

const extraChipAccent = (label: string): string => {
  const normalized = label.toLowerCase();
  if (/heat|shield|sleeve|fire/.test(normalized)) {
    return "#e82133";
  }
  if (/coil|support/.test(normalized)) {
    return "#5b5b5b";
  }
  if (/clamp|clip|fitting/.test(normalized)) {
    return "#454545";
  }
  return "#8a8a8a";
};

const getHoseTextureStyle = (
  hoseTypeId: string | undefined,
  baseColor: string,
  hoseHasImage: boolean,
): React.CSSProperties | undefined => {
  if (!hoseTypeId || !hoseHasImage) {
    return undefined;
  }

  if (hoseTypeId === "hose-200" || hoseTypeId === "hose-205") {
    return {
      backgroundColor: baseColor,
      backgroundImage:
        "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.2) 100%), repeating-linear-gradient(120deg, rgba(238,238,238,0.42) 0 2px, rgba(82,82,82,0.35) 2px 4px), repeating-linear-gradient(60deg, rgba(238,238,238,0.28) 0 2px, rgba(58,58,58,0.28) 2px 4px)",
      backgroundBlendMode: "screen, overlay, overlay",
    };
  }

  if (hoseTypeId === "hose-230" || hoseTypeId === "hose-235") {
    return {
      backgroundColor: baseColor,
      backgroundImage:
        "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 50%, rgba(255,255,255,0.05) 100%), repeating-linear-gradient(115deg, rgba(255,255,255,0.09) 0 2px, rgba(0,0,0,0.32) 2px 4px), repeating-linear-gradient(65deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0.28) 2px 4px)",
      backgroundBlendMode: "multiply, overlay, overlay",
    };
  }

  if (
    hoseTypeId === "hose-302" ||
    hoseTypeId === "hose-303" ||
    hoseTypeId === "hose-304" ||
    hoseTypeId === "hose-305"
  ) {
    return {
      backgroundColor: baseColor,
      backgroundImage:
        "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.22) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 5px, rgba(0,0,0,0.09) 5px 10px)",
      backgroundBlendMode: "screen, overlay",
    };
  }

  if (hoseTypeId === "hose-401" || hoseTypeId === "hose-402") {
    return {
      backgroundColor: baseColor,
      backgroundImage:
        "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 35%, rgba(0,0,0,0.26) 100%), linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.08) 100%)",
      backgroundBlendMode: "screen, normal",
    };
  }

  return undefined;
};

type EndCapVariant =
  | "default"
  | "series1000"
  | "series6000NonSwivel"
  | "series1490"
  | "series7000"
  | "series1200"
  | "series2000";

interface EndCapVariantConfig {
  bodyClassName: string;
  neckClassName: string;
  bodyStyle: React.CSSProperties;
  arcClassName: string;
  pointerClassName: string;
  showSwivelRing?: boolean;
  showDualBands?: boolean;
  showKnurl?: boolean;
}

const getEndCapVariant = (
  endStyleId: string | undefined,
  endStyleLabel: string | undefined,
  endStyleHasImage: boolean,
): EndCapVariant => {
  if (!endStyleId || !endStyleHasImage) {
    return "default";
  }

  if (endStyleId === "1000") {
    return "series1000";
  }
  if (endStyleId === "6000") {
    return endStyleLabel?.toLowerCase().includes("non-swivel")
      ? "series6000NonSwivel"
      : "series1000";
  }
  if (endStyleId === "1490") {
    return "series1490";
  }
  if (endStyleId === "7000" || endStyleId === "7002") {
    return "series7000";
  }
  if (endStyleId === "1200") {
    return "series1200";
  }
  if (endStyleId === "2000") {
    return "series2000";
  }
  return "default";
};

const getEndCapVariantConfig = (variant: EndCapVariant, color: string): EndCapVariantConfig => {
  const defaultConfig: EndCapVariantConfig = {
    bodyClassName:
      "relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-lg border border-border shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-14",
    neckClassName: "h-6 w-3 rounded-md bg-[#5d5d5d]",
    bodyStyle: { backgroundColor: color },
    arcClassName: "inset-x-3 bottom-1 h-5",
    pointerClassName: "bottom-1 h-4",
  };

  if (variant === "series1000") {
    return {
      bodyClassName:
        "relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-xl border border-[#5a5a5a]/70 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-14",
      neckClassName: "h-6 w-3.5 rounded-full bg-[#565656]",
      bodyStyle: {
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 45%, rgba(0,0,0,0.16) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 4px, rgba(0,0,0,0.14) 4px 8px)",
        backgroundBlendMode: "screen, overlay",
      },
      arcClassName: "inset-x-3 bottom-1 h-5",
      pointerClassName: "bottom-1 h-4",
      showSwivelRing: true,
    };
  }

  if (variant === "series6000NonSwivel") {
    return {
      bodyClassName:
        "relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-md border border-[#505050]/70 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-14",
      neckClassName: "h-5 w-4 rounded-[4px] bg-[#4f4f4f]",
      bodyStyle: {
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.2) 100%), linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.12) 100%)",
        backgroundBlendMode: "screen, normal",
      },
      arcClassName: "inset-x-3 bottom-1 h-5",
      pointerClassName: "bottom-1 h-4",
    };
  }

  if (variant === "series1490") {
    return {
      bodyClassName:
        "relative flex h-10 w-full max-w-[140px] items-center justify-center rounded-md border border-[#555555]/70 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-11",
      neckClassName: "h-4 w-4 rounded-[3px] bg-[#4a4a4a] sm:h-5",
      bodyStyle: {
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.24) 100%)",
      },
      arcClassName: "inset-x-3 bottom-0.5 h-4",
      pointerClassName: "bottom-0.5 h-3",
      showDualBands: true,
    };
  }

  if (variant === "series7000") {
    return {
      bodyClassName:
        "relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-lg border border-[#3f3f3f]/80 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-14",
      neckClassName: "h-6 w-3 rounded-md bg-[#3d3d3d]",
      bodyStyle: {
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.24) 100%), linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.18) 100%)",
        backgroundBlendMode: "screen, normal",
      },
      arcClassName: "inset-x-3 bottom-1 h-5",
      pointerClassName: "bottom-1 h-4",
      showDualBands: true,
    };
  }

  if (variant === "series1200") {
    return {
      bodyClassName:
        "relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-lg border border-[#5d5d5d]/70 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-14",
      neckClassName: "h-6 w-3 rounded-md bg-[#626262]",
      bodyStyle: {
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.2) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0 6px, rgba(0,0,0,0.08) 6px 12px)",
        backgroundBlendMode: "screen, overlay",
      },
      arcClassName: "inset-x-3 bottom-1 h-5",
      pointerClassName: "bottom-1 h-4",
      showDualBands: true,
    };
  }

  if (variant === "series2000") {
    return {
      bodyClassName:
        "relative flex h-12 w-full max-w-[140px] items-center justify-center rounded-full border border-[#4d4d4d]/75 shadow-[0_4px_12px_rgba(0,0,0,0.08)] sm:h-14",
      neckClassName: "h-6 w-4 rounded-full bg-[#424242]",
      bodyStyle: {
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, rgba(0,0,0,0.24) 100%), linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%)",
        backgroundBlendMode: "screen, normal",
      },
      arcClassName: "inset-x-3 bottom-1 h-5",
      pointerClassName: "bottom-1 h-4",
      showKnurl: true,
    };
  }

  return defaultConfig;
};

interface EndCapProps {
  label: string;
  angleText: string;
  angleDegrees: number;
  hasAngleSelection: boolean;
  color: string;
  position: "left" | "right";
  variant: EndCapVariant;
}

const EndCap = ({
  label,
  angleText,
  angleDegrees,
  hasAngleSelection,
  color,
  position,
  variant,
}: EndCapProps) => {
  const pointerRotation = hasAngleSelection
    ? position === "left"
      ? -angleDegrees
      : angleDegrees
    : 0;
  const variantConfig = getEndCapVariantConfig(variant, color);

  return (
    <div className="flex w-[84px] shrink-0 flex-col items-center gap-1.5 sm:w-32 sm:gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-text sm:text-[11px] sm:tracking-[0.18em]">
        {label}
      </span>
      <div className={variantConfig.bodyClassName} style={variantConfig.bodyStyle}>
        <div
          className={`absolute ${position === "left" ? "left-1" : "right-1"} ${variantConfig.neckClassName}`}
        />
        {variantConfig.showSwivelRing ? (
          <div
            className={`pointer-events-none absolute top-1/2 h-8 w-2 -translate-y-1/2 rounded-full border border-[#2e2e2e]/60 bg-white/25 ${
              position === "left" ? "left-[18px]" : "right-[18px]"
            }`}
          />
        ) : null}
        {variantConfig.showDualBands ? (
          <>
            <div
              className={`pointer-events-none absolute top-[4px] h-8 w-[2px] rounded-full bg-white/45 ${
                position === "left" ? "left-[16px]" : "right-[16px]"
              }`}
            />
            <div
              className={`pointer-events-none absolute top-[4px] h-8 w-[2px] rounded-full bg-[#2f2f2f]/55 ${
                position === "left" ? "left-[20px]" : "right-[20px]"
              }`}
            />
          </>
        ) : null}
        {variantConfig.showKnurl ? (
          <div
            className="pointer-events-none absolute inset-y-[3px] left-[20%] right-[20%] rounded-full border border-[#303030]/40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(95deg, rgba(255,255,255,0.16) 0 2px, rgba(0,0,0,0.28) 2px 4px)",
            }}
          />
        ) : null}
        <div
          className={`pointer-events-none absolute rounded-t-full border-x border-t border-dashed border-[#b7b7b7]/90 transition-opacity duration-200 ease-out ${variantConfig.arcClassName}`}
        />
        <div
          className={`pointer-events-none absolute left-1/2 w-0.5 -translate-x-1/2 rounded-full transition-all duration-200 ease-out ${variantConfig.pointerClassName} ${
            hasAngleSelection ? "bg-primary/80 opacity-100" : "bg-[#8e8e8e] opacity-55"
          }`}
          style={{
            transform: `translateX(-50%) rotate(${pointerRotation}deg)`,
            transformOrigin: "bottom center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="relative h-0.5 w-7 rounded-full bg-[#454545] transition-transform duration-200 ease-out sm:w-8"
            style={{ transform: `rotate(${pointerRotation}deg)` }}
          >
            <span className="absolute -right-0.5 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-[#454545]" />
          </div>
        </div>
        <span className="relative z-10 inline-flex max-w-[70px] items-center gap-1 rounded-full bg-white/88 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-text sm:max-w-[84px] sm:px-2 sm:text-[10px] sm:tracking-[0.16em]">
          <span className="rounded bg-text/10 px-1 py-0.5 text-[8px] tracking-[0.14em] text-text">
            {position === "left" ? "A" : "B"}
          </span>
          <span className="truncate text-[10px] tracking-[0.06em] sm:text-[11px] sm:tracking-[0.08em]">
            {angleText}
          </span>
        </span>
      </div>
    </div>
  );
};

interface HoseOverlays {
  heatShield: boolean;
  supportCoil: boolean;
  clampCount: number;
}

const HoseSegment = ({
  color,
  sizeLabel,
  lengthInches,
  minLength,
  maxLength,
  overlays,
  surfaceStyle,
}: {
  color: string;
  sizeLabel: string;
  lengthInches?: number;
  minLength: number;
  maxLength: number;
  overlays: HoseOverlays;
  surfaceStyle?: React.CSSProperties;
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
  const clampPositions =
    overlays.clampCount > 1 ? [18, 82] : overlays.clampCount === 1 ? [50] : [];
  const hoseSurfaceStyle = surfaceStyle ?? { backgroundColor: color };

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-text sm:text-[11px] sm:tracking-[0.18em]">
        Hose
      </span>
      <div className="w-full">
        <div className="mx-auto w-full" style={{ width: `${widthPercent}%` }}>
          <div className="relative flex w-full items-center gap-1.5 sm:gap-2">
            <div className="h-2.5 w-4.5 rounded-full bg-[#8a8a8a] sm:h-3 sm:w-6" />
            <div className="relative h-4 flex-1 overflow-hidden rounded-full border border-border shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
              <div className="absolute inset-0 transition-colors duration-200" style={hoseSurfaceStyle} />
              {overlays.heatShield ? (
                <>
                  <div
                    className="pointer-events-none absolute inset-y-0 left-[8%] right-[8%] rounded-full border border-[#343434]/35 transition-opacity duration-200 ease-out"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(65,65,65,0.08) 0%, rgba(28,28,28,0.45) 14%, rgba(132,132,132,0.35) 50%, rgba(28,28,28,0.45) 86%, rgba(65,65,65,0.08) 100%), repeating-linear-gradient(110deg, rgba(255,255,255,0.08) 0 3px, rgba(0,0,0,0.08) 3px 6px)",
                    }}
                  />
                  <div className="pointer-events-none absolute left-[10%] right-[10%] top-[1px] h-px rounded-full bg-white/60" />
                  <div
                    className="pointer-events-none absolute left-[12%] right-[12%] bottom-[1px] h-px rounded-full"
                    style={{ backgroundColor: "rgba(232, 33, 51, 0.55)" }}
                  />
                </>
              ) : null}
              {overlays.supportCoil ? (
                <div
                  className="pointer-events-none absolute inset-y-0 left-[24%] right-[24%] rounded-full border border-[#2d2d2d]/35 transition-opacity duration-200 ease-out"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(105deg, rgba(25,25,25,0.45) 0 2px, rgba(255,255,255,0.14) 2px 4px, rgba(20,20,20,0.38) 4px 6px, rgba(255,255,255,0.1) 6px 8px)",
                  }}
                />
              ) : null}
              {clampPositions.map((position) => (
                <div
                  key={position}
                  className="pointer-events-none absolute top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-[#3f3f3f] shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
                  style={{
                    left: `${position}%`,
                    backgroundImage:
                      "linear-gradient(180deg, rgba(190,190,190,0.8) 0%, rgba(95,95,95,0.95) 55%, rgba(55,55,55,1) 100%)",
                  }}
                >
                  <span className="absolute left-[1px] right-[1px] top-[1px] h-px rounded-full bg-white/70" />
                </div>
              ))}
            </div>
            <div className="h-2.5 w-4.5 rounded-full bg-[#8a8a8a] sm:h-3 sm:w-6" />
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
      <span className="text-[10px] uppercase tracking-[0.16em] text-muted-text sm:text-[11px] sm:tracking-[0.2em]">
        {sizeLabel !== "Select" ? sizeLabel : "Select size"}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#363636] sm:text-xs sm:tracking-[0.16em]">
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
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-text"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: extraChipAccent(label) }}
              aria-hidden="true"
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const AssemblyDiagram = () => {
  const loading = false;
  const { state } = useAssemblyStore();
  const { selections } = state;
  const selectedHoseTypeId = selections.hoseTypeId;
  const selectedEndStyleId = selections.hoseEndStyleId;

  const hoseTypeLabel = findLabel(mockCatalog.hoseTypes, selectedHoseTypeId);
  const hoseSizeLabel = findLabel(mockCatalog.hoseSizes, selections.hoseSizeId);
  const hoseColorLabel = findLabel(mockCatalog.hoseColors, selections.hoseColorId);
  const endStyleLabel = findLabel(mockCatalog.hoseEndStyles, selectedEndStyleId);
  const endColorLabel = findLabel(mockCatalog.hoseEndColors, selections.hoseEndColorId);
  const angleALabel = findLabel(mockCatalog.hoseEndAngles, selections.hoseEndAngleAId);
  const angleBLabel = findLabel(mockCatalog.hoseEndAngles, selections.hoseEndAngleBId);

  const hoseFill = hoseColor(selections.hoseColorId);
  const endFill = endColor(selections.hoseEndColorId);
  const angleA = angleDegrees(selections.hoseEndAngleAId);
  const angleB = angleDegrees(selections.hoseEndAngleBId);
  const hoseHasImage = Boolean(selectedHoseTypeId && getHoseTypeImageSrc(selectedHoseTypeId));
  const hoseSurfaceStyle = getHoseTextureStyle(selectedHoseTypeId, hoseFill, hoseHasImage);
  const selectedEndStyle = selectedEndStyleId
    ? mockCatalog.hoseEndStyles.find((style) => style.id === selectedEndStyleId)
    : undefined;
  const endStyleHasImage = Boolean(selectedEndStyleId && getHoseEndStyleImageSrc(selectedEndStyleId));
  const endCapVariant = getEndCapVariant(selectedEndStyleId, selectedEndStyle?.label, endStyleHasImage);

  const extrasLabels = selections.extras.length
    ? selections.extras
        .map((extraId) => mockCatalog.extras.find((extra) => extra.id === extraId)?.label)
        .filter((label): label is string => Boolean(label))
    : [];
  const normalizedExtras = extrasLabels.map((label) => label.toLowerCase());
  const overlays: HoseOverlays = {
    heatShield: normalizedExtras.some((label) => /heat|shield|sleeve|fire/.test(label)),
    supportCoil: normalizedExtras.some((label) => /coil|support/.test(label)),
    clampCount: normalizedExtras.some((label) => /clamp|clip|fitting/.test(label)) ? 2 : 0,
  };

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
  const hasAngleASelection = Boolean(selections.hoseEndAngleAId);
  const hasAngleBSelection = Boolean(selections.hoseEndAngleBId);
  const selectedLengthInches = selections.lengthInches;
  const maxLengthInches = mockCatalog.length.max;
  const displayLengthInches = selectedLengthInches ?? maxLengthInches;
  const lengthPreview = `${displayLengthInches}"`;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white shadow-[0_10px_24px_rgba(0,0,0,0.12)]">
      <p className="sr-only">Assembly Diagram</p>

      <div
        className="relative w-full border-b border-border bg-[#f1f1f1] px-5 pb-5 pt-10 sm:px-6 sm:pb-6"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.65) 0%, rgba(211,211,211,0.9) 45%, rgba(255,255,255,0.6) 70%, rgba(192,192,192,0.9) 100%), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%), repeating-linear-gradient(120deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 6px)",
          backgroundBlendMode: "overlay, screen, normal",
        }}
        aria-busy={loading}
      >
        <div className="pointer-events-none absolute right-2 top-2 z-20 inline-flex max-w-[calc(100%-1rem)] items-center rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2f2f2f] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
          {lengthPreview}
        </div>
        {loading ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-10 text-muted-text"
            role="status"
          >
            <div className="flex w-full max-w-xl items-center justify-between gap-4">
              <div className="h-10 w-24 rounded-lg bg-white/60 shadow-sm animate-pulse" />
              <div className="h-3 flex-1 rounded-full bg-white/60 shadow-sm animate-pulse" />
              <div className="h-10 w-24 rounded-lg bg-white/60 shadow-sm animate-pulse" />
            </div>
            <div className="h-2 w-48 rounded-full bg-white/60 shadow-sm animate-pulse" />
          </div>
        ) : !hasSelections ? (
          <div className="py-10 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#e82133]">
            Select options to preview the assembly
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 sm:gap-4">
              <EndCap
                label="End A"
                angleText={angleAText}
                angleDegrees={angleA}
                hasAngleSelection={hasAngleASelection}
                color={endFill}
                position="left"
                variant={endCapVariant}
              />
              <HoseSegment
                color={hoseFill}
                sizeLabel={hoseSizeLabel}
                lengthInches={displayLengthInches}
                minLength={mockCatalog.length.min}
                maxLength={mockCatalog.length.max}
                overlays={overlays}
                surfaceStyle={hoseSurfaceStyle}
              />
              <EndCap
                label="End B"
                angleText={angleBText}
                angleDegrees={angleB}
                hasAngleSelection={hasAngleBSelection}
                color={endFill}
                position="right"
                variant={endCapVariant}
              />
            </div>

            <ExtrasOverlay labels={extrasLabels} />
          </>
        )}
      </div>

      <div className="bg-white p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-text">
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-[0.18em]">Hose End A</p>
            <p className="mt-1 text-sm font-semibold text-text">
              {endStyleLabel} · {endColorLabel}
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em]">{angleALabel}</p>
          </div>
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-[0.18em]">Hose End B</p>
            <p className="mt-1 text-sm font-semibold text-text">
              {endStyleLabel} · {endColorLabel}
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em]">{angleBLabel}</p>
          </div>
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-[0.18em]">Hose</p>
            <p className="mt-1 text-sm font-semibold text-text">
              {hoseTypeLabel}
            </p>
            <p className="text-[11px] uppercase tracking-[0.2em]">
              {hoseSizeLabel} · {hoseColorLabel}
            </p>
          </div>
          <div className="min-w-0">
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
      </div>

    </section>
  );
};
