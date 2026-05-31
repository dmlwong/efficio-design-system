'use client';

import React from 'react';
import { FaIcon, InlineBanner } from '@efficio/orbit';
import { PdfDropzone, type DropzoneError } from './PdfDropzone';

interface WizardStepUploadProps {
  uploadedFile?: string;
  onFileSelected: (filename: string) => void;
  onRemove: () => void;
  error?: DropzoneError;
  secondaryFile?: string;
  onSecondaryFileSelected: (filename: string) => void;
  onSecondaryRemove: () => void;
  onTriggerError: (e: DropzoneError | undefined) => void;
}

const ERROR_COPY: Record<DropzoneError, string> = {
  'unsupported': "This file type isn't supported. Please upload a PDF file.",
  'too-large': 'This file is too large. Maximum upload size is 100 MB.',
  'failed': 'Upload failed. Check your connection and try again.',
};

const ICON_DOC = '';

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 14,
  fontWeight: 600,
  color: '#040921',
};

export const WizardStepUpload: React.FC<WizardStepUploadProps> = ({
  uploadedFile,
  onFileSelected,
  onRemove,
  error,
  secondaryFile,
  onSecondaryFileSelected,
  onSecondaryRemove,
  onTriggerError,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, fontWeight: 600, color: '#040921' }}>
          2. Upload Your files
        </h3>
        <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#666' }}>
          Upload the required contract template or standard terms to generate a playbook.
        </p>
      </div>

      {error && (
        <InlineBanner variant="Error" contrast="Low" label={ERROR_COPY[error]} />
      )}

      {/* Template Uploaded section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Template Uploaded</span>
        {uploadedFile ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              border: '1px solid #ccc',
              borderRadius: 4,
              background: '#ffffff',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaIcon icon={ICON_DOC} size={16} color="#040921" />
              <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#040921' }}>
                {uploadedFile}
              </span>
            </div>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove file"
              style={{ width: 16, height: 16, padding: 0, background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaIcon icon={''} size={14} color="#040921" />
            </button>
          </div>
        ) : (
          <PdfDropzone
            uploadedFile={undefined}
            onFileSelected={onFileSelected}
            onRemove={onRemove}
            injectError={error}
          />
        )}

        {!uploadedFile && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'var(--orbit-font-family-sans)', fontSize: 11, color: '#999' }}>
            <span>Dev triggers:</span>
            <button type="button" onClick={() => onTriggerError('unsupported')} style={devBtn}>Unsupported</button>
            <button type="button" onClick={() => onTriggerError('too-large')} style={devBtn}>Too large</button>
            <button type="button" onClick={() => onTriggerError('failed')} style={devBtn}>Failed</button>
            {error && <button type="button" onClick={() => onTriggerError(undefined)} style={devBtn}>Clear</button>}
          </div>
        )}
      </div>

      {/* Upload Contract Playbook (Optional) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={labelStyle}>Upload Contract Playbook</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              background: '#f6f6f6',
              border: '1px solid #999',
              borderRadius: 16,
              fontFamily: 'var(--orbit-font-family-sans)',
              fontSize: 12,
              color: '#040921',
            }}
          >
            Optional
          </span>
        </div>
        <p style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14, color: '#666' }}>
          Upload guidance to tailor the best practices to your organisation.
        </p>
        <PdfDropzone
          uploadedFile={secondaryFile}
          onFileSelected={onSecondaryFileSelected}
          onRemove={onSecondaryRemove}
        />
      </div>
    </div>
  );
};

const devBtn: React.CSSProperties = {
  padding: '2px 6px',
  border: '1px dashed #ccc',
  borderRadius: 4,
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 11,
  color: '#999',
};
