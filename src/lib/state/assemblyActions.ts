export type AssemblyAction =
  | { type: "SELECT_HOSE_TYPE"; id: string }
  | { type: "SELECT_HOSE_COLOR"; id: string }
  | { type: "SELECT_HOSE_SIZE"; id: string }
  | { type: "SELECT_HOSE_END_STYLE"; id: string }
  | { type: "SELECT_HOSE_END_COLOR"; id: string }
  | { type: "SELECT_HOSE_END_ANGLE_A"; id: string }
  | { type: "SELECT_HOSE_END_ANGLE_B"; id: string }
  | { type: "SET_LENGTH"; length?: number }
  | { type: "TOGGLE_EXTRA"; id: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; index: number }
  | { type: "SHOW_SUMMARY"; value: boolean }
  | { type: "RESET" };
