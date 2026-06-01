'use client';

import { InlineBanner, Headings } from '@efficio/orbit';

export default function InlineBannerExample() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Headings size="Heading 5">High Contrast</Headings>
        <InlineBanner variant="Information" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="Success" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="Warning" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="Error" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="Style 1" contrast="High" label="Label" status="Status" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
        <Headings size="Heading 5">Low Contrast</Headings>
        <InlineBanner variant="Information" contrast="Low" label="Label" status="Status" />
        <InlineBanner variant="Success" contrast="Low" label="Label" status="Status" />
        <InlineBanner variant="Warning" contrast="Low" label="Label" status="Status" />
        <InlineBanner variant="Error" contrast="Low" label="Label" status="Status" />
        <InlineBanner variant="Style 1" contrast="Low" label="Label" status="Status" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
        <Headings size="Heading 5">Neutral and Disabled</Headings>
        <InlineBanner variant="None" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="No Status" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="Disabled" contrast="High" label="Label" status="Status" />
        <InlineBanner variant="Disabled" contrast="Low" label="Label" status="Status" />
      </div>
    </>
  );
}
