"use client";
import React from "react";
import { Canvas, Vector3 } from "@react-three/fiber";
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

// Function to create a circle at a given height (y-value) with a specified radius
const HorizontalCircle = ({ radius, y }: { radius: number; y: number }) => {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
    );
  }
  return <Line points={points} color="gray" lineWidth={0.5} opacity={0.7} />;
};

// Function to create a vertical circle of the sphere at a given angle
const VerticalCircle = ({ angle }: { angle: number }) => {
  const points = [];
  for (let i = -32; i <= 32; i++) {
    const theta = (i / 32) * Math.PI; // From top (0) to bottom (π)
    const x = Math.sin(theta) * Math.cos(angle);
    const y = Math.cos(theta);
    const z = Math.sin(theta) * Math.sin(angle);
    points.push(new THREE.Vector3(x, y, z));
  }
  return <Line points={points} color="gray" lineWidth={0.5} opacity={0.7} />;
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
    <Canvas camera={{ position: [3, 3, 3], fov: 30 }}>
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

      {/* Horizontal Circles */}
      {[0.8, 0.4, 0, -0.4, -0.8].map((y) => (
        <HorizontalCircle key={y} radius={Math.sqrt(1 - y * y)} y={y} />
      ))}

      {/* Vertical Circles */}
      {[
        0,
        (1 * Math.PI) / 6,
        (2 * Math.PI) / 6,
        (3 * Math.PI) / 6,
        (4 * Math.PI) / 6,
        (5 * Math.PI) / 6,
      ].map((angle) => (
        <VerticalCircle key={angle} angle={angle} />
      ))}

      {/* Axes: X, Y, Z */}
      <Line
        points={[
          [-1, 0, 0],
          [1, 0, 0],
        ]} // X-axis line
        color={useColorModeValue("black", "white")}
        lineWidth={1}
      />
      <Line
        points={[
          [0, -1, 0],
          [0, 1, 0],
        ]} // Y-axis line
        color={useColorModeValue("black", "white")}
        lineWidth={1}
      />
      <Line
        points={[
          [0, 0, -1],
          [0, 0, 1],
        ]} // Z-axis line
        color={useColorModeValue("black", "white")}
        lineWidth={1}
      />

      {/* Bases */}
      {[
        {
          position: [0, 1.1, 0] as Vector3,
          text: "∣0⟩",
          color: useColorModeValue("black", "white"),
        },
        {
          position: [0, -1.1, 0] as Vector3,
          text: "∣1⟩",
          color: useColorModeValue("black", "white"),
        },
        {
          position: [1.1, 0, 0] as Vector3,
          text: "∣+⟩",
          color: useColorModeValue("black", "white"),
        },
        {
          position: [-1.1, 0, 0] as Vector3,
          text: "∣−⟩",
          color: useColorModeValue("black", "white"),
        },
      ].map((item, index) => {
        return (
          <Html key={index} position={item.position}>
            <div
              style={{
                fontSize: 18,
                color: item.color,
                width: "30px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "30px",
                transform: "translateX(-15px) translateY(-15px)",
              }}
            >
              {item.text}
            </div>
          </Html>
        );
      })}

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

      {/* <axesHelper args={[5]} /> */}
    </Canvas>
  );
};
