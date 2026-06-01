'use client';

import { useState } from 'react';
import { Radio, RadioGroup } from '@efficio/orbit';

export default function RadioGroupExample() {
  const [radioVal, setRadioVal] = useState('one');
  return (
    <RadioGroup value={radioVal} name="docs-radio" ariaLabel="Radio examples" onChange={setRadioVal}>
      <Radio value="one" checked={false} onChange={() => {}} label="Option one" />
      <Radio value="two" checked={false} onChange={() => {}} label="Option two" />
      <Radio value="three" checked={false} onChange={() => {}} label="Option three" state="Disabled" />
    </RadioGroup>
  );
}
