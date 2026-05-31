'use client';

import React from 'react';

export interface TabSpec<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  tabs: TabSpec<T>[];
  active: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Section tabs"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 0,
        minHeight: 78,
        borderBottom: '1px solid var(--orbit-color-card-border-default)',
        paddingLeft: 40,
        boxShadow: '0 4px 10px rgba(15, 23, 42, 0.16)',
      }}
    >
      {tabs.map((t) => (
        <button
          type="button"
          role="tab"
          aria-selected={t.id === active}
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 78,
            padding: 0,
            border: 0,
            background: 'transparent',
            color: '#111827',
            cursor: 'pointer',
            fontFamily: 'var(--orbit-font-family-sans)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: 46,
              padding: '0 26px',
              fontSize: 24,
              lineHeight: '32px',
              fontWeight: t.id === active ? 800 : 400,
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </span>
          <span
            aria-hidden="true"
            style={{
              width: '100%',
              height: 5,
              borderRadius: 4,
              background: t.id === active ? 'var(--orbit-color-btn-secondary-bg-accent)' : 'transparent',
            }}
          />
        </button>
      ))}
    </div>
  );
}
