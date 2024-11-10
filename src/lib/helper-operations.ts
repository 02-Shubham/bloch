import { Complex, Matrix2x2, QuantumState } from "@/types/bloch";

export const addComplex = (c1: Complex, c2: Complex): Complex => ({
  real: c1.real + c2.real,
  imag: c1.imag + c2.imag,
});

export const multiplyComplex = (c1: Complex, c2: Complex): Complex => ({
  real: c1.real * c2.real - c1.imag * c2.imag,
  imag: c1.real * c2.imag + c1.imag * c2.real,
});

export const conjugateComplex = (c: Complex): Complex => ({
  real: c.real,
  imag: -c.imag,
});

export const conjugateTranspose = (
  m: Matrix2x2<Complex>,
): Matrix2x2<Complex> => ({
  _00: conjugateComplex(m._00),
  _01: conjugateComplex(m._10),
  _10: conjugateComplex(m._01),
  _11: conjugateComplex(m._11),
});

export const TOLERANCE = 1e-12;

export const belowTolerance = (n: number): boolean => Math.abs(n) < TOLERANCE;

export const zeroIfBelowTolerance = (n: number): number =>
  belowTolerance(n) ? 0 : n;

export const almostAbs1SlashSqrt2 = (n: number): boolean =>
  belowTolerance(Math.abs(n) - 1 / Math.sqrt(2));

export const oneSlashSqrt2IfAlmostAbs1SlashSqrt2 = (n: number): string =>
  almostAbs1SlashSqrt2(n) ? (n < 0 ? `(-1/√2)` : `(1/√2)`) : `${n}`;

export const isCloseComplex = (a: Complex, b: Complex): boolean =>
  Math.abs(a.real - b.real) < TOLERANCE &&
  Math.abs(a.imag - b.imag) < TOLERANCE;

export const isEqualQuantumState = (
  q1: QuantumState,
  q2: QuantumState,
): boolean => isCloseComplex(q1.a, q2.a) && isCloseComplex(q1.b, q2.b);
