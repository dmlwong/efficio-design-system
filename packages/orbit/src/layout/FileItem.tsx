'use client';

import React from 'react';
import clsx from 'clsx';
import { DocumentGlyph, type DocumentGlyphProps } from '../indicators/DocumentGlyph';
import styles from './FileItem.module.css';

export interface FileItemProps {
  filename: string;
  documentType?: DocumentGlyphProps['documentType'];
  trailing?: React.ReactNode;
  onClick?: () => void;
  fixedWidth?: number;
}

export const FileItem: React.FC<FileItemProps> = ({
  filename,
  documentType = 'Unknown',
  trailing,
  onClick,
  fixedWidth,
}) => {
  const contents = (
    <>
      <DocumentGlyph documentType={documentType} size="Medium" />
      <span className={styles.filename}>{filename}</span>
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </>
  );
  const style = fixedWidth ? { '--_width': `${fixedWidth}px` } as React.CSSProperties : undefined;

  if (onClick) {
    return (
      <button
        type="button"
        className={clsx(styles.fileItem, styles.interactive)}
        style={style}
        onClick={onClick}
      >
        {contents}
      </button>
    );
  }

  return (
    <div className={styles.fileItem} style={style}>
      {contents}
    </div>
  );
};
