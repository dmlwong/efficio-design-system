import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardContent } from './Card';

describe('Card', () => {
  it('defaults to the Figma no-shadow variant', () => {
    render(<Card><span>Body</span></Card>);

    const card = screen.getByText('Body').closest('div');
    expect(card?.className).toContain('static');
    expect(card?.className).not.toContain('dynamic');
  });

  it('renders the Figma shadow variant when hasShadow is true', () => {
    render(<Card hasShadow><span>Body</span></Card>);

    const card = screen.getByText('Body').closest('div');
    expect(card?.className).toContain('dynamic');
  });

  it('keeps the legacy Dynamic type as a shadow alias', () => {
    render(<Card type="Dynamic"><span>Body</span></Card>);

    const card = screen.getByText('Body').closest('div');
    expect(card?.className).toContain('dynamic');
  });

  it('lets hasShadow take precedence over the legacy type prop', () => {
    render(<Card hasShadow={false} type="Dynamic"><span>Body</span></Card>);

    const card = screen.getByText('Body').closest('div');
    expect(card?.className).toContain('static');
    expect(card?.className).not.toContain('dynamic');
  });

  it('forces the Figma hover preview into the shadow variant', () => {
    render(<Card state="Hover" hasShadow={false}><span>Body</span></Card>);

    const card = screen.getByText('Body').closest('div');
    expect(card?.className).toContain('dynamic');
    expect(card?.className).toContain('previewHover');
  });

  it('renders children and resolves background + border tokens per state', () => {
    render(
      <Card state="Information">
        <span>Body</span>
      </Card>,
    );

    const card = screen.getByText('Body').closest('div');
    expect(card).toHaveStyle({ '--_bg': 'var(--orbit-color-card-bg-information)' });
    expect(card).toHaveStyle({ '--_border-color': 'var(--orbit-color-card-border-information)' });
  });

  it.each([
    ['Default', 'default'],
    ['Hover', 'default'],
    ['Accent', 'accent'],
    ['Highlight', 'highlight'],
    ['Feature', 'feature'],
    ['Information', 'information'],
    ['Success', 'success'],
    ['Warning', 'warning'],
    ['Error', 'error'],
    ['Disabled', 'disabled'],
  ] as const)('resolves Figma state %s to card tokens', (state, token) => {
    render(<Card state={state}><span>{state}</span></Card>);

    const card = screen.getByText(state).closest('div');
    expect(card).toHaveStyle({ '--_bg': `var(--orbit-color-card-bg-${token})` });
    expect(card).toHaveStyle({ '--_border-color': `var(--orbit-color-card-border-${token})` });
  });

  it('hides the indicator rail by default for all states', () => {
    const { container } = render(<Card state="Success"><span>Body</span></Card>);

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('shows the indicator rail only when requested', () => {
    const { container } = render(<Card state="Success" indicator><span>Body</span></Card>);

    const rail = container.querySelector('[aria-hidden="true"]');
    expect(rail).not.toBeNull();
    expect(rail).toHaveStyle({ '--_indicator': 'var(--orbit-color-card-indicator-success)' });
  });

  it('renders the disabled indicator rail when requested', () => {
    const { container } = render(<Card state="Disabled" indicator><span>Body</span></Card>);
    const card = screen.getByText('Body').closest('div');
    const rail = container.querySelector('[aria-hidden="true"]');

    expect(card).toHaveAttribute('aria-disabled', 'true');
    expect(rail).not.toBeNull();
    expect(rail).toHaveStyle({ '--_indicator': 'var(--orbit-color-card-indicator-disabled)' });
  });

  it('keeps the resting Figma shadow on disabled shadow variants', () => {
    render(<Card state="Disabled" hasShadow><span>Body</span></Card>);

    const card = screen.getByText('Body').closest('div');
    expect(card?.className).toContain('dynamic');
    expect(card?.className).toContain('disabled');
  });

  it('renders the optional ContentPlaceHolder helper with padding and orientation', () => {
    render(
      <CardContent padding="Small" orientation="Horizontal">
        <span>Slot</span>
      </CardContent>,
    );

    const content = screen.getByText('Slot').closest('div');
    expect(content?.className).toContain('contentPlaceholder');
    expect(content?.className).toContain('contentHorizontal');
    expect(content?.className).toContain('paddingSmall');
  });

  it('lets CardContent own slot padding without double-padding the Card surface', () => {
    render(
      <Card padding="Medium">
        <CardContent padding="Small">
          <span>Slot</span>
        </CardContent>
      </Card>,
    );

    const content = screen.getByText('Slot').closest('div');
    const card = content?.parentElement;
    expect(card?.className).not.toContain('paddingMedium');
    expect(content?.className).toContain('paddingSmall');
  });
});
