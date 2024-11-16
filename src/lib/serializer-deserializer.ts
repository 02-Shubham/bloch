import { HistoryItem } from "@/state/app-context";
import { Complex, Gate, Matrix2x2, QuantumState } from "@/types/bloch";
import LZString from "lz-string";

// Utility to encode Complex numbers
const encodeComplex = (complex: Complex): string =>
  `${complex.real}|${complex.imag}`;

// Utility to decode Complex numbers
const decodeComplex = (str: string): Complex => {
  const [real, imag] = str.split("|").map(Number);
  return { real, imag };
};

// Serializer for the QuantumState
const serializeQuantumState = (state: QuantumState): string => {
  return `${encodeComplex(state.a)}~${encodeComplex(state.b)}`;
};

const deserializeQuantumState = (data: string): QuantumState => {
  const [a, b] = data.split("~").map(decodeComplex);
  return { a, b };
};

// Serializer for the Gate
const serializeGate = (gate: Gate): string => {
  if (gate.name === "init") return gate.name;

  const base = `${gate.name};${serializeComplexMatrix(gate.matrix)}`;
  if (gate.name === "P") {
    return `${base};${gate.phi};${gate.originalExpression ?? ""}`;
  } else if (gate.name === "custom") {
    return `${base};${serializeStringMatrix(gate.originalExpressionMatrix)}`;
  } else if (gate.name === "rotation") {
    return base;
  }
  return base;
};

const deserializeGate = (data: string): Gate => {
  const [name, matrix, ...rest] = data.split(";");
  if (name === "init") return { name: "init" };

  const deserializedMatrix = deserializeComplexMatrix(matrix);

  if (name === "P") {
    const [phi, originalExpression] = rest;
    return {
      name: "P",
      matrix: deserializedMatrix,
      phi: parseFloat(phi),
      originalExpression: originalExpression || undefined,
    };
  } else if (name === "custom") {
    const [originalExpressionMatrix] = rest;
    return {
      name: "custom",
      matrix: deserializedMatrix,
      originalExpressionMatrix: deserializeStringMatrix(
        originalExpressionMatrix,
      ),
    };
  } else if (name === "rotation") {
    return { name: "rotation", matrix: deserializedMatrix };
  }
  // eslint-disable-next-line
  return { name: name as any, matrix: deserializedMatrix };
};

// Serializer for Matrix2x2<Complex>
const serializeComplexMatrix = (matrix: Matrix2x2<Complex>): string => {
  return `${encodeComplex(matrix._00)}:${encodeComplex(matrix._01)}:${encodeComplex(
    matrix._10,
  )}:${encodeComplex(matrix._11)}`;
};

// Serializer for Matrix2x2<Complex>
const serializeStringMatrix = (matrix: Matrix2x2<string>): string => {
  return `${matrix._00}\u202F${matrix._01}\u202F${matrix._10}\u202F${matrix._11}`;
};

const deserializeComplexMatrix = (data: string): Matrix2x2<Complex> => {
  const [c00, c01, c10, c11] = data.split(":").map(decodeComplex);
  return { _00: c00, _01: c01, _10: c10, _11: c11 };
};

const deserializeStringMatrix = (data: string): Matrix2x2<string> => {
  const [c00, c01, c10, c11] = data.split("\u202F");
  return { _00: c00, _01: c01, _10: c10, _11: c11 };
};

// Serialize the full HistoryItem
const serializeHistoryItem = (item: HistoryItem): string => {
  return `${serializeQuantumState(item.currentState)}\u23AF${serializeGate(
    item.gateUsed,
  )}`;
};

const deserializeHistoryItem = (data: string): HistoryItem => {
  const [currentState, gateUsed] = data.split("\u23AF");
  return {
    currentState: deserializeQuantumState(currentState),
    gateUsed: deserializeGate(gateUsed),
  };
};

// Serialize the full history
export const serializeHistory = (history: HistoryItem[]): string => {
  const serialized = history.map(serializeHistoryItem).join("#");
  return LZString.compressToEncodedURIComponent(serialized);
};

// Deserialize the full history
export const deserializeHistory = (data: string): HistoryItem[] => {
  const decompressed = LZString.decompressFromEncodedURIComponent(data);
  if (!decompressed) throw new Error("Failed to decompress data");
  return decompressed.split("#").map(deserializeHistoryItem);
};
