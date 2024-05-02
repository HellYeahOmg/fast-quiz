"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@radix-ui/themes";

export function SubmitButton({ children, ...rest }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" aria-disabled={pending} loading={pending} {...rest}>
      {children}
    </Button>
  );
}
