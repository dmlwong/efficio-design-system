'use client';

import { RiskIndicator } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function RiskIndicatorExample() {
  return (
    <Row label="Risk & Priority Indicators">
      <RiskIndicator level="Very High" />
      <RiskIndicator level="High" />
      <RiskIndicator level="None" />
      <RiskIndicator level="Medium" />
      <RiskIndicator level="Low" />
      <RiskIndicator level="Very Low" />
    </Row>
  );
}
