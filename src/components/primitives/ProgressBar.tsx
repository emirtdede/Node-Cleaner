import React from "react";
import "./primitives.css";

export interface ProgressBarProps {
  progress?: number; // 0 to 100
  indeterminate?: boolean;
  className?: string;
  "aria-label"?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress = 0,
  indeterminate = false,
  className = "",
  "aria-label": ariaLabel = "İlerleme",
}) => {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div
      className={`progress-bar-container ${className}`}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className={`progress-bar-fill ${indeterminate ? "progress-bar-indeterminate" : ""}`}
        style={indeterminate ? undefined : { width: `${clamped}%` }}
      />
    </div>
  );
};
