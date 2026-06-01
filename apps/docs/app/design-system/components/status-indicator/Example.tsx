'use client';

import { StatusIndicator } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function StatusIndicatorExample() {
  return (
    <>
      <Row label="With label">
        <StatusIndicator status="Success" label="Success" />
        <StatusIndicator status="Warning" label="Warning" />
        <StatusIndicator status="Information" label="Information" />
        <StatusIndicator status="Error" label="Error" />
        <StatusIndicator status="No Status" label="No Status" />
      </Row>
      <Row label="Default (dot only)">
        <StatusIndicator status="Success" />
        <StatusIndicator status="Information" />
        <StatusIndicator status="Error" />
        <StatusIndicator status="Warning" />
        <StatusIndicator status="No Status" />
      </Row>
      <Row label="Small">
        <StatusIndicator status="Success" size="Small" />
        <StatusIndicator status="Information" size="Small" />
        <StatusIndicator status="Error" size="Small" />
        <StatusIndicator status="Warning" size="Small" />
        <StatusIndicator status="No Status" size="Small" />
      </Row>
    </>
  );
}
