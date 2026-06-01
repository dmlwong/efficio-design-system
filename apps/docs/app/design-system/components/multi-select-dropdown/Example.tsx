'use client';

import { useState } from 'react';
import { MultiSelectDropdown } from '@efficio/orbit';

export default function MultiSelectDropdownExample() {
  const [multiSelectVal, setMultiSelectVal] = useState<string[]>(['opt2']);
  return (
    <div style={{ maxWidth: 520 }}>
      <MultiSelectDropdown
        label="Label"
        options={[
          { label: 'Option 1', value: 'opt1' },
          { label: 'Option 2', value: 'opt2' },
          { label: 'Option 3', value: 'opt3' },
        ]}
        value={multiSelectVal}
        onChange={setMultiSelectVal}
        required
      />
    </div>
  );
}
