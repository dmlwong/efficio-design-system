'use client';

import React from 'react';
import styles from './DocumentGlyph.module.css';

export interface DocumentGlyphProps {
  documentType?: 'XLS' | 'DOC' | 'PDF' | 'ZIP' | 'IMG' | 'Unknown';
  size?: 'Large' | 'Medium' | 'Small' | 'Extra Small' | 'Micro';
  ariaLabel?: string;
}

const colorMap: Record<string, string> = {
  XLS: 'var(--orbit-color-doc-xls)',
  DOC: 'var(--orbit-color-doc-word)',
  PDF: 'var(--orbit-color-doc-pdf)',
  ZIP: 'var(--orbit-color-doc-zip)',
  IMG: 'var(--orbit-color-doc-img)',
  Unknown: 'var(--orbit-color-doc-unknown)',
};

const labelMap: Record<string, string> = {
  XLS: 'XLS',
  DOC: 'DOC',
  PDF: 'PDF',
  ZIP: 'ZIP',
  IMG: '',
  Unknown: '',
};

// Font Awesome unicode for the icon types
const iconMap: Record<string, string> = {
  IMG: '\uf03e',       // image
  Unknown: '\uf059',   // circle-question
};

const sizeMap: Record<string, string> = {
  Large: 'var(--orbit-document-glyph-size-large)',
  Medium: 'var(--orbit-document-glyph-size-medium)',
  Small: 'var(--orbit-document-glyph-size-small)',
  'Extra Small': 'var(--orbit-document-glyph-size-extra-small)',
  Micro: 'var(--orbit-document-glyph-size-micro)',
};

const labelSizeMap: Record<string, string> = {
  Large: 'var(--orbit-document-glyph-label-size-large)',
  Medium: 'var(--orbit-document-glyph-label-size-medium)',
  Small: 'var(--orbit-document-glyph-label-size-small)',
  'Extra Small': 'var(--orbit-document-glyph-label-size-extra-small)',
};

const iconSizeMap: Record<string, string> = {
  Large: 'var(--orbit-document-glyph-icon-size-large)',
  Medium: 'var(--orbit-document-glyph-icon-size-medium)',
  Small: 'var(--orbit-document-glyph-icon-size-small)',
  'Extra Small': 'var(--orbit-document-glyph-icon-size-extra-small)',
};

const overlayPaddingMap: Record<string, string> = {
  Large: 'var(--orbit-document-glyph-overlay-padding-large)',
  Medium: 'var(--orbit-document-glyph-overlay-padding-medium)',
  Small: 'var(--orbit-document-glyph-overlay-padding-small)',
  'Extra Small': 'var(--orbit-document-glyph-overlay-padding-extra-small)',
};

export const DocumentGlyph: React.FC<DocumentGlyphProps> = ({
  documentType = 'XLS',
  size = 'Large',
  ariaLabel,
}) => {
  const sizeToken = sizeMap[size];
  const color = colorMap[documentType];
  const label = labelMap[documentType];
  const faIcon = iconMap[documentType];
  const isMicro = size === 'Micro';

  if (isMicro) {
    return (
      <span
        className={styles.micro}
        style={{ '--_color': color, '--_size': sizeToken } as React.CSSProperties}
        role="img"
        aria-label={ariaLabel || `${documentType} document`}
      />
    );
  }

  // Use a normalized 48x64 viewBox for consistent proportions, then scale via tokenized wrapper dimensions.
  const style = {
    '--_size': sizeToken,
    '--_label-size': labelSizeMap[size],
    '--_icon-size': iconSizeMap[size],
    '--_overlay-padding': overlayPaddingMap[size],
  } as React.CSSProperties;

  return (
    <span
      className={styles.wrapper}
      style={style}
      role="img"
      aria-label={ariaLabel || `${documentType} document`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 48 64"
        fill="none"
      >
        {/* Document body — rounded corners on BL, BR, TL; straight fold on TR */}
        <path
          d="M4 0 L34 0 L48 14 L48 59 Q48 64 43 64 L5 64 Q0 64 0 59 L0 5 Q0 0 4 0 Z"
          fill={color}
        />
        {/* Fold */}
        <path
          d="M34 0 L48 14 L38 14 Q34 14 34 10 L34 0 Z"
          fill="var(--orbit-color-doc-fold-overlay)"
        />
      </svg>

      {/* Label or icon overlay */}
      <span className={styles.overlay}>
        {label && (
          <span className={styles.textLabel}>
            {label}
          </span>
        )}
        {faIcon && (
          <span className={styles.iconLabel}>
            {faIcon}
          </span>
        )}
      </span>
    </span>
  );
};
