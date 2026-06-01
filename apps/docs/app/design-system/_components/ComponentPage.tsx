import type { ReactNode } from 'react';
import { Headings } from '@efficio/orbit';
import type { DocComponent } from '../_generated/component-data';
import { DocSection } from './DocSection';
import { PropsTable } from './PropsTable';
import { TokensConsumed } from './TokensConsumed';
import { ComposesUsedBy } from './ComposesUsedBy';
import { ImportSnippet } from './ImportSnippet';
import { UsageBlock } from './UsageBlock';
import { A11yBlock } from './A11yBlock';

const valChip: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-mono, ui-monospace, monospace)',
  fontSize: 12,
  background: 'var(--orbit-color-bg-hover)',
  padding: '2px 6px',
  borderRadius: 'var(--orbit-radius-sm)',
};

/**
 * The three-block per-component documentation page: live examples, generated
 * reference, usage & accessibility. Server component — `example` is an already
 * rendered (client) element or null for reference-only components.
 */
export function ComponentPage({ data, example }: { data: DocComponent; example: ReactNode }) {
  return (
    <div style={{ maxWidth: 880 }}>
      <header style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--orbit-color-text-secondary)',
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          {data.categoryTitle}
        </div>
        <Headings size="Heading 1">{data.name}</Headings>
        {data.description && (
          <p style={{ fontSize: 16, color: 'var(--orbit-color-text-secondary)', marginTop: 8 }}>
            {data.description}
          </p>
        )}
        <ImportSnippet name={data.importName} />
      </header>

      <DocSection title="Examples" description="Live variants and states.">
        {example ?? (
          <p style={{ fontSize: 14, color: 'var(--orbit-color-text-secondary)' }}>
            No interactive example yet — see the reference below.
          </p>
        )}
      </DocSection>

      <DocSection title="Props" description="Generated from the component's TypeScript types.">
        <PropsTable props={data.props} />
        {data.variants.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--orbit-color-text-secondary)',
                marginBottom: 8,
              }}
            >
              Variants
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {data.variants.map((v) => (
                <div key={v.prop} style={{ fontSize: 13 }}>
                  <code style={valChip}>{v.prop}</code>{' '}
                  {v.values.map((val) => (
                    <code key={val} style={{ ...valChip, marginRight: 4 }}>
                      {val}
                    </code>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </DocSection>

      <DocSection title="Tokens & composition" description="What this component consumes and how it relates to others.">
        <TokensConsumed tokens={data.tokens} />
        <ComposesUsedBy composes={data.composes} usedBy={data.usedBy} />
      </DocSection>

      <DocSection title="Usage & accessibility" description="How to use it, and the contracts it must satisfy.">
        <UsageBlock markdown={data.usage} />
        <A11yBlock checks={data.a11y} />
      </DocSection>
    </div>
  );
}
