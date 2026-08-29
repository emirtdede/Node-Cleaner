import React from "react";

export interface LogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 22,
  className = "",
  showWordmark = false,
}) => {
  return (
    <div
      className={`logo-container ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        userSelect: "none",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Node Cleaner Logo"
      >
        <defs>
          <linearGradient id="nc-grad-primary" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A84FF" />
            <stop offset="1" stopColor="#0055D4" />
          </linearGradient>
          <linearGradient id="nc-grad-glass" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="1" stopColor="rgba(255, 255, 255, 0.05)" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Hexagon / Module Base */}
        <rect
          x="3"
          y="3"
          width="26"
          height="26"
          rx="7"
          fill="url(#nc-grad-primary)"
        />

        {/* Clean Facet Inner Overlay */}
        <path
          d="M3 10C3 6.13401 6.13401 3 10 3H22C25.866 3 29 6.13401 29 10V16L16 29H10C6.13401 29 3 25.866 3 22V10Z"
          fill="url(#nc-grad-glass)"
        />

        {/* Central Geometric Node Connections */}
        <circle cx="16" cy="11" r="3.2" fill="#FFFFFF" />
        <circle cx="10" cy="21" r="2.6" fill="#FFFFFF" />
        <circle cx="22" cy="21" r="2.6" fill="#FFFFFF" />

        {/* Node Connectivity Lines */}
        <path
          d="M16 11L10 21M16 11L22 21M10 21L22 21"
          stroke="#FFFFFF"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Clean Sparkle Highlight */}
        <path
          d="M24.5 5.5L25.2 7.2L26.9 7.9L25.2 8.6L24.5 10.3L23.8 8.6L22.1 7.9L23.8 7.2L24.5 5.5Z"
          fill="#FFFFFF"
        />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontSize: 14,
            fontWeight: 650,
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
          }}
        >
          Node Cleaner
        </span>
      )}
    </div>
  );
};

