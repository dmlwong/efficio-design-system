'use client';

import React from 'react';
import { Headings, Separator, Text } from '@efficio/orbit';

/* ─── Token data ─── */

const primitiveColors = [
  { group: 'Neutrals', tokens: [
    { name: '--orbit-color-black', label: 'Black' },
    { name: '--orbit-color-white', label: 'White' },
    { name: '--orbit-color-black-pearl', label: 'Black Pearl' },
    { name: '--orbit-color-dark-grey', label: 'Dark Grey' },
    { name: '--orbit-color-dove-gray', label: 'Dove Gray' },
    { name: '--orbit-color-mid-gray', label: 'Mid Gray' },
    { name: '--orbit-color-silver', label: 'Silver' },
    { name: '--orbit-color-alto', label: 'Alto' },
    { name: '--orbit-color-mercury', label: 'Mercury' },
    { name: '--orbit-color-gallery', label: 'Gallery' },
    { name: '--orbit-color-light-gray', label: 'Light Gray' },
    { name: '--orbit-color-alabaster', label: 'Alabaster' },
  ]},
  { group: 'Brand', tokens: [
    { name: '--orbit-color-efficio-blue', label: 'Efficio Blue' },
    { name: '--orbit-color-chambray', label: 'Chambray' },
  ]},
  { group: 'Accent / Teal', tokens: [
    { name: '--orbit-color-bright-green', label: 'Bright Green' },
    { name: '--orbit-color-cruise', label: 'Cruise' },
    { name: '--orbit-color-dark-green', label: 'Dark Green' },
    { name: '--orbit-color-cerulean', label: 'Cerulean' },
  ]},
  { group: 'Status', tokens: [
    { name: '--orbit-color-jade', label: 'Jade' },
    { name: '--orbit-color-science-blue', label: 'Science Blue' },
    { name: '--orbit-color-web-orange', label: 'Web Orange' },
    { name: '--orbit-color-red-ribbon', label: 'Red Ribbon' },
    { name: '--orbit-color-bright-orange', label: 'Bright Orange' },
  ]},
  { group: 'Extended', tokens: [
    { name: '--orbit-color-hollywood-cerise', label: 'Hollywood Cerise' },
    { name: '--orbit-color-peach-schnapps', label: 'Peach Schnapps' },
    { name: '--orbit-color-cornflower-lilac', label: 'Cornflower Lilac' },
    { name: '--orbit-color-rose-white', label: 'Rose White' },
  ]},
];

const swatchScales = [
  { family: 'Bright Green', prefix: '--orbit-color-swatch-bright-green', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1500] },
  { family: 'Cerulean', prefix: '--orbit-color-swatch-cerulean', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] },
  { family: 'Dark Red', prefix: '--orbit-color-swatch-dark-red', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] },
  { family: 'Goblin Green', prefix: '--orbit-color-swatch-goblin-green', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] },
  { family: 'Hollywood Cerise', prefix: '--orbit-color-swatch-hollywood-cerise', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] },
  { family: 'Purple Gray', prefix: '--orbit-color-swatch-purple-gray', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] },
  { family: 'Science Blue', prefix: '--orbit-color-swatch-science-blue', rungs: [300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500] },
  { family: 'Slate', prefix: '--orbit-color-swatch-slate', rungs: [100, 200] },
  { family: 'Web Orange', prefix: '--orbit-color-swatch-web-orange', rungs: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1500] },
];

