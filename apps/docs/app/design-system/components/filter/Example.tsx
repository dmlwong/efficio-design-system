'use client';

import { Filter } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function FilterExample() {
  return (
    <Row>
      <Filter label="Category: Legal" onRemove={() => {}} />
      <Filter label="Region: Europe" state="Hover" onRemove={() => {}} />
    </Row>
  );
}
