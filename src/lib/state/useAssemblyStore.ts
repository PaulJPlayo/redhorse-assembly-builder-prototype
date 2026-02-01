"use client";

import React, { createContext, useContext, useReducer } from "react";
import { assemblyReducer, initialAssemblyState } from "@/lib/state/assemblyReducer";
import type { AssemblyAction } from "@/lib/state/assemblyActions";
import type { AssemblyState } from "@/types/assembly";

interface AssemblyStore {
  state: AssemblyState;
  dispatch: React.Dispatch<AssemblyAction>;
}

const AssemblyContext = createContext<AssemblyStore | undefined>(undefined);

export const AssemblyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(assemblyReducer, initialAssemblyState);
  return React.createElement(
    AssemblyContext.Provider,
    { value: { state, dispatch } },
    children,
  );
};

export const useAssemblyStore = (): AssemblyStore => {
  const context = useContext(AssemblyContext);
  if (!context) {
    throw new Error("useAssemblyStore must be used within AssemblyProvider");
  }
  return context;
};
