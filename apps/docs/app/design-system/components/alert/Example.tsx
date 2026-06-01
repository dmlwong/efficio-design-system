'use client';

import { Alert } from '@efficio/orbit';

const DESC =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

export default function AlertExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Alert type="Information" title="Title" description={DESC} onDismiss={() => {}} />
      <Alert type="Success" title="Title" description={DESC} onDismiss={() => {}} />
      <Alert type="Error" title="Title" description={DESC} onDismiss={() => {}} />
      <Alert type="Warning" title="Title" description={DESC} onDismiss={() => {}} />
      <Alert type="No Status" title="Title" description={DESC} onDismiss={() => {}} />
    </div>
  );
}
