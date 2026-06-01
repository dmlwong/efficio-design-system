'use client';

import { StepCircle } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function StepCircleExample() {
  return (
    <Row label="Step Circles">
      <StepCircle status="Checked" ariaLabel="Completed step" />
      <StepCircle status="Active" ariaLabel="Active step" />
      <StepCircle status="To Do" ariaLabel="To do step" />
      <StepCircle status="Numbered" label={2} />
      <StepCircle status="Disabled" label={3} />
    </Row>
  );
}
