'use client';

import React from 'react';
import { FaIcon } from '@efficio/orbit';
import {
  CLM_SYSTEM_OPTIONS,
  type RawDataRow,
} from '@/data/data-tracker-mock';

interface RawDataSectionProps {
  rows: RawDataRow[];
  onChangeSystem: (id: string, value: string) => void;
  onChangeComment: (id: string, value: string) => void;
}

const ICON_SORT = '\uf0dc';
const ICON_CHEVRON_DOWN = '\uf078';

const headerStyle: React.CSSProperties = {
  padding: '26px 32px',
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 24,
  lineHeight: '32px',
  fontWeight: 800,
  color: '#040921',
  textAlign: 'left',
  borderBottom: '1px solid #d8dee8',
  background: '#ffffff',
};

const cellStyle: React.CSSProperties = {
  padding: '38px 32px',
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 24,
  lineHeight: '32px',
  color: '#040921',
  verticalAlign: 'middle',
};

const SortableHeader: React.FC<{ children: React.ReactNode; width?: string; padding?: string }> = ({ children, width, padding }) => (
  <th style={{ ...headerStyle, width, padding: padding ?? headerStyle.padding }}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
      {children}
      <FaIcon icon={ICON_SORT} size={18} color="#000000" />
    </span>
  </th>
);

export const RawDataTable: React.FC<RawDataSectionProps> = ({ rows, onChangeSystem, onChangeComment }) => {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        marginTop: 8,
        padding: 0,
        background: '#ffffff',
      }}
    >
      <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 26, lineHeight: 1.15, fontWeight: 800, color: '#040921' }}>
        Raw Data
      </h3>

      <div style={{ overflow: 'hidden', border: '1px solid #d8dee8', borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <SortableHeader width="50%">CLM System</SortableHeader>
              <SortableHeader width="50%" padding="26px 6px">Comments</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 1).map((r) => (
              <tr key={r.id}>
                <td style={{ ...cellStyle, padding: '38px 6px 38px 32px' }}>
                  <span style={{ position: 'relative', display: 'block', width: '100%' }}>
                    <select
                      aria-label="CLM System"
                      value={r.clmSystem}
                      onChange={(event) => onChangeSystem(r.id, event.target.value)}
                      style={{
                        appearance: 'none',
                        width: '100%',
                        height: 51,
                        padding: '0 48px 0 14px',
                        border: '1px solid #94a3b8',
                        borderRadius: 5,
                        background: '#ffffff',
                        fontFamily: 'var(--orbit-font-family-sans)',
                        fontSize: 24,
                        lineHeight: '32px',
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      {CLM_SYSTEM_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <FaIcon
                      icon={ICON_CHEVRON_DOWN}
                      size={18}
                      color="#040921"
                      style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                    />
                  </span>
                </td>
                <td style={{ ...cellStyle, padding: '38px 32px 38px 6px' }}>
                  <input
                    type="text"
                    value={r.comments}
                    onChange={(e) => onChangeComment(r.id, e.target.value)}
                    placeholder="Add a comment..."
                    style={{
                      width: '100%',
                      height: 51,
                      padding: '0 14px',
                      border: '1px solid #94a3b8',
                      borderRadius: 5,
                      background: '#ffffff',
                      fontFamily: 'var(--orbit-font-family-sans)',
                      fontSize: 22,
                      lineHeight: '32px',
                      color: '#475569',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
