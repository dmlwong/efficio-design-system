'use client';

import { useState } from 'react';
import { QuickFilterGroup, QuickFilterItem } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function QuickFilterGroupExample() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  return (
    <>
      <Row label="Default Group">
        <QuickFilterGroup>
          <QuickFilterItem label="One" />
          <QuickFilterItem label="Two" />
          <QuickFilterItem label="Three" />
        </QuickFilterGroup>
      </Row>
      <Row label="Interactive (click to toggle)">
        <QuickFilterGroup>
          {['Category', 'Region', 'Status', 'Risk Level'].map((f) => (
            <QuickFilterItem
              key={f}
              label={f}
              selected={selectedFilters.includes(f)}
              onClick={() =>
                setSelectedFilters((prev) =>
                  prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
                )
              }
            />
          ))}
        </QuickFilterGroup>
      </Row>
      <Row label="States">
        <QuickFilterItem label="Default" />
        <QuickFilterItem label="Selected" selected />
      </Row>
    </>
  );
}
