import { DesignSystemShell } from './DesignSystemShell';

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DesignSystemShell>{children}</DesignSystemShell>;
}
