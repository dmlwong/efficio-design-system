'use client';

import React from 'react';
import { Overlay, Headings, Separator, Button } from '@efficio/orbit';
import { similarProjectSuppliers } from '@/data/mock-data';

interface SimilarProjectsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SimilarProjectsModal: React.FC<SimilarProjectsModalProps> = ({
  visible,
  onClose,
}) => {
  if (!visible) return null;

  const thStyles: React.CSSProperties = {
    padding: `var(--orbit-space-s) var(--orbit-space-base)`,
    textAlign: 'left',
    fontSize: 'var(--orbit-text-small-size)',
    fontWeight: 'var(--orbit-font-weight-semibold)',
    fontFamily: 'var(--orbit-font-family-sans)',
    color: 'var(--orbit-color-text-secondary)',
    borderBottom: `var(--orbit-space-xxs) solid var(--orbit-color-border-default)`,
    lineHeight: 'var(--orbit-leading-tight)',
  };

  const tdStyles: React.CSSProperties = {
    padding: `var(--orbit-space-s) var(--orbit-space-base)`,
    fontSize: 'var(--orbit-text-body-size)',
    fontFamily: 'var(--orbit-font-family-sans)',
    borderBottom: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
    color: 'var(--orbit-color-text-primary)',
    lineHeight: 'var(--orbit-text-body-leading)',
  };

  return (
    <Overlay visible onClose={onClose}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `var(--orbit-space-m) var(--orbit-space-m) var(--orbit-space-base)`,
        }}
      >
        <Headings size="Heading 4">Suppliers in Similar Projects</Headings>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 'var(--orbit-text-lg)',
            color: 'var(--orbit-color-text-secondary)',
            padding: 'var(--orbit-space-xs)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-leading-tight)',
          }}
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>

      <Separator />

      <div style={{ padding: `var(--orbit-space-base) var(--orbit-space-m)` }}>
        <p
          style={{
            fontSize: 'var(--orbit-text-body-size)',
            fontFamily: 'var(--orbit-font-family-sans)',
            color: 'var(--orbit-color-text-secondary)',
            lineHeight: 'var(--orbit-text-body-leading)',
            marginBottom: 'var(--orbit-space-base)',
          }}
        >
          Suppliers from the same category that have been used in other projects.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyles}>Supplier Name</th>
              <th style={thStyles}>Project Name</th>
              <th style={thStyles}>Category</th>
            </tr>
          </thead>
          <tbody>
            {similarProjectSuppliers.map((row, i) => (
              <tr key={i}>
                <td
                  style={{
                    ...tdStyles,
                    fontWeight: 'var(--orbit-font-weight-semibold)',
                  }}
                >
                  {row.supplierName}
                </td>
                <td style={tdStyles}>{row.projectName}</td>
                <td
                  style={{
                    ...tdStyles,
                    color: 'var(--orbit-color-text-secondary)',
                  }}
                >
                  {row.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Separator />

      <div
        style={{
          padding: `var(--orbit-space-base) var(--orbit-space-m) var(--orbit-space-m)`,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button variant="Secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Overlay>
  );
};
