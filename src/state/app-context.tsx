"use client";
import { Gate, QuantumState } from "@/types/bloch";
import { createContext, useContext } from "react";

export interface AppContextType {
  initialState: QuantumState;
  history: { currentState: QuantumState; gateUsed: Gate }[];
}

export const AppContext = createContext<AppContextType>({
  initialState: {
    a: { real: 0.6, imag: 0 },
    b: { real: 0, imag: 0.8 },
  },
  history: [],
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AppContext.Provider
      value={{
        initialState: {
          a: { real: 0.6, imag: 0 },
          b: { real: 0, imag: 0.8 },
        },
        history: [],
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
