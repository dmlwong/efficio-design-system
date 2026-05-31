'use client';

import React from 'react';
import { Input } from '@efficio/orbit';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const searchIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Input
      ariaLabel="Search suppliers"
      value={value}
      onChange={onChange}
      placeholder="Search suppliers by name, category, or certification..."
      icon={searchIcon}
      style={{ flex: 1 }}
    />
  );
};
