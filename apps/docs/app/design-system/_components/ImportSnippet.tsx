/** Static import affordance (display only — not copyable, per scope). */
export function ImportSnippet({ name }: { name: string }) {
  return (
    <pre
      style={{
        marginTop: 16,
        padding: '10px 14px',
        background: 'var(--orbit-color-sidenav-bg)',
        color: 'var(--orbit-color-text-inverse)',
        borderRadius: 'var(--orbit-radius-md)',
        fontSize: 12,
        fontFamily: 'var(--orbit-font-family-mono, ui-monospace, monospace)',
        overflowX: 'auto',
      }}
    >
      <code>{`import { ${name} } from '@efficio/orbit';`}</code>
    </pre>
  );
}
