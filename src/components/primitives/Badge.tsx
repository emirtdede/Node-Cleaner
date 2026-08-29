import React from "react";
import { PackageManagerType } from "@/types";
import "./primitives.css";

export interface BadgeProps {
  type?: PackageManagerType | "default";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type = "default",
  children,
  className = "",
}) => {
  return (
    <span className={`badge badge-${type} ${className}`}>
      {children}
    </span>
  );
};
