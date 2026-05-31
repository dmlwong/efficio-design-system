'use client';

import React from 'react';
import { Overlay, Avatar, StatusIndicator, Chip, CountryFlag, Button, Separator, Headings } from '@efficio/orbit';
import type { Supplier, Classification } from '@/data/mock-data';

interface SupplierDetailModalProps {
  supplier: Supplier | null;
  isTracked: boolean;
  onToggleTrack: (id: string) => void;
  onClose: () => void;
}

const classificationStatusMap: Record<Classification, 'Success' | 'Warning' | 'Information' | 'No Status'> = {
  Incumbent: 'Information',
  'Recently Awarded': 'Success',
  'Efficio Engaged': 'Warning',
  'COP Approved': 'Success',
};

export const SupplierDetailModal: React.FC<SupplierDetailModalProps> = ({
  supplier,
  isTracked,
  onToggleTrack,
  onClose,
}) => {
  if (!supplier) return null;

  const sectionStyles: React.CSSProperties = {
    padding: `var(--orbit-space-base) var(--orbit-space-m)`,
  };

  const labelStyles: React.CSSProperties = {
    fontSize: 'var(--orbit-text-small-size)',
    fontWeight: 'var(--orbit-text-small-weight)',
    fontFamily: 'var(--orbit-font-family-sans)',
    color: 'var(--orbit-color-text-secondary)',
    lineHeight: 'var(--orbit-leading-tight)',
    marginBottom: 'var(--orbit-space-xs)',
  };

  const valueStyles: React.CSSProperties = {
    fontSize: 'var(--orbit-text-body-size)',
    fontWeight: 'var(--orbit-text-body-weight)',
    fontFamily: 'var(--orbit-font-family-sans)',
    color: 'var(--orbit-color-text-primary)',
    lineHeight: 'var(--orbit-text-body-leading)',
  };

  return (
    <Overlay visible onClose={onClose}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: `var(--orbit-space-m) var(--orbit-space-m) var(--orbit-space-base)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)' }}>
          <Avatar
            style="Text"
            size="Large"
            initials={supplier.initials}
            name={supplier.name}
            color={supplier.avatarColor}
          />
          <div>
            <Headings size="Heading 4">{supplier.name}</Headings>
            <div
              style={{
                fontSize: 'var(--orbit-text-body-size)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: 'var(--orbit-color-text-secondary)',
                lineHeight: 'var(--orbit-text-body-leading)',
                marginTop: 'var(--orbit-space-xs)',
              }}
            >
              {supplier.category}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--orbit-text-lg)',
            color: 'var(--orbit-color-text-secondary)',
            padding: 'var(--orbit-space-xs)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-leading-tight)',
          }}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>

      <Separator />

      {/* Details Grid */}
      <div style={sectionStyles}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--orbit-space-base)',
            marginBottom: 'var(--orbit-space-base)',
          }}
        >
          <div>
            <div style={labelStyles}>Region</div>
            <div style={valueStyles}>
              <CountryFlag country={supplier.country} />
              <span
                style={{
                  marginLeft: 'var(--orbit-space-xs)',
                  color: 'var(--orbit-color-text-secondary)',
                  fontSize: 'var(--orbit-text-small-size)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                }}
              >
                ({supplier.region})
              </span>
            </div>
          </div>
          <div>
            <div style={labelStyles}>Company Size</div>
            <div style={valueStyles}>
              {supplier.companySize === 'Small'
                ? 'Small (1-50 employees)'
                : supplier.companySize === 'Medium'
                ? 'Medium (51-500 employees)'
                : 'Large (500+ employees)'}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--orbit-space-base)' }}>
          <div style={labelStyles}>Relationship Status</div>
          <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
            {supplier.classifications.map((cls) => (
              <StatusIndicator
                key={cls}
                status={classificationStatusMap[cls]}
                label={cls}
              />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 'var(--orbit-space-base)' }}>
          <div style={labelStyles}>Certifications</div>
          {supplier.certifications.length > 0 ? (
            <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
              {supplier.certifications.map((cert) => (
                <Chip key={cert} label={cert} size="Medium" />
              ))}
            </div>
          ) : (
            <div style={valueStyles}>No certifications on record</div>
          )}
        </div>
      </div>

      <Separator />

      {/* Description */}
      <div style={sectionStyles}>
        <div style={labelStyles}>About</div>
        <div style={valueStyles}>{supplier.description}</div>
      </div>

      <Separator />

      {/* Risk & Performance Placeholder */}
      <div style={sectionStyles}>
        <Headings size="Heading 5" style={{ marginBottom: 'var(--orbit-space-s)' }}>
          Risk &amp; Performance Summary
        </Headings>
        <div
          style={{
            padding: 'var(--orbit-space-m)',
            backgroundColor: 'var(--orbit-color-light-gray)',
            borderRadius: 'var(--orbit-radius-md)',
            textAlign: 'center',
            color: 'var(--orbit-color-text-secondary)',
            fontSize: 'var(--orbit-text-body-size)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-body-leading)',
          }}
        >
          Risk and performance data will be available once connected to the analytics module.
        </div>
      </div>

      <Separator />

      {/* Past Projects Placeholder */}
      <div style={sectionStyles}>
        <Headings size="Heading 5" style={{ marginBottom: 'var(--orbit-space-s)' }}>
          Past Project Appearances
        </Headings>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--orbit-space-xs)',
          }}
        >
          {['SWW21 - South West Water IT Refresh', 'ANH23 - Anglian Water Cyber'].map((project) => (
            <div
              key={project}
              style={{
                padding: `var(--orbit-space-xs) var(--orbit-space-s)`,
                backgroundColor: 'var(--orbit-color-light-gray)',
                borderRadius: 'var(--orbit-radius-sm)',
                fontSize: 'var(--orbit-text-body-size)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: 'var(--orbit-color-text-primary)',
                lineHeight: 'var(--orbit-text-body-leading)',
              }}
            >
              {project}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Footer */}
      <div
        style={{
          ...sectionStyles,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 'var(--orbit-space-s)',
          paddingBottom: 'var(--orbit-space-m)',
        }}
      >
        <Button variant="Secondary" onClick={onClose}>
          Close
        </Button>
        <Button
          variant={isTracked ? 'Destructive' : 'Primary'}
          onClick={() => onToggleTrack(supplier.id)}
        >
          {isTracked ? 'Remove from Tracker' : 'Add to Tracker'}
        </Button>
      </div>
    </Overlay>
  );
};
