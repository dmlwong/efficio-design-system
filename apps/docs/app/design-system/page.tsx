import Link from 'next/link';
import type React from 'react';
import { Headings, Text } from '@efficio/orbit';
import { COMPONENT_NAV_GROUPS, getComponentDoc } from './componentDocs';
import styles from './DesignSystemIndex.module.css';

function CardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        color: 'var(--orbit-color-text-secondary)',
        fontSize: 'var(--orbit-text-xs)',
        lineHeight: 'var(--orbit-leading-relaxed)',
        overflowWrap: 'anywhere',
      }}
    >
      {children}
    </p>
  );
}

function ResourceLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className={`${styles.indexCard} ${styles.resourceCard}`}
    >
      <Headings size="Heading 5" style={{ overflowWrap: 'anywhere' }}>{title}</Headings>
      <CardDescription>{description}</CardDescription>
    </Link>
  );
}

export default function DesignSystemPage() {
  return (
    <main>
      <section style={{ marginBottom: 40 }}>
        <Text variant="Secondary" size="Small">Orbit documentation</Text>
        <div style={{ marginTop: 8 }}>
          <Headings size="Heading 1">Design System</Headings>
        </div>
        <p style={{ margin: 'var(--orbit-space-base) 0 0', maxWidth: 720, color: 'var(--orbit-color-text-secondary)', fontSize: 'var(--orbit-text-base)', lineHeight: 1.65 }}>
          Component guidance, design tokens, and exported style data for teams building with Orbit.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 'var(--orbit-space-base)',
          }}
        >
          <ResourceLink
            href="/design-system/tokens"
            title="Design Tokens"
            description="Semantic color, spacing, typography, elevation, and component tokens."
          />
          <ResourceLink
            href="/orbit-style-guide.json"
            title="Style Guide JSON"
            description="Exported semantics, styles, and tokens for external development handoff."
          />
        </div>
      </section>

      <section>
        <div style={{ marginBottom: 20 }}>
          <Headings size="Heading 3">Components</Headings>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xl)' }}>
          {COMPONENT_NAV_GROUPS.map((group) => (
            <section key={group.group}>
              <div style={{ marginBottom: 'var(--orbit-space-base)' }}>
                <Text variant="Bold" size="Small">{group.group}</Text>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
                  gap: 'var(--orbit-space-base)',
                }}
              >
                {group.items.map((item) => {
                  const doc = getComponentDoc(item.id);
                  if (!doc) return null;

                  return (
                    <Link
                      key={doc.id}
                      href={`/design-system/components/${doc.id}`}
                      className={`${styles.indexCard} ${styles.componentCard}`}
                    >
                      <Headings size="Heading 5" style={{ overflowWrap: 'anywhere' }}>{doc.title}</Headings>
                      <CardDescription>{doc.description}</CardDescription>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
