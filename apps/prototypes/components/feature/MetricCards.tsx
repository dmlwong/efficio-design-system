'use client';

import React from 'react';
import { Card } from '@efficio/orbit';

interface MetricCardData {
  label: string;
  count: number;
  status: 'Success' | 'Information' | 'Warning' | 'No Status';
}

interface MetricCardsProps {
  metrics: MetricCardData[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'var(--orbit-space-base)',
  };

  const bgMap: Record<string, string> = {
    Success: 'var(--orbit-color-status-low-bg-success)',
    Information: 'var(--orbit-color-status-low-bg-information)',
    Warning: 'var(--orbit-color-status-low-bg-warning)',
    'No Status': 'var(--orbit-color-status-low-bg-no-status)',
  };

  const borderMap: Record<string, string> = {
    Success: 'var(--orbit-color-status-low-border-success)',
    Information: 'var(--orbit-color-status-low-border-information)',
    Warning: 'var(--orbit-color-status-low-border-warning)',
    'No Status': 'var(--orbit-color-status-low-border-no-status)',
  };

  const iconColorMap: Record<string, string> = {
    Success: 'var(--orbit-color-status-low-icon-success)',
    Information: 'var(--orbit-color-status-low-icon-information)',
    Warning: 'var(--orbit-color-status-low-icon-warning)',
    'No Status': 'var(--orbit-color-status-low-icon-no-status)',
  };

  return (
    <div style={containerStyles}>
      {metrics.map((metric) => (
        <Card key={metric.label} padding="Base">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--orbit-space-s)',
            }}
          >
            <div
              style={{
                width: 'var(--orbit-space-xxl)',
                height: 'var(--orbit-space-xxl)',
                borderRadius: 'var(--orbit-radius-md)',
                backgroundColor: bgMap[metric.status],
                border: `var(--orbit-space-micro) solid ${borderMap[metric.status]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--orbit-text-lg)',
                fontWeight: 'var(--orbit-font-weight-bold)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: iconColorMap[metric.status],
                flexShrink: 0,
              }}
            >
              {metric.count}
            </div>
            <div>
              <div
                style={{
                  fontSize: 'var(--orbit-text-small-size)',
                  fontWeight: 'var(--orbit-text-small-weight)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  color: 'var(--orbit-color-text-secondary)',
                  lineHeight: 'var(--orbit-leading-tight)',
                }}
              >
                {metric.label}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
