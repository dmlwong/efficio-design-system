import { notFound } from 'next/navigation';
import { BY_SLUG, COMPONENTS } from '../../_generated/component-data';
import { ComponentPage } from '../../_components/ComponentPage';
import { EXAMPLES } from '../_examples-registry';

export function generateStaticParams() {
  return COMPONENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = BY_SLUG[slug];
  return data
    ? { title: `${data.name} — Orbit`, description: data.description }
    : { title: 'Component — Orbit' };
}

export default async function ComponentDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = BY_SLUG[slug];
  if (!data) notFound();

  const Example = EXAMPLES[slug];
  return <ComponentPage data={data} example={Example ? <Example /> : null} />;
}
