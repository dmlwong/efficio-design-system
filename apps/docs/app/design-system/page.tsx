import Link from 'next/link';
import { Headings } from '@efficio/orbit';
import { NAV, BY_SLUG, COMPONENTS } from './_generated/component-data';

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '14px 16px',
  border: '1px solid var(--orbit-color-border-default)',
  borderRadius: 'var(--orbit-radius-lg)',
  background: 'var(--orbit-color-bg-default)',
  textDecoration: 'none',
  color: 'inherit',
};

/** Components index — a directory of every component, grouped by category. */
export default function ComponentsIndex() {
  return (
    <div style={{ maxWidth: 960 }}>
      <Headings size="Heading 1">Components</Headings>
      <p style={{ fontSize: 16, color: 'var(--orbit-color-text-secondary)', marginTop: 8, marginBottom: 8 }}>
        {COMPONENTS.length} components across {NAV.length} categories. Open one for live examples,
        generated props, the tokens it consumes, and usage &amp; accessibility guidance.
      </p>

      {NAV.map((group) => (
        <section key={group.category} style={{ marginTop: 36 }}>
          <Headings size="Heading 4">{group.title}</Headings>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 12,
              marginTop: 14,
            }}
          >
            {group.items.map((item) => {
              const data = BY_SLUG[item.slug];
              return (
                <Link key={item.slug} href={`/design-system/components/${item.slug}`} style={cardStyle}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                  {data?.description && (
                    <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                      {data.description}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
