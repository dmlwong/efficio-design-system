'use client';

import React, { useState } from 'react';
import { FaIcon, IconButton } from '@efficio/orbit';
import type { ContractLink } from '@/data/data-tracker-mock';

interface ContractUploaderProps {
  links: ContractLink[];
  onAdd: (url: string) => void;
  onRemove: (id: string) => void;
}

const ICON_LINK = '\uf0c1';
const ICON_TRASH = '\uf2ed';

export const ContractUploader: React.FC<ContractUploaderProps> = ({ links, onAdd, onRemove }) => {
  const [draft, setDraft] = useState('');

  const submit = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft('');
  };

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 0,
        background: '#ffffff',
      }}
    >
      <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 26, lineHeight: 1.15, fontWeight: 800, color: '#040921' }}>
        Upload Contracts
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '23px 25px 27px',
          background: '#f8fafc',
          borderRadius: 8,
        }}
      >
        <label
          htmlFor="contract-link-input"
          style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24, lineHeight: '32px', fontWeight: 700, color: '#040921' }}
        >
          Please paste a SharePoint or zip file link to your contract files:
        </label>
        <input
          id="contract-link-input"
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder="https://sharepoint.com/... or https://..."
          style={{
            width: '100%',
            height: 51,
            padding: '0 15px',
            border: '1px solid #94a3b8',
            borderRadius: 5,
            background: '#ffffff',
            fontFamily: 'var(--orbit-font-family-sans)',
            fontSize: 24,
            lineHeight: '32px',
            color: '#040921',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {links.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '24px 25px 25px', background: '#f8fafc', borderRadius: 8 }}>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24, lineHeight: '32px', fontWeight: 700, color: '#040921' }}>
            Links Submitted
          </span>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {links.map((l) => (
              <li
                key={l.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: 'min(100%, 790px)',
                  minHeight: 75,
                  padding: '0 24px',
                  background: '#ffffff',
                  border: '1px solid #d8dee8',
                  borderRadius: 5,
                  gap: 18,
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18, minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <FaIcon icon={ICON_LINK} size={28} color="#475569" />
                  <span
                    style={{
                      fontFamily: 'var(--orbit-font-family-sans)',
                      fontSize: 24,
                      lineHeight: '32px',
                      color: 'var(--orbit-color-btn-primary-bg)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {l.url}
                  </span>
                </span>
                <IconButton
                  ariaLabel="Remove link"
                  variant="Tertiary"
                  size="Large"
                  icon={<FaIcon icon={ICON_TRASH} size={22} color="#001969" />}
                  onClick={() => onRemove(l.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