const semanticColors = [
  { group: 'Text', tokens: [
    { name: '--orbit-color-text-primary', label: 'Primary' },
    { name: '--orbit-color-text-secondary', label: 'Secondary' },
    { name: '--orbit-color-text-disabled', label: 'Disabled' },
    { name: '--orbit-color-text-inverse', label: 'Inverse' },
    { name: '--orbit-color-text-error', label: 'Error' },
    { name: '--orbit-color-text-info', label: 'Info' },
    { name: '--orbit-color-text-success', label: 'Success' },
    { name: '--orbit-color-text-warning', label: 'Warning' },
    { name: '--orbit-color-text-heading', label: 'Heading' },
  ]},
  { group: 'Border', tokens: [
    { name: '--orbit-color-border-default', label: 'Default' },
    { name: '--orbit-color-border-accent', label: 'Accent' },
    { name: '--orbit-color-border-selected', label: 'Selected' },
    { name: '--orbit-color-border-highlight', label: 'Highlight' },
    { name: '--orbit-color-border-hover', label: 'Hover' },
    { name: '--orbit-color-border-disabled', label: 'Disabled' },
    { name: '--orbit-color-border-focused', label: 'Focused' },
    { name: '--orbit-color-border-error', label: 'Error' },
  ]},
  { group: 'Background', tokens: [
    { name: '--orbit-color-bg-default', label: 'Default' },
    { name: '--orbit-color-bg-accent', label: 'Accent' },
    { name: '--orbit-color-bg-hover', label: 'Hover' },
    { name: '--orbit-color-bg-selected', label: 'Selected' },
    { name: '--orbit-color-bg-disabled', label: 'Disabled' },
    { name: '--orbit-color-bg-style1', label: 'Style 1' },
  ]},
];

const statusHighTokens = [
  { name: '--orbit-color-status-high-bg-information', label: 'Information' },
  { name: '--orbit-color-status-high-bg-success', label: 'Success' },
  { name: '--orbit-color-status-high-bg-warning', label: 'Warning' },
  { name: '--orbit-color-status-high-bg-error', label: 'Error' },
  { name: '--orbit-color-status-high-bg-no-status', label: 'No Status' },
];

const statusLowGroups = ['information', 'success', 'warning', 'error', 'no-status'].map((s) => ({
  group: s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' '),
  tokens: [
    { name: `--orbit-color-status-low-bg-${s}`, label: 'Background' },
    { name: `--orbit-color-status-low-border-${s}`, label: 'Border' },
    { name: `--orbit-color-status-low-icon-${s}`, label: 'Icon' },
    { name: `--orbit-color-status-low-fg-${s}`, label: 'Foreground' },
  ],
}));

const spacingTokens = [
  { name: '--orbit-space-0', label: 'none (0)', px: '0px' },
  { name: '--orbit-space-px', label: 'micro (1)', px: '1px' },
  { name: '--orbit-space-0_5', label: 'xxs (2)', px: '2px' },
  { name: '--orbit-space-1', label: 'xs (4)', px: '4px' },
  { name: '--orbit-space-2', label: 's (8)', px: '8px' },
  { name: '--orbit-space-4', label: 'base (16)', px: '16px' },
  { name: '--orbit-space-6', label: 'm (24)', px: '24px' },
  { name: '--orbit-space-8', label: 'l (32)', px: '32px' },
  { name: '--orbit-space-12', label: 'xxl (48)', px: '48px' },
  { name: '--orbit-space-16', label: 'mega (64)', px: '64px' },
];

const typographySizes = [
  { name: '--orbit-text-xs', label: 'xs', px: '12px' },
  { name: '--orbit-text-sm', label: 'sm', px: '14px' },
  { name: '--orbit-text-base', label: 'base', px: '16px' },
  { name: '--orbit-text-lg', label: 'lg', px: '20px' },
  { name: '--orbit-text-xl', label: 'xl', px: '26px' },
  { name: '--orbit-text-2xl', label: '2xl', px: '28px' },
  { name: '--orbit-text-3xl', label: '3xl', px: '36px' },
];

const typographyWeights = [
  { name: '--orbit-font-weight-regular', label: 'Regular', value: '400' },
  { name: '--orbit-font-weight-medium', label: 'Medium', value: '500' },
  { name: '--orbit-font-weight-semibold', label: 'Semibold', value: '600' },
  { name: '--orbit-font-weight-bold', label: 'Bold', value: '800' },
];

