import { Complex, Matrix2x2 } from "@/types/bloch";
import {
  addComplex,
  conjugateTranspose,
  isCloseComplex,
  multiplyComplex,
} from "./helper-operations";

export const isUnitary = (m: Matrix2x2<Complex>) => {
  const uConjugateTranspose = conjugateTranspose(m);

  const product: Matrix2x2<Complex> = {
    _00: addComplex(
      multiplyComplex(uConjugateTranspose._00, m._00),
      multiplyComplex(uConjugateTranspose._01, m._10),
    ),
    _01: addComplex(
      multiplyComplex(uConjugateTranspose._00, m._01),
      multiplyComplex(uConjugateTranspose._01, m._11),
    ),
    _10: addComplex(
      multiplyComplex(uConjugateTranspose._10, m._00),
      multiplyComplex(uConjugateTranspose._11, m._10),
    ),
    _11: addComplex(
      multiplyComplex(uConjugateTranspose._10, m._01),
      multiplyComplex(uConjugateTranspose._11, m._11),
    ),
  };

  const identity: Matrix2x2<Complex> = {
    _00: { real: 1, imag: 0 },
    _01: { real: 0, imag: 0 },
    _10: { real: 0, imag: 0 },
    _11: { real: 1, imag: 0 },
  };

  return (
    isCloseComplex(product._00, identity._00) &&
    isCloseComplex(product._01, identity._01) &&
    isCloseComplex(product._10, identity._10) &&
    isCloseComplex(product._11, identity._11)
  );
};
