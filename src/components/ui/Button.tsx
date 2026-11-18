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
        "inline-flex cursor-pointer items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#719681] focus:ring-offset-2 focus:ring-offset-[#F7F5EF]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[#315E50] text-white hover:bg-[#264B3F] active:bg-[#203F35]",
        variant === "secondary" &&
          "border border-[#E7E5DC] bg-white/65 text-[#263B33] hover:border-[#D9C5A2] hover:bg-white",
        variant === "ghost" &&
          "bg-transparent text-[#777D76] hover:bg-[#315E50]/[0.06] hover:text-[#263B33]",
        className,
      )}
      {...props}
    />
  );
}
