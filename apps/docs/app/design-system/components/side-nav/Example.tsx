'use client';

import { SideNav } from '@efficio/orbit';

// Font Awesome private-use glyph codepoints (kept as numeric to stay encoding-safe).
const fa = (code: number) => String.fromCharCode(code);

export default function SideNavExample() {
  return (
    <div style={{ height: 700, border: '1px solid var(--orbit-color-border-default)', borderRadius: 'var(--orbit-radius-md)', overflow: 'hidden' }}>
      <SideNav
        appName="Efficio Orbit"
        clientName="Yorkshire Water"
        navItems={[
          { id: 'notifications', icon: fa(0xf0f3), label: 'Notifications', badge: 1 },
          { id: 'home', icon: fa(0xf015), label: 'Home', active: true },
          { id: 'data-tracker-insights', icon: fa(0xf1c0), label: 'Data Tracker & Insights' },
          { id: 'document-search', icon: fa(0xf15b), label: 'Document Search' },
        ]}
        sections={[
          { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)' },
          {
            id: 'deliver',
            label: 'Deliver',
            color: 'var(--orbit-color-header-deliver-from)',
            expanded: true,
            items: [
              { id: 'project-management', icon: fa(0xf135), label: 'Project Management', active: true },
              { id: 'route-to-market', icon: fa(0xf3c5), label: 'Route to Market', muted: true },
              { id: 'sourcing-execution', icon: fa(0xf643), label: 'Sourcing Execution', muted: true },
            ],
          },
          { id: 'sustain', label: 'Sustain', color: 'var(--orbit-color-header-sustain-from)' },
        ]}
        workItems={[
          { id: 'research-agent', title: 'Research Agent (2)', subtitle: '1min ago' },
          { id: 'route-recommendation', title: 'Route Recommendation', subtitle: '2h ago | Legal Tech Platform Up...' },
          { id: 'spend-guard', title: 'Spend Guard', subtitle: '3h ago | Legal Tech Platform Up...' },
          { id: 'rfp-analytics', title: 'RFP Analytics', subtitle: '6h ago | Fleet Cost Optimitisatio...' },
          { id: 'clause-iq', title: 'Clause IQ', subtitle: '1d ago | Fleet Cost Optimitisatio...' },
        ]}
        userName="Chris Hurley"
        userInitials="CH"
      />
    </div>
  );
}
