import { Complex, Matrix2x2, QuantumState } from "@/types/bloch";
import {
  computeExpMinusIAlpha,
  determinantComplex2x2,
  multiplyMatrixByComplex,
} from "./helper-operations";
import { applyGateToState } from "./apply-gate";

export const decomposeMatrix = (
  matrix: Matrix2x2<Complex>,
): {
  nx: number;
  ny: number;
  nz: number;
  theta: number;
} => {
  const det = determinantComplex2x2(matrix);
  const phase = 0.5 * Math.atan2(det.imag, det.real);
  const V = multiplyMatrixByComplex(computeExpMinusIAlpha(phase), matrix);

  const N = Math.sqrt(
    Math.pow(V._01.imag, 2) + Math.pow(V._01.real, 2) + Math.pow(V._00.imag, 2),
  );

  const nx = (-1 * V._01.imag) / N;
  const ny = (-1 * V._01.real) / N;
  const nz = (-1 * V._00.imag) / N;

  let s = -1 * (V._00.imag / nz);
  const c = V._00.real;

  let theta = 0;

  if (Number.isNaN(s)) {
    theta = Math.acos(c) * 2;
    s = Math.sin(0.5 * theta);
  } else {
    theta = 2 * Math.atan2(s, c);
  }

  return {
    nx,
    ny,
    nz,
    theta,
  };
};

export const recomposeMatrix = ({
  nx,
  ny,
  nz,
  theta,
}: {
  nx: number;
  ny: number;
  nz: number;
  theta: number;
}): Matrix2x2<Complex> => {
  const cosThetaHalf = Math.cos(theta / 2);
  const sinThetaHalf = Math.sin(theta / 2);

  const _00 = {
    real: cosThetaHalf,
    imag: -nz * sinThetaHalf,
  };
  const _01 = {
    real: -ny * sinThetaHalf,
    imag: -nx * sinThetaHalf,
  };
  const _10 = {
    real: ny * sinThetaHalf,
    imag: -nx * sinThetaHalf,
  };
  const _11 = {
    real: cosThetaHalf,
    imag: nz * sinThetaHalf,
  };

  return { _00, _01, _10, _11 };
};

export const rotateMatrix = (
  matrix: Matrix2x2<Complex>,
  t: number,
): Matrix2x2<Complex> => {
  const { nx, ny, nz, theta } = decomposeMatrix(matrix);
  const tclamp = Math.min(Math.max(t, 0), 1);
  return recomposeMatrix({ nx, ny, nz, theta: theta * tclamp });
};

export const calculateIntermediateStates = (
  previousState: QuantumState,
  gateUsed: Matrix2x2<Complex>,
  steps = 60,
): QuantumState[] => {
  console.log(decomposeMatrix(gateUsed));

  const res: QuantumState[] = [previousState];

  for (let i = 1; i <= steps; i++) {
    res.push(
      applyGateToState(previousState, {
        name: "rotation",
        matrix: rotateMatrix(gateUsed, i / steps),
      }),
    );
  }

  return res;
};
