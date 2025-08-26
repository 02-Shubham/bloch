import { ClientOnly, IconButton, Skeleton } from "@chakra-ui/react";
import React from "react";
import { LuGithub } from "react-icons/lu";

export const GithubButton: React.FC = () => (
  <ClientOnly fallback={<Skeleton boxSize="8" />}>
    {/* <IconButton
      onClick={() => {
        window.open("https://github.com/dolnaaa/bloch-sphere", "_blank");
      } }
      variant="ghost"
      aria-label="Navigate to github"
      size="sm"
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <LuGithub />
    </IconButton> */}
  </ClientOnly>
);
