'use client';

import { Tooltip, Button } from '@efficio/orbit';
import { Row } from '../../_components/DocSection';

export default function TooltipExample() {
  return (
    <Row>
      <Tooltip content="Tooltip on top" direction="top">
        <Button variant="Secondary">Hover me (top)</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" direction="bottom">
        <Button variant="Secondary">Hover me (bottom)</Button>
      </Tooltip>
      <Tooltip content="Tooltip on left" direction="left">
        <Button variant="Secondary">Hover me (left)</Button>
      </Tooltip>
      <Tooltip content="Tooltip on right" direction="right">
        <Button variant="Secondary">Hover me (right)</Button>
      </Tooltip>
      <Tooltip content="Aligned to start" direction="bottom" align="start">
        <Button variant="Secondary">Start aligned</Button>
      </Tooltip>
      <Tooltip content="Aligned to end" direction="bottom" align="end">
        <Button variant="Secondary">End aligned</Button>
      </Tooltip>
    </Row>
  );
}
