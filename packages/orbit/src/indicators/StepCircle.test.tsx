import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StepCircle } from './StepCircle';

describe('StepCircle', () => {
  it('renders an accessible checked step', () => {
    render(<StepCircle status="Checked" size="Large" ariaLabel="Contract uploaded" />);

    expect(screen.getByRole('img', { name: 'Contract uploaded' })).toBeInTheDocument();
  });

  it('renders numbered labels', () => {
    render(<StepCircle status="Numbered" label={2} />);

    expect(screen.getByRole('img', { name: 'Step Numbered 2' })).toHaveTextContent('2');
  });

  it('renders an active step marker', () => {
    const { container } = render(<StepCircle status="Active" ariaLabel="Current step" />);

    expect(screen.getByRole('img', { name: 'Current step' })).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
