'use client';

import { Chip } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

const VARIANTS = ['Information', 'Success', 'Warning', 'Error', 'Additional', 'No Status', 'Outline', 'Disabled'] as const;

export default function ChipExample() {
  return (
    <>
      <Row label="Default Chips">
        {VARIANTS.map((v) => (
          <Chip key={v} variant={v} label="Label" />
        ))}
      </Row>
      <Row label="Mini Chips">
        {VARIANTS.map((v) => (
          <Chip key={v} size="Mini" variant={v} label="Label" />
        ))}
      </Row>
    </>
  );
}
