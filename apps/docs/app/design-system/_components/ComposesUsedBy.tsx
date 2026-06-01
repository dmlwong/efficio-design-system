import Link from 'next/link';
import { BY_SLUG } from '../_generated/component-data';

const linkChip: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-mono, ui-monospace, monospace)',
  fontSize: 12,
  background: 'var(--orbit-color-bg-hover)',
  padding: '2px 6px',
  borderRadius: 'var(--orbit-radius-sm)',
  textDecoration: 'none',
  color: 'var(--orbit-color-text-info)',
};

function NameLinks({ names }: { names: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {names.map((n) => {
        const target = BY_SLUG[n];
        return target ? (
          <Link key={n} href={`/design-system/components/${target.slug}`} style={linkChip}>
            {n}
          </Link>
        ) : (
          <code key={n} style={{ ...linkChip, color: 'var(--orbit-color-text-secondary)' }}>{n}</code>
        );
      })}
    </div>
  );
}

/** "Composes" + "Used by" relationship graph, links navigable. Server component. */
export function ComposesUsedBy({ composes, usedBy }: { composes: string[]; usedBy: string[] }) {
  if (!composes.length && !usedBy.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
      {composes.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orbit-color-text-secondary)', marginBottom: 6 }}>
            Composes
          </div>
          <NameLinks names={composes} />
        </div>
      )}
      {usedBy.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--orbit-color-text-secondary)', marginBottom: 6 }}>
            Used by
          </div>
          <NameLinks names={usedBy} />
        </div>
      )}
    </div>
  );
}
