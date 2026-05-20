import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonCustomProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "outline" | "ghost" | "link";
  size?: "sm" | "default" | "lg" | "icon";
  children: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonCustomProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      loading,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "active:scale-[0.98] active:duration-100",
          {
            "flex items-center justify-center gap-2": icon,
            "opacity-80 pointer-events-none": loading,
            "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-md":
              variant === "primary",
            "bg-white dark:bg-slate-950 border border-border hover:bg-accent/50 text-foreground":
              variant === "outline",
          },
          className
        )}
        variant={variant !== "primary" ? variant : "default"}
        size={size}
        disabled={loading || props.disabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="absolute inset-0 m-auto h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {icon && !loading && <span>{icon}</span>}
        <span className={cn({ "opacity-0": loading })}>{children}</span>
      </Button>
    );
  }
);

ButtonCustom.displayName = "ButtonCustom";

export { ButtonCustom };
