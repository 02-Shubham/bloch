import { Flex, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export const Logo: React.FC = () => {
  return (
    <HStack gap={1.5} height={"36px"}>
      <Flex boxSize={"36px"} alignItems={"center"} justifyContent={"center"}>
        <Image src={"/icon.webp"} alt="Icon" width={28} height={28} />
      </Flex>
      <Text letterSpacing={-0.5}>Bloch sphere simulator</Text>
    </HStack>
  );
};
