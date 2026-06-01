'use client';

import { DocumentGlyph } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

const TYPES = ['XLS', 'DOC', 'PDF', 'ZIP', 'IMG', 'Unknown'] as const;
const SIZES = [
  ['Large (64px)', 'Large'],
  ['Medium (32px)', 'Medium'],
  ['Small (24px)', 'Small'],
  ['Extra Small (16px)', 'Extra Small'],
  ['Micro (8px)', 'Micro'],
] as const;

export default function DocumentGlyphExample() {
  return (
    <>
      {SIZES.map(([label, size]) => (
        <Row key={size} label={label}>
          {TYPES.map((t) => (
            <DocumentGlyph key={t} documentType={t} size={size} />
          ))}
        </Row>
      ))}
    </>
  );
}
