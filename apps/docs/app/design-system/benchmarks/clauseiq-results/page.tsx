import type { Metadata } from 'next';
import { ClauseIQResultsBenchmark } from './ClauseIQResultsBenchmark';

export const metadata: Metadata = {
  title: 'ClauseIQ Results Table Benchmark | Orbit Design System',
  description: 'Benchmark Task 1 implementation for a data-heavy ClauseIQ results table.',
};

export default function ClauseIQResultsBenchmarkPage() {
  return <ClauseIQResultsBenchmark />;
}
