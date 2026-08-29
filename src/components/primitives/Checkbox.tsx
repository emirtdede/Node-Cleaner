import React from "react";
import { Check, Minus } from "lucide-react";
import "./primitives.css";

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  indeterminate = false,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
  id,
}) => {
  return (
    <label
      className={`checkbox-container ${checked ? "checkbox-checked" : ""} ${
        indeterminate ? "checkbox-indeterminate" : ""
      } ${disabled ? "disabled" : ""}`}
    >
      <input
        type="checkbox"
        id={id}
        className="checkbox-input"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="checkbox-box">
        {indeterminate ? (
          <Minus size={12} strokeWidth={3} />
        ) : checked ? (
          <Check size={12} strokeWidth={3} />
        ) : null}
      </div>
    </label>
  );
};
