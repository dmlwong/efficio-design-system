'use client';

import React, { useState } from 'react';
import { Button, FaIcon, FA, IconButton } from '@efficio/orbit';
import type { Clause, Playbook } from '@/data/data-tracker-mock';
import { LargeOverlay } from './LargeOverlay';
import { ClauseTable } from './ClauseTable';
import { AddClausePanel } from './AddClausePanel';

interface PlaybookDetailModalProps {
  open: boolean;
  playbook?: Playbook;
  clauses: Clause[];
  addClauseOpen: boolean;
  onClose: () => void;
  onOpenAddClause: () => void;
  onCloseAddClause: () => void;
  onSaveClause: (clause: Omit<Clause, 'id'>) => void;
  onDeleteClause: (id: string) => void;
}

const ICON_PLUS = '';

const FilterChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      height: 24,
      padding: '2px 8px',
      background: '#f6f6f6',
      border: '1px solid #999',
      borderRadius: 4,
      fontFamily: 'var(--orbit-font-family-sans)',
      fontSize: 12,
      color: '#040921',
    }}
  >
    {label}
  </span>
);

export const PlaybookDetailModal: React.FC<PlaybookDetailModalProps> = ({
  open,
  playbook,
  clauses,
  addClauseOpen,
  onClose,
  onOpenAddClause,
  onCloseAddClause,
  onSaveClause,
  onDeleteClause,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <LargeOverlay visible={open} onClose={onClose} ariaLabel="Playbook detail">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '90vh', background: '#ffffff' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottom: '1px solid #e6e6e6',
          }}
        >
          <h2 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 26, fontWeight: 600, color: '#040921' }}>
            Playbook_123_ABC
          </h2>
          <IconButton
            ariaLabel="Close playbook detail"
            variant="Tertiary"
            size="Small"
            icon={<FaIcon icon={FA.xmark} size={16} color="#040921" />}
            onClick={onClose}
          />
        </div>

        {/* Filter row + Add Clause */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <FilterChip label={`Contract Template: Contract_123_ABC.pdf`} />
            <FilterChip label={`Category: ${playbook?.category ?? 'Financial Service'}`} />
            <FilterChip label={`Company: Company_ABC_123`} />
          </div>
          {!addClauseOpen && (
            <Button
              variant="Secondary"
              onClick={onOpenAddClause}
              icon={<FaIcon icon={ICON_PLUS} size={14} color="#040921" />}
            >
              Add Clause
            </Button>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', padding: '0 16px 16px 16px' }}>
            <ClauseTable
              clauses={clauses}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              onDelete={onDeleteClause}
            />
          </div>
          {addClauseOpen && (
            <AddClausePanel onClose={onCloseAddClause} onSave={onSaveClause} />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderTop: '1px solid #e6e6e6',
          }}
        >
          <Button variant="Secondary" onClick={onClose}>Close</Button>
          <Button variant="Primary" onClick={onClose}>Save Changes</Button>
        </div>
      </div>
    </LargeOverlay>
  );
};
