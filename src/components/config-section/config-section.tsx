import {
  Box,
  Button,
  Card,
  ClientOnly,
  GridItem,
  Group,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { CollapsibleCard } from "@/components/collapsible-card/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/state/app-context";
import {
  LuCircle,
  LuCircleDashed,
  LuCircleDot,
  LuHelpCircle,
  LuMove3D,
  LuRedo,
  LuShare,
  LuUndo,
} from "react-icons/lu";
import {
  CustomGate,
  HGate,
  PGate,
  SaGate,
  SGate,
  TGate,
  XGate,
  YGate,
  ZGate,
} from "@/lib/gates";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@/components/ui/timeline";
import { create, all } from "mathjs";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Complex } from "@/types/bloch";
import { isQuantumStateValid, TOLERANCE } from "@/lib/helper-operations";
import { isUnitary } from "@/lib/is-unitary";
import {
  stateToAnglesString,
  stateToCoordinatesString,
  stateToKetString,
} from "@/lib/state-parser";
import { useColorModeValue } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { useSearchParams } from "next/navigation";
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardRoot,
  HoverCardTrigger,
} from "../ui/hover-card";
import Latex from "react-latex-next";

const math = create(all);

export const ConfigSection: React.FC = () => {
  const {
    settings: {
      showAxesHelper,
      setShowAxesHelper,
      showStats,
      setShowStats,
      drawPathForTheLastNGate,
      setDrawPathForTheLastNGate,
    },
    undo,
    redo,
    goToState,
    resetHistory,
    applyGate,
    canUndo,
    canRedo,
    history,
    currentHistoryIndex,
    resetRotation,
    saveHistory,
    historyRestorationSuccess,
    historyRestoreHappened,
    restoreHistory,
  } = useAppContext();

  const searchParams = useSearchParams();
  const serializedState = searchParams.get("state");

  useEffect(() => {
    if (historyRestoreHappened === false && serializedState) {
      restoreHistory(serializedState);
    }
  }, []);

  useEffect(() => {
    if (historyRestorationSuccess !== "unknown") {
      if (historyRestorationSuccess === "success") {
        toaster.create({
          title: "State restored successfully",
          type: "success",
          duration: 2000,
        });
      } else {
        toaster.create({
          title: "Could not restore state",
          type: "error",
          duration: 2000,
        });
      }
    }
  }, [historyRestoreHappened, historyRestorationSuccess]);

  const [phiExpression, setPhiExpression] = useState("pi/2");
  const [phiError, setPhiError] = useState(false);
  const [calculatedPhiExpression, setCalculatedPhiExpression] = useState(
    Math.PI / 2,
  );

  const handlePhiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhiExpression(newValue);

    try {
      const value = math.evaluate(newValue);

      if (value === undefined) {
        setPhiError(true);
      } else if (typeof value === "number") {
        setPhiError(false);
        setCalculatedPhiExpression(value);
      } else if (
        value.im !== undefined &&
        value.re !== undefined &&
        typeof value.im === "number" &&
        typeof value.re === "number" &&
        Math.abs(value.im) < TOLERANCE
      ) {
        setPhiError(false);
        setCalculatedPhiExpression(value.re);
      } else {
        setPhiError(true);
      }
    } catch (_err) {
      setPhiError(true);
    }
  };

  const [custom00Expression, setCustom00Expression] = useState("1/sqrt(2)");
  const [custom00Error, setCustom00Error] = useState(false);
  const [calculatedCustom00Expression, setCalculatedCustom00Expression] =
    useState<Complex>({ real: 1 / Math.sqrt(2), imag: 0 });
  const [custom01Expression, setCustom01Expression] = useState("1/sqrt(2)");
  const [custom01Error, setCustom01Error] = useState(false);
  const [calculatedCustom01Expression, setCalculatedCustom01Expression] =
    useState<Complex>({ real: 1 / Math.sqrt(2), imag: 0 });
  const [custom10Expression, setCustom10Expression] = useState("1/sqrt(2)");
  const [custom10Error, setCustom10Error] = useState(false);
  const [calculatedCustom10Expression, setCalculatedCustom10Expression] =
    useState<Complex>({ real: 1 / Math.sqrt(2), imag: 0 });
  const [custom11Expression, setCustom11Expression] = useState("-1/sqrt(2)");
  const [custom11Error, setCustom11Error] = useState(false);
  const [calculatedCustom11Expression, setCalculatedCustom11Expression] =
    useState<Complex>({ real: -1 / Math.sqrt(2), imag: 0 });

  const [customGateError, setCustomGateError] = useState<string | null>(null);

  useEffect(() => {
    if (custom00Error || custom01Error || custom10Error || custom11Error) {
      setCustomGateError("Invalid expression(s)");
      return;
    }

    if (
      isUnitary({
        _00: calculatedCustom00Expression,
        _01: calculatedCustom01Expression,
        _10: calculatedCustom10Expression,
        _11: calculatedCustom11Expression,
      })
    ) {
      setCustomGateError(null);
      return;
    }

    setCustomGateError(
      "The given matrix is not a valid quantum gate because it's not unitary",
    );
  }, [
    calculatedCustom00Expression,
    calculatedCustom01Expression,
    calculatedCustom10Expression,
    calculatedCustom11Expression,
    custom00Error,
    custom01Error,
    custom10Error,
    custom11Error,
  ]);

  const handleCustomChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setExpression: (expression: string) => void,
    setCalculatedExpression: (calculatedExpression: Complex) => void,
    setError: (error: boolean) => void,
  ) => {
    const newValue = e.target.value;
    setExpression(newValue);

    try {
      const value = math.evaluate(newValue);

      if (value === undefined) {
        setError(true);
      } else if (typeof value === "number") {
        setError(false);
        setCalculatedExpression({ real: value, imag: 0 });
      } else if (
        value.im !== undefined &&
        value.re !== undefined &&
        typeof value.im === "number" &&
        typeof value.re === "number"
      ) {
        setError(false);
        setCalculatedExpression({ real: value.re, imag: value.im });
      } else {
        setError(true);
      }
    } catch (_err) {
      setError(true);
    }
  };

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const scrollToActiveItem = () => {
    const container = containerRef.current;
    const activeItem = itemRefs.current.get(
      history.length - 1 - currentHistoryIndex,
    );

    if (container && activeItem) {
      const containerRect = container.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();

      const scrollOffset =
        activeItemRect.top -
        containerRect.top +
        container.scrollTop -
        containerRect.height / 2 +
        activeItemRect.height / 2;

      container.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToActiveItem();
  }, [currentHistoryIndex]);

  const [drawForValue, setDrawForValue] = useState(
    drawPathForTheLastNGate.toString(),
  );
  const [drawForValueError, setDrawForValueError] = useState(false);

  useEffect(() => {
    const parsed = parseInt(drawForValue, 10);
    if (isNaN(parsed)) {
      setDrawForValueError(true);
      return;
    }

    if (parsed < 0) {
      setDrawForValueError(true);
      return;
    }

    setDrawForValueError(false);
    setDrawPathForTheLastNGate(parsed);
  }, [drawForValue]);

  const stateToPresent =
    history[currentHistoryIndex > history.length - 1 ? 0 : currentHistoryIndex]
      .currentState;

  const [ket0Expression, setKet0Expression] = useState("0");
  const [ket0Error, setKet0Error] = useState(false);
  const [calculatedKet0Expression, setCalculatedKet0Expression] =
    useState<Complex>({ real: 0, imag: 0 });
  const [ket1Expression, setKet1Expression] = useState("i");
  const [ket1Error, setKet1Error] = useState(false);
  const [calculatedKet1Expression, setCalculatedKet1Expression] =
    useState<Complex>({ real: 0, imag: 1 });
  const [customStateError, setCustomStateError] = useState<string | null>(null);

  useEffect(() => {
    if (ket0Error || ket1Error) {
      setCustomStateError("Invalid expression(s)");
      return;
    }

    if (
      isQuantumStateValid({
        a: calculatedKet0Expression,
        b: calculatedKet1Expression,
      })
    ) {
      setCustomStateError(null);
      return;
    }

    setCustomStateError(
      "The given state is not a valid quantum state because it's length is not 1",
    );
  }, [
    calculatedKet0Expression,
    calculatedKet1Expression,
    ket0Error,
    ket1Error,
  ]);

  /* const [statesHelpOpen, setStatesHelpOpen] = useState(false);
  const [gatesHelpOpen, setGatesHelpOpen] = useState(false); */

  return (
    <VStack
      alignSelf={"stretch"}
      alignItems={"stretch"}
      gap={4}
      paddingLeft={{ base: 2, md: 0 }}
      paddingRight={{ base: 2, md: 12 }}
    >
      <CollapsibleCard
        title={
          <HStack>
            <Text>Gates</Text>
            <HoverCardRoot
              size="sm"
              openDelay={500}
              closeDelay={100}
              /* open={gatesHelpOpen}
              onOpenChange={(e) => setGatesHelpOpen(e.open)} */
            >
              <HoverCardTrigger asChild>
                <Box display={{ base: "none", md: "block" }}>
                  <ClientOnly fallback={<Skeleton boxSize="8" />}>
                    <IconButton
                      variant="ghost"
                      aria-label="Info"
                      size="sm"
                      css={{
                        _icon: {
                          width: "5",
                          height: "5",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        //setGatesHelpOpen(true);
                      }}
                    >
                      <LuHelpCircle />
                    </IconButton>
                  </ClientOnly>
                </Box>
              </HoverCardTrigger>
              <HoverCardContent width="432px" maxWidth={"432px"}>
                <HoverCardArrow />
                <Box width="400px" whiteSpace={"pre-line"}>
                  <Latex>{String.raw`The well-known 1-bit quantum gates include the following:

                  $-$ Pauli-X Gate ($X$)
                  $-$ Pauli-Y Gate ($Y$)
                  $-$ Pauli-Z Gate ($Z$)
                  $-$ Hadamard Gate ($H$)
                  $-$ Phase Gate ($P(\phi)$)
                  $-$ Specific phase gates ($S, S^\dagger, T$)

                  To apply a 1-bit quantum gate to a general quantum state \( \psi = a\ket{0} + b\ket{1} \), you represent the quantum state as a vector:
                  \[
                  \psi = \begin{bmatrix} a \\ b \end{bmatrix}
                  \] Each gate corresponds to a specific unitary matrix \( U \). Applying the gate to the state involves multiplying the state vector by the gate matrix:
                  \[
                  \psi' = U \psi = U \begin{bmatrix} a \\ b \end{bmatrix}
                  \] where \( \psi' \) is the transformed quantum state. This operation evolves the state based on the chosen gate's transformation properties.

                  A quantum gate is valid if it is unitary, meaning its matrix representation \( U \) satisfies the following:
                  \[
                  U^\dagger U = U U^\dagger = I
                  \]
                  where \( U^\dagger \) is the conjugate transpose of \( U \).`}</Latex>
                </Box>
              </HoverCardContent>
            </HoverCardRoot>
          </HStack>
        }
      >
        <Group wrap={"wrap"}>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(XGate)}
              >
                <strong>X</strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`
                  $$
                  X = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}
                  $$
                  The X gate flips the state of a qubit along the X-axis of the Bloch sphere.`}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(YGate)}
              >
                <strong>Y</strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  Y = \begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}
                  $$
                  The Y gate introduces a combined flip and phase change by rotating the qubit around the Y-axis of the Bloch sphere by π. `}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(ZGate)}
              >
                <strong>Z</strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  Z = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}
                  $$
                  The Z gate applies a phase flip, inverting the phase of the qubit's state along the Z-axis of the Bloch sphere. `}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(HGate)}
              >
                <strong>H</strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  H = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}
                  $$
                  The H gate creates superposition by equally distributing the qubit's probability amplitude between its computational basis states and rotating it between the X and Z axes.`}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Group attached>
                <Button
                  size={"sm"}
                  variant={"subtle"}
                  onClick={() =>
                    applyGate(PGate(calculatedPhiExpression, phiExpression))
                  }
                  disabled={phiError}
                >
                  <strong>P</strong>(ϕ =
                </Button>
                <Input
                  size={"sm"}
                  placeholder="e^(pi*i)/sqrt(2)"
                  value={phiExpression}
                  onChange={handlePhiChange}
                  borderRadius={0}
                  borderColor={phiError ? "border.error" : "gray.subtle"}
                  width={"150px"}
                  marginRight={0}
                  _focus={{ outline: 0 }}
                  _active={{ outline: 0 }}
                />
                <Button
                  size={"sm"}
                  variant={"subtle"}
                  onClick={() =>
                    applyGate(PGate(calculatedPhiExpression, phiExpression))
                  }
                  disabled={phiError}
                >
                  )
                </Button>
              </Group>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  P = \begin{bmatrix} 1 & 0 \\ 0 & e^{i\phi} \end{bmatrix}
                  $$
                  The P gate introduces a controlled phase shift to a qubit's state, effectively adding a phase factor proportional to a specified angle. `}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(SGate)}
              >
                <strong>S</strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  S = \begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}
                  $$
                  The S gate applies a specific π/2 phase shift, introducing a quarter-turn rotation around the Z-axis. Basically it is a P(π/2) gate.`}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(SaGate)}
              >
                <strong>
                  S<sup>†</sup>
                </strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  S^\dagger = \begin{bmatrix} 1 & 0 \\ 0 & -i \end{bmatrix}
                  $$
                  The $ S^\dagger $ gate reverses the effect of the S gate, applying a −π/2 phase shift and effectively performing the inverse rotation around the Z-axis. Basically it is a P(−π/2) gate.`}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <HoverCardRoot size="sm" openDelay={500} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button
                size={"sm"}
                variant={"subtle"}
                onClick={() => applyGate(TGate)}
              >
                <strong>T</strong>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent maxWidth="240px">
              <HoverCardArrow />
              <Box>
                <Latex>
                  {String.raw`$$
                  T = \begin{bmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{bmatrix}
                  $$
                  The T gate introduces a precise π/4 phase shift, often used in fault-tolerant quantum computing to approximate arbitrary single-qubit operations. Basically it is a P(π/4) gate.`}
                </Latex>
              </Box>
            </HoverCardContent>
          </HoverCardRoot>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <Button size={"sm"} variant={"subtle"}>
                <strong>Custom...</strong>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                <SimpleGrid columns={6} columnGap={2}>
                  <GridItem>
                    <Text
                      fontSize={"40px"}
                      lineHeight={"40px"}
                      textAlign={"center"}
                    >
                      ⎡
                    </Text>
                  </GridItem>
                  <GridItem colSpan={2} paddingBottom={1}>
                    <Input
                      size={"sm"}
                      placeholder="1/sqrt(2)"
                      value={custom00Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom00Expression,
                          setCalculatedCustom00Expression,
                          setCustom00Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom00Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem colSpan={2} paddingBottom={1}>
                    <Input
                      size={"sm"}
                      placeholder="1/sqrt(2)"
                      value={custom01Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom01Expression,
                          setCalculatedCustom01Expression,
                          setCustom01Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom01Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text
                      fontSize={"40px"}
                      lineHeight={"40px"}
                      textAlign={"center"}
                    >
                      ⎤
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text
                      fontSize={"40px"}
                      lineHeight={"40px"}
                      textAlign={"center"}
                    >
                      ⎣
                    </Text>
                  </GridItem>
                  <GridItem colSpan={2} paddingTop={1}>
                    <Input
                      size={"sm"}
                      placeholder="1/sqrt(2)"
                      value={custom10Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom10Expression,
                          setCalculatedCustom10Expression,
                          setCustom10Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom10Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem colSpan={2} paddingTop={1}>
                    <Input
                      size={"sm"}
                      placeholder="-1/sqrt(2)"
                      value={custom11Expression}
                      onChange={(e) =>
                        handleCustomChange(
                          e,
                          setCustom11Expression,
                          setCalculatedCustom11Expression,
                          setCustom11Error,
                        )
                      }
                      borderRadius={0}
                      borderColor={
                        custom11Error ? "border.error" : "gray.solid"
                      }
                      marginRight={0}
                      _focus={{ outline: 0 }}
                      _active={{ outline: 0 }}
                    />
                  </GridItem>
                  <GridItem>
                    <Text
                      fontSize={"40px"}
                      lineHeight={"40px"}
                      textAlign={"center"}
                    >
                      ⎦
                    </Text>
                  </GridItem>
                  <GridItem colSpan={6} paddingTop={4}>
                    <VStack w={"full"} alignItems={"stretch"} gap={2}>
                      {customGateError !== null && (
                        <Text colorPalette={"red"} textAlign={"center"}>
                          {customGateError}
                        </Text>
                      )}
                      <Button
                        size={"sm"}
                        variant={"subtle"}
                        onClick={() =>
                          applyGate(
                            CustomGate(
                              {
                                _00: calculatedCustom00Expression,
                                _01: calculatedCustom01Expression,
                                _10: calculatedCustom10Expression,
                                _11: calculatedCustom11Expression,
                              },
                              {
                                _00: custom00Expression,
                                _01: custom01Expression,
                                _10: custom10Expression,
                                _11: custom11Expression,
                              },
                            ),
                          )
                        }
                        disabled={customGateError !== null}
                      >
                        <strong>Apply gate</strong>
                      </Button>
                    </VStack>
                  </GridItem>
                </SimpleGrid>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </Group>
      </CollapsibleCard>
      <CollapsibleCard
        title={
          <HStack>
            <Text>Current state</Text>
            <HoverCardRoot
              size="sm"
              openDelay={500}
              closeDelay={100}
              /* open={statesHelpOpen}
              onOpenChange={(e) => setStatesHelpOpen(e.open)} */
            >
              <HoverCardTrigger asChild>
                <Box display={{ base: "none", md: "block" }}>
                  <ClientOnly fallback={<Skeleton boxSize="8" />}>
                    <IconButton
                      variant="ghost"
                      aria-label="Info"
                      size="sm"
                      css={{
                        _icon: {
                          width: "5",
                          height: "5",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        //setStatesHelpOpen(true);
                      }}
                    >
                      <LuHelpCircle />
                    </IconButton>
                  </ClientOnly>
                </Box>
              </HoverCardTrigger>
              <HoverCardContent width="432px" maxWidth={"432px"}>
                <HoverCardArrow />
                <Box width="400px">
                  <Latex>
                    {String.raw`The two basis states:

                    \[
                    |0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}, \quad |1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}
                    \]

                    can represent any pure qubit state (ignoring global phase) using the following linear combination:

                    \[
                    |\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + \sin\left(\frac{\theta}{2}\right) e^{i\phi} |1\rangle = \begin{pmatrix} \alpha \\ \beta \end{pmatrix}
                    \]

                    Here, \(\theta\) is the polar angle, and \(\phi\) is the azimuthal angle. The state is represented on the Bloch sphere by a vector, where the angles \( \theta \) and \( \phi \) determine the direction of the vector. The Bloch vector is given by:

                    \[
                    \vec{r} = \begin{pmatrix} \sin \theta \cos \phi \\ \sin \theta \sin \phi \\ \cos \theta \end{pmatrix} = \begin{pmatrix} u \\ v \\ w \end{pmatrix}
                    \]

                    For the state to be valid, the following normalization condition must hold:
                    \[
                    |a|^2 + |b|^2 = 1
                    \]
                    This ensures that the total probability of measuring the qubit in either state \( |0\rangle \) or \( |1\rangle \) is 1. Here, \( |a|^2 \) is the probability of observing \( |0\rangle \), and \( |b|^2 \) is the probability of observing \( |1\rangle \).`}
                  </Latex>
                </Box>
              </HoverCardContent>
            </HoverCardRoot>
          </HStack>
        }
      >
        <VStack w={"full"} gap={2} alignItems={"stretch"}>
          <HStack gapX={4} gapY={1} wrap={"wrap"}>
            <Text opacity={0.7}>Superposition state:</Text>
            <Text>{stateToKetString(stateToPresent)}</Text>
          </HStack>
          <HStack gap={4} wrap={"wrap"}>
            <Text opacity={0.7}>Rotation angles:</Text>
            <HStack gap={12} wrap={"wrap"}>
              <Text>{stateToAnglesString(stateToPresent).split(";")[0]}</Text>
              <Text>{stateToAnglesString(stateToPresent).split(";")[1]}</Text>
            </HStack>
          </HStack>
          <HStack gap={4} wrap={"wrap"}>
            <Text opacity={0.7}>Coords:</Text>
            <HStack gap={12} wrap={"wrap"}>
              <Text>
                {stateToCoordinatesString(stateToPresent).split(";")[0]}
              </Text>
              <Text>
                {stateToCoordinatesString(stateToPresent).split(";")[1]}
              </Text>
              <Text>
                {stateToCoordinatesString(stateToPresent).split(";")[2]}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </CollapsibleCard>
      <CollapsibleCard title="History">
        <VStack gap={4} alignSelf={"stretch"} alignItems={"stretch"}>
          <Group wrap={"wrap"} gap={1}>
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={undo}
              disabled={!canUndo()}
            >
              <LuUndo /> Undo
            </Button>
            <Button
              size={"sm"}
              variant={"subtle"}
              onClick={redo}
              disabled={!canRedo()}
              marginRight={1}
            >
              <LuRedo /> Redo
            </Button>
            <HStack wrap={"nowrap"} gap={2}>
              <Text> Reset state to:</Text>
              <Group gap={1}>
                <Button
                  size={"sm"}
                  variant={"subtle"}
                  colorPalette={"red"}
                  onClick={() => resetHistory()}
                >
                  ∣0⟩
                </Button>
                <PopoverRoot>
                  <PopoverTrigger asChild>
                    <Button size={"sm"} variant={"subtle"} colorPalette={"red"}>
                      custom
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                      <SimpleGrid columns={4} columnGap={2}>
                        <GridItem>
                          <Text
                            fontSize={"40px"}
                            lineHeight={"40px"}
                            textAlign={"center"}
                          >
                            ⎡
                          </Text>
                        </GridItem>
                        <GridItem colSpan={2} paddingBottom={1}>
                          <Input
                            size={"sm"}
                            placeholder="0"
                            value={ket0Expression}
                            onChange={(e) => {
                              handleCustomChange(
                                e,
                                setKet0Expression,
                                setCalculatedKet0Expression,
                                setKet0Error,
                              );
                            }}
                            borderRadius={0}
                            borderColor={
                              ket0Error ? "border.error" : "gray.solid"
                            }
                            marginRight={0}
                            _focus={{ outline: 0 }}
                            _active={{ outline: 0 }}
                          />
                        </GridItem>
                        <GridItem>
                          <Text
                            fontSize={"40px"}
                            lineHeight={"40px"}
                            textAlign={"center"}
                          >
                            ⎤
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text
                            fontSize={"40px"}
                            lineHeight={"40px"}
                            textAlign={"center"}
                          >
                            ⎣
                          </Text>
                        </GridItem>
                        <GridItem colSpan={2} paddingTop={1}>
                          <Input
                            size={"sm"}
                            placeholder="0"
                            value={ket1Expression}
                            onChange={(e) => {
                              handleCustomChange(
                                e,
                                setKet1Expression,
                                setCalculatedKet1Expression,
                                setKet1Error,
                              );
                            }}
                            borderRadius={0}
                            borderColor={
                              ket1Error ? "border.error" : "gray.solid"
                            }
                            marginRight={0}
                            _focus={{ outline: 0 }}
                            _active={{ outline: 0 }}
                          />
                        </GridItem>
                        <GridItem>
                          <Text
                            fontSize={"40px"}
                            lineHeight={"40px"}
                            textAlign={"center"}
                          >
                            ⎦
                          </Text>
                        </GridItem>
                        <GridItem colSpan={4} paddingTop={4}>
                          <VStack w={"full"} alignItems={"stretch"} gap={2}>
                            {customStateError !== null && (
                              <Text colorPalette={"red"} textAlign={"center"}>
                                {customStateError}
                              </Text>
                            )}
                            <Button
                              size={"sm"}
                              variant={"subtle"}
                              onClick={() => {
                                resetHistory({
                                  a: calculatedKet0Expression,
                                  b: calculatedKet1Expression,
                                });
                              }}
                              disabled={customStateError !== null}
                            >
                              <strong>Reset to described state</strong>
                            </Button>
                          </VStack>
                        </GridItem>
                      </SimpleGrid>
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              </Group>
            </HStack>
          </Group>
          <Card.Root
            w={"full"}
            maxH={"300px"}
            overflowY={"scroll"}
            ref={containerRef}
          >
            <Card.Body paddingBottom={0}>
              <TimelineRoot variant={"subtle"} w="full">
                {history.toReversed().map((item, index) => {
                  const reversedCurrentHistoryIndex =
                    history.length - 1 - currentHistoryIndex;
                  return (
                    <TimelineItem
                      key={index}
                      ref={(el) => {
                        if (el) itemRefs.current.set(index, el);
                      }}
                    >
                      <TimelineConnector
                        {...(index === reversedCurrentHistoryIndex
                          ? { bg: "#317572", color: "teal.contrast" }
                          : index > reversedCurrentHistoryIndex
                            ? { bg: "gray.solid", color: "gray.contrast" }
                            : {})}
                        cursor={"pointer"}
                        onClick={() => {
                          goToState(history.length - 1 - index);
                        }}
                      >
                        {index === reversedCurrentHistoryIndex ? (
                          <LuCircleDot />
                        ) : index > reversedCurrentHistoryIndex ? (
                          <LuCircle />
                        ) : (
                          <LuCircleDashed />
                        )}
                      </TimelineConnector>
                      <TimelineContent>
                        <TimelineTitle>
                          <Text>
                            {item.gateUsed.name === "init" ? (
                              `Initialized with ${stateToKetString(item.currentState)}`
                            ) : (
                              <>
                                {item.gateUsed.name === "S†" ? (
                                  <>
                                    {"S"}
                                    <sup>†</sup>
                                  </>
                                ) : (
                                  item.gateUsed.name
                                )}
                                {` gate used`}
                              </>
                            )}
                          </Text>
                        </TimelineTitle>
                        {item.gateUsed.name === "P" && (
                          <TimelineDescription>
                            {`ϕ = ${
                              item.gateUsed.originalExpression ??
                              item.gateUsed.phi
                            }`}
                          </TimelineDescription>
                        )}
                        {item.gateUsed.name === "custom" && (
                          <SimpleGrid
                            columns={13}
                            gap={0}
                            alignSelf={"stretch"}
                            textAlign={"center"}
                          >
                            <GridItem>
                              <TimelineDescription>{`⎡`}</TimelineDescription>
                            </GridItem>
                            <GridItem colSpan={5}>
                              <TimelineDescription>
                                {item.gateUsed.originalExpressionMatrix._00}
                              </TimelineDescription>
                            </GridItem>
                            <GridItem>
                              <TimelineDescription>{`;`}</TimelineDescription>
                            </GridItem>
                            <GridItem colSpan={5}>
                              <TimelineDescription>
                                {item.gateUsed.originalExpressionMatrix._01}
                              </TimelineDescription>
                            </GridItem>
                            <GridItem>
                              <TimelineDescription>{`⎤`}</TimelineDescription>
                            </GridItem>
                            <GridItem>
                              <TimelineDescription>{`⎣`}</TimelineDescription>
                            </GridItem>
                            <GridItem colSpan={5}>
                              <TimelineDescription>
                                {item.gateUsed.originalExpressionMatrix._10}
                              </TimelineDescription>
                            </GridItem>
                            <GridItem>
                              <TimelineDescription>{`;`}</TimelineDescription>
                            </GridItem>
                            <GridItem colSpan={5}>
                              <TimelineDescription>
                                {item.gateUsed.originalExpressionMatrix._11}
                              </TimelineDescription>
                            </GridItem>
                            <GridItem>
                              <TimelineDescription>{`⎦`}</TimelineDescription>
                            </GridItem>
                          </SimpleGrid>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </TimelineRoot>
            </Card.Body>
          </Card.Root>
          <Button
            alignSelf={"flex-start"}
            size={"sm"}
            variant={"subtle"}
            background={"#317572"}
            _hover={{ background: useColorModeValue("teal.700", "teal.600") }}
            color={"teal.contrast"}
            onClick={() => {
              toaster.promise(
                navigator.clipboard.writeText(
                  `${window.location.origin}/?state=${saveHistory()}`,
                ),
                {
                  success: {
                    title: "Shareable link is copied to clipboard",
                    duration: 2000,
                  },
                  error: {
                    title: "Could not share current history",
                  },
                  loading: { title: "Saving..." },
                },
              );
            }}
          >
            <LuShare /> Share
          </Button>
        </VStack>
      </CollapsibleCard>
      <CollapsibleCard title="Settings">
        <VStack gap={4} alignSelf={"stretch"} alignItems={"stretch"}>
          <Button
            size={"sm"}
            variant={"subtle"}
            colorPalette={"red"}
            onClick={resetRotation}
            alignSelf={"flex-start"}
          >
            <LuMove3D /> Reset rotation, zoom
          </Button>
          <Checkbox
            variant={"subtle"}
            checked={showAxesHelper}
            onCheckedChange={(e) => setShowAxesHelper(!!e.checked)}
          >
            Show axes helper (X: red. Y: green. Z: blue)
          </Checkbox>
          <Checkbox
            variant={"subtle"}
            checked={showStats}
            onCheckedChange={(e) => setShowStats(!!e.checked)}
          >
            Show stats
          </Checkbox>
          <HStack gap={2} wrap={"wrap"}>
            <Text>Draw the trace for the last </Text>
            <Input
              size={"sm"}
              placeholder="3"
              width={"75px"}
              value={drawForValue}
              onChange={(e) => {
                setDrawForValue(e.target.value);
              }}
              borderRadius={0}
              borderColor={drawForValueError ? "border.error" : "gray.subtle"}
              marginRight={0}
              _focus={{ outline: 0 }}
              _active={{ outline: 0 }}
            />
            <Text> gate(s) applied.</Text>
          </HStack>
        </VStack>
      </CollapsibleCard>
    </VStack>
  );
};
