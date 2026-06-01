'use client';

import { LegendLabel } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function LegendLabelExample() {
  return (
    <Row label="Legend Labels">
      <LegendLabel value="Value" color="var(--orbit-color-bright-green)" />
      <LegendLabel value="Value" color="var(--orbit-color-efficio-blue)" />
      <LegendLabel value="Value" color="var(--orbit-color-silver)" />
    </Row>
  );
}
