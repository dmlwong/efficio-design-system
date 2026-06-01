import { Headings, Text, LinkText, Carat, Required } from '@efficio/orbit';
import { DocSection, Row } from '../_components/DocSection';

/** Foundations overview — typography, links, and form-element primitives. */
export default function FoundationsPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <Headings size="Heading 1">Foundations</Headings>
      <p style={{ fontSize: 16, color: 'var(--orbit-color-text-secondary)', marginTop: 8, marginBottom: 32 }}>
        The typographic scale, link styles, and shared form primitives Orbit is built on. For exact
        token values see Design Tokens; for the components themselves see the component pages.
      </p>

      <DocSection id="typography" title="Typography" description="Heading, body, and small text styles used across the system.">
        <Row label="Headings">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5'] as const).map((h) => (
              <div key={h} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', minWidth: 80 }}>{h}</span>
                <Headings size={h}>{h}</Headings>
              </div>
            ))}
          </div>
        </Row>
        <Row label="Body Text">
          <Text variant="Primary">Primary</Text>
          <Text variant="Secondary">Secondary</Text>
          <Text variant="Bold">Bold</Text>
          <Text variant="Error">Error</Text>
          <Text variant="Information">Information</Text>
          <Text variant="Warning">Warning</Text>
          <Text variant="Disabled">Disabled</Text>
        </Row>
        <Row label="Small Text">
          <Text size="Small" variant="Primary">Primary</Text>
          <Text size="Small" variant="Bold">Bold</Text>
          <Text size="Small" variant="Secondary">Secondary</Text>
          <Text size="Small" variant="Disabled">Disabled</Text>
        </Row>
      </DocSection>

      <DocSection id="links" title="Links" description="Inline link styles for primary, secondary, and heading contexts.">
        <Row label="Styles">
          <LinkText label="Primary link" variant="Primary" />
          <LinkText label="Secondary link" variant="Secondary" />
          <LinkText label="Heading link" variant="Heading" />
        </Row>
      </DocSection>

      <DocSection id="form-elements" title="Form Elements" description="Shared form primitives: required indicators and carat separators.">
        <Row>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text variant="Primary">Text</Text>
            <Carat />
            <Text variant="Primary">Text</Text>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Text variant="Primary">Field label</Text>
            <Required />
          </span>
        </Row>
      </DocSection>
    </div>
  );
}
