"use client";
import { BlochSphere } from "@/components/bloch-sphere/bloch-sphere";
import { ConfigSection } from "@/components/config-section/config-section";
import { HelpButton } from "@/components/help-icon/help-icon";
// import { Logo } from "@/components/logo/logo";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useAppContext } from "@/state/app-context";
import { Box, Stack, VStack } from "@chakra-ui/react";

import { Suspense } from "react";

export default function Home() {
  const {
    history,
    currentHistoryIndex,
    settings: { showAxesHelper, showStats, drawPathForTheLastNGate },
    controlsRef,
  } = useAppContext();

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
    >
      {/* <Box position={"absolute"} top={"6px"} left={"6px"} zIndex={100}>
        <Logo />
      </Box> */}
      <Box position={"absolute"} top={"6px"} right={"6px"} zIndex={100}>
        <ColorModeButton />
      </Box>
      {/* <Box position={"absolute"} top={"6px"} right={"48px"} zIndex={100}>
        <GithubButton />
      </Box> */}
      <Box position={"absolute"} top={"6px"} right={"90px"} zIndex={100}>
        <HelpButton />
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
          zIndex={1}
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
        <VStack flex={1} gap={16} paddingY={16} overflowY={"scroll"} zIndex={2}>
          <Suspense>
            <ConfigSection />
          </Suspense>
        </VStack>
      </Stack>
    </Box>
  );
}
