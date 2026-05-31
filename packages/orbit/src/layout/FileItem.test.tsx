import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileItem } from './FileItem';

describe('FileItem', () => {
  it('renders an uploaded file with a document glyph', () => {
    render(<FileItem filename="contract.pdf" documentType="PDF" />);

    expect(screen.getByText('contract.pdf')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'PDF document' })).toBeInTheDocument();
  });

  it('can be interactive', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<FileItem filename="contract.pdf" documentType="PDF" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: /contract.pdf/ }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
