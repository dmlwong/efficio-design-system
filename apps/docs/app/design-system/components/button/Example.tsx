'use client';

import { Button, FaIcon } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--orbit-color-text-secondary)',
  marginBottom: 8,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function ButtonExample() {
  return (
    <>
      <Row label="Variants">
        <Button variant="Primary">Primary</Button>
        <Button variant="Secondary">Secondary</Button>
        <Button variant="Tertiary">Tertiary</Button>
        <Button variant="Positive">Positive</Button>
        <Button variant="Destructive">Destructive</Button>
      </Row>
      <Row label="Sizes">
        <Button variant="Primary" size="Medium">Medium</Button>
        <Button variant="Primary" size="Small">Small</Button>
      </Row>
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>States</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: '12px 24px', alignItems: 'center' }}>
          <div />
          <div style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontWeight: 600 }}>Default</div>
          <div style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontWeight: 600 }}>Hover</div>
          <div style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontWeight: 600 }}>Disabled</div>
          <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)' }}>Primary</div>
          <div><Button variant="Primary" state="Default">Default</Button></div>
          <div><Button variant="Primary" state="Hover">Hover</Button></div>
          <div><Button variant="Primary" state="Disabled">Disabled</Button></div>
          <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)' }}>Secondary</div>
          <div><Button variant="Secondary" state="Default">Default</Button></div>
          <div><Button variant="Secondary" state="Hover">Hover</Button></div>
          <div><Button variant="Secondary" state="Disabled">Disabled</Button></div>
          <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)' }}>Tertiary</div>
          <div><Button variant="Tertiary" state="Default">Default</Button></div>
          <div><Button variant="Tertiary" state="Hover">Hover</Button></div>
          <div><Button variant="Tertiary" state="Disabled">Disabled</Button></div>
        </div>
      </div>
      <Row label="With Icons">
        <Button variant="Primary" icon={<FaIcon icon={''} size={16} color="var(--orbit-color-white)" />}>Left icon</Button>
        <Button variant="Primary" iconRight={<FaIcon icon={''} size={16} color="var(--orbit-color-white)" />}>Right Icon</Button>
      </Row>
      <Row label="Secondary with Icons">
        <Button variant="Secondary" icon={<FaIcon icon={''} size={16} />}>Left icon</Button>
        <Button variant="Secondary" iconRight={<FaIcon icon={''} size={16} />}>Right Icon</Button>
      </Row>
    </>
  );
}
