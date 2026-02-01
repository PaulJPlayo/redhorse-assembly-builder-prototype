import type { AssemblySelection, StepDefinition, StepId } from "@/types/assembly";
import { ASSEMBLY_STEPS } from "@/types/assembly";
import type { Catalog, CatalogOption, CatalogLengthRule } from "@/types/catalog";
import { filterCatalog, type OptionWithAvailability } from "@/lib/rules/filterCatalog";

export interface StepOptions {
  stepId: StepId;
  definition: StepDefinition;
  options: OptionWithAvailability<CatalogOption>[];
  lengthRule?: CatalogLengthRule;
  helper?: string;
  gridClassName?: string;
}

const STEP_HELPERS: Partial<Record<StepId, string>> = {
  hoseType: "Select the hose family to start building your assembly.",
  hoseColor: "Choose the hose color that matches your application.",
  hoseSize: "Gauge size controls flow and fitting compatibility.",
  hoseEndStyle: "Select the hose end style that matches your fittings.",
  hoseEndColor: "Pick a hose end finish.",
  hoseEndAngleA: "Choose the angle for Hose End A.",
  hoseEndAngleB: "Choose the angle for Hose End B.",
  assemblyLength: "Length measured flare to flare in inches.",
  extras: "Optional protection and support.",
};

export const deriveNextOptions = (
  catalog: Catalog,
  selections: AssemblySelection,
  stepId: StepId,
): StepOptions => {
  const filtered = filterCatalog(catalog, selections);
  const definition = ASSEMBLY_STEPS.find((step) => step.id === stepId) ?? ASSEMBLY_STEPS[0];

  switch (stepId) {
    case "hoseType":
      return {
        stepId,
        definition,
        options: filtered.hoseTypes,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      };
    case "hoseColor":
      return {
        stepId,
        definition,
        options: filtered.hoseColors,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      };
    case "hoseSize":
      return {
        stepId,
        definition,
        options: filtered.hoseSizes,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      };
    case "hoseEndStyle":
      return {
        stepId,
        definition,
        options: filtered.hoseEndStyles,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      };
    case "hoseEndColor":
      return {
        stepId,
        definition,
        options: filtered.hoseEndColors,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      };
    case "hoseEndAngleA":
    case "hoseEndAngleB":
      return {
        stepId,
        definition,
        options: filtered.hoseEndAngles,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
      };
    case "assemblyLength":
      return {
        stepId,
        definition,
        options: [],
        helper: STEP_HELPERS[stepId],
        lengthRule: filtered.length,
      };
    case "extras":
      return {
        stepId,
        definition,
        options: filtered.extras,
        helper: STEP_HELPERS[stepId],
        gridClassName:
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      };
    default:
      return {
        stepId,
        definition,
        options: [],
      };
  }
};

export const isStepComplete = (stepId: StepId, selections: AssemblySelection): boolean => {
  switch (stepId) {
    case "hoseType":
      return Boolean(selections.hoseTypeId);
    case "hoseColor":
      return Boolean(selections.hoseColorId);
    case "hoseSize":
      return Boolean(selections.hoseSizeId);
    case "hoseEndStyle":
      return Boolean(selections.hoseEndStyleId);
    case "hoseEndColor":
      return Boolean(selections.hoseEndColorId);
    case "hoseEndAngleA":
      return Boolean(selections.hoseEndAngleAId);
    case "hoseEndAngleB":
      return Boolean(selections.hoseEndAngleBId);
    case "assemblyLength":
      return Boolean(selections.lengthInches);
    case "extras":
      return true;
    default:
      return false;
  }
};
