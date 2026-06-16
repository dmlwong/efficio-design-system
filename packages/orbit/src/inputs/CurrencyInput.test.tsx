import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyInput } from './CurrencyInput';
import styles from './CurrencyInput.module.css';

describe('CurrencyInput', () => {
  it('renders the currency marker as an attached segment with a separator', () => {
    const { container } = render(
      <CurrencyInput
        label="Projected savings"
        value=""
        onChange={() => {}}
        currency="GBP"
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Projected savings' })).toBeInTheDocument();
    expect(screen.getByText('GBP')).toHaveClass(styles.currency);
    expect(container.querySelector(`.${styles.separator}`)).toBeInTheDocument();
  });

  it('focuses the outer field and currency marker through the preview state', () => {
    const { container } = render(
      <CurrencyInput
        label="Projected savings"
        value="125000"
        onChange={() => {}}
        currency="GBP"
        previewState="focus"
      />,
    );

    expect(container.querySelector(`.${styles.box}`)).toHaveClass(styles.boxFocused);
    expect(screen.getByText('GBP')).toHaveClass(styles.currencyFocused);
  });
});
