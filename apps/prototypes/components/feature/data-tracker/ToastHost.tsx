'use client';

import React from 'react';
import { Toast } from '@efficio/orbit';

export interface ToastSpec {
  variant: 'Success' | 'Error' | 'Info' | 'Warning';
  message: string;
}

interface ToastHostProps {
  toast: ToastSpec | null;
  onDismiss: () => void;
}

export const ToastHost: React.FC<ToastHostProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--orbit-space-m)',
        right: 'var(--orbit-space-m)',
        zIndex: 1000,
        minWidth: 320,
        maxWidth: 480,
      }}
    >
      <Toast
        type={toast.variant}
        message={toast.message}
        visible={true}
        onDismiss={onDismiss}
      />
    </div>
  );
};
