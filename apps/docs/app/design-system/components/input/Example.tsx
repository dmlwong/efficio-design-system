'use client';

import { useState } from 'react';
import { Input } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

const fieldLabel: React.CSSProperties = { fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginBottom: 4 };

export default function InputExample() {
  const [inputValue, setInputValue] = useState('');
  const [filledInput, setFilledInput] = useState('Hello World');
  return (
    <Row label="States">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 240 }}>
          <div style={fieldLabel}>Default</div>
          <Input ariaLabel="Default text input" placeholder="Placeholder text" value={inputValue} onChange={setInputValue} />
        </div>
        <div style={{ width: 240 }}>
          <div style={fieldLabel}>Filled</div>
          <Input ariaLabel="Filled text input" placeholder="Placeholder" value={filledInput} onChange={setFilledInput} />
        </div>
        <div style={{ width: 240 }}>
          <div style={fieldLabel}>Error</div>
          <Input ariaLabel="Error text input" invalid placeholder="Error state" value="Invalid input" onChange={() => {}} />
        </div>
        <div style={{ width: 240 }}>
          <div style={fieldLabel}>Disabled</div>
          <Input ariaLabel="Disabled text input" disabled placeholder="Disabled" value="" onChange={() => {}} />
        </div>
      </div>
    </Row>
  );
}
