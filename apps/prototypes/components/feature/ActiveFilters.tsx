'use client';

import React from 'react';
import { Chip } from '@efficio/orbit';

interface ActiveFiltersProps {
  filters: { key: string; label: string }[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({ filters, onRemove, onClearAll }) => {
  if (filters.length === 0) return null;

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-s)',
    flexWrap: 'wrap',
    padding: `var(--orbit-space-s) var(--orbit-space-0)`,
  };

  const clearStyles: React.CSSProperties = {
    fontSize: 'var(--orbit-text-small-size)',
    fontWeight: 'var(--orbit-font-weight-medium)',
    fontFamily: 'var(--orbit-font-family-sans)',
    color: 'var(--orbit-color-btn-tertiary-fg)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
    lineHeight: 'var(--orbit-leading-tight)',
  };

  return (
    <div style={containerStyles}>
      <span
        style={{
          fontSize: 'var(--orbit-text-small-size)',
          fontFamily: 'var(--orbit-font-family-sans)',
          color: 'var(--orbit-color-text-secondary)',
          lineHeight: 'var(--orbit-leading-tight)',
        }}
      >
        Active filters:
      </span>
      {filters.map((filter) => (
        <Chip
          key={filter.key}
          label={filter.label}
          size="Small"
          removable
          onRemove={() => onRemove(filter.key)}
        />
      ))}
      <button style={clearStyles} onClick={onClearAll}>
        Clear all filters
      </button>
    </div>
  );
};
