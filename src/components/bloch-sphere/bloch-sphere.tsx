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
  Stats,
} from "@react-three/drei";
import * as THREE from "three";
import { useColorModeValue } from "@/components/ui/color-mode";
import { ketToBlochVector } from "@/lib/ket-to-bloch-vector";
import { Gate, QuantumState } from "@/types/bloch";
import { calculateIntermediateStates } from "@/lib/track-movement";

export interface BlochSphereProps {
  arrowDirection?: QuantumState | undefined;
  tracking?:
    | {
        previousDirection: QuantumState;
        gateUsed: Gate;
      }[]
    | undefined;
  arrowColor?: THREE.ColorRepresentation | undefined;
  showAxesHelper?: boolean | undefined;
  showStats?: boolean | undefined;
  drawPathForTheLastNGate?: number | undefined;
  // eslint-disable-next-line
  controlsRef?: React.Ref<any>;
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

// Function to create a circle at a given height (z-value) with a specified radius
const HorizontalCircle = ({ radius, z }: { radius: number; z: number }) => {
  const points = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.sin(angle) * radius, Math.cos(angle) * radius, z),
    );
  }
  return <Line points={points} color="gray" lineWidth={0.5} opacity={0.7} />;
};

// Function to create a vertical circle of the sphere at a given angle
const VerticalCircle = ({ angle }: { angle: number }) => {
  const points = [];
  for (let i = -32; i <= 32; i++) {
    const theta = (i / 32) * Math.PI; // From top (0) to bottom (π)
    const x = Math.sin(theta) * Math.sin(angle);
    const y = Math.sin(theta) * Math.cos(angle);
    const z = Math.cos(theta);
    points.push(new THREE.Vector3(x, y, z));
  }
  return <Line points={points} color="gray" lineWidth={0.5} opacity={0.7} />;
};

// Function to track the state movement
const TrackingLine = ({
  previousState,
  gateUsed,
  progress,
}: {
  previousState: QuantumState;
  gateUsed: Gate;
  progress: number;
}) => {
  const color = useColorModeValue(
    new THREE.Color(0x8000ff),
    new THREE.Color(0xffd700),
  );

  if (gateUsed.name !== "init") {
    const points: THREE.Vector3[] = calculateIntermediateStates(
      previousState,
      gateUsed.matrix,
    ).map((x) => ketToBlochVector(x));

    const opacity = Math.min(Math.max(progress, 0), 1);

    const vertexColors: [number, number, number, number][] = [];
    for (let i = 0; i < points.length; i++) {
      vertexColors.push([color.r, color.g, color.b, opacity]);
    }

    return (
      <Line
        points={points}
        color={color}
        vertexColors={vertexColors}
        lineWidth={2}
        depthTest={false}
      />
    );
  }
  return null;
};

export const BlochSphere: React.FC<BlochSphereProps> = ({
  arrowDirection,
  tracking,
  arrowColor = new THREE.Color(0x7dfff8),
  showAxesHelper = false,
  showStats = false,
  drawPathForTheLastNGate = 3,
  controlsRef = null,
}) => {
  const arrowLength = 1;
  const shaftRadius = 0.02;
  const headLength = 0.2;
  const headWidth = 0.08;

  // Get arrow transform data
  const { shaftPosition, headPosition, arrowQuaternion } = useArrowTransform(
    arrowDirection
      ? ketToBlochVector(arrowDirection)
      : ketToBlochVector({ a: { real: 1, imag: 0 }, b: { real: 0, imag: 0 } }),
    arrowLength,
  );

  // Create the rotation matrix
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationFromEuler(
    new THREE.Euler(-Math.PI / 2, 0, Math.PI, "XYZ"),
  );

  return (
    <Canvas camera={{ position: [-3, 3, 3], fov: 30 }}>
      {/* Controls for panning and rotating */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        zoomToCursor={false}
        enablePan={false}
      />

      {/* Light sources */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Rotation */}
      <group matrixAutoUpdate={false} matrix={rotationMatrix}>
        {/* Sphere */}
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            transparent
            opacity={useColorModeValue(0.05, 0.2)}
            color={useColorModeValue("gray", "white")}
            side={THREE.DoubleSide}
          />
        </Sphere>

        {tracking &&
          tracking.map((item, index) => {
            return (
              <TrackingLine
                key={index}
                previousState={item.previousDirection}
                gateUsed={item.gateUsed}
                progress={
                  (index + 1) /
                  Math.min(drawPathForTheLastNGate, tracking.length)
                }
              />
            );
          })}

        {/* Horizontal Circles */}
        {[0.8, 0.4, 0, -0.4, -0.8].map((z) => (
          <HorizontalCircle key={z} radius={Math.sqrt(1 - z * z)} z={z} />
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
            position: [0, 0, 1.1] as Vector3,
            text: "∣0⟩",
            color: useColorModeValue("black", "white"),
          },
          {
            position: [0, 0, -1.1] as Vector3,
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
          {
            position: [0, 1.1, 0] as Vector3,
            text: "∣ 𝑖⟩",
            color: useColorModeValue("black", "white"),
          },
          {
            position: [0, -1.1, 0] as Vector3,
            text: "∣−𝑖⟩",
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

        {showAxesHelper && <axesHelper args={[5]} />}

        {showStats && <Stats />}
      </group>
    </Canvas>
  );
};
