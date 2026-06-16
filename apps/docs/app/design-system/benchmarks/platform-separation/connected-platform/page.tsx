import type { Metadata } from 'next';
import { ConnectedPlatformSeparationBenchmark } from './ConnectedPlatformSeparationBenchmark';

export const metadata: Metadata = {
  title: 'Connected Platform Separation Benchmark | Orbit Design System',
  description: 'Platform separation benchmark for an internal Connected Platform initiative list/detail screen.',
};

export default function ConnectedPlatformSeparationBenchmarkPage() {
  return <ConnectedPlatformSeparationBenchmark />;
}
