'use client';

import { FileItem } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function FileItemExample() {
  return (
    <Row>
      <FileItem filename="contract-analysis.pdf" documentType="PDF" fixedWidth={380} />
      <FileItem filename="supplier-data.xlsx" documentType="XLS" />
      <FileItem filename="source-brief.docx" documentType="DOC" onClick={() => {}} />
    </Row>
  );
}
