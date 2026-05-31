'use client';

import React from 'react';
import { SupplierCard } from '@/components/feature/SupplierCard';
import type { Supplier } from '@/data/mock-data';

interface SupplierCardGridProps {
  suppliers: Supplier[];
  trackedIds: Set<string>;
  onToggleTrack: (id: string) => void;
  onSelectSupplier: (supplier: Supplier) => void;
  loading?: boolean;
}

export const SupplierCardGrid: React.FC<SupplierCardGridProps> = ({
  suppliers,
  trackedIds,
  onToggleTrack,
  onSelectSupplier,
  loading = false,
}) => {
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--orbit-space-base)',
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
        <div style={gridStyles}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              style={{
                height: '220px',
                backgroundColor: 'var(--orbit-color-gallery)',
                borderRadius: 'var(--orbit-radius-md)',
                border: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
                animation: 'pulse 1.5s ease infinite',
              }}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div style={gridStyles}>
      {suppliers.map((supplier) => (
        <SupplierCard
          key={supplier.id}
          supplier={supplier}
          isTracked={trackedIds.has(supplier.id)}
          onToggleTrack={onToggleTrack}
          onSelect={onSelectSupplier}
        />
      ))}
    </div>
  );
};
