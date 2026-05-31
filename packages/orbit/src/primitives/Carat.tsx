'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Carat.module.css';

export interface CaratProps {
  visible?: boolean;
}

export const Carat: React.FC<CaratProps> = ({ visible = true }) => {
  return (
    <span className={clsx(styles.carat, visible ? styles.visible : styles.hidden)}>|</span>
  );
};
