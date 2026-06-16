import type { Metadata } from 'next';
import { MarketIQAnalyticsDashboardBenchmark } from './MarketIQAnalyticsDashboardBenchmark';

export const metadata: Metadata = {
  title: 'MarketIQ Analytics Dashboard Benchmark | Orbit Design System',
  description: 'Benchmark Task 3 implementation for a MarketIQ KPI and chart analytics dashboard.',
};

export default function MarketIQAnalyticsDashboardBenchmarkPage() {
  return <MarketIQAnalyticsDashboardBenchmark />;
}
