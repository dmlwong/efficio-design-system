import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('supports repeated placeholder hrefs without duplicate-key warnings', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Breadcrumb
        items={[
          { label: 'Projects & Initiatives', href: '#' },
          { label: 'YRK22 - Yorkshire Water', href: '#' },
          { label: 'Suppliers' },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Projects & Initiatives' })).toHaveAttribute('href', '#');
    expect(screen.getByRole('link', { name: 'YRK22 - Yorkshire Water' })).toHaveAttribute('href', '#');
    expect(screen.getByText('Suppliers')).toHaveAttribute('aria-current', 'page');
    expect(error).not.toHaveBeenCalled();
  });
});
