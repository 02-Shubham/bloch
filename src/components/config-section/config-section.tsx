import { VStack } from "@chakra-ui/react";
import React from "react";
import { CollapsibleCard } from "@/components/collapsible-card/collapsible-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppContext } from "@/state/app-context";

export const ConfigSection: React.FC = () => {
  const {
    settings: { showAxesHelper, changeShowAxesHelper },
  } = useAppContext();

  return (
    <VStack
      alignSelf={"stretch"}
      alignItems={"stretch"}
      gap={4}
      paddingLeft={{ base: 2, md: 0 }}
      paddingRight={{ base: 2, md: 12 }}
    >
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
