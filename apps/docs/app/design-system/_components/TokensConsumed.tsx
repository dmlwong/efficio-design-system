const GROUP_ORDER = ['colour', 'spacing', 'typography', 'radius', 'shadow', 'other'] as const;

const chip: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-mono, ui-monospace, monospace)',
  fontSize: 11,
  background: 'var(--orbit-color-bg-hover)',
  padding: '2px 6px',
  borderRadius: 'var(--orbit-radius-sm)',
};

/** Renders the design tokens a component consumes, grouped. Server component. */
export function TokensConsumed({ tokens }: { tokens: Record<string, string[]> }) {
  const present = GROUP_ORDER.filter((g) => (tokens[g]?.length ?? 0) > 0);
  if (!present.length) {
    return (
      <p style={{ fontSize: 14, color: 'var(--orbit-color-text-secondary)' }}>
        No design tokens consumed directly.
      </p>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {present.map((group) => (
        <div key={group}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--orbit-color-text-secondary)',
              marginBottom: 6,
            }}
          >
            {group}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tokens[group].map((t) => (
              <code key={t} style={chip}>
                {t}
              </code>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
