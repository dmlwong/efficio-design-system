'use client';

import { Badge } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function BadgeExample() {
  return (
    <Row label="Number Badges">
      <Badge label="99" status="Green" />
      <Badge label="99" status="Red" />
      <Badge label="99" status="Gray" />
      <Badge label="Info" status="Information" />
      <Badge label="Warn" status="Warning" />
    </Row>
  );
}
