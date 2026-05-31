'use client';

import React from 'react';
import { FaIcon, FA } from '../primitives/FaIcon';

interface BreadcrumbItem {
  label: string;
  href?: string;
  id?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-xs)',
    fontSize: 'var(--orbit-text-small-size)',
    fontWeight: 'var(--orbit-text-small-weight)',
    fontFamily: 'var(--orbit-font-family-sans)',
    lineHeight: 'var(--orbit-text-small-leading)',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const itemStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-xs)',
  };

  const linkStyles: React.CSSProperties = {
    color: 'var(--orbit-color-text-secondary)',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const activeStyles: React.CSSProperties = {
    color: 'var(--orbit-color-text-primary)',
    fontWeight: 'var(--orbit-font-weight-medium)',
  };

  const separatorStyles: React.CSSProperties = {
    color: 'var(--orbit-color-text-disabled)',
    userSelect: 'none',
  };

  return (
    <nav aria-label="Breadcrumb">
      <ol style={containerStyles}>
      {items.map((item, index) => (
        <li key={item.id || `${item.label}-${index}`} style={itemStyles}>
          {index > 0 && <span style={separatorStyles} aria-hidden="true"><FaIcon icon={FA.chevronRight} size={10} color="inherit" /></span>}
          {index === items.length - 1 ? (
            <span style={activeStyles} aria-current="page">{item.label}</span>
          ) : (
            <a href={item.href || '#'} style={linkStyles}>
              {item.label}
            </a>
          )}
        </li>
      ))}
      </ol>
    </nav>
  );
};
