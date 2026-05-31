'use client';

import React, { useState } from 'react';
import {
  SideNav,
  PageHeader,
  HeaderPresets,
  Card,
  Headings,
  Text,
  Chip,
  StatusIndicator,
  RadialIndicator,
  PriceIndicator,
  Separator,
  FaIcon,
  Badge,
  Avatar,
} from '@efficio/orbit';

/* ─── Data ─── */

const kpis = [
  { label: 'Total Spend', value: '$14.2M', change: '+8.2%', movement: 'Positive' as const, icon: '\uf155', progress: 78, status: 'Success' as const },
  { label: 'Active Suppliers', value: '312', change: '+14', movement: 'Positive' as const, icon: '\uf0c0', progress: 85, status: 'Information' as const },
  { label: 'Open RFPs', value: '9', change: '-2', movement: 'Negative' as const, icon: '\uf15c', progress: 42, status: 'Warning' as const },
];

const recentActivity = [
  { user: 'Sarah Chen', action: 'Approved supplier onboarding', target: 'GlobalTech Solutions', time: '2 hours ago', status: 'Success' as const },
  { user: 'James Okafor', action: 'Submitted RFP response', target: 'Q3 IT Hardware', time: '4 hours ago', status: 'Information' as const },
  { user: 'Priya Sharma', action: 'Flagged contract risk', target: 'FastLogistics Co', time: '6 hours ago', status: 'Error' as const },
  { user: 'Tom Wheeler', action: 'Updated spend forecast', target: 'Acme Industries', time: '1 day ago', status: 'Warning' as const },
  { user: 'Lisa Johansson', action: 'Completed supplier review', target: 'EcoSource Ltd', time: '1 day ago', status: 'Success' as const },
];

const topSuppliers = [
  { name: 'Acme Industries', category: 'Manufacturing', spend: '$3.1M', risk: 'Low', compliance: 92, status: 'Success' as const },
  { name: 'GlobalTech Solutions', category: 'Technology', spend: '$2.8M', risk: 'Medium', compliance: 78, status: 'Warning' as const },
  { name: 'EcoSource Ltd', category: 'Sustainability', spend: '$1.9M', risk: 'Low', compliance: 95, status: 'Success' as const },
  { name: 'FastLogistics Co', category: 'Logistics', spend: '$1.6M', risk: 'High', compliance: 54, status: 'Error' as const },
  { name: 'PrimeParts Inc', category: 'Manufacturing', spend: '$1.2M', risk: 'Low', compliance: 88, status: 'Success' as const },
];

const spendByCategory = [
  { category: 'Technology', amount: '$4.8M', pct: 34 },
  { category: 'Manufacturing', amount: '$4.3M', pct: 30 },
  { category: 'Logistics', amount: '$2.9M', pct: 20 },
  { category: 'Sustainability', amount: '$1.4M', pct: 10 },
  { category: 'Other', amount: '$0.8M', pct: 6 },
];

const categoryColors: Record<string, string> = {
  Technology: 'var(--orbit-color-status-high-bg-information)',
  Manufacturing: 'var(--orbit-color-status-high-bg-success)',
  Logistics: 'var(--orbit-color-status-high-bg-warning)',
  Sustainability: 'var(--orbit-color-btn-primary-bg)',
  Other: 'var(--orbit-color-silver)',
};

/* ─── Styles ─── */

const thStyle: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 'var(--orbit-text-xs)',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: 'var(--orbit-color-text-secondary)',
  padding: 'var(--orbit-space-s) var(--orbit-space-base)',
  textAlign: 'left',
  borderBottom: '1px solid var(--orbit-color-card-border-default)',
};

const tdStyle: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 'var(--orbit-text-sm)',
  color: 'var(--orbit-color-text-primary)',
  padding: 'var(--orbit-space-s) var(--orbit-space-base)',
  borderBottom: '1px solid var(--orbit-color-card-border-default)',
};

/* ─── Component ─── */

