import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface RsvCtaPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  "data-testid"?: string;
}

export function RsvCtaPrimary({
  children,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  size = "md",
  disabled,
  className,
  "data-testid": testId = "rsv-cta-primary",
  ...props
}: RsvCtaPrimaryProps) {
  const sizeMap = {
    sm: "h-9 px-4 text-sm rounded-control",
    md: "h-11 px-6 text-sm rounded-control",
    lg: "h-13 px-8 text-base rounded-card",
  };

  return (
    <button
      data-testid={testId}
      disabled={disabled || loading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 font-semibold transition-all",
        "bg-gradient-to-r from-blue-700 to-blue-600 text-white",
        "border border-blue-700/60 shadow-card",
        "hover:from-blue-800 hover:to-blue-700 hover:shadow-elevated",
        "active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:pointer-events-none",
        sizeMap[size],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {loading && (
        <Loader2
          data-testid={`${testId}-spinner`}
          className="w-4 h-4 animate-spin shrink-0"
        />
      )}
      {!loading && icon && iconPosition === "left" && (
        <span data-testid={`${testId}-icon-left`} className="shrink-0 w-4 h-4 flex items-center">
          {icon}
        </span>
      )}
      <span data-testid={`${testId}-label`}>{children}</span>
      {!loading && icon && iconPosition === "right" && (
        <span data-testid={`${testId}-icon-right`} className="shrink-0 w-4 h-4 flex items-center">
          {icon}
        </span>
      )}
    </button>
  );
}
