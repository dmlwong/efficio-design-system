'use client';

import { CountryFlag } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function CountryFlagExample() {
  return (
    <Row>
      <CountryFlag country="US" />
      <CountryFlag country="GB" />
      <CountryFlag country="DE" />
      <CountryFlag country="FR" />
      <CountryFlag country="JP" />
      <CountryFlag country="AU" />
    </Row>
  );
}
