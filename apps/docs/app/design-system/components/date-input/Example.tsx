'use client';

import { useState } from 'react';
import { DateInput } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function DateInputExample() {
  const [dateVal, setDateVal] = useState('');
  return (
    <Row label="States">
      <DateInput ariaLabel="Default date input" value={dateVal} onChange={setDateVal} />
      <DateInput ariaLabel="Hover date input" value="" onChange={() => {}} previewState="hover" />
      <DateInput ariaLabel="Focused date input" value="" onChange={() => {}} previewState="focus" />
      <DateInput ariaLabel="Filled date input" value="24-03-30" onChange={() => {}} />
      <DateInput ariaLabel="Disabled date input" value="" onChange={() => {}} disabled />
      <DateInput ariaLabel="Error date input" value="" onChange={() => {}} invalid />
    </Row>
  );
}
