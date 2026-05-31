'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@efficio/orbit';
import type { Clause } from '@/data/data-tracker-mock';

interface AddClausePanelProps {
  onClose: () => void;
  onSave: (clause: Omit<Clause, 'id'>) => void;
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 14,
  fontWeight: 600,
  color: '#040921',
};

const counterStyle = (cur: number, max: number): React.CSSProperties => ({
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 12,
  color: cur > max ? '#e00034' : '#666',
});

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 32,
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontFamily: 'var(--orbit-font-family-sans)',
  fontSize: 14,
  color: '#040921',
  background: '#ffffff',
  outline: 'none',
  boxSizing: 'border-box',
};

const textareaStyle = (height: number): React.CSSProperties => ({
  ...inputStyle,
  height,
  minHeight: 48,
  resize: 'vertical',
  padding: 12,
});

export const AddClausePanel: React.FC<AddClausePanelProps> = ({ onClose, onSave }) => {
  const [clauseName, setClauseName] = useState('');
  const [subClauseName, setSubClauseName] = useState('');
  const [subClauseDescription, setSubClauseDescription] = useState('');
  const [bestPractice, setBestPractice] = useState('');
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => { firstRef.current?.focus(); }, []);

  const isValid = clauseName.trim().length > 0 && subClauseDescription.trim().length > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      clauseName: clauseName.trim(),
      subClauseDescription: subClauseDescription.trim() || subClauseName.trim(),
      bestPractice: bestPractice.trim(),
    });
  };

  return (
    <aside
      aria-label="Add Clause"
      style={{
        width: 390,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '1px solid #e6e6e6',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: 16,
          borderBottom: '1px solid #e6e6e6',
        }}
      >
        <h3 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 20, fontWeight: 600, color: '#040921' }}>
          Add Clause
        </h3>
        <div style={{ display: 'flex', gap: 4 }}>
          <Button variant="Primary" size="Small" onClick={handleSave} disabled={!isValid}>Save</Button>
          <Button variant="Secondary" size="Small" onClick={onClose}>Cancel</Button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Clause Name</label>
          <input
            ref={firstRef}
            type="text"
            value={clauseName}
            onChange={(e) => setClauseName(e.target.value.slice(0, 60))}
            placeholder="Add the clause name here..."
            style={inputStyle}
          />
          <span style={counterStyle(clauseName.length, 60)}>{clauseName.length}/60 characters</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Sub-Clause Name</label>
          <input
            type="text"
            value={subClauseName}
            onChange={(e) => setSubClauseName(e.target.value.slice(0, 90))}
            placeholder="Add the sub-clause name here..."
            style={inputStyle}
          />
          <span style={counterStyle(subClauseName.length, 90)}>{subClauseName.length}/90 characters</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Sub-Clause Description</label>
          <textarea
            value={subClauseDescription}
            onChange={(e) => setSubClauseDescription(e.target.value.slice(0, 300))}
            placeholder="Add the sub-clause description here..."
            style={textareaStyle(160)}
          />
          <span style={counterStyle(subClauseDescription.length, 300)}>{subClauseDescription.length}/300 characters</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={labelStyle}>Best Practice</label>
          <textarea
            value={bestPractice}
            onChange={(e) => setBestPractice(e.target.value)}
            placeholder="Add the best practice here..."
            style={textareaStyle(240)}
          />
        </div>
      </div>
    </aside>
  );
};
