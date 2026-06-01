'use client';

import { Avatar, AvatarStack } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function AvatarExample() {
  return (
    <>
      <Row label="Sizes">
        <Avatar name="John Doe" size="Extra Small" initials="JD" />
        <Avatar name="John Doe" size="Small" initials="JD" />
        <Avatar name="John Doe" size="Medium" initials="JD" />
        <Avatar name="John Doe" size="Large" initials="JD" />
      </Row>
      <Row label="Styles">
        <Avatar name="Alice" style="Text" initials="AB" />
        <Avatar name="Bob" style="Icon" initials="BC" />
        <Avatar name="Square Avatar" style="Square" initials="SA" />
      </Row>
      <Row label="Stack">
        <AvatarStack
          max={3}
          avatars={[
            { name: 'Alice Brown', initials: 'AB' },
            { name: 'Bob Chen', initials: 'BC' },
            { name: 'Derek Wong', initials: 'DW' },
            { name: 'Maya Patel', initials: 'MP' },
          ]}
        />
      </Row>
    </>
  );
}
