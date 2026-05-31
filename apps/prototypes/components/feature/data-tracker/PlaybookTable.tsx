'use client';

import React, { useState } from 'react';
import { Button, FaIcon, FA, IconButton } from '@efficio/orbit';
import type { Playbook, PlaybookStatus } from '@/data/data-tracker-mock';

interface PlaybookTableProps {
  playbooks: Playbook[];
  onReview: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const ICON_EDIT = '\uf044';
const ICON_TRASH = '\uf2ed';
const ICON_SORT = '\uf0dc';
const ICON_SPINNER = '\uf110';

type SortKey = 'name' | 'company' | 'category' | 'status' | 'dateCreated' | 'lastUpdated' | 'inputType';

const STATUS_STYLES: Record<PlaybookStatus, { bg: string; fg: string; border: string }> = {
  Pending: { bg: '#f6f6f6', fg: '#666', border: '#999' },
  'Awaiting Review': { bg: '#fffbf2', fg: '#af7d00', border: '#af7d00' },
  Published: { bg: '#dffcf3', fg: '#009a81', border: '#009a81' },
};

const StatusChip: React.FC<{ status: PlaybookStatus }> = ({ status }) => {
  const s = STATUS_STYLES[status];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        height: 24,
        padding: '2px 8px',
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.border}`,
        borderRadius: 16,
        fontFamily: 'var(--orbit-font-family-sans)',
        fontSize: 12,
      }}
    >
      {status === 'Pending' && (
        <FaIcon icon={ICON_SPINNER} size={10} color={s.fg} />
      )}
      {status}
    </span>
  );
};

const CategoryChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 24,
      padding: '2px 8px',
      background: '#e5f1fa',
      color: '#2a75b1',
      border: '1px solid #2a75b1',
      borderRadius: 16,
      fontFamily: 'var(--orbit-font-family-sans)',
      fontSize: 12,
    }}
  >
    {label}
  </span>
);

const Avatar: React.FC<{ initials: string }> = ({ initials }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'var(--orbit-color-btn-primary-bg)',
      color: '#fff',
      fontFamily: 'var(--orbit-font-family-sans)',
      fontSize: 10,
      fontWeight: 600,
    }}
  >
    {initials}
  </span>
);

export const PlaybookTable: React.FC<PlaybookTableProps> = ({ playbooks, onReview, onDelete, onEdit }) => {
  const [sortKey, setSortKey] = useState<SortKey>('dateCreated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = [...playbooks].sort((a, b) => {
    const get = (p: Playbook): string => {
      switch (sortKey) {
        case 'name': return p.name;
        case 'company': return p.company;
        case 'category': return p.category;
        case 'status': return p.status;
        case 'dateCreated': return p.dateCreated;
        case 'lastUpdated': return p.lastUpdated;
        case 'inputType': return p.inputType;
      }
    };
    const cmp = get(a).localeCompare(get(b));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const cellStyle: React.CSSProperties = {
    padding: '20px 16px',
    fontFamily: 'var(--orbit-font-family-sans)',
    fontSize: 14,
    color: '#040921',
    borderBottom: '1px solid #e6e6e6',
    verticalAlign: 'middle',
  };

  const headerStyle: React.CSSProperties = {
    ...cellStyle,
    textAlign: 'left',
    background: '#ffffff',
    fontWeight: 700,
    color: '#040921',
    height: 64,
    boxSizing: 'border-box',
  };

  const headerCell = (key: SortKey, label: string) => (
    <th style={headerStyle}>
      <button
        type="button"
        onClick={() => { setSortKey(key); setSortDir((d) => sortKey === key && d === 'asc' ? 'desc' : 'asc'); }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, color: 'inherit' }}
      >
        {label}
        <FaIcon icon={ICON_SORT} size={12} color="#666" />
      </button>
    </th>
  );

  return (
    <div style={{ width: '100%', overflow: 'auto', border: '1px solid #e6e6e6', borderRadius: 8, background: '#ffffff' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1200 }}>
        <thead>
          <tr>
            {headerCell('name', 'Playbook Name')}
            {headerCell('company', 'Company')}
            {headerCell('category', 'Category')}
            {headerCell('status', 'Status')}
            {headerCell('dateCreated', 'Date Created')}
            {headerCell('lastUpdated', 'Last Updated')}
            <th style={headerStyle}>Last Updated By</th>
            {headerCell('inputType', 'Input Type')}
            <th style={{ ...headerStyle, width: 168, textAlign: 'right' }} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.id}>
              <td style={cellStyle}>{p.name}</td>
              <td style={cellStyle}>{p.company}</td>
              <td style={cellStyle}><CategoryChip label={p.category} /></td>
              <td style={cellStyle}><StatusChip status={p.status} /></td>
              <td style={cellStyle}>{p.dateCreated}</td>
              <td style={cellStyle}>{p.lastUpdated}</td>
              <td style={cellStyle}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <Avatar initials={p.lastUpdatedBy.initials} />
                  <span>{p.lastUpdatedBy.name}</span>
                </span>
              </td>
              <td style={cellStyle}>{p.inputType}</td>
              <td style={{ ...cellStyle, textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                  {p.status === 'Awaiting Review' ? (
                    <Button variant="Primary" size="Small" onClick={() => onReview(p.id)}>Review</Button>
                  ) : (
                    <IconButton
                      ariaLabel={`Edit ${p.name}`}
                      variant="Tertiary"
                      size="Small"
                      icon={<FaIcon icon={ICON_EDIT} size={14} color="#040921" />}
                      onClick={() => onEdit(p.id)}
                    />
                  )}
                  <IconButton
                    ariaLabel={`Delete ${p.name}`}
                    variant="Tertiary"
                    size="Small"
                    icon={<FaIcon icon={ICON_TRASH} size={14} color="#040921" />}
                    onClick={() => onDelete(p.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

void FA;
