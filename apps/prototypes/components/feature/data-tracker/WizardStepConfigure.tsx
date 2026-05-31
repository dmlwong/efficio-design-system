'use client';

import React from 'react';
import { Dropdown } from '@efficio/orbit';
import {
  AGREEMENT_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  ENTITY_OPTIONS,
  GOVERNING_LAW_OPTIONS,
} from '@/data/data-tracker-mock';

interface WizardStepConfigureProps {
  category?: string;
  entity?: string;
  governingLaw?: string;
  agreementType?: string;
  onSetCategory: (v: string) => void;
  onSetEntity: (v: string) => void;
  onSetGoverningLaw: (v: string) => void;
  onSetAgreementType: (v: string) => void;
}

export const WizardStepConfigure: React.FC<WizardStepConfigureProps> = ({
  category,
  entity,
  governingLaw,
  agreementType,
  onSetCategory,
  onSetEntity,
  onSetGoverningLaw,
  onSetAgreementType,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, fontWeight: 600, color: '#040921' }}>
            3. Additional Details
          </h3>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              background: '#f6f6f6',
              border: '1px solid #999',
              borderRadius: 4,
              fontFamily: 'var(--orbit-font-family-sans)',
              fontSize: 12,
              color: '#040921',
            }}
          >
            Optional
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#666' }}>
          Add the details that define when this playbook should be used.
        </p>
      </div>

      <Dropdown
        label="Category"
        placeholder="Please Select a Category..."
        options={CATEGORY_OPTIONS}
        value={category}
        onChange={onSetCategory}
      />

      <Dropdown
        label="Entity"
        placeholder="Please Select an Entity..."
        options={ENTITY_OPTIONS}
        value={entity}
        onChange={onSetEntity}
      />

      <Dropdown
        label="Governing Law"
        placeholder="Please Select a Governing Law..."
        options={GOVERNING_LAW_OPTIONS}
        value={governingLaw}
        onChange={onSetGoverningLaw}
      />

      <Dropdown
        label="Agreement Type"
        placeholder="Please Select an Agreement type..."
        options={AGREEMENT_TYPE_OPTIONS}
        value={agreementType}
        onChange={onSetAgreementType}
      />
    </div>
  );
};
