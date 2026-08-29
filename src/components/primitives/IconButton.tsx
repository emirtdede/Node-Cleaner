import React from "react";
import "./primitives.css";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  "aria-label": string;
  tooltip?: string;
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = "md",
  "aria-label": ariaLabel,
  tooltip,
  children,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={`icon-btn icon-btn-${size} ${className}`}
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
