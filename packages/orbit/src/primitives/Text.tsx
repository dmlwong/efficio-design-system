'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Text.module.css';

export interface TextProps {
  children: React.ReactNode;
  as?: 'span' | 'p' | 'div' | 'strong' | 'em';
  size?: 'Paragraph' | 'Small';
  variant?: 'Primary' | 'Secondary' | 'Bold' | 'Disabled' | 'Inverse' | 'Error' | 'Information' | 'Warning';
}

const colorClassMap: Record<string, string> = {
  Primary: styles.primary,
  Secondary: styles.secondary,
  Bold: styles.primary,
  Disabled: styles.disabled,
  Inverse: styles.inverse,
  Error: styles.error,
  Information: styles.information,
  Warning: styles.warning,
};

export const Text: React.FC<TextProps> = ({
  children,
  as: Component = 'span',
  size = 'Paragraph',
  variant = 'Primary',
}) => {
  const isParagraph = size === 'Paragraph';
  const isBold = variant === 'Bold';

  return (
    <Component
      className={clsx(
        styles.text,
        isParagraph ? styles.paragraph : styles.small,
        isBold ? styles.bold : styles.regular,
        isParagraph && !isBold && styles.leadingParagraph,
        isBold && styles.leadingBold,
        !isParagraph && !isBold && styles.leadingSmall,
        colorClassMap[variant],
      )}
    >
      {children}
    </Component>
  );
};
