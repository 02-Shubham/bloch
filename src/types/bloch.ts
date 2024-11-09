export interface Complex {
  real: number;
  imag: number;
}

export interface QuantumState {
  a: Complex;
  b: Complex;
}

export type Gate =
  | {
      name: "X" | "Y" | "Z" | "H" | "custom";
      matrix: { _00: Complex; _01: Complex; _10: Complex; _11: Complex };
    }
  | {
      name: "P";
      matrix: { _00: Complex; _01: Complex; _10: Complex; _11: Complex };
      phi: number;
      originalExpression?: string | undefined;
    }
  | {
      name: "init";
    };
