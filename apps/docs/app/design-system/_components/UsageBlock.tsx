import type { ReactNode } from 'react';

/**
 * Minimal markdown renderer for the editable usage sidecar — paragraphs and
 * `- ` bullet lists only (no MDX dependency). HTML comments are stripped.
 * Server component.
 */
export function UsageBlock({ markdown }: { markdown: string }) {
  const cleaned = markdown.replace(/<!--[\s\S]*?-->/g, '').trim();
  if (!cleaned) return null;

  // Split into blocks on blank lines.
  const blocks = cleaned.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const rendered: ReactNode[] = [];

  blocks.forEach((block, i) => {
    const lines = block.split('\n');
    const isList = lines.every((l) => /^[-*]\s+/.test(l.trim()));
    if (isList) {
      rendered.push(
        <ul key={i} style={{ margin: '0 0 12px', paddingLeft: 20, fontSize: 14, color: 'var(--orbit-color-text-primary)', lineHeight: 1.6 }}>
          {lines.map((l, j) => (
            <li key={j}>{l.replace(/^[-*]\s+/, '')}</li>
          ))}
        </ul>,
      );
    } else if (/^#{1,6}\s/.test(block)) {
      rendered.push(
        <p key={i} style={{ fontWeight: 600, fontSize: 14, margin: '0 0 8px' }}>
          {block.replace(/^#{1,6}\s/, '')}
        </p>,
      );
    } else {
      rendered.push(
        <p key={i} style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--orbit-color-text-primary)', lineHeight: 1.6 }}>
          {block}
        </p>,
      );
    }
  });

  return <div>{rendered}</div>;
}
