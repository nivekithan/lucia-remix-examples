import { Slot } from "@radix-ui/react-slot";
import { Link, type LinkProps } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

export interface InlineLinkProps extends LinkProps {
  asChild?: boolean;
}

export function InlineLink({
  className,
  asChild = false,
  ...props
}: InlineLinkProps) {
  const Comp = asChild ? Slot : Link;
  return (
    <Comp
      className={twMerge(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline h9 px-0.5",
        className
      )}
      {...props}
    />
  );
}
