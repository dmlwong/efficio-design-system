'use client';

import React from 'react';

export interface RadialIndicatorProps {
  status?: 'Success' | 'Information' | 'Error' | 'Warning' | 'No Status';
  progress?: number; // 0-100, defaults to 75
  size?: number; // defaults to --orbit-radial-size (24px)
  ariaLabel?: string;
}

// These mirror the component tokens in components.css but are consumed as numbers for SVG math
const RADIAL_STROKE_RADIUS = 6; // --orbit-radial-stroke-radius
const RADIAL_STROKE_WIDTH = 2.5; // --orbit-radial-stroke-width

export const RadialIndicator: React.FC<RadialIndicatorProps> = ({
  status = 'Success',
  progress = 75,
  size = 24, // --orbit-radial-size
  ariaLabel,
}) => {
  const trackColorMap: Record<string, string> = {
    Success: 'var(--orbit-color-radial-track-success)',
    Information: 'var(--orbit-color-radial-track-information)',
    Error: 'var(--orbit-color-radial-track-error)',
    Warning: 'var(--orbit-color-radial-track-warning)',
    'No Status': 'var(--orbit-color-radial-track-no-status)',
  };

  const arcColorMap: Record<string, string> = {
    Success: 'var(--orbit-color-status-high-bg-success)',
    Information: 'var(--orbit-color-status-high-bg-information)',
    Error: 'var(--orbit-color-status-high-bg-error)',
    Warning: 'var(--orbit-color-status-high-bg-warning)',
    'No Status': 'var(--orbit-color-status-high-bg-no-status)',
  };

  const r = RADIAL_STROKE_RADIUS;
  const circumference = 2 * Math.PI * r;
  const boundedProgress = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;
  const offset = circumference - (boundedProgress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={ariaLabel || `${status} progress ${boundedProgress}%`}
      style={{ transform: 'rotate(-90deg)' }}
    >
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke={trackColorMap[status]}
        strokeWidth={RADIAL_STROKE_WIDTH}
      />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke={arcColorMap[status]}
        strokeWidth={RADIAL_STROKE_WIDTH}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
};
