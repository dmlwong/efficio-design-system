'use client';

import { useState } from 'react';
import { CurrencyInput } from '@efficio/orbit';

export default function CurrencyInputExample() {
  const [currencyVal, setCurrencyVal] = useState('');
  const [currencyFilled, setCurrencyFilled] = useState('1,250.00');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <CurrencyInput label="Label" message="Helper text" value={currencyVal} onChange={setCurrencyVal} currency="GBP" />
      <CurrencyInput label="Label" message="Helper text" value={currencyFilled} onChange={setCurrencyFilled} currency="GBP" />
      <CurrencyInput label="Label" message="Helper text" value="" onChange={() => {}} currency="GBP" disabled />
      <CurrencyInput label="Label" message="Error message" value="Invalid" onChange={() => {}} currency="GBP" invalid />
    </div>
  );
}
