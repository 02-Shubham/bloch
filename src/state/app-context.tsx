"use client";
import { applyGateToState } from "@/lib/apply-gate";
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
  currentHistoryIndex: number;
  applyGate: (gate: Gate) => void;
  undo: () => void;
  redo: () => void;
  resetHistory: (toState?: QuantumState) => void;
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
  currentHistoryIndex: 0,
  applyGate: () => null,
  undo: () => null,
  redo: () => null,
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
  const [history, setHistory] = useState<AppContextType["history"]>([
    { currentState: INITIAL_QUANTUM_STATE, gateUsed: { name: "init" } },
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [showAxesHelper, changeShowAxesHelper] = useState(false);

  const applyGate = (gate: Gate) => {
    const newItem: HistoryItem = {
      currentState: applyGateToState(
        history[currentHistoryIndex].currentState,
        gate,
      ),
      gateUsed: gate,
    };
    setHistory([...history.slice(0, currentHistoryIndex + 1), newItem]);
    setCurrentHistoryIndex(currentHistoryIndex + 1);
  };

  const undo = () => {
    if (currentHistoryIndex > 0)
      setCurrentHistoryIndex(currentHistoryIndex - 1);
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1)
      setCurrentHistoryIndex(currentHistoryIndex + 1);
  };

  const resetHistory = (toState: QuantumState = INITIAL_QUANTUM_STATE) => {
    setCurrentHistoryIndex(0);
    setHistory([{ currentState: toState, gateUsed: { name: "init" } }]);
  };

  return (
    <AppContext.Provider
      value={{
        history,
        currentHistoryIndex,
        applyGate,
        undo,
        redo,
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
