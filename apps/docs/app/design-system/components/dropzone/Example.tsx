'use client';

import { useState } from 'react';
import { Dropzone } from '@efficio/orbit';

export default function DropzoneExample() {
  const [dropzoneFile, setDropzoneFile] = useState('');
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Dropzone
          ariaLabel="Upload contract file"
          accept=".pdf"
          onFileSelected={(file) => setDropzoneFile(file.name)}
          promptPrefix="Drag & drop or choose file"
          chooseButtonLabel="choose files"
          promptSuffix="to upload"
          acceptedFileTypesLabel="File types supported: PDF"
          maxFileSizeLabel="Maximum upload file size: 100 MB"
        />
        <Dropzone
          ariaLabel="Upload disabled file"
          accept=".pdf"
          disabled
          onFileSelected={() => {}}
          promptPrefix="Drag & drop or choose file"
          chooseButtonLabel="choose files"
          promptSuffix="to upload"
          acceptedFileTypesLabel="File types supported: PDF"
          maxFileSizeLabel="Maximum upload file size: 100 MB"
          error="Upload is disabled in this state."
        />
      </div>
      {dropzoneFile && (
        <p style={{ marginTop: 12, fontSize: 14, color: 'var(--orbit-color-text-secondary)' }}>
          Selected file: {dropzoneFile}
        </p>
      )}
    </>
  );
}
