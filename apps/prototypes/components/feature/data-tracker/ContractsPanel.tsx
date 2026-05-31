'use client';

import React from 'react';
import { Button, FaIcon, IconButton } from '@efficio/orbit';
import { CONTRACT_LENS_OPTIONS, CONTRACT_SUMMARY } from '@/data/data-tracker-mock';

interface ContractsPanelProps {
  numberOfContracts: number;
  contractLens: string;
  onContractLensChange: (v: string) => void;
  onViewPlaybooks: () => void;
}

const ICON_CHEVRON_DOWN = '\uf078';

export const ContractsPanel: React.FC<ContractsPanelProps> = ({
  numberOfContracts,
  contractLens,
  onContractLensChange,
  onViewPlaybooks,
}) => {
  const annualisedValue = `$${(CONTRACT_SUMMARY.totalAnnualised / 1000).toLocaleString('en-US')}`;
  const buttonStyle: React.CSSProperties = {
    height: 51,
    padding: '0 23px',
    fontSize: 24,
    lineHeight: '32px',
    fontWeight: 500,
    borderRadius: 5,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 32, lineHeight: 1.15, fontWeight: 800, color: '#040921' }}>
            Contracts
          </h2>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              height: 51,
              padding: '0 14px',
              background: '#ffffff',
              border: '1px solid #94a3b8',
              borderRadius: 5,
              fontFamily: 'var(--orbit-font-family-sans)',
              fontSize: 24,
              lineHeight: '32px',
              fontWeight: 400,
              color: '#0f172a',
              cursor: 'pointer',
            }}
            aria-label="Status: Needs Attention"
          >
            Needs Attention
            <FaIcon icon={ICON_CHEVRON_DOWN} size={18} color="#0f172a" />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'flex-end', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <Button variant="Secondary" style={buttonStyle} onClick={onViewPlaybooks}>View Playbooks</Button>
          <Button variant="Secondary" style={buttonStyle}>Output Files</Button>
          <Button variant="Primary" style={{ ...buttonStyle, padding: '0 25px' }}>Save</Button>
          <Button variant="Secondary" style={buttonStyle}>Cancel</Button>
          <Button variant="Secondary" style={buttonStyle}>Request Support</Button>
          <IconButton
            ariaLabel="More options"
            variant="Tertiary"
            size="Large"
            style={{ width: 51, height: 51 }}
            icon={<FaIcon icon={ICON_CHEVRON_DOWN} size={24} color="#040921" />}
          />
        </div>
      </div>

      <p style={{ margin: 0, maxWidth: 1510, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24, color: '#111827', lineHeight: 1.55 }}>
        This section provides a transparent overview of all contracts available for the client, along with the tools or systems they come from. This gives visibility of coverage and data gaps.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap' }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 18 }}>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24, color: '#111827', lineHeight: '32px' }}>No. of Contracts</span>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 32, lineHeight: 1, fontWeight: 800, color: '#000414' }}>{numberOfContracts}</span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24, color: '#111827', lineHeight: '32px' }}>ContractLens</span>
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <select
              aria-label="ContractLens"
              value={contractLens}
              onChange={(event) => onContractLensChange(event.target.value)}
              style={{
                appearance: 'none',
                height: 51,
                minWidth: 113,
                padding: '0 44px 0 12px',
                border: '1px solid #94a3b8',
                borderRadius: 5,
                background: '#ffffff',
                fontFamily: 'var(--orbit-font-family-sans)',
                fontSize: 24,
                lineHeight: '32px',
                color: '#111827',
                cursor: 'pointer',
              }}
            >
              {CONTRACT_LENS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <FaIcon
              icon={ICON_CHEVRON_DOWN}
              size={18}
              color="#111827"
              style={{ position: 'absolute', right: 14, pointerEvents: 'none' }}
            />
          </span>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 18 }}>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24, color: '#111827', lineHeight: '32px' }}>Total Annualised Contract Value</span>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 32, lineHeight: 1, fontWeight: 800, color: '#000414' }}>{annualisedValue}</span>
        </div>
      </div>
    </section>
  );
};
