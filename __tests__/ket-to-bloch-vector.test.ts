import * as THREE from "three";
import { ketToBlochVector } from "../src/lib/ket-to-bloch-vector";

describe("ketToBlochVector", () => {
  const epsilon = 1e-6; // Tolerance for floating-point comparisons

  const expectVectorClose = (
    v1: THREE.Vector3,
    v2: THREE.Vector3,
    tolerance = epsilon,
  ) => {
    expect(v1.x).toBeCloseTo(v2.x, tolerance);
    expect(v1.y).toBeCloseTo(v2.y, tolerance);
    expect(v1.z).toBeCloseTo(v2.z, tolerance);
  };

  test("Converts |0⟩ state correctly", () => {
    const state = { a: { real: 1, imag: 0 }, b: { real: 0, imag: 0 } };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(0, 0, 1));
  });

  test("Converts |1⟩ state correctly", () => {
    const state = { a: { real: 0, imag: 0 }, b: { real: 1, imag: 0 } };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(0, 0, -1));
  });

  test("Converts |+⟩ = (|0⟩ + |1⟩)/√2 state correctly", () => {
    const state = {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: 1 / Math.sqrt(2), imag: 0 },
    };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(1, 0, 0));
  });

  test("Converts |-⟩ = (|0⟩ - |1⟩)/√2 state correctly", () => {
    const state = {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: -1 / Math.sqrt(2), imag: 0 },
    };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(-1, 0, 0));
  });

  test("Converts |i⟩ = (|0⟩ + i|1⟩)/√2 state correctly", () => {
    const state = {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: 0, imag: 1 / Math.sqrt(2) },
    };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(0, 1, 0));
  });

  test("Converts |-i⟩ = (|0⟩ - i|1⟩)/√2 state correctly", () => {
    const state = {
      a: { real: 1 / Math.sqrt(2), imag: 0 },
      b: { real: 0, imag: -1 / Math.sqrt(2) },
    };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(0, -1, 0));
  });

  test("Handles non-normalized states (|0⟩ + |1⟩)", () => {
    const state = { a: { real: 1, imag: 0 }, b: { real: 1, imag: 0 } };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(1, 0, 0));
  });

  test("Handles edge case with zero vector (a = b = 0)", () => {
    const state = { a: { real: 0, imag: 0 }, b: { real: 0, imag: 0 } };
    const result = ketToBlochVector(state);
    expectVectorClose(result, new THREE.Vector3(0, 0, 1)); // FALLBACK vector
  });

  test("Handles complex states with non-trivial components", () => {
    const state = {
      a: { real: 0.6, imag: 0 },
      b: { real: 0, imag: 0.8 },
    };
    const result = ketToBlochVector(state);
    const expected = new THREE.Vector3(0, 0.96, -0.28);
    expectVectorClose(result, expected);
  });
});
