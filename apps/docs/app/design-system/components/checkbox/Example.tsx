'use client';

import { useState } from 'react';
import { Checkbox } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function CheckboxExample() {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  return (
    <>
      <Row>
        <Checkbox checked={checkboxChecked} onChange={setCheckboxChecked} label="Interactive checkbox" />
        <Checkbox checked={true} onChange={() => {}} label="Checked" />
        <Checkbox checked={false} onChange={() => {}} label="Unchecked" />
        <Checkbox checked={false} state="Disabled" onChange={() => {}} label="Disabled" />
      </Row>
      <Row label="Alignment">
        <Checkbox checked={true} alignment="Left" onChange={() => {}} label="Left aligned" />
        <Checkbox checked={true} alignment="Right" onChange={() => {}} label="Right aligned" />
      </Row>
    </>
  );
}