export default function ProcurementDashboardPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div data-theme="orbit" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--orbit-font-family-sans)' }}>
      {/* Sidebar */}
      <SideNav
        appName="Efficio Orbit"
        clientName="Yorkshire Water"
        navItems={[
          { id: 'notifications', icon: '\uf0f3', label: 'Notifications', badge: 3 },
          { id: 'home', icon: '\uf015', label: 'Home' },
          { id: 'dashboard', icon: '\uf200', label: 'Dashboard', active: true },
          { id: 'suppliers', icon: '\uf0c0', label: 'Suppliers' },
          { id: 'contracts', icon: '\uf15c', label: 'Contracts' },
        ]}
        sections={[
          { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)' },
          { id: 'deliver', label: 'Deliver', color: 'var(--orbit-color-header-deliver-from)' },
          { id: 'sustain', label: 'Sustain', color: 'var(--orbit-color-header-sustain-from)' },
        ]}
        workItems={[]}
        userName="Chris Hurley"
        userInitials="CH"
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--orbit-color-card-bg-accent)' }}>
        <PageHeader
          type="tool"
          title="Procurement Dashboard"
          subtitle="Real-time overview of procurement operations"
          icon={'\uf200'}
          {...HeaderPresets.identify}
          tabs={[
            { label: 'Overview' },
            { label: 'Spend Analysis' },
            { label: 'Suppliers' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showTabUnderline={true}
        />

        {/* Content */}
        <main style={{ flex: 1, padding: 'var(--orbit-space-m)', overflow: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>

            {/* ── KPI Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--orbit-space-base)' }}>
              {kpis.map((kpi) => (
                <Card key={kpi.label} state="Default" padding="Base">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-s)' }}>
                    {/* Top row: icon + label + radial */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      <RadialIndicator status={kpi.status} progress={kpi.progress} size={32} />
                    </div>

                    {/* Value */}
                    <Headings size="Heading 2">{kpi.value}</Headings>

                    {/* Change indicator */}
                    <PriceIndicator value={kpi.change} movement={kpi.movement} />
                  </div>
                </Card>
              ))}
            </div>

            {/* ── Two-column: Spend Breakdown + Activity ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--orbit-space-base)' }}>

              {/* Spend by Category */}
              <Card state="Default" padding="Base">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Headings size="Heading 4">Spend by Category</Headings>
                    <Chip label="This Quarter" variant="Outline" size="Small" />
                  </div>

                  {/* Stacked bar */}
                  <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden' }}>
                    {spendByCategory.map((cat) => (
                      <div
                        key={cat.category}
                        style={{
                          width: `${cat.pct}%`,
                          backgroundColor: categoryColors[cat.category],
                        }}
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-s)' }}>
                    {spendByCategory.map((cat) => (
                      <div key={cat.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                          <span style={{
                            width: 10, height: 10, borderRadius: 2,
                            backgroundColor: categoryColors[cat.category],
                            display: 'inline-block', flexShrink: 0,
                          }} />
                          <Text variant="Primary" size="Paragraph">{cat.category}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)' }}>
                          <Text variant="Secondary" size="Small">{cat.pct}%</Text>
                          <span style={{
                            fontFamily: 'var(--orbit-font-family-sans)',
                            fontSize: 'var(--orbit-text-sm)',
                            fontWeight: 'var(--orbit-font-weight-semibold)',
                            color: 'var(--orbit-color-text-primary)',
                            minWidth: 60,
                            textAlign: 'right',
                          }}>
                            {cat.amount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card state="Default" padding="Base">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Headings size="Heading 4">Recent Activity</Headings>
                    <Badge label="5 new" status="Green" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xs)' }}>
                    {recentActivity.map((item, i) => (
                      <React.Fragment key={i}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--orbit-space-s)', padding: 'var(--orbit-space-xs) 0' }}>
                          <div style={{ marginTop: 2, flexShrink: 0 }}>
                            <Avatar name={item.user} size="Small" />
                          </div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                              <span style={{
                                fontFamily: 'var(--orbit-font-family-sans)',
                                fontSize: 'var(--orbit-text-sm)',
                                fontWeight: 'var(--orbit-font-weight-semibold)',
                                color: 'var(--orbit-color-text-primary)',
                              }}>
                                {item.user}
                              </span>
                              <StatusIndicator status={item.status} size="Small" />
                            </div>
                            <Text variant="Primary" size="Small">{item.action} — {item.target}</Text>
                            <Text variant="Secondary" size="Small">{item.time}</Text>
                          </div>
                        </div>
                        {i < recentActivity.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* ── Top Suppliers Table ── */}
            <Card state="Default" padding="Base">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Headings size="Heading 4">Top Suppliers by Spend</Headings>
                  <Chip label="Top 5" variant="Information" size="Small" />
                </div>

                <div style={{ border: '1px solid var(--orbit-color-card-border-default)', borderRadius: 'var(--orbit-radius-md)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--orbit-color-card-bg-accent)' }}>
                        <th style={thStyle}>Supplier</th>
                        <th style={thStyle}>Category</th>
                        <th style={thStyle}>Spend</th>
                        <th style={thStyle}>Risk</th>
                        <th style={thStyle}>Compliance</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSuppliers.map((s) => (
                        <tr key={s.name}>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                              <Avatar name={s.name} size="Small" />
                              <span style={{ fontWeight: 'var(--orbit-font-weight-semibold)' }}>{s.name}</span>
                            </div>
                          </td>
                          <td style={tdStyle}>
                            <Chip label={s.category} variant="Outline" size="Small" />
                          </td>
                          <td style={{ ...tdStyle, fontWeight: 'var(--orbit-font-weight-semibold)' }}>{s.spend}</td>
                          <td style={tdStyle}>
                            <Chip
                              label={s.risk}
                              variant={s.risk === 'High' ? 'Error' : s.risk === 'Medium' ? 'Warning' : 'Success'}
                              size="Small"
                            />
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                              <RadialIndicator
                                status={s.status}
                                progress={s.compliance}
                                size={24}
                              />
                              <span>{s.compliance}%</span>
                            </div>
                          </td>
                          <td style={tdStyle}>
                            <StatusIndicator status={s.status} label={s.status === 'Success' ? 'Active' : s.status === 'Warning' ? 'Review' : 'At Risk'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
