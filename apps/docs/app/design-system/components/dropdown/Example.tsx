'use client';

import { useState } from 'react';
import { Dropdown } from '@efficio/orbit';

const OPTIONS = [
  { label: 'Option 1', value: 'opt1' },
  { label: 'Option 2', value: 'opt2' },
  { label: 'Option 3', value: 'opt3' },
];

export default function DropdownExample() {
  const [dropdownVal, setDropdownVal] = useState('');
  const [dropdownFilled, setDropdownFilled] = useState('opt2');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Dropdown label="Label" message="Helper text" options={OPTIONS} value={dropdownVal} onChange={setDropdownVal} required />
      <Dropdown label="Label" message="Helper text" options={OPTIONS} value={dropdownFilled} onChange={setDropdownFilled} />
      <Dropdown label="Label" message="Helper text" options={[]} value="" onChange={() => {}} disabled />
      <Dropdown label="Label" message="Error message" options={[{ label: 'Option 1', value: 'opt1' }]} value="" onChange={() => {}} invalid required />
    </div>
  );
}
