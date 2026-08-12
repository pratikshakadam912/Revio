import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "primary" && "bg-black text-white hover:bg-black/85",
        variant === "secondary" &&
          "border border-black/10 bg-white text-black hover:bg-black/[0.03]",
        variant === "ghost" &&
          "bg-transparent text-black/70 hover:bg-black/[0.04] hover:text-black",
        className,
      )}
      {...props}
    />
  );
}
