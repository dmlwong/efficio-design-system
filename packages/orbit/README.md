# @efficio/orbit

Orbit is Efficio's React design-system package for prototype and product UI work. It provides shared components, token CSS, base styles, and the current Font Awesome Pro icon font assets used by `FaIcon`.

## Install

For local prototype work, point your app at the package folder:

```json
{
  "dependencies": {
    "@efficio/orbit": "file:/Users/derekwong/efficio-orbit/packages/orbit"
  }
}
```

Orbit expects React and React DOM from the consuming app:

```json
{
  "peerDependencies": {
    "react": ">=18 <20",
    "react-dom": ">=18 <20"
  }
}
```

## Next.js Setup

Add Orbit to `transpilePackages` so source-compatible consumers and local `file:` installs resolve cleanly:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@efficio/orbit'],
};

export default nextConfig;
```

Import styles once in the app root layout:

```tsx
import '@efficio/orbit/styles.css';
```

Then import components from the package boundary:

```tsx
import { Button, Card, Headings, Text } from '@efficio/orbit';
import type { ButtonProps, CardProps } from '@efficio/orbit';
```

## CSS Entrypoints

Use `styles.css` when Orbit controls the whole prototype surface. It bundles tokens, fonts, reset, and base styles:

```tsx
import '@efficio/orbit/styles.css';
```

For embedded prototypes inside another product shell, prefer the narrower entrypoints:

```tsx
import '@efficio/orbit/tokens.css';
import '@efficio/orbit/fonts.css';
```

Optional entrypoints are also available when an app wants Orbit's global defaults:

```tsx
import '@efficio/orbit/base.css';
import '@efficio/orbit/reset.css';
```

## Prototype Checklist

- Import UI from `@efficio/orbit`, not local `components/orbit` copies.
- Import Orbit CSS once, usually from the root layout.
- Keep product-specific layouts, data, flows, and prototype state in the app.
- Add or update component tests when adding reusable Orbit behavior.
- Run `npm run typecheck:orbit`, `npm run build:orbit`, and `npm run test:components` before sharing package changes.

