'use client';

import { Spinner } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function SpinnerExample() {
  return (
    <Row label="Spinners">
      <Spinner size="Inline" label="Loading inline" />
      <Spinner size="Medium" label="Loading medium" />
      <Spinner size="Large" label="Loading large" />
    </Row>
  );
}
