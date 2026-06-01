'use client';

import { useState } from 'react';
import { Textbox } from '@efficio/orbit';

export default function TextboxExample() {
  const [textboxVal, setTextboxVal] = useState('');
  const [textboxFilled, setTextboxFilled] = useState('Hello World');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Textbox label="Label" message="Helper text" placeholder="Enter text" value={textboxVal} onChange={setTextboxVal} />
      <Textbox label="Label" message="Helper text" placeholder="Enter text" value={textboxFilled} onChange={setTextboxFilled} />
      <Textbox label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} disabled />
      <Textbox label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} locked />
      <Textbox label="Label" message="Error message" placeholder="Enter text" value="Invalid" onChange={() => {}} invalid />
      <Textbox label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} required />
    </div>
  );
}
