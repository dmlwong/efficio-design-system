'use client';

import React from 'react';
import { Button, FaIcon } from '@efficio/orbit';

interface PlaybookEmptyStateProps {
  onAddPlaybook: () => void;
}

const ICON_PLUS = '\uf067';

const RobotIllustration: React.FC = () => (
  <svg width="232" height="120" viewBox="0 0 232 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="116" cy="105" rx="80" ry="6" fill="#e2e8f0" />
    <rect x="78" y="40" width="76" height="56" rx="10" fill="#cbd5e1" />
    <rect x="86" y="48" width="60" height="36" rx="6" fill="#ffffff" />
    <circle cx="100" cy="64" r="5" fill="#475569" />
    <circle cx="132" cy="64" r="5" fill="#475569" />
    <rect x="106" y="74" width="20" height="3" rx="1.5" fill="#94a3b8" />
    <rect x="112" y="28" width="8" height="14" rx="2" fill="#cbd5e1" />
    <circle cx="116" cy="24" r="6" fill="#615fff" />
    <rect x="60" y="56" width="14" height="22" rx="6" fill="#cbd5e1" />
    <rect x="158" y="56" width="14" height="22" rx="6" fill="#cbd5e1" />
    <rect x="92" y="96" width="16" height="6" rx="2" fill="#94a3b8" />
    <rect x="124" y="96" width="16" height="6" rx="2" fill="#94a3b8" />
  </svg>
);

export const PlaybookEmptyState: React.FC<PlaybookEmptyStateProps> = ({ onAddPlaybook }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '40px 24px',
        background: '#ffffff',
        border: '1px solid #e6e6e6',
        borderRadius: 8,
      }}
    >
      <RobotIllustration />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, fontWeight: 600, color: '#040921' }}>
          No Playbooks Yet
        </h3>
        <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#040921' }}>
          Create your first submission to generate a Best Practice Table.
        </p>
      </div>
      <Button
        variant="Primary"
        onClick={onAddPlaybook}
        icon={<FaIcon icon={ICON_PLUS} size={14} color="#ffffff" />}
      >
        Add New Playbook
      </Button>
    </div>
  );
};
