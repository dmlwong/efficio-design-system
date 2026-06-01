'use client';

import { Card, Headings } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

const sub: React.CSSProperties = { fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginTop: 4 };

export default function CardExample() {
  return (
    <>
      <Row label="Static Card">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(['Base', 'Medium', 'Small'] as const).map((pad) => (
            <Card key={pad} type="Static" padding={pad} style={{ width: 200 }}>
              <Headings size="Heading 5">Padding: {pad}</Headings>
              <p style={sub}>Static card</p>
            </Card>
          ))}
        </div>
      </Row>
      <Row label="Dynamic Card -- Default">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(['Base', 'Medium', 'Small'] as const).map((pad) => (
            <Card key={pad} padding={pad} style={{ width: 200 }}>
              <Headings size="Heading 5">Padding: {pad}</Headings>
              <p style={sub}>Dynamic card</p>
            </Card>
          ))}
        </div>
      </Row>
      <Row label="Dynamic Card -- All States">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(['Default', 'Highlight', 'Accent', 'Disabled', 'Success', 'Warning'] as const).map((st) => (
            <Card key={st} state={st} style={{ width: 180 }}>
              <Headings size="Heading 5">{st}</Headings>
              <p style={sub}>{st} state</p>
            </Card>
          ))}
        </div>
      </Row>
    </>
  );
}
