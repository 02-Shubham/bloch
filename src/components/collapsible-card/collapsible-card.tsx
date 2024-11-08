import {
  Card,
  ClientOnly,
  Collapsible,
  IconButton,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

export interface CollapsibleCardProps {
  title: string;
  children: React.ReactNode;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card.Root>
      <Card.Body>
        <Collapsible.Root
          open={!isCollapsed}
          onOpenChange={() => setIsCollapsed(!isCollapsed)}
          display={"flex"}
          flexDirection={"column"}
          gap="2"
        >
          <Collapsible.Trigger width={"full"} cursor={"pointer"}>
            <Card.Title
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text>{title}</Text>
              <ClientOnly fallback={<Skeleton boxSize="8" />}>
                <IconButton
                  variant="ghost"
                  aria-label="Collapse card"
                  size="xs"
                  css={{
                    _icon: {
                      width: "4",
                      height: "4",
                    },
                  }}
                >
                  {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
                </IconButton>
              </ClientOnly>
            </Card.Title>
          </Collapsible.Trigger>
          <Collapsible.Content>{children}</Collapsible.Content>
        </Collapsible.Root>
      </Card.Body>
    </Card.Root>
  );
};
