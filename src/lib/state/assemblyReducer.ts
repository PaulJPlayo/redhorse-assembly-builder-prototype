import { ASSEMBLY_STEPS, type AssemblySelection, type AssemblyState, type StepId } from "@/types/assembly";
import type { AssemblyAction } from "@/lib/state/assemblyActions";

const STEP_ORDER: StepId[] = ASSEMBLY_STEPS.map((step) => step.id);

const STEP_FIELD: Record<StepId, keyof AssemblySelection> = {
  hoseType: "hoseTypeId",
  hoseColor: "hoseColorId",
  hoseSize: "hoseSizeId",
  hoseEndStyle: "hoseEndStyleId",
  hoseEndColor: "hoseEndColorId",
  hoseEndAngleA: "hoseEndAngleAId",
  hoseEndAngleB: "hoseEndAngleBId",
  assemblyLength: "lengthInches",
  extras: "extras",
};

const emptySelections: AssemblySelection = {
  extras: [],
};

export const initialAssemblyState: AssemblyState = {
  stepIndex: 0,
  selections: emptySelections,
  showSummary: false,
};

const clearAfterStep = (selections: AssemblySelection, stepId: StepId): AssemblySelection => {
  const startIndex = STEP_ORDER.indexOf(stepId);
  if (startIndex < 0) {
    return selections;
  }
  const nextSelections: AssemblySelection = { ...selections };
  for (let i = startIndex + 1; i < STEP_ORDER.length; i += 1) {
    const field = STEP_FIELD[STEP_ORDER[i]];
    if (field === "extras") {
      nextSelections.extras = [];
    } else {
      delete nextSelections[field];
    }
  }
  return nextSelections;
};

const clampStepIndex = (index: number): number => {
  if (index < 0) {
    return 0;
  }
  if (index > STEP_ORDER.length - 1) {
    return STEP_ORDER.length - 1;
  }
  return index;
};

export const assemblyReducer = (
  state: AssemblyState,
  action: AssemblyAction,
): AssemblyState => {
  switch (action.type) {
    case "SELECT_HOSE_TYPE": {
      const selections = clearAfterStep(
        { ...state.selections, hoseTypeId: action.id },
        "hoseType",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SELECT_HOSE_COLOR": {
      const selections = clearAfterStep(
        { ...state.selections, hoseColorId: action.id },
        "hoseColor",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SELECT_HOSE_SIZE": {
      const selections = clearAfterStep(
        { ...state.selections, hoseSizeId: action.id },
        "hoseSize",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SELECT_HOSE_END_STYLE": {
      const selections = clearAfterStep(
        { ...state.selections, hoseEndStyleId: action.id },
        "hoseEndStyle",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SELECT_HOSE_END_COLOR": {
      const selections = clearAfterStep(
        { ...state.selections, hoseEndColorId: action.id },
        "hoseEndColor",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SELECT_HOSE_END_ANGLE_A": {
      const selections = clearAfterStep(
        { ...state.selections, hoseEndAngleAId: action.id },
        "hoseEndAngleA",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SELECT_HOSE_END_ANGLE_B": {
      const selections = clearAfterStep(
        { ...state.selections, hoseEndAngleBId: action.id },
        "hoseEndAngleB",
      );
      return { ...state, selections, showSummary: false };
    }
    case "SET_LENGTH": {
      return {
        ...state,
        selections: { ...state.selections, lengthInches: action.length },
        showSummary: false,
      };
    }
    case "TOGGLE_EXTRA": {
      const nextExtras = state.selections.extras.includes(action.id)
        ? state.selections.extras.filter((extra) => extra !== action.id)
        : [...state.selections.extras, action.id];
      return {
        ...state,
        selections: { ...state.selections, extras: nextExtras },
        showSummary: false,
      };
    }
    case "NEXT_STEP": {
      return {
        ...state,
        stepIndex: clampStepIndex(state.stepIndex + 1),
      };
    }
    case "PREV_STEP": {
      return {
        ...state,
        stepIndex: clampStepIndex(state.stepIndex - 1),
        showSummary: false,
      };
    }
    case "GO_TO_STEP": {
      return {
        ...state,
        stepIndex: clampStepIndex(action.index),
        showSummary: false,
      };
    }
    case "SHOW_SUMMARY": {
      return { ...state, showSummary: action.value };
    }
    case "RESET": {
      return initialAssemblyState;
    }
    default:
      return state;
  }
};
