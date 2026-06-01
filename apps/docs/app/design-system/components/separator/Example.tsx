'use client';

import { Separator } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function SeparatorExample() {
  return (
    <>
      <Row label="Horizontal">
        <div style={{ width: '100%' }}>
          <Separator orientation="Horizontal" />
        </div>
      </Row>
      <Row label="Vertical">
        <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
          <span>Left</span>
          <Separator orientation="Vertical" />
          <span>Right</span>
        </div>
      </Row>
    </>
  );
}
