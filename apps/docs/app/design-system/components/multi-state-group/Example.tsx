'use client';

import { useState } from 'react';
import { MultiStateButton, MultiStateGroup } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function MultiStateGroupExample() {
  const [multiStateActive, setMultiStateActive] = useState('overview');
  return (
    <>
      <Row label="Individual States">
        <MultiStateButton value="selected" label="MultiState Button" selected />
        <MultiStateButton value="default" label="MultiState Button" />
        <MultiStateButton value="disabled" label="MultiState Button" disabled />
      </Row>
      <Row label="MultiState Group (interactive)">
        <MultiStateGroup value={multiStateActive} onValueChange={setMultiStateActive}>
          {['Overview', 'Details', 'Analytics', 'Settings', 'Export'].map((item) => (
            <MultiStateButton key={item} value={item.toLowerCase()} label={item} />
          ))}
        </MultiStateGroup>
      </Row>
      <Row label="With Count">
        <MultiStateGroup defaultValue="all">
          <MultiStateButton value="all" label="All" count={42} />
          <MultiStateButton value="active" label="Active" count={18} />
          <MultiStateButton value="pending" label="Pending" count={7} />
        </MultiStateGroup>
      </Row>
    </>
  );
}
