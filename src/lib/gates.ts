import { Complex, Gate, Matrix2x2 } from "@/types/bloch";

export const XGate: Gate = {
  name: "X",
  matrix: {
    _00: { real: 0, imag: 0 },
    _01: { real: 1, imag: 0 },
    _10: { real: 1, imag: 0 },
    _11: { real: 0, imag: 0 },
  },
};

export const YGate: Gate = {
  name: "Y",
  matrix: {
    _00: { real: 0, imag: 0 },
    _01: { real: 0, imag: -1 },
    _10: { real: 0, imag: 1 },
    _11: { real: 0, imag: 0 },
  },
};

export const ZGate: Gate = {
  name: "Z",
  matrix: {
    _00: { real: 1, imag: 0 },
    _01: { real: 0, imag: 0 },
    _10: { real: 0, imag: 0 },
    _11: { real: -1, imag: 0 },
  },
};

export const HGate: Gate = {
  name: "H",
  matrix: {
    _00: { real: 1 / Math.sqrt(2), imag: 0 },
    _01: { real: 1 / Math.sqrt(2), imag: 0 },
    _10: { real: 1 / Math.sqrt(2), imag: 0 },
    _11: { real: -1 / Math.sqrt(2), imag: 0 },
  },
};

export const PGate: (phi: number, originalExpression?: string) => Gate = (
  phi,
  originalExpression,
) => ({
  name: "P",
  matrix: {
    _00: { real: 1, imag: 0 },
    _01: { real: 0, imag: 0 },
    _10: { real: 0, imag: 0 },
    _11: {
      real: Math.cos(phi),
      imag: Math.sin(phi),
    },
  },
  phi,
  originalExpression,
});

export const CustomGate: (
  matrix: Matrix2x2<Complex>,
  originalExpressionMatrix: Matrix2x2<string>,
) => Gate = (matrix, originalExpressionMatrix) => ({
  name: "custom",
  matrix,
  originalExpressionMatrix,
});
