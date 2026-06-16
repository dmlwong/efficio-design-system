import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComponentDocsPage } from '../../ComponentDocsPage';
import { COMPONENT_DOCS, getComponentDoc } from '../../componentDocs';

interface ComponentPageProps {
  params: Promise<{ component: string }>;
}

export function generateStaticParams() {
  return COMPONENT_DOCS.map((doc) => ({ component: doc.id }));
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
  const { component } = await params;
  const doc = getComponentDoc(component);

  if (!doc) {
    return {
      title: 'Component Not Found | Orbit Design System',
    };
  }

  return {
    title: `${doc.title} | Orbit Design System`,
    description: doc.description,
  };
}

export default async function ComponentDocumentationRoute({ params }: ComponentPageProps) {
  const { component } = await params;
  const doc = getComponentDoc(component);

  if (!doc) {
    notFound();
  }

  return <ComponentDocsPage doc={doc} />;
}
