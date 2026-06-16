import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';
import styles from './Input.module.css';

describe('Input', () => {
  it('uses ariaLabel as the accessible name', () => {
    render(<Input ariaLabel="Supplier search" value="" onChange={() => {}} />);

    expect(screen.getByRole('textbox', { name: 'Supplier search' })).toBeInTheDocument();
  });

  it('supports an external label through ariaLabelledBy', () => {
    render(
      <>
        <span id="supplier-field-label">Supplier</span>
        <Input ariaLabelledBy="supplier-field-label" value="" onChange={() => {}} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Supplier' })).toBeInTheDocument();
  });

  it('links helper and validation text through ariaDescribedBy', () => {
    render(
      <>
        <span id="supplier-field-help">Use the registered supplier name.</span>
        <Input
          ariaLabel="Supplier"
          ariaDescribedBy="supplier-field-help"
          value=""
          onChange={() => {}}
        />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Supplier' })).toHaveAccessibleDescription('Use the registered supplier name.');
  });

  it('calls onChange with the next string value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input ariaLabel="Supplier search" value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Supplier search' }), 'orbit');

    expect(onChange).toHaveBeenCalledWith('o');
  });

  it('derives filled styling from the controlled value', () => {
    render(<Input ariaLabel="Supplier search" value="Orbit" onChange={() => {}} />);

    expect(screen.getByRole('textbox', { name: 'Supplier search' })).toHaveClass(styles.inputFilled);
  });

  it('supports disabled, invalid, and preview focus props explicitly', () => {
    render(<Input ariaLabel="Supplier search" value="" onChange={() => {}} disabled invalid />);

    const input = screen.getByRole('textbox', { name: 'Supplier search' });
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-invalid', 'true');

    render(<Input ariaLabel="Preview search" value="" onChange={() => {}} previewState="focus" />);
    expect(screen.getByRole('textbox', { name: 'Preview search' }).parentElement).toHaveClass(styles.containerFocused);
  });
});
