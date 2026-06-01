import type { ReactNode } from 'react';
import { Headings } from '@efficio/orbit';

/**
 * Section wrapper used across the docs (migrated from the original mega page).
 * Server component — no hooks.
 */
export function DocSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        marginBottom: 64,
        paddingBottom: 48,
        borderBottom: '1px solid var(--orbit-color-border-default)',
        scrollMarginTop: 24,
      }}
    >
      <Headings size="Heading 3">{title}</Headings>
      {description && (
        <p
          style={{
            fontSize: 14,
            color: 'var(--orbit-color-text-secondary)',
            marginTop: 4,
            marginBottom: 20,
          }}
        >
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export function Row({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--orbit-color-text-secondary)',
            marginBottom: 8,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
}
