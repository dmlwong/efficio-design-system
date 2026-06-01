import type { DocAudit } from '../_generated/component-data';

/**
 * Renders the accessibility contracts matched to this component (from the static
 * audit), or the baseline guidance if none match. Server component.
 */
export function A11yBlock({ checks }: { checks: DocAudit[] }) {
  return (
    <div style={{ marginTop: 24 }}>
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
        Accessibility
      </div>
      {checks.length > 0 ? (
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.6 }}>
          {checks.map((c) => (
            <li key={c.name}>
              <strong>{c.name}.</strong>
              {c.details ? ` ${c.details}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: 14, color: 'var(--orbit-color-text-secondary)', lineHeight: 1.6 }}>
          Follows Orbit's baseline: WCAG&nbsp;2.2 AA contrast (4.5:1 text, 3:1 large/UI),
          a visible focus ring, and full keyboard operability.
        </p>
      )}
      <p style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginTop: 8 }}>
        Enforced by <code>npm run audit:design-system</code>.
      </p>
    </div>
  );
}
