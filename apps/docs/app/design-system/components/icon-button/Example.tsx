'use client';

import { IconButton, FaIcon } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function IconButtonExample() {
  return (
    <>
      <Row label="Variants">
        <IconButton variant="Primary" ariaLabel="Primary" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Secondary" ariaLabel="Secondary" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Tertiary" ariaLabel="Tertiary" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Positive" ariaLabel="Positive" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Destructive" ariaLabel="Destructive" icon={<FaIcon icon={''} size={16} />} />
      </Row>
      <Row label="Sizes">
        <IconButton variant="Primary" size="Small" ariaLabel="Small" icon={<FaIcon icon={''} size={12} />} />
        <IconButton variant="Primary" size="Medium" ariaLabel="Medium" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Primary" size="Large" ariaLabel="Large" icon={<FaIcon icon={''} size={16} />} />
      </Row>
      <Row label="Primary States">
        <IconButton variant="Primary" state="Default" ariaLabel="Default" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Primary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Primary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={''} size={16} />} />
      </Row>
      <Row label="Secondary States">
        <IconButton variant="Secondary" state="Default" ariaLabel="Default" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Secondary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Secondary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={''} size={16} />} />
      </Row>
      <Row label="Tertiary States">
        <IconButton variant="Tertiary" state="Default" ariaLabel="Default" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Tertiary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={''} size={16} />} />
        <IconButton variant="Tertiary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={''} size={16} />} />
      </Row>
    </>
  );
}
