import { Button, Group, VStack } from "@chakra-ui/react";
import React from "react";
import { CollapsibleCard } from "@/components/collapsible-card/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/state/app-context";
import { LuRedo, LuUndo, LuUndo2 } from "react-icons/lu";
import { HGate, PGate, XGate, YGate, ZGate } from "@/lib/gates";

export const ConfigSection: React.FC = () => {
  const {
    settings: { showAxesHelper, changeShowAxesHelper },
    undo,
    redo,
    resetHistory,
    applyGate,
    canUndo,
    canRedo,
  } = useAppContext();

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
            X
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(YGate)}
          >
            Y
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(ZGate)}
          >
            Z
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(HGate)}
          >
            H
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(PGate(Math.PI /* TODO */))}
          >
            P(with PI parameter)
          </Button>
          <Button
            size={"sm"}
            variant={"subtle"}
            onClick={() => applyGate(PGate(Math.PI / 2))}
          >
            S
          </Button>
        </Group>
      </CollapsibleCard>
      <CollapsibleCard title="History">
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
            <LuUndo2 /> Reset state
          </Button>
        </Group>
      </CollapsibleCard>
      <CollapsibleCard title="Settings">
        <Checkbox
          variant={"subtle"}
          checked={showAxesHelper}
          onCheckedChange={(e) => changeShowAxesHelper(!!e.checked)}
        >
          Show axes helper (X: red. Y: green. Z: blue)
        </Checkbox>
      </CollapsibleCard>
    </VStack>
  );
};
