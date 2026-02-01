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
}

export const ASSEMBLY_STEPS: StepDefinition[] = [
  {
    id: "hoseType",
    label: "Hose Type",
    title: "Choose Your Hose",
  },
  {
    id: "hoseColor",
    label: "Hose Color",
    title: "Choose Your Hose Color",
  },
  {
    id: "hoseSize",
    label: "Hose Size",
    title: "Choose Your Hose Size (Gauge)",
  },
  {
    id: "hoseEndStyle",
    label: "Hose End Style",
    title: "Choose Your Hose End Type",
  },
  {
    id: "hoseEndColor",
    label: "Hose End Color",
    title: "Choose Your Hose End Color",
  },
  {
    id: "hoseEndAngleA",
    label: "Hose End A Angle",
    title: "Hose End A Angle",
  },
  {
    id: "hoseEndAngleB",
    label: "Hose End B Angle",
    title: "Hose End B Angle",
  },
  {
    id: "assemblyLength",
    label: "Assembly Length",
    title: "Total Assembly Length",
  },
  {
    id: "extras",
    label: "Extras",
    title: "Extras?",
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
