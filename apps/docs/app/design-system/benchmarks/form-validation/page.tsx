import type { Metadata } from 'next';
import { ProcurementSettingsBenchmark } from './ProcurementSettingsBenchmark';

export const metadata: Metadata = {
  title: 'Procurement Settings Form Benchmark | Orbit Design System',
  description: 'Benchmark Task 2 implementation for a procurement settings form with validation and recovery states.',
};

export default function ProcurementSettingsBenchmarkPage() {
  return <ProcurementSettingsBenchmark />;
}
