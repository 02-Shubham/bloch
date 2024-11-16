import { QuantumState } from "@/types/bloch";
import { isEqualQuantumState, numberToExpression } from "./helper-operations";

export const BASE_STATES: { key: string; value: QuantumState }[] = [
  {
    key: "∣0⟩",
    value: {
      a: { real: 1, imag: 0 },
      b: { real: 0, imag: 0 },
    },
  },
  {
    key: "∣1⟩",
    value: {
      a: { real: 0, imag: 0 },
      b: { real: 1, imag: 0 },
    },
  },
  {
    key: "∣+⟩",
    value: {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: 1 / Math.sqrt(2), imag: 0 },
    },
  },
  {
    key: "∣−⟩",
    value: {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: -1 / Math.sqrt(2), imag: 0 },
    },
  },
  {
    key: "∣i⟩",
    value: {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: 0, imag: 1 / Math.sqrt(2) },
    },
  },
  {
    key: "∣−i⟩",
    value: {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: 0, imag: -1 / Math.sqrt(2) },
    },
  },
];

export const EXPRESSION_MAP: { key: string; value: number }[] = [
  { key: "0", value: 0 },
  { key: "1/√8", value: 1 / Math.sqrt(8) },
  { key: "1/2", value: 1 / 2 },
  { key: "1/√3", value: 1 / Math.sqrt(3) },
  { key: "1/√2", value: 1 / Math.sqrt(2) },
  { key: "√(2/3)", value: Math.sqrt(2 / 3) },
  { key: "(√3)/2", value: Math.sqrt(3) / 2 },
  { key: "√(3/4)", value: Math.sqrt(3 / 4) },
  { key: "1", value: 1 },
];

export const stateToString: (state: QuantumState) => string = (state) => {
  const baseState = BASE_STATES.find((x) =>
    isEqualQuantumState(x.value, state),
  );

  return (
    baseState?.key ||
    `(${numberToExpression(state.a.real, EXPRESSION_MAP)} + ${numberToExpression(state.a.imag, EXPRESSION_MAP)} * i) * ∣0⟩ + (${numberToExpression(state.b.real, EXPRESSION_MAP)} + ${numberToExpression(state.b.imag, EXPRESSION_MAP)} * i) * ∣1⟩`
  );
};
