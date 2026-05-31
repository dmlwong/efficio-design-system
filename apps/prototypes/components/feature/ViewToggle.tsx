'use client';

import React from 'react';

interface ViewToggleProps {
  view: 'table' | 'card';
  onViewChange: (view: 'table' | 'card') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    border: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
    borderRadius: 'var(--orbit-radius-sm)',
    overflow: 'hidden',
  };

  const getButtonStyles = (isActive: boolean): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--orbit-space-xs)',
    padding: `var(--orbit-space-xs) var(--orbit-space-s)`,
    fontSize: 'var(--orbit-text-small-size)',
    fontWeight: isActive ? 'var(--orbit-font-weight-semibold)' : 'var(--orbit-font-weight-regular)',
    fontFamily: 'var(--orbit-font-family-sans)',
    color: isActive ? 'var(--orbit-color-text-inverse)' : 'var(--orbit-color-text-primary)',
    backgroundColor: isActive ? 'var(--orbit-color-efficio-blue)' : 'var(--orbit-color-bg-default)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    lineHeight: 'var(--orbit-leading-tight)',
  });

  const tableIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="5.5" width="12" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="10" width="12" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );

  const gridIcon = (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );

  return (
    <div style={containerStyles}>
      <button style={getButtonStyles(view === 'table')} onClick={() => onViewChange('table')}>
        {tableIcon}
        <span>Table</span>
      </button>
      <button style={getButtonStyles(view === 'card')} onClick={() => onViewChange('card')}>
        {gridIcon}
        <span>Cards</span>
      </button>
    </div>
  );
};
