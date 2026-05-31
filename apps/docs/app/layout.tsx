import '@efficio/orbit/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orbit Design System',
  description: 'Reusable Orbit design system documentation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
