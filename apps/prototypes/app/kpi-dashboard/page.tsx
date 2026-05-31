'use client';

import React from 'react';
import {
  Card,
  Headings,
  Text,
  FaIcon,
  Separator,
} from '@efficio/orbit';

/* ─── KPI Data ─── */

const kpis = [
  {
    label: 'Total Spend',
    value: '$12.4M',
    change: '+8.2%',
    trend: 'up' as const,
    icon: '\uf155',
    description: 'vs. previous quarter',
  },
  {
    label: 'Active Suppliers',
    value: '247',
    change: '+14',
    trend: 'up' as const,
    icon: '\uf0c0',
    description: 'vs. previous quarter',
  },
  {
    label: 'Avg. Lead Time',
    value: '18 days',
    change: '-3 days',
    trend: 'down' as const,
    icon: '\uf017',
    description: 'vs. previous quarter',
  },
];

/* ─── Component ─── */

export default function KpiDashboardPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--orbit-color-bg-secondary)', padding: 'var(--orbit-space-m)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-m)' }}>

        {/* Header */}
        <div>
          <Headings size="Heading 2">Dashboard</Headings>
          <Text variant="Secondary" size="Paragraph">Overview of procurement performance this quarter.</Text>
        </div>

        <Separator />

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--orbit-space-base)' }}>
          {kpis.map((kpi) => (
            <Card key={kpi.label} state="Default" padding="Base">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-s)' }}>

                {/* Icon + Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--orbit-radius-md)',
                    backgroundColor: 'var(--orbit-color-card-bg-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FaIcon icon={kpi.icon} size={18} color="var(--orbit-color-btn-primary-bg)" />
                  </div>
                  <Text variant="Secondary" size="Paragraph">{kpi.label}</Text>
                </div>

                {/* Value */}
                <Headings size="Heading 2">{kpi.value}</Headings>

                {/* Change */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                  <FaIcon
                    icon={kpi.trend === 'up' ? '\uf062' : '\uf063'}
                    size={12}
                    color={
                      (kpi.trend === 'up' && kpi.label !== 'Avg. Lead Time') || (kpi.trend === 'down' && kpi.label === 'Avg. Lead Time')
                        ? 'var(--orbit-color-text-success)'
                        : 'var(--orbit-color-text-error)'
                    }
                  />
                  <span style={{
                    fontFamily: 'var(--orbit-font-family-sans)',
                    fontSize: 'var(--orbit-text-sm)',
                    fontWeight: 'var(--orbit-font-weight-semibold)',
                    color:
                      (kpi.trend === 'up' && kpi.label !== 'Avg. Lead Time') || (kpi.trend === 'down' && kpi.label === 'Avg. Lead Time')
                        ? 'var(--orbit-color-text-success)'
                        : 'var(--orbit-color-text-error)',
                  }}>
                    {kpi.change}
                  </span>
                  <span style={{
                    fontFamily: 'var(--orbit-font-family-sans)',
                    fontSize: 'var(--orbit-text-xs)',
                    color: 'var(--orbit-color-text-secondary)',
                  }}>
                    {kpi.description}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
