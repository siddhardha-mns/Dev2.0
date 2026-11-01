import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-catalyst-forest focus-visible:ring-offset-2 active:opacity-80 disabled:pointer-events-none disabled:opacity-50", { variants: { variant: { default: "bg-catalyst-forest text-white hover:bg-catalyst-ink", outline: "border border-catalyst-line bg-transparent hover:bg-catalyst-sage", ghost: "hover:bg-catalyst-sage" }, size: { default: "min-h-11 px-4 py-2", sm: "min-h-11 rounded-md px-3", lg: "h-11 rounded-md px-8" } }, defaultVariants: { variant: "default", size: "default" } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => { const Comp = asChild ? Slot : "button"; return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />; });
Button.displayName = "Button";
export { buttonVariants };
