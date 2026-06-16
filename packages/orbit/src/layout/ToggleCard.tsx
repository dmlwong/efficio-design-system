'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './ToggleCard.module.css';

export type ToggleCardStatus = 'Default' | 'Hover' | 'Selected' | 'Disabled';

export interface ToggleCardProps {
  status?: ToggleCardStatus;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ToggleCard: React.FC<ToggleCardProps> = ({
  status = 'Default',
  onClick,
  children,
  className,
  style,
}) => {
  const isDisabled = status === 'Disabled';

  return (
    <button
      type="button"
      className={clsx(
        styles.toggleCard,
        status === 'Hover' && styles.hover,
        status === 'Selected' && styles.selected,
        isDisabled && styles.disabled,
        className,
      )}
      style={style}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
