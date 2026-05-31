'use client';

import React from 'react';
import { FaIcon } from '@efficio/orbit';
import type { InputType } from '@/data/data-tracker-mock';

interface WizardStepInputTypeProps {
  selected?: InputType;
  onSelect: (type: InputType) => void;
}

const ICON_FILE_LINES = '';
const ICON_FILE = '';
const ICON_INFO = '';

const Tile: React.FC<{
  selected: boolean;
  onClick: () => void;
  recommended?: boolean;
  icon: string;
  title: string;
  bullets: string[];
  exampleLabel: string;
  exampleFile: string;
}> = ({ selected, onClick, recommended, icon, title, bullets, exampleLabel, exampleFile }) => (
  <div
    role="radio"
    aria-checked={selected}
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: 16,
      background: '#ffffff',
      border: `1px solid ${selected ? 'var(--orbit-color-btn-primary-bg)' : '#e6e6e6'}`,
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'border-color 0.15s ease',
      outline: 'none',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32 }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: 4,
          background: '#f4dbeb',
        }}
      >
        <FaIcon icon={icon} size={16} color="var(--orbit-color-btn-primary-bg)" />
      </span>
      {recommended && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 24,
            padding: '2px 8px',
            background: '#e5f1fa',
            border: '1px solid #2a75b1',
            borderRadius: 16,
            fontFamily: 'var(--orbit-font-family-sans)',
            fontSize: 12,
            color: '#2a75b1',
          }}
        >
          Recommended
        </span>
      )}
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, fontWeight: 600, color: '#040921', lineHeight: 1.4 }}>
        {title}
      </span>
      <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {bullets.map((b) => (
          <li key={b} style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 12, color: '#666', lineHeight: 1.5 }}>
            {b}
          </li>
        ))}
      </ul>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#040921' }}>
        {exampleLabel}
      </span>
      <a
        href="#"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: 'var(--orbit-color-btn-primary-bg)', textDecoration: 'underline' }}
      >
        {exampleFile}
      </a>
    </div>
  </div>
);

export const WizardStepInputType: React.FC<WizardStepInputTypeProps> = ({ selected, onSelect }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, fontWeight: 600, color: '#040921' }}>
          1. Select Input
        </h3>
        <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#666' }}>
          Select an option to get started
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: 16,
          background: '#e5f1fa',
          borderRadius: 8,
          alignItems: 'flex-start',
        }}
      >
        <FaIcon icon={ICON_INFO} size={16} color="#2a75b1" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#040921' }}>
          <span style={{ fontWeight: 700 }}>Not sure which to choose?</span>
          <span>• If your document looks like a contract → choose Contract Template</span>
          <span>• If it&apos;s guidance or negotiation notes → choose Playbook</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Tile
          selected={selected === 'template'}
          onClick={() => onSelect('template')}
          recommended
          icon={ICON_FILE_LINES}
          title="Contract Template / Standard Terms"
          bullets={[
            'The document looks like a contract.',
            'It has numbered clauses.',
            'It contains wording that could go directly into an agreement.',
            'It represents the standard positions contract terms.',
          ]}
          exampleLabel="Download Documents Examples"
          exampleFile="Contract_template_example.pdf"
        />
        <Tile
          selected={selected === 'guidance'}
          onClick={() => onSelect('guidance')}
          icon={ICON_FILE}
          title="Negotiation Playbook / Guidance Document"
          bullets={[
            'The document explains what to accept, reject, or negotiate.',
            'It includes fallback positions or escalation rules.',
            'It contains comments or guidance rather than full contract wording.',
            'It may be in a table, memo, or Word document.',
          ]}
          exampleLabel="Download Documents Examples"
          exampleFile="Playbook_example.pdf"
        />
      </div>
    </div>
  );
};
