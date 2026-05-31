'use client';

import React, { useState } from 'react';
import { Avatar, StatusIndicator, Chip, CountryFlag, Tooltip } from '@efficio/orbit';
import type { Supplier, Classification } from '@/data/mock-data';

interface SupplierTableProps {
  suppliers: Supplier[];
  trackedIds: Set<string>;
  onToggleTrack: (id: string) => void;
  onSelectSupplier: (supplier: Supplier) => void;
  loading?: boolean;
}

type SortKey = 'name' | 'category' | 'country' | 'companySize';
type SortDir = 'asc' | 'desc';

const classificationStatusMap: Record<Classification, 'Success' | 'Warning' | 'Information' | 'No Status'> = {
  Incumbent: 'Information',
  'Recently Awarded': 'Success',
  'Efficio Engaged': 'Warning',
  'COP Approved': 'Success',
};

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  trackedIds,
  onToggleTrack,
  onSelectSupplier,
  loading = false,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedSuppliers = [...suppliers].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const cmp = String(aVal).localeCompare(String(bVal));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--orbit-text-body-size)',
    fontFamily: 'var(--orbit-font-family-sans)',
  };

  const thStyles: React.CSSProperties = {
    padding: `var(--orbit-space-s) var(--orbit-space-base)`,
    textAlign: 'left',
    fontSize: 'var(--orbit-text-small-size)',
    fontWeight: 'var(--orbit-font-weight-semibold)',
    fontFamily: 'var(--orbit-font-family-sans)',
    color: 'var(--orbit-color-text-secondary)',
    borderBottom: `var(--orbit-space-xxs) solid var(--orbit-color-border-default)`,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    lineHeight: 'var(--orbit-leading-tight)',
  };

  const tdStyles: React.CSSProperties = {
    padding: `var(--orbit-space-s) var(--orbit-space-base)`,
    borderBottom: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
    verticalAlign: 'middle',
    lineHeight: 'var(--orbit-text-body-leading)',
  };

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return ' \u2195';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  const skeletonRow = (i: number) => (
    <tr key={`skeleton-${i}`}>
      {Array.from({ length: 7 }).map((_, j) => (
        <td key={j} style={tdStyles}>
          <div
            style={{
              height: 'var(--orbit-space-base)',
              backgroundColor: 'var(--orbit-color-gallery)',
              borderRadius: 'var(--orbit-radius-sm)',
              animation: 'pulse 1.5s ease infinite',
              width: j === 0 ? '160px' : j === 5 ? '80px' : '100px',
            }}
          />
        </td>
      ))}
    </tr>
  );

  const heartIcon = (filled: boolean) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 0 1 8 4.5 3.5 3.5 0 0 1 13.5 7C13.5 10.5 8 14 8 14z"
        fill={filled ? 'var(--orbit-color-red-ribbon)' : 'none'}
        stroke={filled ? 'var(--orbit-color-red-ribbon)' : 'var(--orbit-color-mid-gray)'}
        strokeWidth="1.2"
      />
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .orbit-table-row:hover {
          background-color: var(--orbit-color-bg-hover) !important;
        }
      `}</style>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles} onClick={() => handleSort('name')}>
              Supplier Name{sortArrow('name')}
            </th>
            <th style={thStyles} onClick={() => handleSort('category')}>
              Category{sortArrow('category')}
            </th>
            <th style={thStyles} onClick={() => handleSort('country')}>
              Region / Country{sortArrow('country')}
            </th>
            <th style={thStyles}>Classification</th>
            <th style={thStyles}>Certifications</th>
            <th style={thStyles} onClick={() => handleSort('companySize')}>
              Company Size{sortArrow('companySize')}
            </th>
            <th style={{ ...thStyles, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => skeletonRow(i))
            : sortedSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="orbit-table-row"
                  style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                  onClick={() => onSelectSupplier(supplier)}
                >
                  <td style={tdStyles}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                      <Avatar
                        style="Text"
                        size="Extra Small"
                        initials={supplier.initials}
                        name={supplier.name}
                        color={supplier.avatarColor}
                      />
                      <span
                        style={{
                          fontWeight: 'var(--orbit-font-weight-semibold)',
                          fontSize: 'var(--orbit-text-strong-size)',
                          lineHeight: 'var(--orbit-text-strong-leading)',
                          fontFamily: 'var(--orbit-font-family-sans)',
                        }}
                      >
                        {supplier.name}
                      </span>
                    </div>
                  </td>
                  <td style={tdStyles}>
                    <span
                      style={{
                        color: 'var(--orbit-color-text-secondary)',
                        fontSize: 'var(--orbit-text-body-size)',
                        fontFamily: 'var(--orbit-font-family-sans)',
                      }}
                    >
                      {supplier.category}
                    </span>
                  </td>
                  <td style={tdStyles}>
                    <CountryFlag country={supplier.country} />
                  </td>
                  <td style={tdStyles}>
                    <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
                      {supplier.classifications.map((cls) => (
                        <StatusIndicator
                          key={cls}
                          status={classificationStatusMap[cls]}
                          size="Small"
                          label={cls}
                        />
                      ))}
                    </div>
                  </td>
                  <td style={tdStyles}>
                    <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
                      {supplier.certifications.map((cert) => (
                        <Chip key={cert} label={cert} size="Small" />
                      ))}
                    </div>
                  </td>
                  <td style={tdStyles}>
                    <span
                      style={{
                        fontSize: 'var(--orbit-text-body-size)',
                        fontFamily: 'var(--orbit-font-family-sans)',
                      }}
                    >
                      {supplier.companySize}
                    </span>
                  </td>
                  <td style={{ ...tdStyles, textAlign: 'right' }}>
                    <Tooltip content={trackedIds.has(supplier.id) ? 'Remove from Tracker' : 'Add to Tracker'}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTrack(supplier.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 'var(--orbit-space-xs)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          borderRadius: 'var(--orbit-radius-sm)',
                        }}
                        aria-label={trackedIds.has(supplier.id) ? 'Remove from Tracker' : 'Add to Tracker'}
                      >
                        {heartIcon(trackedIds.has(supplier.id))}
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};
