import { type VariantProps, cva } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

const headingVariants = cva(" font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      default: "text-2xl",
      "3xl": "text-3xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface HeaderProps
  extends React.HTMLAttributes<HTMLHeadElement>,
    VariantProps<typeof headingVariants> {}

export function Header({ className, size, ...props }: HeaderProps) {
  return (
    <h1 className={cn(headingVariants({ size, className }))} {...props}></h1>
  );
}
