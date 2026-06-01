import type { DocPropInfo } from '../_generated/component-data';

const cellStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  verticalAlign: 'top',
  fontSize: 13,
};
const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-mono, ui-monospace, monospace)',
  fontSize: 12,
  background: 'var(--orbit-color-bg-hover)',
  padding: '1px 5px',
  borderRadius: 'var(--orbit-radius-sm)',
};

/** Generated props table. Server component. */
export function PropsTable({ props }: { props: DocPropInfo[] }) {
  if (!props.length) {
    return (
      <p style={{ fontSize: 14, color: 'var(--orbit-color-text-secondary)' }}>
        This component takes no props of its own.
      </p>
    );
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid var(--orbit-color-border-default)' }}>
          <th style={{ ...cellStyle, fontWeight: 600 }}>Name</th>
          <th style={{ ...cellStyle, fontWeight: 600 }}>Type</th>
          <th style={{ ...cellStyle, fontWeight: 600 }}>Required</th>
          <th style={{ ...cellStyle, fontWeight: 600 }}>Default</th>
        </tr>
      </thead>
      <tbody>
        {props.map((p) => (
          <tr key={p.name} style={{ borderBottom: '1px solid var(--orbit-color-border-default)' }}>
            <td style={cellStyle}>
              <code style={codeStyle}>{p.name}</code>
            </td>
            <td style={cellStyle}>
              <code style={codeStyle}>{p.type}</code>
            </td>
            <td style={{ ...cellStyle, color: p.required === 'Yes' ? 'var(--orbit-color-text-primary)' : 'var(--orbit-color-text-secondary)' }}>
              {p.required}
            </td>
            <td style={cellStyle}>
              {p.default ? <code style={codeStyle}>{p.default}</code> : <span style={{ color: 'var(--orbit-color-text-secondary)' }}>—</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
