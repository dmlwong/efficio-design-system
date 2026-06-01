'use client';

import { useState } from 'react';
import { TabButton } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function TabButtonExample() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
      <Row>
        {['Overview', 'Details', 'History'].map((tab, i) => (
          <TabButton key={tab} active={activeTab === i} onClick={() => setActiveTab(i)}>
            {tab}
          </TabButton>
        ))}
      </Row>
      <Row label="All Variants">
        <TabButton active={false} status="Rest">Label</TabButton>
        <TabButton active={false} status="Hover">Label</TabButton>
        <TabButton active={true} status="Hover">Label</TabButton>
        <TabButton active={true}>Label</TabButton>
        <TabButton active={false} status="Disabled">Label</TabButton>
        <TabButton active={true} status="Disabled">Label</TabButton>
      </Row>
    </>
  );
}
