'use client';

import React from 'react';
import { Breadcrumb, Button, FaIcon } from '@efficio/orbit';
import type { Playbook } from '@/data/data-tracker-mock';
import { PlaybookEmptyState } from './PlaybookEmptyState';
import { PlaybookTable } from './PlaybookTable';

interface BestPracticeLibraryProps {
  playbooks: Playbook[];
  onAddPlaybook: () => void;
  onReview: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onBack?: () => void;
}

const ICON_PLUS = '\uf067';
const ICON_ARROW_LEFT = '\uf060';

export const BestPracticeLibrary: React.FC<BestPracticeLibraryProps> = ({
  playbooks,
  onAddPlaybook,
  onReview,
  onDelete,
  onEdit,
  onBack,
}) => {
  const empty = playbooks.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Breadcrumb items={[{ label: 'Data Tracker & Insights', href: '#' }, { label: 'Playbook' }]} />

      {onBack && (
        <div>
          <Button
            variant="Tertiary"
            onClick={onBack}
            icon={<FaIcon icon={ICON_ARROW_LEFT} size={14} color="currentColor" />}
          >
            Back to Data Overview
          </Button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 20, fontWeight: 600, color: '#040921' }}>
            Best Practice Library
          </h2>
          <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#666' }}>
            Manage your contract playbooks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="Secondary" onClick={() => { /* future: manage parameters */ }}>
            Manage Parameters
          </Button>
          <Button
            variant="Primary"
            onClick={onAddPlaybook}
            icon={<FaIcon icon={ICON_PLUS} size={14} color="#ffffff" />}
          >
            Add New Playbook
          </Button>
        </div>
      </div>

      {empty ? (
        <PlaybookEmptyState onAddPlaybook={onAddPlaybook} />
      ) : (
        <PlaybookTable playbooks={playbooks} onReview={onReview} onDelete={onDelete} onEdit={onEdit} />
      )}
    </div>
  );
};
