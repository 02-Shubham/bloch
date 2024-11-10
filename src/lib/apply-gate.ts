import { QuantumState, Gate } from "@/types/bloch";
import { addComplex, multiplyComplex } from "./helper-operations";

export const applyGateToState: (
  state: QuantumState,
  gate: Gate,
) => QuantumState = (state, gate) => {
  if (gate.name === "init") {
    return state;
  }

  const { _00, _01, _10, _11 } = gate.matrix;
  const { a, b } = state;

  const newA = addComplex(multiplyComplex(_00, a), multiplyComplex(_01, b));

  const newB = addComplex(multiplyComplex(_10, a), multiplyComplex(_11, b));

  return { a: newA, b: newB };
};
