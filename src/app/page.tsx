"use client";
import { BlochSphere } from "@/components/bloch-sphere/bloch-sphere";
import { ConfigSection } from "@/components/config-section/config-section";
import { GithubButton } from "@/components/github-icon/github-icon";
import { ColorModeButton } from "@/components/ui/color-mode";
import { toaster } from "@/components/ui/toaster";
import { useAppContext } from "@/state/app-context";
import { Box, Stack, VStack } from "@chakra-ui/react";

import { Noto_Sans_Math } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const notoSansMath = Noto_Sans_Math({
  subsets: ["math"],
  display: "swap",
  weight: "400",
});

export default function Home() {
  const {
    history,
    currentHistoryIndex,
    settings: { showAxesHelper, showStats, drawPathForTheLastNGate },
    controlsRef,
    restoreHistory,
    historyRestorationSuccess,
    historyRestoreHappened,
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

  const drawnHistory =
    currentHistoryIndex === 0
      ? undefined
      : history.slice(
          currentHistoryIndex - drawPathForTheLastNGate < 0
            ? 0
            : currentHistoryIndex - drawPathForTheLastNGate,
          currentHistoryIndex + 1 === history.length
            ? undefined
            : currentHistoryIndex + 1,
        );

  return (
    <Box
      display={"flex"}
      minWidth={"100vw"}
      minHeight={"100vh"}
      maxWidth={"100vw"}
      maxHeight={"100vh"}
      overflow={"hidden"}
      className={notoSansMath.className}
    >
      <Box position={"absolute"} top={"6px"} right={"6px"} zIndex={100}>
        <ColorModeButton />
      </Box>
      <Box position={"absolute"} top={"6px"} right={"48px"} zIndex={100}>
        <GithubButton />
      </Box>
      <Stack
        direction={{ base: "column", md: "row" }}
        flex={1}
        alignItems={"stretch"}
      >
        <Box
          flex={1}
          position={"relative"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          userSelect={"none"}
        >
          <Box
            position={"relative"}
            w={"100%"}
            aspectRatio={"square"}
            cursor={"pointer"}
          >
            <BlochSphere
              arrowDirection={
                history[
                  currentHistoryIndex > history.length - 1
                    ? 0
                    : currentHistoryIndex
                ].currentState
              }
              tracking={
                currentHistoryIndex === 0
                  ? undefined
                  : drawnHistory?.slice(1, undefined).map((item, index) => ({
                      previousDirection: drawnHistory[index].currentState,
                      gateUsed: item.gateUsed,
                    }))
              }
              showAxesHelper={showAxesHelper}
              showStats={showStats}
              controlsRef={controlsRef}
            />
          </Box>
        </Box>
        <VStack flex={1} gap={16} paddingY={16} overflowY={"scroll"}>
          <ConfigSection />
        </VStack>
      </Stack>
    </Box>
  );
}
