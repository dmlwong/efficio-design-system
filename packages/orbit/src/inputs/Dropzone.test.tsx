import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropzone } from './Dropzone';

describe('Dropzone', () => {
  it('opens the hidden file input from the semantic choose-files button', async () => {
    const user = userEvent.setup();
    const inputClick = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {});

    render(<Dropzone ariaLabel="Upload PDF contract" onFileSelected={() => {}} accept=".pdf" />);

    await user.click(screen.getByRole('button', { name: 'choose files' }));

    expect(inputClick).toHaveBeenCalled();
    inputClick.mockRestore();
  });

  it('passes dropped files to the consumer', () => {
    const onFileSelected = vi.fn();
    const file = new File(['content'], 'Contract.pdf', { type: 'application/pdf' });

    render(<Dropzone ariaLabel="Upload PDF contract" onFileSelected={onFileSelected} accept=".pdf" />);

    fireEvent.drop(screen.getByRole('group', { name: 'Upload PDF contract' }), {
      dataTransfer: { files: [file] },
    });

    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it('announces supplied error content', () => {
    render(<Dropzone ariaLabel="Upload PDF contract" onFileSelected={() => {}} error="Please upload a PDF file." />);

    expect(screen.getByRole('alert')).toHaveTextContent('Please upload a PDF file.');
  });
});
