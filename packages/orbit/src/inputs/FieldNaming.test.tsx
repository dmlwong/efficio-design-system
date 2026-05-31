import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyInput } from './CurrencyInput';
import { DateInput } from './DateInput';
import { Dropdown } from './Dropdown';
import { Searchbox } from './Searchbox';
import { TextArea } from './TextArea';
import { Textbox } from './Textbox';

const options = [{ label: 'Icertis', value: 'icertis' }];

describe('Orbit input accessible naming', () => {
  it('uses visible labels for labelled field inputs', () => {
    render(
      <>
        <Textbox label="Supplier name" message="Use the registered supplier name." value="" onChange={() => {}} />
        <TextArea label="Contract summary" value="" onChange={() => {}} />
        <CurrencyInput label="Annual value" value="" onChange={() => {}} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Supplier name' })).toHaveAccessibleDescription('Use the registered supplier name.');
    expect(screen.getByRole('textbox', { name: 'Contract summary' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Annual value' })).toBeInTheDocument();
  });

  it('requires intentional names for standalone inputs', () => {
    render(
      <>
        <DateInput ariaLabel="Start date" value="" onChange={() => {}} />
        <Searchbox ariaLabel="Supplier search" value="" onChange={() => {}} />
        <Dropdown ariaLabel="CLM system" options={options} value="" onChange={() => {}} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Start date' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Supplier search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CLM system/ })).toBeInTheDocument();
  });

  it('supports external labels through ariaLabelledBy', () => {
    render(
      <>
        <span id="renewal-date-label">Renewal date</span>
        <DateInput ariaLabelledBy="renewal-date-label" value="" onChange={() => {}} />
        <span id="source-system-label">Source system</span>
        <Dropdown ariaLabelledBy="source-system-label" options={options} value="" onChange={() => {}} />
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Renewal date' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Source system/ })).toBeInTheDocument();
  });
});
