import { QuantumState } from "@/types/bloch";
import { isEqualQuantumState, numberToExpression } from "./helper-operations";
import { anglesToCoordinates, ketToAngles } from "./ket-to-bloch-vector";

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

export const CIRCLE_ROTATION_MAP: { key: string; value: number }[] = [
  { key: "0", value: 0 },
  { key: "π/12", value: Math.PI / 12 },
  { key: "π/6", value: Math.PI / 6 },
  { key: "π/4", value: Math.PI / 4 },
  { key: "π/3", value: Math.PI / 3 },
  { key: "5π/12", value: (5 * Math.PI) / 12 },
  { key: "π/2", value: Math.PI / 2 },
  { key: "7π/12", value: (7 * Math.PI) / 12 },
  { key: "2π/3", value: (2 * Math.PI) / 3 },
  { key: "3π/4", value: (3 * Math.PI) / 4 },
  { key: "5π/6", value: (5 * Math.PI) / 6 },
  { key: "11π/12", value: (11 * Math.PI) / 12 },
  { key: "π", value: Math.PI },
  { key: "13π/12", value: (13 * Math.PI) / 12 },
  { key: "7π/6", value: (7 * Math.PI) / 6 },
  { key: "5π/4", value: (5 * Math.PI) / 4 },
  { key: "4π/3", value: (4 * Math.PI) / 3 },
  { key: "17π/12", value: (17 * Math.PI) / 12 },
  { key: "3π/2", value: (3 * Math.PI) / 2 },
  { key: "19π/12", value: (19 * Math.PI) / 12 },
  { key: "5π/3", value: (5 * Math.PI) / 3 },
  { key: "7π/4", value: (7 * Math.PI) / 4 },
  { key: "11π/6", value: (11 * Math.PI) / 6 },
  { key: "23π/12", value: (23 * Math.PI) / 12 },
  { key: "2π", value: 2 * Math.PI },
];

export const COORDINATE_MAP: { key: string; value: number }[] = [
  { key: "0", value: 0 },
  { key: "0.5", value: 0.5 },
  { key: "1", value: 1 },
];

export const stateToKetString: (state: QuantumState) => string = (state) => {
  const baseState = BASE_STATES.find((x) =>
    isEqualQuantumState(x.value, state),
  );

  return (
    baseState?.key ||
    `(${numberToExpression(state.a.real, EXPRESSION_MAP)} + ${numberToExpression(state.a.imag, EXPRESSION_MAP)} * i) * ∣0⟩ + (${numberToExpression(state.b.real, EXPRESSION_MAP)} + ${numberToExpression(state.b.imag, EXPRESSION_MAP)} * i) * ∣1⟩`
  );
};

export const stateToAnglesString: (state: QuantumState) => string = (state) => {
  const { theta, phi } = ketToAngles(state);
  return `θ = ${numberToExpression(theta, CIRCLE_ROTATION_MAP)};ϕ = ${numberToExpression(phi, CIRCLE_ROTATION_MAP)}`;
};

export const stateToCoordinatesString: (state: QuantumState) => string = (
  state,
) => {
  const angles = ketToAngles(state);
  const { x, y, z } = anglesToCoordinates(angles);
  return `x = ${numberToExpression(x, COORDINATE_MAP)};y = ${numberToExpression(y, COORDINATE_MAP)};z = ${numberToExpression(z, COORDINATE_MAP)}`;
};
