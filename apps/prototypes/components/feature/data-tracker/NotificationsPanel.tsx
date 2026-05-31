'use client';

import React, { useState } from 'react';
import { FaIcon, FA, IconButton } from '@efficio/orbit';
import type { NotificationItem } from '@/data/data-tracker-mock';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const ICON_GEAR = '';
const ICON_BOOK = '';

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkAllRead,
  onDismiss,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const filtered = filter === 'unread' ? notifications.filter((n) => n.unread) : notifications;

  return (
    <aside
      aria-label="Notifications"
      style={{
        width: 440,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 0px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, fontWeight: 600, color: '#040921' }}>
            Notifications
          </span>
          <FaIcon icon={ICON_GEAR} size={12} color="#475569" />
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'var(--orbit-font-family-sans)',
            fontSize: 14,
            color: '#615fff',
          }}
        >
          Mark all as read
        </button>
      </div>

      {/* Tabs */}
      <div style={{ padding: 8, borderBottom: '1px solid #e2e8f0' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: 4,
            background: '#e6e6e6',
            borderRadius: 8,
            gap: 0,
          }}
        >
          {(['all', 'unread'] as const).map((k) => {
            const active = filter === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                style={{
                  border: 'none',
                  height: 28,
                  padding: '0 16px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  fontSize: 14,
                  background: active ? '#ffffff' : 'transparent',
                  color: '#040921',
                  boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {k === 'all' ? 'All' : 'Unread'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.length === 0 && (
          <div style={{ padding: 16, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#475569' }}>
            You&apos;re all caught up.
          </div>
        )}
        {filtered.map((n, i) => (
          <div
            key={n.id}
            style={{
              display: 'flex',
              alignItems: 'stretch',
              borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #e2e8f0',
            }}
          >
            {/* Status stripe */}
            <span aria-hidden="true" style={{ width: 3, background: '#00a962', flexShrink: 0 }} />
            {/* Icon badge */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0 16px 16px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#615fff',
                }}
              >
                <FaIcon icon={ICON_BOOK} size={14} color="#ffffff" />
              </span>
            </div>
            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: 16, justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#040921' }}>
                {n.message}
              </span>
              <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 12, color: '#475569' }}>
                {n.timeAgo}
              </span>
            </div>
            {/* Close */}
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: 16 }}>
              <IconButton
                ariaLabel="Dismiss notification"
                variant="Tertiary"
                size="Small"
                icon={<FaIcon icon={FA.xmark} size={14} color="#475569" />}
                onClick={() => onDismiss(n.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
