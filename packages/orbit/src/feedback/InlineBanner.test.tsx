import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineBanner } from './InlineBanner';

function getBannerElement(label: string) {
  const wrapper = screen.getByText(label).parentElement;
  const banner = wrapper?.parentElement;
  if (!banner) throw new Error('InlineBanner root was not rendered');
  return banner;
}

describe('InlineBanner', () => {
  it('uses the component-scoped Style 1 high-contrast token', () => {
    render(<InlineBanner variant="Style 1" contrast="High" label="Label" status="Status" />);

    expect(getBannerElement('Label')).toHaveStyle({
      '--_bg': 'var(--orbit-color-status-high-bg-style-1)',
    });
  });

  it('supports label-only feedback when status is not supplied', () => {
    render(<InlineBanner variant="Error" contrast="Low" label="Upload failed" />);

    expect(screen.getByText('Upload failed')).toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
  });
});
