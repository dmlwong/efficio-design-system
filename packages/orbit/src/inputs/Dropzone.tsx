'use client';

import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { FaIcon, Text } from '../primitives';
import styles from './Dropzone.module.css';

const ICON_UPLOAD = '\ue09a';

export interface DropzoneProps {
  onFileSelected: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  ariaLabel: string;
  chooseButtonLabel?: string;
  promptPrefix?: React.ReactNode;
  promptSuffix?: React.ReactNode;
  acceptedFileTypesLabel?: string;
  maxFileSizeLabel?: string;
  error?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  accept,
  disabled = false,
  ariaLabel,
  chooseButtonLabel = 'choose files',
  promptPrefix = 'Drag & drop or',
  promptSuffix = 'to upload',
  acceptedFileTypesLabel,
  maxFileSizeLabel,
  error,
  icon,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const openFilePicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleFile = (file?: File) => {
    if (!file || disabled) return;
    onFileSelected(file);
  };

  return (
    <div className={styles.root}>
      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        accept={accept}
        aria-label={ariaLabel}
        tabIndex={-1}
        disabled={disabled}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      <div
        className={clsx(styles.dropzone, dragActive && styles.dropzoneActive, disabled && styles.dropzoneDisabled)}
        role="group"
        aria-label={ariaLabel}
        data-drag-active={dragActive ? 'true' : 'false'}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('button')) return;
          openFilePicker();
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon ?? <FaIcon icon={ICON_UPLOAD} size={32} color="var(--orbit-color-text-secondary)" />}
        </span>
        <div className={styles.prompt}>
          <Text variant="Primary" size="Paragraph">{promptPrefix}</Text>
          <button type="button" className={styles.chooseButton} onClick={openFilePicker} disabled={disabled}>
            {chooseButtonLabel}
          </button>
          <Text variant="Primary" size="Paragraph">{promptSuffix}</Text>
        </div>
        {acceptedFileTypesLabel && <Text variant="Secondary" size="Paragraph">{acceptedFileTypesLabel}</Text>}
        {maxFileSizeLabel && <Text variant="Secondary" size="Paragraph">{maxFileSizeLabel}</Text>}
      </div>
    </div>
  );
};
