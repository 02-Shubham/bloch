import {
  Box,
  ClientOnly,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { LuHelpCircle } from "react-icons/lu";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";

export const HelpButton: React.FC = () => {
  return (
    <DialogRoot
      size={"lg"}
      placement="center"
      motionPreset="slide-in-bottom"
      scrollBehavior={"inside"}
    >
      <DialogTrigger asChild>
        <Box>
          <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
              variant="ghost"
              aria-label="Show explanation"
              size="sm"
              css={{
                _icon: {
                  width: "5",
                  height: "5",
                },
              }}
            >
              <LuHelpCircle />
            </IconButton>
          </ClientOnly>
        </Box>
      </DialogTrigger>
      <DialogContent marginX={8}>
        <DialogHeader>
          <DialogTitle>Bloch sphere</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          <VStack gap={4} alignItems={"center"}>
            <VStack gap={1} alignItems={"stretch"}>
              <Text fontWeight={700}>Introduction</Text>
              <Text whiteSpace={"pre-line"}>{String.raw`
          The Bloch sphere is an extremely useful geometrical tool used in quantum mechanics to visualize and analyze the quantum states of two-state quantum systems, also known as qubits. The Bloch sphere is named after the Swiss physicist Felix Bloch. The state of a qubit is typically represented as a two-component vector of complex numbers with a magnitude of 1.

          The Bloch sphere provides a 3D representation of quantum states, where the north and south poles represent the basis states, ∣0⟩ and ∣1⟩, respectively. Unitary transformations, which encompass quantum gates and other quantum operations, appear on the Bloch sphere as rotations. These rotations around specific axes correspond to particular unitary transformations that modify the quantum states.`}</Text>
            </VStack>
            <Image
              src="/meme.webp"
              width={500}
              height={500}
              alt="Very funny meme about quantum theory"
            />
          </VStack>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