const compositeStyles = [
  { label: 'Heading 1', size: '--orbit-text-h1-size', weight: '--orbit-text-h1-weight' },
  { label: 'Heading 2', size: '--orbit-text-h2-size', weight: '--orbit-text-h2-weight' },
  { label: 'Heading 3', size: '--orbit-text-h3-size', weight: '--orbit-text-h3-weight' },
  { label: 'Heading 4', size: '--orbit-text-h4-size', weight: '--orbit-text-h4-weight' },
  { label: 'Heading 5', size: '--orbit-text-h5-size', weight: '--orbit-text-h5-weight' },
  { label: 'Body', size: '--orbit-text-body-size', weight: '--orbit-text-body-weight' },
  { label: 'Strong', size: '--orbit-text-strong-size', weight: '--orbit-text-strong-weight' },
  { label: 'Button', size: '--orbit-text-button-size', weight: '--orbit-text-button-weight' },
  { label: 'Link', size: '--orbit-text-link-size', weight: '--orbit-text-link-weight' },
  { label: 'Small', size: '--orbit-text-small-size', weight: '--orbit-text-small-weight' },
];

const radiusTokens = [
  { name: '--orbit-radius-none', label: 'none', px: '0px' },
  { name: '--orbit-radius-sm', label: 'sm', px: '4px' },
  { name: '--orbit-radius-md', label: 'md', px: '8px' },
];

const shadowTokens = [
  { name: '--orbit-shadow-none', label: 'none' },
  { name: '--orbit-shadow-sm', label: 'sm' },
  { name: '--orbit-shadow-md', label: 'md' },
  { name: '--orbit-shadow-lg', label: 'lg' },
];

const componentTokenGroups = [
  { group: 'Toggle', tokens: [
    { name: '--orbit-toggle-track-width', label: 'Track width' },
    { name: '--orbit-toggle-track-height', label: 'Track height' },
    { name: '--orbit-toggle-track-radius', label: 'Track radius' },
    { name: '--orbit-toggle-handle-size', label: 'Handle size' },
  ]},
  { group: 'Badge', tokens: [
    { name: '--orbit-badge-min-width', label: 'Min width' },
    { name: '--orbit-badge-radius', label: 'Radius' },
  ]},
  { group: 'Toast', tokens: [
    { name: '--orbit-toast-max-width', label: 'Max width' },
  ]},
  { group: 'Dropzone', tokens: [
    { name: '--orbit-dropzone-min-height', label: 'Min height' },
  ]},
  { group: 'Overlay', tokens: [
    { name: '--orbit-overlay-width-medium', label: 'Medium width' },
    { name: '--orbit-overlay-width-large', label: 'Large width' },
    { name: '--orbit-overlay-height-default', label: 'Default height' },
  ]},
  { group: 'Inline Banner', tokens: [
    { name: '--orbit-inline-banner-height', label: 'Height' },
    { name: '--orbit-inline-banner-icon-box-size', label: 'Icon box size' },
  ]},
  { group: 'Chip', tokens: [
    { name: '--orbit-chip-height-mini', label: 'Mini height' },
    { name: '--orbit-chip-height-default', label: 'Default height' },
    { name: '--orbit-chip-radius-mini', label: 'Mini radius' },
    { name: '--orbit-chip-radius-default', label: 'Default radius' },
  ]},
  { group: 'Document Glyph', tokens: [
    { name: '--orbit-document-glyph-size-large', label: 'Large size' },
    { name: '--orbit-document-glyph-size-medium', label: 'Medium size' },
    { name: '--orbit-document-glyph-size-small', label: 'Small size' },
    { name: '--orbit-document-glyph-size-extra-small', label: 'Extra small size' },
    { name: '--orbit-document-glyph-size-micro', label: 'Micro size' },
    { name: '--orbit-document-glyph-micro-radius', label: 'Micro radius' },
  ]},
  { group: 'Required', tokens: [
    { name: '--orbit-required-width', label: 'Width' },
  ]},
  { group: 'Radial Indicator', tokens: [
    { name: '--orbit-radial-size', label: 'Size' },
    { name: '--orbit-radial-stroke-radius', label: 'Stroke radius' },
    { name: '--orbit-radial-stroke-width', label: 'Stroke width' },
  ]},
];

