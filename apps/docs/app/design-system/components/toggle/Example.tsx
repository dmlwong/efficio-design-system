'use client';

import { useState } from 'react';
import { Toggle } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function ToggleExample() {
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  return (
    <>
      <Row label="Active">
        <Toggle checked={toggleOn} onChange={setToggleOn} label="Label" />
        <Toggle checked={toggleOff} onChange={setToggleOff} label="Label" />
      </Row>
      <Row label="Alignment">
        <Toggle checked={true} onChange={() => {}} label="Label" alignment="Left" />
        <Toggle checked={true} onChange={() => {}} label="Label" alignment="Right" />
      </Row>
      <Row label="Disabled">
        <Toggle checked={true} state="Disabled" onChange={() => {}} label="Label" />
        <Toggle checked={false} state="Disabled" onChange={() => {}} label="Label" />
      </Row>
    </>
  );
}
