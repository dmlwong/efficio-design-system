'use client';

import React from 'react';
import styles from './CountryFlag.module.css';

export interface CountryFlagProps {
  country: string;
  countryName?: string;
  flag?: string;
}

function flagFromCountryCode(country: string) {
  const code = country.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '';

  return Array.from(code)
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join('');
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  country,
  countryName,
  flag,
}) => {
  const label = countryName || country;
  const flagGlyph = flag ?? flagFromCountryCode(country);

  return (
    <span className={styles.container}>
      {flagGlyph && <span className={styles.flag} aria-hidden="true">{flagGlyph}</span>}
      <span>{label}</span>
    </span>
  );
};
