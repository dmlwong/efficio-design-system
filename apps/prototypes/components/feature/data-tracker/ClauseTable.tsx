'use client';

import React from 'react';
import { FaIcon, IconButton } from '@efficio/orbit';
import type { Clause } from '@/data/data-tracker-mock';

interface ClauseTableProps {
  clauses: Clause[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const ICON_EDIT = '';
const ICON_TRASH = '';
const ICON_SORT = '';
const ICON_CHEVRON_LEFT = '';
const ICON_CHEVRON_RIGHT = '';
const ICON_CHEVRON_DOWN = '';

const cellStyle: React.CSSProperties = {
  padding: '20px 16px',
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 14,
  color: '#040921',
  borderBottom: '1px solid #e6e6e6',
  verticalAlign: 'top',
};

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  textAlign: 'left',
  background: '#ffffff',
  fontWeight: 700,
  height: 64,
  verticalAlign: 'middle',
  boxSizing: 'border-box',
};

const HeaderCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th style={headerStyle}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {children}
      <FaIcon icon={ICON_SORT} size={12} color="#666" />
    </span>
  </th>
);

const PageBtn: React.FC<{ disabled?: boolean; ariaLabel: string; onClick: () => void; icon: string }> = ({ disabled, ariaLabel, onClick, icon }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      border: '1px solid #ccc',
      borderRadius: 4,
      background: '#ffffff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <FaIcon icon={icon} size={12} color="#040921" />
  </button>
);

export const ClauseTable: React.FC<ClauseTableProps> = ({
  clauses,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onEdit,
}) => {
  const totalPages = Math.max(1, Math.ceil(clauses.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, clauses.length);
  const visible = clauses.slice(start, end);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflow: 'auto', border: '1px solid #e6e6e6', borderRadius: 8, background: '#ffffff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead>
            <tr>
              <HeaderCell>Clause Name</HeaderCell>
              <HeaderCell>Sub-Clause Description</HeaderCell>
              <HeaderCell>Best Practice</HeaderCell>
              <th style={{ ...headerStyle, width: 88 }} aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.id}>
                <td style={{ ...cellStyle, width: 200 }}>{c.clauseName}</td>
                <td style={{ ...cellStyle, width: 320 }}>{c.subClauseDescription}</td>
                <td style={cellStyle}>{c.bestPractice}</td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 4 }}>
                    {onEdit && (
                      <IconButton
                        ariaLabel="Edit clause"
                        variant="Tertiary"
                        size="Small"
                        icon={<FaIcon icon={ICON_EDIT} size={14} color="#040921" />}
                        onClick={() => onEdit(c.id)}
                      />
                    )}
                    {onDelete && (
                      <IconButton
                        ariaLabel="Delete clause"
                        variant="Tertiary"
                        size="Small"
                        icon={<FaIcon icon={ICON_TRASH} size={14} color="#040921" />}
                        onClick={() => onDelete(c.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80, padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#040921' }}>
          <span>View</span>
          <div style={{ position: 'relative' }}>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                appearance: 'none',
                width: 56,
                height: 32,
                padding: '0 24px 0 12px',
                border: '1px solid #ccc',
                borderRadius: 4,
                background: '#ffffff',
                fontFamily: 'var(--orbit-font-family-sans)',
                fontSize: 14,
                color: '#040921',
                cursor: 'pointer',
              }}
            >
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <FaIcon icon={ICON_CHEVRON_DOWN} size={10} color="#040921" />
            </span>
          </div>
          <span>{clauses.length === 0 ? '0' : `${start + 1} to ${end}`}</span>
          <span style={{ color: '#666' }}>of {clauses.length} items</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PageBtn disabled={safePage === 1} ariaLabel="Previous page" onClick={() => onPageChange(Math.max(1, safePage - 1))} icon={ICON_CHEVRON_LEFT} />
          <input
            type="number"
            min={1}
            max={totalPages}
            value={safePage}
            onChange={(e) => onPageChange(Math.min(totalPages, Math.max(1, Number(e.target.value) || 1)))}
            style={{
              width: 48,
              height: 32,
              padding: '0 8px',
              border: '1px solid #ccc',
              borderRadius: 4,
              background: '#ffffff',
              fontFamily: 'var(--orbit-font-family-sans)',
              fontSize: 14,
              color: '#040921',
              textAlign: 'center',
            }}
          />
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#272b31' }}>of {totalPages} pages</span>
          <PageBtn disabled={safePage === totalPages} ariaLabel="Next page" onClick={() => onPageChange(Math.min(totalPages, safePage + 1))} icon={ICON_CHEVRON_RIGHT} />
        </div>
      </div>
    </div>
  );
};
