"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  Line,
  Html,
  Cylinder,
  Cone,
} from "@react-three/drei";
import * as THREE from "three";
import { useColorModeValue } from "../ui/color-mode";

export interface BlochSphereProps {
  arrowDirection?: THREE.Vector3 | undefined;
  arrowColor?: THREE.ColorRepresentation | undefined;
}

// Function to calculate position and rotation for the arrow based on direction
const useArrowTransform = (direction: THREE.Vector3, length: number) => {
  // Normalize the direction to make it a unit vector
  const normalizedDir = direction.clone().normalize();

  // Compute the rotation quaternion
  const arrowQuaternion = new THREE.Quaternion();
  arrowQuaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normalizedDir);

  // Compute the position based on the length and direction
  const shaftPosition = normalizedDir
    .clone()
    .multiplyScalar((length - 0.2) / 2);
  const headPosition = normalizedDir.clone().multiplyScalar(length - 0.2 / 2);

  return { shaftPosition, headPosition, arrowQuaternion };
};

export const BlochSphere: React.FC<BlochSphereProps> = ({
  arrowDirection,
  arrowColor = "lightgreen",
}) => {
  const arrowLength = 1;
  const shaftRadius = 0.02;
  const headLength = 0.2;
  const headWidth = 0.08;

  // Get arrow transform data
  const { shaftPosition, headPosition, arrowQuaternion } = useArrowTransform(
    arrowDirection || new THREE.Vector3(0, 1, 0),
    arrowLength,
  );

  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 35 }}>
      {/* Controls for panning and rotating */}
      <OrbitControls enableZoom={true} zoomToCursor={false} enablePan={false} />

      {/* Light sources */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial
          transparent
          opacity={useColorModeValue(0.05, 0.2)}
          color={useColorModeValue("gray", "white")}
          side={THREE.DoubleSide}
        />
      </Sphere>

      {/* Axes: X, Y, Z */}
      <Line
        points={[
          [-1, 0, 0],
          [1, 0, 0],
        ]} // X-axis line
        color={useColorModeValue("black", "white")}
        lineWidth={1}
      />
      <Html position={[1.1, 0, 0]}>
        <div
          style={{
            color: useColorModeValue("black", "white"),
            fontWeight: "bold",
          }}
        >
          x
        </div>
      </Html>

      <Line
        points={[
          [0, -1, 0],
          [0, 1, 0],
        ]} // Y-axis line
        color={useColorModeValue("black", "white")}
        lineWidth={1}
      />
      <Html position={[0, 1.1, 0]}>
        <div
          style={{
            color: useColorModeValue("black", "white"),
            fontWeight: "bold",
          }}
        >
          y
        </div>
      </Html>

      <Line
        points={[
          [0, 0, -1],
          [0, 0, 1],
        ]} // Z-axis line
        color={useColorModeValue("black", "white")}
        lineWidth={1}
      />
      <Html position={[0, 0, 1.1]}>
        <div
          style={{
            color: useColorModeValue("black", "white"),
            fontWeight: "bold",
          }}
        >
          z
        </div>
      </Html>

      {/* Custom arrow */}
      <Cylinder
        args={[shaftRadius, shaftRadius, arrowLength - headLength, 32]}
        position={[shaftPosition.x, shaftPosition.y, shaftPosition.z]}
        quaternion={arrowQuaternion}
      >
        <meshStandardMaterial color={arrowColor} />
      </Cylinder>

      <Cone
        args={[headWidth, headLength, 32]}
        position={[headPosition.x, headPosition.y, headPosition.z]}
        quaternion={arrowQuaternion}
      >
        <meshStandardMaterial color={arrowColor} />
      </Cone>
    </Canvas>
  );
};
