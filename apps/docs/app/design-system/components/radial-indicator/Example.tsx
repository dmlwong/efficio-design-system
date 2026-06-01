'use client';

import { RadialIndicator } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function RadialIndicatorExample() {
  return (
    <Row label="Radial Indicators">
      <RadialIndicator status="Success" />
      <RadialIndicator status="Information" />
      <RadialIndicator status="Error" />
      <RadialIndicator status="Warning" />
      <RadialIndicator status="No Status" />
    </Row>
  );
}