/* ─── Helper components ─── */

function ColorSwatch({ name, label }: { name: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
      <div style={{
        width: 40, height: 40, borderRadius: 'var(--orbit-radius-sm)',
        backgroundColor: `var(${name})`,
        border: '1px solid var(--orbit-color-border-default)',
        flexShrink: 0,
      }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 12, fontWeight: 600, color: 'var(--orbit-color-text-primary)' }}>{label}</span>
        <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--orbit-color-text-secondary)', wordBreak: 'break-all' }}>{name}</code>
      </div>
    </div>
  );
}

function ColorGrid({ tokens }: { tokens: { name: string; label: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 4 }}>
      {tokens.map((t) => <ColorSwatch key={t.name} {...t} />)}
    </div>
  );
}

function SwatchRamp({ family, prefix, rungs }: { family: string; prefix: string; rungs: number[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, fontWeight: 600, color: 'var(--orbit-color-text-primary)' }}>{family}</span>
        <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--orbit-color-text-secondary)' }}>{prefix}-&#123;rung&#125;</code>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${rungs.length}, minmax(0, 1fr))`, gap: 4 }}>
        {rungs.map((rung) => {
          const tokenName = `${prefix}-${rung}`;
          return (
            <div key={rung} style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 'var(--orbit-radius-sm)',
                  backgroundColor: `var(${tokenName})`,
                  border: '1px solid var(--orbit-color-border-default)',
                }}
                title={tokenName}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--orbit-color-text-primary)', textAlign: 'center' }}>{rung}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 48, marginBottom: 16 }}>
      <Headings size="Heading 3">{children}</Headings>
      <Separator />
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24, marginBottom: 8 }}>
      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--orbit-color-text-secondary)' }}>
        {children}
      </span>
    </div>
  );
}

/* ─── Page ─── */

