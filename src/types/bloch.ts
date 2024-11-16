export interface Complex {
  real: number;
  imag: number;
}

export interface Matrix2x2<T> {
  _00: T;
  _01: T;
  _10: T;
  _11: T;
}

export interface QuantumState {
  a: Complex;
  b: Complex;
}

export type Gate =
  | {
      name: "X" | "Y" | "Z" | "H" | "S" | "S†" | "T";
      matrix: Matrix2x2<Complex>;
    }
  | {
      name: "P";
      matrix: Matrix2x2<Complex>;
      phi: number;
      originalExpression?: string | undefined;
    }
  | {
      name: "custom";
      matrix: Matrix2x2<Complex>;
      originalExpressionMatrix: Matrix2x2<string>;
    }
  | {
      name: "init";
    }
  | {
      name: "rotation";
      matrix: Matrix2x2<Complex>;
    };
