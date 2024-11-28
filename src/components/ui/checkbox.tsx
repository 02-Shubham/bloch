import {
  Checkbox as ChakraCheckbox,
  ClientOnly,
  Skeleton,
} from "@chakra-ui/react";
import { forwardRef } from "react";

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { icon, children, inputProps, rootRef, ...rest } = props;
    return (
      <ClientOnly fallback={<Skeleton height={6} width={16} />}>
        <ChakraCheckbox.Root ref={rootRef} {...rest}>
          <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
          <ChakraCheckbox.Control>
            {icon || <ChakraCheckbox.Indicator width={"full"} />}
          </ChakraCheckbox.Control>
          {children != null && (
            <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
          )}
        </ChakraCheckbox.Root>
      </ClientOnly>
    );
  },
);
