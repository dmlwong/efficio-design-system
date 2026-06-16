import type { DesignSystemNavItem } from './DesignSystemShell';

export const TOKEN_NAV_ITEMS: DesignSystemNavItem[] = [
  { label: 'Primitive Colors', id: 'primitive-colors' },
  { label: 'Swatches', id: 'swatches' },
  { label: 'Semantic Colors', id: 'semantic-colors' },
  { label: 'Status - High Contrast', id: 'status-high' },
  { label: 'Status - Low Contrast', id: 'status-low' },
  { label: 'Spacing', id: 'spacing' },
  { label: 'Typography', id: 'typography' },
  { label: 'Elevation', id: 'elevation' },
  { label: 'Component Tokens', id: 'component-tokens' },
];

export const TOKEN_SECTION_IDS = TOKEN_NAV_ITEMS.map((item) => item.id);
