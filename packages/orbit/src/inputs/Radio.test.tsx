import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './Radio';

function RadioGroupHarness() {
  const [value, setValue] = useState('alpha');

  return (
    <RadioGroup value={value} name="choice" ariaLabel="Choice" onChange={setValue}>
      <Radio value="alpha" checked={false} onChange={() => {}} label="Alpha" />
      <Radio value="beta" checked={false} onChange={() => {}} label="Beta" />
    </RadioGroup>
  );
}

describe('Radio', () => {
  it('renders a native radio with an accessible label', () => {
    render(<Radio value="alpha" checked={false} onChange={() => {}} label="Alpha" />);

    expect(screen.getByRole('radio', { name: 'Alpha' })).toBeInTheDocument();
  });

  it('calls onChange with the radio value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Radio value="alpha" checked={false} onChange={onChange} label="Alpha" />);
    await user.click(screen.getByRole('radio', { name: 'Alpha' }));

    expect(onChange).toHaveBeenCalledWith('alpha');
  });

  it('moves controlled RadioGroup selection with arrow keys', async () => {
    const user = userEvent.setup();

    render(<RadioGroupHarness />);

    const alpha = screen.getByRole('radio', { name: 'Alpha' });
    const beta = screen.getByRole('radio', { name: 'Beta' });
    expect(alpha).toBeChecked();

    alpha.focus();
    await user.keyboard('{ArrowRight}');

    expect(beta).toBeChecked();
  });

  it('skips disabled radios during arrow-key navigation', async () => {
    const user = userEvent.setup();

    function DisabledRadioGroupHarness() {
      const [value, setValue] = useState('alpha');

      return (
        <RadioGroup value={value} name="disabled-choice" ariaLabel="Disabled choice" onChange={setValue}>
          <Radio value="alpha" checked={false} onChange={() => {}} label="Alpha" />
          <Radio value="beta" checked={false} onChange={() => {}} label="Beta" state="Disabled" />
          <Radio value="gamma" checked={false} onChange={() => {}} label="Gamma" />
        </RadioGroup>
      );
    }

    render(<DisabledRadioGroupHarness />);

    const alpha = screen.getByRole('radio', { name: 'Alpha' });
    alpha.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Gamma' })).toBeChecked();
  });

  it('marks error radios invalid', () => {
    render(<Radio value="alpha" checked={false} onChange={() => {}} label="Alpha" state="Error" />);

    expect(screen.getByRole('radio', { name: 'Alpha' })).toHaveAttribute('aria-invalid', 'true');
  });
});
