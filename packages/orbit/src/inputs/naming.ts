export type FieldNamingProps =
  | { label: string; ariaLabel?: string; ariaLabelledBy?: string }
  | { label?: undefined; ariaLabel: string; ariaLabelledBy?: string }
  | { label?: undefined; ariaLabel?: string; ariaLabelledBy: string };

export type StandaloneFieldNamingProps =
  | { ariaLabel: string; ariaLabelledBy?: string }
  | { ariaLabel?: string; ariaLabelledBy: string };

export function warnIfUnnamed(componentName: string, label?: string, ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV === 'production') return;
  if (label || ariaLabel || ariaLabelledBy) return;

  console.warn(`${componentName} requires label, ariaLabel, or ariaLabelledBy to provide an accessible name.`);
}
