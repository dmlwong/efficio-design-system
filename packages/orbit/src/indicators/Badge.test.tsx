import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('supports the expanded status set', () => {
    render(
      <>
        <Badge label="Info" status="Information" />
        <Badge label="Warn" status="Warning" />
        <Badge label="None" status="No Status" />
      </>
    );

    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Warn')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
  });
});
