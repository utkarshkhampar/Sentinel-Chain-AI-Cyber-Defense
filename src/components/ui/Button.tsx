import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-glow hover:brightness-110 active:brightness-95",
        secondary: "bg-surface-hover text-text-primary border border-border-strong hover:bg-white/10",
        ghost: "bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary",
        outline: "bg-transparent border border-border-strong text-text-primary hover:bg-white/5",
        danger: "bg-severity-critical/15 text-severity-critical border border-severity-critical/30 hover:bg-severity-critical/25",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
