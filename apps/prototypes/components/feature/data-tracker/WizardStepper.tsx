'use client';

import React from 'react';
import { FaIcon, FA } from '@efficio/orbit';

export interface StepDef {
  number: number;
  label: string;
}

interface WizardStepperProps {
  steps: StepDef[];
  current: number;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({ steps, current }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, width: '100%' }}>
      {steps.map((s, i) => {
        const isCompleted = s.number < current;
        const isCurrent = s.number === current;

        const circleBg = isCompleted
          ? '#00a962'
          : isCurrent
            ? 'var(--orbit-color-btn-primary-bg)'
            : '#e0e0e0';
        const circleFg = isCompleted || isCurrent ? '#ffffff' : '#999999';
        const labelColor = isCompleted || isCurrent ? 'var(--orbit-color-text-primary)' : '#999999';

        return (
          <React.Fragment key={s.number}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)', flexShrink: 0 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: circleBg,
                  color: circleFg,
                  fontFamily: 'var(--orbit-font-family-sans)',
                  fontSize: 16,
                  fontWeight: 'var(--orbit-font-weight-medium)',
                }}
              >
                {isCompleted ? <FaIcon icon={FA.check} size={14} color="#ffffff" /> : s.number}
              </span>
              <span
                style={{
                  fontFamily: 'var(--orbit-font-family-sans)',
                  fontSize: 14,
                  color: labelColor,
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden="true" style={{ flex: 1, height: 1, background: '#e0e0e0', margin: '0 var(--orbit-space-s)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
