import type { Metadata } from 'next';
import { OrbitMarketIQSeparationBenchmark } from './OrbitMarketIQSeparationBenchmark';

export const metadata: Metadata = {
  title: 'Orbit MarketIQ Separation Benchmark | Orbit Design System',
  description: 'Platform separation benchmark for a client-facing Orbit MarketIQ guided workflow.',
};

export default function OrbitMarketIQSeparationBenchmarkPage() {
  return <OrbitMarketIQSeparationBenchmark />;
}
