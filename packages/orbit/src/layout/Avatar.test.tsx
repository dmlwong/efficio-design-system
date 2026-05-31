import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarStack } from './Avatar';

describe('Avatar', () => {
  it('renders square avatars', () => {
    render(<Avatar name="Ada Lovelace" initials="AL" style="Square" />);

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('renders stacked avatars with overflow count', () => {
    render(
      <AvatarStack
        max={2}
        avatars={[
          { name: 'Ada Lovelace', initials: 'AL' },
          { name: 'Grace Hopper', initials: 'GH' },
          { name: 'Katherine Johnson', initials: 'KJ' },
        ]}
      />
    );

    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '1 more' })).toHaveTextContent('+1');
  });
});
