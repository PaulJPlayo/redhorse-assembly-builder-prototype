export type StepId =
  | "hoseType"
  | "hoseColor"
  | "hoseSize"
  | "hoseEndStyle"
  | "hoseEndColor"
  | "hoseEndAngleA"
  | "hoseEndAngleB"
  | "assemblyLength"
  | "extras";

export interface StepDefinition {
  id: StepId;
  label: string;
  title: string;
  mode: "single" | "multi" | "input";
  autoAdvance?: boolean;
}

export const ASSEMBLY_STEPS: StepDefinition[] = [
  {
    id: "hoseType",
    label: "Hose Type",
    title: "Choose Your Hose",
    mode: "single",
    autoAdvance: true,
  },
  {
    id: "hoseSize",
    label: "Hose Size",
    title: "Choose Your Hose Size (Gauge)",
    mode: "single",
    autoAdvance: true,
  },
  {
    id: "hoseEndStyle",
    label: "Hose End Style",
    title: "Choose Your Hose End Type",
    mode: "single",
    autoAdvance: true,
  },
  {
    id: "hoseEndColor",
    label: "Hose End Color",
    title: "Choose Your Hose End Color",
    mode: "single",
    autoAdvance: true,
  },
  {
    id: "hoseEndAngleA",
    label: "Hose End A Angle",
    title: "Hose End A Angle",
    mode: "single",
    autoAdvance: true,
  },
  {
    id: "hoseEndAngleB",
    label: "Hose End B Angle",
    title: "Hose End B Angle",
    mode: "single",
    autoAdvance: true,
  },
  {
    id: "assemblyLength",
    label: "Assembly Length",
    title: "Total Assembly Length",
    mode: "input",
    autoAdvance: false,
  },
  {
    id: "extras",
    label: "Extras",
    title: "Extras?",
    mode: "multi",
    autoAdvance: false,
  },
];

export interface AssemblySelection {
  hoseTypeId?: string;
  hoseColorId?: string;
  hoseSizeId?: string;
  hoseEndStyleId?: string;
  hoseEndColorId?: string;
  hoseEndAngleAId?: string;
  hoseEndAngleBId?: string;
  lengthInches?: number;
  extras: string[];
}

export interface AssemblyState {
  stepIndex: number;
  selections: AssemblySelection;
  showSummary: boolean;
}

export interface SummaryRow {
  label: string;
  value: string;
  sku?: string;
  emphasize?: boolean;
}
