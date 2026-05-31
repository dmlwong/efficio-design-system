'use client';

import React from 'react';
import { Card, Avatar, StatusIndicator, Chip, CountryFlag, Button } from '@efficio/orbit';
import type { Supplier, Classification } from '@/data/mock-data';

interface SupplierCardProps {
  supplier: Supplier;
  isTracked: boolean;
  onToggleTrack: (id: string) => void;
  onSelect: (supplier: Supplier) => void;
}

const classificationStatusMap: Record<Classification, 'Success' | 'Warning' | 'Information' | 'No Status'> = {
  Incumbent: 'Information',
  'Recently Awarded': 'Success',
  'Efficio Engaged': 'Warning',
  'COP Approved': 'Success',
};

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  isTracked,
  onToggleTrack,
  onSelect,
}) => {
  const contentStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--orbit-space-s)',
  };

  return (
    <Card padding="Base">
      <div style={contentStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
          <Avatar
            style="Text"
            size="Small"
            initials={supplier.initials}
            name={supplier.name}
            color={supplier.avatarColor}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 'var(--orbit-text-strong-weight)',
                fontSize: 'var(--orbit-text-strong-size)',
                lineHeight: 'var(--orbit-text-strong-leading)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: 'var(--orbit-color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {supplier.name}
            </div>
            <div
              style={{
                fontSize: 'var(--orbit-text-body-size)',
                fontWeight: 'var(--orbit-text-body-weight)',
                lineHeight: 'var(--orbit-text-body-leading)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: 'var(--orbit-color-text-secondary)',
              }}
            >
              {supplier.category}
            </div>
          </div>
        </div>

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

        <CountryFlag country={supplier.country} />

        {supplier.certifications.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
            {supplier.certifications.map((cert) => (
              <Chip key={cert} label={cert} size="Small" />
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: 'var(--orbit-space-xs)',
            display: 'flex',
            gap: 'var(--orbit-space-xs)',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="Tertiary"
            size="Small"
            onClick={() => onSelect(supplier)}
          >
            View details
          </Button>
          <Button
            variant={isTracked ? 'Primary' : 'Secondary'}
            size="Small"
            onClick={() => {
              onToggleTrack(supplier.id);
            }}
          >
            {isTracked ? 'Tracking' : 'Add to My Supplier Tracker'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
