'use client';

import { useState } from 'react';
import { TextArea } from '@efficio/orbit';

export default function TextAreaExample() {
  const [textareaVal, setTextareaVal] = useState('');
  const [textareaFilled, setTextareaFilled] = useState('Some filled content here');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <TextArea label="Label" message="Helper text" placeholder="Enter text" value={textareaVal} onChange={setTextareaVal} maxLength={250} />
      <TextArea label="Label" message="Helper text" value={textareaFilled} onChange={setTextareaFilled} maxLength={250} />
      <TextArea label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} disabled maxLength={250} />
      <TextArea label="Label" message="Error message" value="Invalid content" onChange={() => {}} invalid maxLength={250} />
    </div>
  );
}
