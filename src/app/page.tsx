import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Center, HStack, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      display={"flex"}
      minWidth={"100vw"}
      minHeight={"100vh"}
      maxWidth={"100vw"}
      maxHeight={"100vh"}
      overflow={"hidden"}
    >
      <Box position={"absolute"} top={4} right={4}>
        <ColorModeButton />
      </Box>
      <HStack flex={1}>
        <Center flex={1}>
          <Text>[sphere]</Text>
        </Center>
        <Center flex={1}>
          <Text>[config]</Text>
        </Center>
      </HStack>
    </Box>
  );
}
