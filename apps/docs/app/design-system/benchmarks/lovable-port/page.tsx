import type { Metadata } from 'next';
import { LovablePortBenchmark } from './LovablePortBenchmark';

export const metadata: Metadata = {
  title: 'Lovable Prototype Port Benchmark | Orbit Design System',
  description: 'Benchmark Task 4 implementation that ports a Lovable initiatives table into Orbit components and tokens.',
};

export default function LovablePortBenchmarkPage() {
  return <LovablePortBenchmark />;
}
