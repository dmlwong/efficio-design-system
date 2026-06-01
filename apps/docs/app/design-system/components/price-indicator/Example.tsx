'use client';

import { PriceIndicator } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function PriceIndicatorExample() {
  return (
    <Row label="Price Indicators">
      <PriceIndicator movement="Positive" value="Value" />
      <PriceIndicator movement="Negative" value="Value" />
      <PriceIndicator movement="None" value="Value" />
    </Row>
  );
}
