import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/locales";
import { IconButton } from "./IconButton";
import "./primitives.css";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "520px",
}) => {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);

  // Esc key closes modal (UX-009)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="dialog-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className="dialog-modal"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        ref={modalRef}
      >
        <div className="dialog-header">
          <h2 id="dialog-title" className="dialog-title">
            {title}
          </h2>
          <IconButton
            size="sm"
            aria-label={t.settings.close}
            onClick={onClose}
          >
            <X size={16} />
          </IconButton>
        </div>

        <div className="dialog-body">{children}</div>

        {footer && <div className="dialog-footer">{footer}</div>}
      </div>
    </div>
  );
};
