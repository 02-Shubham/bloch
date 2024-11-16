"use client";
import { applyGateToState } from "@/lib/apply-gate";
import {
  serializeHistory,
  deserializeHistory,
} from "@/lib/serializer-deserializer";
import { Gate, QuantumState } from "@/types/bloch";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
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
  canUndo: () => boolean;
  canRedo: () => boolean;
  goToState: (index: number) => void;
  settings: {
    showAxesHelper: boolean;
    setShowAxesHelper: Dispatch<SetStateAction<boolean>>;
    showStats: boolean;
    setShowStats: Dispatch<SetStateAction<boolean>>;
    drawPathForTheLastNGate: number;
    setDrawPathForTheLastNGate: Dispatch<SetStateAction<number>>;
  };
  // eslint-disable-next-line
  controlsRef: React.Ref<any>;
  resetRotation: () => void;
  saveHistory: () => string;
  restoreHistory: (serializedHistory: string) => void;
  historyRestoreHappened: boolean;
  historyRestorationSuccess: "success" | "error" | "unknown";
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
  canUndo: () => false,
  canRedo: () => false,
  goToState: () => false,
  settings: {
    showAxesHelper: false,
    setShowAxesHelper: () => null,
    showStats: false,
    setShowStats: () => null,
    drawPathForTheLastNGate: 0,
    setDrawPathForTheLastNGate: () => null,
  },
  controlsRef: null,
  resetRotation: () => null,
  saveHistory: () => "",
  restoreHistory: () => null,
  historyRestoreHappened: false,
  historyRestorationSuccess: "unknown",
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
  const [showAxesHelper, setShowAxesHelper] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [drawPathForTheLastNGate, setDrawPathForTheLastNGate] = useState(3);
  const [historyRestoreHappened, setHistoryRestoreHappened] = useState(false);
  const [historyRestorationSuccess, setHistoryRestorationSuccess] = useState<
    "success" | "error" | "unknown"
  >("unknown");

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

  const canUndo = () => currentHistoryIndex > 0;
  const canRedo = () => currentHistoryIndex < history.length - 1;

  const undo = () => {
    if (canUndo()) setCurrentHistoryIndex(currentHistoryIndex - 1);
  };

  const redo = () => {
    if (canRedo()) setCurrentHistoryIndex(currentHistoryIndex + 1);
  };

  const resetHistory = (toState: QuantumState = INITIAL_QUANTUM_STATE) => {
    setCurrentHistoryIndex(0);
    setHistory([{ currentState: toState, gateUsed: { name: "init" } }]);
  };

  // eslint-disable-next-line
  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    controlsRef.current?.reset();
  };

  const goToState = (index: number) => {
    const safeIndex = Math.min(Math.max(index, 0), history.length - 1);
    setCurrentHistoryIndex(safeIndex);
  };

  const saveHistory = (): string => {
    return serializeHistory(history);
  };

  const restoreHistory = (serializedHistory: string) => {
    try {
      const deserialized = deserializeHistory(serializedHistory);
      setCurrentHistoryIndex(0);
      setHistory(deserialized);
      setHistoryRestorationSuccess("success");
    } catch (error) {
      console.error("Invalid serialized state", error);
      setHistoryRestorationSuccess("error");
    }
  };

  useEffect(() => {
    if (historyRestorationSuccess !== "unknown") {
      setHistoryRestoreHappened(true);
      setCurrentHistoryIndex(history.length - 1);
    }
  }, [historyRestorationSuccess]);

  return (
    <AppContext.Provider
      value={{
        history,
        currentHistoryIndex,
        applyGate,
        undo,
        redo,
        resetHistory,
        canUndo,
        canRedo,
        goToState,
        settings: {
          showAxesHelper,
          setShowAxesHelper,
          showStats,
          setShowStats,
          drawPathForTheLastNGate,
          setDrawPathForTheLastNGate,
        },
        controlsRef,
        resetRotation: handleReset,
        saveHistory,
        restoreHistory,
        historyRestoreHappened,
        historyRestorationSuccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
