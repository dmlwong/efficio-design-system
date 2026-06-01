'use client';

import { useState } from 'react';
import { Toast, Button } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

type ToastKind = 'Success' | 'Error' | 'Info' | 'Warning' | 'Mute' | 'NoStatus';

export default function ToastExample() {
  const [toastType, setToastType] = useState<ToastKind | null>(null);
  return (
    <>
      <Row>
        <Button variant="Primary" onClick={() => setToastType('Success')}>Success Toast</Button>
        <Button variant="Destructive" onClick={() => setToastType('Error')}>Error Toast</Button>
        <Button variant="Secondary" onClick={() => setToastType('Info')}>Info Toast</Button>
        <Button variant="Secondary" onClick={() => setToastType('Warning')}>Warning Toast</Button>
        <Button variant="Secondary" onClick={() => setToastType('NoStatus')}>No Status Toast</Button>
      </Row>
      {toastType && (
        <Toast
          type={toastType}
          message={`This is a ${toastType.toLowerCase()} toast message.`}
          visible={true}
          onDismiss={() => setToastType(null)}
          actions={toastType === 'Success' ? [
            { label: 'Review', variant: 'Primary', onClick: () => setToastType(null) },
            { label: 'Dismiss', variant: 'Secondary', onClick: () => setToastType(null) },
          ] : undefined}
        />
      )}
    </>
  );
}
