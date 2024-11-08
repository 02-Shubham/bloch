import { Complex, QuantumState, Gate } from "@/types/bloch";

const multiplyComplex = (c1: Complex, c2: Complex): Complex => ({
  real: c1.real * c2.real - c1.imag * c2.imag,
  imag: c1.real * c2.imag + c1.imag * c2.real,
});

const addComplex = (c1: Complex, c2: Complex): Complex => ({
  real: c1.real + c2.real,
  imag: c1.imag + c2.imag,
});

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
