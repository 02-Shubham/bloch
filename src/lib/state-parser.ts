import { QuantumState } from "@/types/bloch";
import {
  isEqualQuantumState,
  oneSlashSqrt2IfAlmostAbs1SlashSqrt2,
  zeroIfBelowTolerance,
} from "./helper-operations";

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

export const stateToString: (state: QuantumState) => string = (state) => {
  const baseState = BASE_STATES.find((x) =>
    isEqualQuantumState(x.value, state),
  );

  return (
    baseState?.key ||
    `(${oneSlashSqrt2IfAlmostAbs1SlashSqrt2(zeroIfBelowTolerance(state.a.real))} + ${oneSlashSqrt2IfAlmostAbs1SlashSqrt2(zeroIfBelowTolerance(state.a.imag))} * i) * ∣0⟩ + (${oneSlashSqrt2IfAlmostAbs1SlashSqrt2(zeroIfBelowTolerance(state.b.real))} + ${oneSlashSqrt2IfAlmostAbs1SlashSqrt2(zeroIfBelowTolerance(state.b.imag))} * i) * ∣1⟩`
  );
};
