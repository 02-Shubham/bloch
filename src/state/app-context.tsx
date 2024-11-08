"use client";
import { Gate, QuantumState } from "@/types/bloch";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface HistoryItem {
  currentState: QuantumState;
  gateUsed: Gate;
}

export interface AppContextType {
  history: HistoryItem[];
  pushState: (newState: HistoryItem) => void;
  popState: () => void;
  resetHistory: () => void;
  settings: {
    showAxesHelper: boolean;
    changeShowAxesHelper: Dispatch<SetStateAction<boolean>>;
  };
}

const INITIAL_QUANTUM_STATE: QuantumState = {
  a: { real: 1, imag: 0 },
  b: { real: 0, imag: 0 },
};

export const AppContext = createContext<AppContextType>({
  history: [],
  pushState: () => null,
  popState: () => null,
  resetHistory: () => null,
  settings: {
    showAxesHelper: false,
    changeShowAxesHelper: () => null,
  },
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [history, changeHistory] = useState<AppContextType["history"]>([
    { currentState: INITIAL_QUANTUM_STATE, gateUsed: { name: "init" } },
  ]);
  const [showAxesHelper, changeShowAxesHelper] = useState(false);

  const pushState = (newState: HistoryItem) => {
    changeHistory([...history, newState]);
  };

  const popState = () => {
    changeHistory(history.splice(0, history.length - 1));
  };

  const resetHistory = () => {
    changeHistory([
      { currentState: INITIAL_QUANTUM_STATE, gateUsed: { name: "init" } },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        history,
        pushState,
        popState,
        resetHistory,
        settings: {
          showAxesHelper,
          changeShowAxesHelper,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
