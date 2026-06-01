'use client';

import { useState } from 'react';
import { Searchbox } from '@efficio/orbit';

export default function SearchboxExample() {
  const [searchVal, setSearchVal] = useState('');
  const [searchFilled, setSearchFilled] = useState('Search...');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Searchbox ariaLabel="Default search input" placeholder="Search..." value={searchVal} onChange={setSearchVal} />
      <Searchbox ariaLabel="Filled search input" placeholder="Search..." value={searchFilled} onChange={setSearchFilled} />
      <Searchbox ariaLabel="Disabled search input" placeholder="Search..." value="" onChange={() => {}} disabled />
      <Searchbox ariaLabel="Error search input" placeholder="Search..." value="" onChange={() => {}} invalid />
    </div>
  );
}
