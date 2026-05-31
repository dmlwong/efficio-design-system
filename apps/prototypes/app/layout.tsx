import '@efficio/orbit/styles.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orbit Prototypes',
  description: 'Orbit prototype ecosystem for procurement workflows',
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
