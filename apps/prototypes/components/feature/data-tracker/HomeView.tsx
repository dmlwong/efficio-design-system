'use client';

import React from 'react';
import { Toggle } from '@efficio/orbit';
import type { NotificationItem } from '@/data/data-tracker-mock';
import { NotificationsPanel } from './NotificationsPanel';

interface HomeViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onDismissNotification: (id: string) => void;
  themeOrbit: boolean;
  onThemeChange: (orbit: boolean) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  notifications,
  onMarkAllRead,
  onDismissNotification,
  themeOrbit,
  onThemeChange,
}) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8fafc', minWidth: 0 }}>
      {/* Greeting header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 24px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          height: 72,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 20, fontWeight: 600, color: '#040921' }}>
            Good afternoon, Chris
          </h1>
          <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#475569' }}>
            Here&apos;s your overview for today
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#475569' }}>
            Theme: <strong style={{ color: '#040921' }}>{themeOrbit ? 'Orbit' : 'Efficio'}</strong>
          </span>
          <Toggle checked={themeOrbit} onChange={onThemeChange} ariaLabel="Toggle theme" />
        </div>
      </div>

      {/* Notifications panel anchored top-left */}
      <div style={{ padding: 16, flex: 1 }}>
        <NotificationsPanel
          notifications={notifications}
          onMarkAllRead={onMarkAllRead}
          onDismiss={onDismissNotification}
        />
      </div>
    </div>
  );
};
