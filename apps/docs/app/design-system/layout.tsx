'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { DesignSystemShell, type DesignSystemMode } from './DesignSystemShell';
import { NAV } from './_generated/component-data';

// Tokens page keeps in-page anchor nav (no route per token).
const TOKENS_NAV = [
  { label: 'Primitive Colors', id: 'primitive-colors' },
  { label: 'Swatches', id: 'swatches' },
  { label: 'Semantic Colors', id: 'semantic-colors' },
  { label: 'Status — High Contrast', id: 'status-high' },
  { label: 'Status — Low Contrast', id: 'status-low' },
  { label: 'Spacing', id: 'spacing' },
  { label: 'Typography', id: 'typography' },
  { label: 'Elevation', id: 'elevation' },
  { label: 'Component Tokens', id: 'component-tokens' },
];

// Component sidebar nav, derived from the generated NAV (zero-drift).
const COMPONENT_NAV_GROUPS = NAV.map((g) => ({
  group: g.title,
  items: g.items.map((i) => ({ label: i.name, id: i.slug })),
}));

/**
 * Persistent shell for the whole /design-system section. App Router keeps this
 * client layout mounted across child route changes, so the Efficio/Orbit mode
 * toggle survives navigation between component pages, the index, and tokens.
 */
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<DesignSystemMode>('efficio');
  const pathname = usePathname() ?? '';

  const isTokens = pathname.startsWith('/design-system/tokens');
  const isFoundations = pathname.startsWith('/design-system/foundations');
  const currentPage = isTokens ? 'tokens' : isFoundations ? 'foundations' : 'components';
  const activeSlug = pathname.match(/\/design-system\/components\/([^/]+)/)?.[1] ?? '';

  const title = isTokens ? 'Design Tokens' : isFoundations ? 'Foundations' : 'Orbit Design System';
  const subtitle = isTokens
    ? 'All semantic tokens — switches with the Efficio/Orbit toggle'
    : isFoundations
      ? 'Typography, links, and form-element foundations'
      : 'Component library';

  return (
    <DesignSystemShell
      mode={mode}
      onModeChange={setMode}
      title={title}
      subtitle={subtitle}
      currentPage={currentPage}
      navGroups={isTokens ? undefined : COMPONENT_NAV_GROUPS}
      navItems={isTokens ? TOKENS_NAV : undefined}
      linkBase={isTokens ? undefined : '/design-system/components'}
      activeSection={isTokens ? undefined : activeSlug}
    >
      {children}
    </DesignSystemShell>
  );
}
