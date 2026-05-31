'use client';

import React from 'react';
import { Tabs } from './Tabs';

export type DataTrackerTab = 'insights' | 'data-overview';

interface DataTrackerHeaderProps {
  activeTab: DataTrackerTab;
  onTabChange: (id: DataTrackerTab) => void;
}

const TABS = [
  { id: 'insights' as const, label: 'Insights' },
  { id: 'data-overview' as const, label: 'Data Overview' },
];

export const DataTrackerHeader: React.FC<DataTrackerHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '22px 38px 0',
          height: 112,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 30, lineHeight: 1.15, fontWeight: 800, color: '#040921' }}>
            Data Tracker &amp; Insights
          </h1>
          <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 22, lineHeight: 1.45, color: '#475569' }}>
            Here&apos;s your overview for today
          </p>
        </div>
      </div>

      <Tabs<DataTrackerTab> tabs={TABS} active={activeTab} onChange={onTabChange} />
    </div>
  );
};
