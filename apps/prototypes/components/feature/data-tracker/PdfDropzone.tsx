'use client';

import React, { useRef, useState } from 'react';
import { FaIcon, IconButton } from '@efficio/orbit';

export type DropzoneError = 'unsupported' | 'too-large' | 'failed';

interface PdfDropzoneProps {
  uploadedFile?: string;
  onFileSelected: (filename: string) => void;
  onRemove: () => void;
  injectError?: DropzoneError;
  maxSizeMb?: number;
}

const ICON_UPLOAD = '';
const ICON_TRASH = '';

export const PdfDropzone: React.FC<PdfDropzoneProps> = ({
  uploadedFile,
  onFileSelected,
  onRemove,
  injectError,
  maxSizeMb = 100,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (injectError) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) return;
    if (file.size > maxSizeMb * 1024 * 1024) return;
    onFileSelected(file.name);
  };

  if (uploadedFile) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--orbit-space-s) var(--orbit-space-base)',
          border: '1px solid var(--orbit-color-silver)',
          borderRadius: 'var(--orbit-radius-sm)',
          backgroundColor: 'var(--orbit-color-white)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 22,
              height: 22,
              borderRadius: 4,
              background: 'var(--orbit-color-text-error)',
              color: 'var(--orbit-color-white)',
              fontFamily: 'var(--orbit-font-family-sans)',
              fontSize: 9,
              fontWeight: 700,
            }}
          >
            PDF
          </span>
          <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-primary)' }}>
            {uploadedFile}
          </span>
        </div>
        <IconButton
          ariaLabel="Remove file"
          variant="Tertiary"
          size="Small"
          icon={<FaIcon icon={ICON_TRASH} size={14} color="var(--orbit-color-text-secondary)" />}
          onClick={onRemove}
        />
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--orbit-space-xs)',
          paddingTop: 'var(--orbit-space-base)',
          paddingBottom: 32,
          border: `2px dashed ${dragActive ? 'var(--orbit-color-btn-primary-bg)' : 'var(--orbit-color-card-border-accent)'}`,
          borderRadius: 'var(--orbit-radius-sm)',
          backgroundColor: 'var(--orbit-color-card-bg-accent)',
          cursor: 'pointer',
          transition: 'border-color 0.15s ease',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            padding: 'var(--orbit-space-base)',
          }}
        >
          <FaIcon icon={ICON_UPLOAD} size={32} color="var(--orbit-color-dove-gray)" />
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)' }}>
          <span style={{ color: 'var(--orbit-color-text-primary)' }}>Drag &amp; drop or choose file</span>
          <span style={{ color: 'var(--orbit-color-btn-tertiary-fg)', textDecoration: 'underline' }}>choose files</span>
          <span style={{ color: 'var(--orbit-color-text-primary)' }}>to upload</span>
        </div>
        <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-secondary)' }}>
          File types supported: PDF
        </span>
        <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-secondary)' }}>
          Maximum upload file size: {maxSizeMb} MB
        </span>
      </div>
    </>
  );
};

