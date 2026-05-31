'use client';

import React from 'react';
import styles from './Required.module.css';

export type RequiredProps = Record<string, never>;

export const Required: React.FC<RequiredProps> = () => {
  return <span className={styles.required}>*</span>;
};
