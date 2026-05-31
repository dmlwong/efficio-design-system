'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Headings.module.css';

export interface HeadingsProps {
  size: 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4' | 'Heading 5';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const sizeClassMap: Record<string, string> = {
  'Heading 1': styles.heading1,
  'Heading 2': styles.heading2,
  'Heading 3': styles.heading3,
  'Heading 4': styles.heading4,
  'Heading 5': styles.heading5,
};

const tagMap: Record<string, keyof JSX.IntrinsicElements> = {
  'Heading 1': 'h1',
  'Heading 2': 'h2',
  'Heading 3': 'h3',
  'Heading 4': 'h4',
  'Heading 5': 'h5',
};

export const Headings: React.FC<HeadingsProps> = ({ size, children, style: externalStyle }) => {
  const Tag = tagMap[size];

  return (
    <Tag className={clsx(styles.heading, sizeClassMap[size])} style={externalStyle}>
      {children}
    </Tag>
  );
};