export default function TokensPage() {
  return (
    <div style={{ maxWidth: 960 }}>

          {/* ── Primitive Colors ── */}
          <div id="primitive-colors" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Primitive Colors</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Raw color values that form the foundation of the palette. Not used directly in components — referenced by semantic tokens.</Text>
            {primitiveColors.map((g) => (
              <div key={g.group}>
                <SubTitle>{g.group}</SubTitle>
                <ColorGrid tokens={g.tokens} />
              </div>
            ))}
          </div>

          {/* ── Swatches ── */}
          <div id="swatches" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Swatches</SectionTitle>
            <Text variant="Secondary" size="Paragraph">
              Full primitive color ramps imported from the Figma Efficio Styleguide library (Primitives.Swatches collection). The 800 rung is the brand anchor; lower numbers are tints, higher numbers are shades. Values shift when the Orbit theme is active.
            </Text>
            <div style={{ marginTop: 16 }}>
              {swatchScales.map((s) => (
                <SwatchRamp key={s.family} family={s.family} prefix={s.prefix} rungs={s.rungs} />
              ))}
            </div>
          </div>

          {/* ── Semantic Colors ── */}
          <div id="semantic-colors" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Semantic Colors</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Purpose-driven colors used by components. These change between Efficio and Orbit modes.</Text>
            {semanticColors.map((g) => (
              <div key={g.group}>
                <SubTitle>{g.group}</SubTitle>
                <ColorGrid tokens={g.tokens} />
              </div>
            ))}
          </div>

          {/* ── Status High ── */}
          <div id="status-high" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Status — High Contrast</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Bold status backgrounds used for toasts, badges, and status indicators.</Text>
            <ColorGrid tokens={statusHighTokens} />
          </div>

          {/* ── Status Low ── */}
          <div id="status-low" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Status — Low Contrast</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Subtle status colors used for banners, chips, and inline notifications.</Text>
            {statusLowGroups.map((g) => (
              <div key={g.group}>
                <SubTitle>{g.group}</SubTitle>
                <ColorGrid tokens={g.tokens} />
              </div>
            ))}
          </div>

          {/* ── Spacing ── */}
          <div id="spacing" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Spacing</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Consistent spacing scale from 0 to 64px. Used for padding, margin, and gap values.</Text>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {spacingTokens.map((t) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: `var(${t.name})`, height: 24,
                    backgroundColor: 'var(--orbit-color-btn-primary-bg)',
                    borderRadius: 2, minWidth: 2,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--orbit-color-text-primary)', minWidth: 80 }}>{t.label}</span>
                  <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.name}</code>
                  <span style={{ fontSize: 11, color: 'var(--orbit-color-text-disabled)' }}>{t.px}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Typography ── */}
          <div id="typography" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Typography</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Font families, sizes, weights, and composite text styles.</Text>

            <SubTitle>Font Families</SubTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 20 }}>Inter — The quick brown fox</span>
                <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>--orbit-font-family-sans</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                <span style={{ fontFamily: 'var(--orbit-font-family-brand)', fontSize: 20 }}>Sofia Pro — The quick brown fox</span>
                <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>--orbit-font-family-brand</code>
              </div>
            </div>

            <SubTitle>Font Sizes</SubTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {typographySizes.map((t) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: `var(${t.name})`, minWidth: 200 }}>The quick brown fox</span>
                  <span style={{ fontSize: 13, fontWeight: 600, minWidth: 40 }}>{t.label}</span>
                  <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.name}</code>
                  <span style={{ fontSize: 11, color: 'var(--orbit-color-text-disabled)' }}>{t.px}</span>
                </div>
              ))}
            </div>

            <SubTitle>Font Weights</SubTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {typographyWeights.map((t) => (
                <div key={t.name} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, fontWeight: `var(${t.name})` as any, minWidth: 200 }}>The quick brown fox</span>
                  <span style={{ fontSize: 13, fontWeight: 600, minWidth: 80 }}>{t.label} ({t.value})</span>
                  <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.name}</code>
                </div>
              ))}
            </div>

            <SubTitle>Composite Styles</SubTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {compositeStyles.map((t) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
                  <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: `var(${t.size})`, fontWeight: `var(${t.weight})` as any, minWidth: 240 }}>{t.label}</span>
                  <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.size}</code>
                </div>
              ))}
            </div>
          </div>

          {/* ── Elevation ── */}
          <div id="elevation" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Elevation</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Border radius and shadow tokens for depth and containment.</Text>

            <SubTitle>Border Radius</SubTitle>
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
              {radiusTokens.map((t) => (
                <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 64, height: 64,
                    backgroundColor: 'var(--orbit-color-bg-hover)',
                    border: '2px solid var(--orbit-color-border-default)',
                    borderRadius: `var(${t.name})`,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</span>
                  <code style={{ fontSize: 10, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.px}</code>
                </div>
              ))}
            </div>

            <SubTitle>Shadows</SubTitle>
            <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
              {shadowTokens.map((t) => (
                <div key={t.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 80, height: 80,
                    backgroundColor: 'var(--orbit-color-white)',
                    borderRadius: 'var(--orbit-radius-md)',
                    boxShadow: `var(${t.name})`,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</span>
                  <code style={{ fontSize: 10, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.name}</code>
                </div>
              ))}
            </div>
          </div>

          {/* ── Component Tokens ── */}
          <div id="component-tokens" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Component Tokens</SectionTitle>
            <Text variant="Secondary" size="Paragraph">Component-specific sizing and layout tokens. These are scoped to individual components and not intended for global reuse.</Text>
            {componentTokenGroups.map((g) => (
              <div key={g.group}>
                <SubTitle>{g.group}</SubTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {g.tokens.map((t) => (
                    <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '4px 0' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120 }}>{t.label}</span>
                      <code style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontFamily: 'monospace' }}>{t.name}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
    </div>
  );
}
