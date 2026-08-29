import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./context-menu.css";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Esc
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Need a tiny timeout so it doesn't trigger immediately on the click that opened it
    const timerId = setTimeout(() => {
      document.addEventListener("click", handleGlobalClick);
      document.addEventListener("contextmenu", handleGlobalClick);
      document.addEventListener("keydown", handleKeyDown);
    }, 10);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("click", handleGlobalClick);
      document.removeEventListener("contextmenu", handleGlobalClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Make sure menu doesn't overflow screen
  let styleX = x;
  let styleY = y;
  if (menuRef.current) {
    const rect = menuRef.current.getBoundingClientRect();
    if (x + rect.width > window.innerWidth) {
      styleX = x - rect.width;
    }
    if (y + rect.height > window.innerHeight) {
      styleY = y - rect.height;
    }
  }

  const menu = (
    <div
      ref={menuRef}
      className="context-menu-container glass-surface"
      style={{ top: styleY, left: styleX }}
      onContextMenu={(e) => {
        e.preventDefault(); // Prevent double context menu
        e.stopPropagation();
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          className={`context-menu-item ${item.danger ? "danger" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
        >
          {item.icon && <span className="context-menu-icon">{item.icon}</span>}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );

  return createPortal(menu, document.body);
};
