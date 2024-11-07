import { QuantumState } from "@/components/bloch-sphere/bloch-sphere";
import * as THREE from "three";

/**
 * Converts a quantum state in ket notation to a THREE.Vector3 representation on the Bloch sphere.
 *
 * @param a - The complex coefficient for |0⟩, as { real: number, imag: number }.
 * @param b - The complex coefficient for |1⟩, as { real: number, imag: number }.
 * @returns A THREE.Vector3 representing the Bloch sphere coordinates.
 */
export function ketToBlochVector({ a, b }: QuantumState): THREE.Vector3 {
  // Handling absolute zero
  if (a.real === 0 && a.imag === 0 && b.real === 0 && b.imag === 0) {
    console.error("FALLBACK vector because zeroes were given");
    return new THREE.Vector3(0, 0, 1); // Default to |0⟩ state
  }

  // Normalize the coefficients
  const norm = Math.sqrt(a.real ** 2 + a.imag ** 2 + b.real ** 2 + b.imag ** 2);

  const aNormalized = { real: a.real / norm, imag: a.imag / norm };
  const bNormalized = { real: b.real / norm, imag: b.imag / norm };

  // Compute magnitudes
  const magA = Math.sqrt(aNormalized.real ** 2 + aNormalized.imag ** 2);
  //const magB = Math.sqrt(bNormalized.real ** 2 + bNormalized.imag ** 2);

  // Compute phases
  const phaseA = Math.atan2(aNormalized.imag, aNormalized.real);
  const phaseB = Math.atan2(bNormalized.imag, bNormalized.real);

  // Compute spherical coordinates
  const theta = 2 * Math.acos(magA);
  const phi = phaseB - phaseA;

  // Compute Bloch vector components
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  console.log(
    `FROM\n(${a.real} + ${a.imag}i) * |0⟩ + (${b.real} + ${b.imag}i) * |1⟩\nTO\n{x: ${x}, y: ${y}, z: ${z}}`,
  );

  return new THREE.Vector3(x, y, z);
}
