'use client';

import { Breadcrumb } from '@efficio/orbit';

export default function BreadcrumbExample() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#' },
        { label: 'Suppliers', href: '#' },
        { label: 'Acme Corp' },
      ]}
    />
  );
}
