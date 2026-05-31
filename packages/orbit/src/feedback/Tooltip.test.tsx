import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../actions/Button';
import { Tooltip } from './Tooltip';
import styles from './Tooltip.module.css';

describe('Tooltip', () => {
  it('attaches tooltip semantics to a design-system button trigger on focus', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Upload contracts">
        <Button>Upload</Button>
      </Tooltip>
    );

    const button = screen.getByRole('button', { name: 'Upload' });

    await user.tab();

    const tooltip = screen.getByRole('tooltip');
    expect(button).toHaveFocus();
    expect(tooltip).toHaveTextContent('Upload contracts');
    expect(button).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('supports aligned tooltip variants', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Aligned tooltip" direction="bottom" align="end">
        <Button>Aligned</Button>
      </Tooltip>
    );

    await user.tab();

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveClass(styles.bottom);
    expect(tooltip).toHaveClass(styles.alignEnd);
  });

  it('renders all directional and alignment class combinations', async () => {
    const directions = ['top', 'bottom', 'left', 'right'] as const;
    const aligns = ['start', 'center', 'end'] as const;

    for (const direction of directions) {
      for (const align of aligns) {
        const { unmount } = render(
          <Tooltip content={`${direction}-${align}`} direction={direction} align={align}>
            <Button>{`${direction}-${align}`}</Button>
          </Tooltip>
        );

        await userEvent.hover(screen.getByRole('button', { name: `${direction}-${align}` }));

        expect(screen.getByRole('tooltip')).toHaveClass(styles[direction]);
        expect(screen.getByRole('tooltip')).toHaveClass(styles[`align${align[0].toUpperCase()}${align.slice(1)}` as keyof typeof styles]);

        unmount();
      }
    }
  });
});
