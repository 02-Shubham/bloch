import { Button, Card, Group, Input, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CollapsibleCard } from "@/components/collapsible-card/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/state/app-context";
import {
  LuCircle,
  LuCircleDashed,
  LuCircleDot,
  LuMove3D,
  LuRedo,
  LuUndo,
  LuUndo2,
} from "react-icons/lu";
import { HGate, PGate, XGate, YGate, ZGate } from "@/lib/gates";
import {
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineRoot,
  TimelineTitle,
} from "@/components/ui/timeline";
import { create, all } from "mathjs";

const math = create(all);

export const ConfigSection: React.FC = () => {
  const {
    settings: { showAxesHelper, setShowAxesHelper, showStats, setShowStats },
    undo,
    redo,
    resetHistory,
    applyGate,
    canUndo,
    canRedo,
    history,
    currentHistoryIndex,
    resetRotation,
  } = useAppContext();

  const [phiExpression, setPhiExpression] = useState("pi/2");
  const [phiError, setPhiError] = useState(false);
  const [calculatedPhiExpression, setCalculatedPhiExpression] = useState(
    Math.PI / 2,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhiExpression(newValue);

    const TOLERANCE = 1e-12;

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

  return (
    <VStack
      alignSelf={"stretch"}
      alignItems={"stretch"}
      gap={4}
      paddingLeft={{ base: 2, md: 0 }}
      paddingRight={{ base: 2, md: 12 }}
    >
      <CollapsibleCard title="Gates">
        <Group wrap={"wrap"}>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(XGate)}
          >
            <strong>X</strong>
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(YGate)}
          >
            <strong>Y</strong>
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(ZGate)}
          >
            <strong>Z</strong>
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(HGate)}
          >
            <strong>H</strong>
          </Button>
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
              placeholder="e.g., e^(i*pi/sqrt(2))"
              value={phiExpression}
              onChange={handleChange}
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
        </Group>
      </CollapsibleCard>
      <CollapsibleCard title="History">
        <VStack gap={4} alignSelf={"stretch"} alignItems={"stretch"}>
          <Group wrap={"wrap"}>
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
            >
              <LuRedo /> Redo
            </Button>
            <Button
              size={"sm"}
              variant={"subtle"}
              colorPalette={"red"}
              onClick={() => resetHistory()}
            >
              <LuUndo2 /> Reset state to ∣0⟩
            </Button>
          </Group>
          <Card.Root w={"full"} maxH={"300px"} overflowY={"scroll"}>
            <Card.Body paddingBottom={0}>
              <TimelineRoot variant={"subtle"} w="full">
                {history.toReversed().map((item, index) => {
                  const reversedCurrentHistoryIndex =
                    history.length - 1 - currentHistoryIndex;
                  return (
                    <TimelineItem key={index}>
                      <TimelineConnector
                        {...(index === reversedCurrentHistoryIndex
                          ? { bg: "#317572", color: "teal.contrast" }
                          : index > reversedCurrentHistoryIndex
                            ? { bg: "gray.solid", color: "gray.contrast" }
                            : {})}
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
                          {item.gateUsed.name === "init"
                            ? "Initialized with ∣0⟩"
                            : `${item.gateUsed.name} gate used${item.gateUsed.name === "P" ? ` with parameter ϕ = ${item.gateUsed.originalExpression ?? item.gateUsed.phi}` : ""}`}
                        </TimelineTitle>
                        {/* <TimelineDescription>13th May 2021</TimelineDescription> */}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
              </TimelineRoot>
            </Card.Body>
          </Card.Root>
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
        </VStack>
      </CollapsibleCard>
    </VStack>
  );
};
