import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function walk(dir, matcher, acc = []) {
  if (!existsSync(join(root, dir))) return acc;

  for (const entry of readdirSync(join(root, dir))) {
    const full = join(root, dir, entry);
    const rel = relative(root, full);
    const stat = statSync(full);

    if (stat.isDirectory()) {
      walk(rel, matcher, acc);
    } else if (matcher(rel)) {
      acc.push(rel);
    }
  }

  return acc;
}

const tsxFiles = [
  ...walk('packages/orbit/src', (file) => file.endsWith('.tsx')),
  'apps/docs/app/design-system/page.tsx',
  'apps/docs/app/design-system/tokens/page.tsx',
];
const orbitReusableFiles = walk(
  'packages/orbit/src',
  (file) => file.endsWith('.tsx') || file.endsWith('.css')
);
const componentTestFiles = walk('packages/orbit/src', (file) => file.endsWith('.test.tsx'));
const appAndComponentFiles = [
  ...walk('packages/orbit/src', (file) => file.endsWith('.tsx') || file.endsWith('.ts')),
  ...walk('apps/docs/app', (file) => file.endsWith('.tsx') || file.endsWith('.ts')),
  ...walk('apps/prototypes/app', (file) => file.endsWith('.tsx') || file.endsWith('.ts')),
  ...walk('apps/prototypes/components', (file) => file.endsWith('.tsx') || file.endsWith('.ts')),
];

// Per-component docs examples now live under components/<slug>/Example.tsx (plus
// the foundations page). Assertions that used to read the single mega page.tsx
// check this corpus instead, so they survive the split.
const docsExampleFiles = walk('apps/docs/app/design-system/components', (file) => file.endsWith('Example.tsx'));
if (existsSync(join(root, 'apps/docs/app/design-system/foundations/page.tsx'))) {
  docsExampleFiles.push('apps/docs/app/design-system/foundations/page.tsx');
}
const docsExampleText = docsExampleFiles.map(read).join('\n');

const checks = [];

function check(name, pass, details = '') {
  checks.push({ name, pass, details });
}

const buttonsMissingType = tsxFiles.flatMap((file) => {
  const matches = [...read(file).matchAll(/<button\b(?![^>]*\btype=)[^>]*>/gs)];
  return matches.map((match) => `${file}:${read(file).slice(0, match.index).split('\n').length}`);
});

check(
  'All non-submit buttons declare type="button"',
  buttonsMissingType.length === 0,
  buttonsMissingType.join('\n')
);

const orbitComponentText = tsxFiles
  .filter((file) => file.startsWith('packages/orbit/src/'))
  .map((file) => read(file))
  .join('\n');

const rawHexMatches = orbitReusableFiles.flatMap((file) => {
  const matches = [...read(file).matchAll(/#[0-9A-Fa-f]{3,8}\b/g)];
  return matches.map((match) => `${file}:${read(file).slice(0, match.index).split('\n').length}`);
});

check(
  'Orbit components do not import prototype mock data',
  !orbitComponentText.includes('@/data/mock-data'),
  'Remove product/mock-data imports from reusable components.'
);

check(
  'Orbit reusable components avoid raw hex colors',
  rawHexMatches.length === 0,
  rawHexMatches.join('\n') || 'Use Orbit tokens or component-local CSS variables instead of raw hex values.'
);

const faIconWeightOverrides = appAndComponentFiles.flatMap((file) => {
  const matches = [...read(file).matchAll(/\bweight=\{/g)];
  return matches.map((match) => `${file}:${read(file).slice(0, match.index).split('\n').length}`);
});

check(
  'Font Awesome icons render as Regular by default',
  read('packages/orbit/src/primitives/FaIcon.tsx').includes('fontWeight: 400') &&
    !read('packages/orbit/src/primitives/FaIcon.tsx').includes('weight?:') &&
    faIconWeightOverrides.length === 0,
  faIconWeightOverrides.join('\n') || 'FaIcon should not expose or accept a Solid weight override.'
);

check(
  'Dropdown trigger is programmatically labelled',
  read('packages/orbit/src/inputs/Dropdown.tsx').includes('aria-labelledby={triggerLabelledBy}') &&
    read('packages/orbit/src/inputs/Dropdown.tsx').includes('aria-label={triggerAriaLabel}'),
  'Dropdown trigger must link visual label/value or an explicit standalone name to the focusable button.'
);

check(
  'Input has an explicit accessible-name contract',
  read('packages/orbit/src/inputs/Input.tsx').includes('StandaloneFieldNamingProps') &&
    read('packages/orbit/src/inputs/Input.tsx').includes('ariaLabelledBy') &&
    read('packages/orbit/src/inputs/Input.test.tsx').includes("getByRole('textbox', { name: 'Supplier search' })"),
  'Input should require a reliable accessible name and cover it with a DOM test.'
);

check(
  'Input family shares the accessible-name contract',
  read('packages/orbit/src/inputs/naming.ts').includes('FieldNamingProps') &&
    read('packages/orbit/src/inputs/Textbox.tsx').includes('FieldNamingProps') &&
    read('packages/orbit/src/inputs/TextArea.tsx').includes('FieldNamingProps') &&
    read('packages/orbit/src/inputs/CurrencyInput.tsx').includes('FieldNamingProps') &&
    read('packages/orbit/src/inputs/DateInput.tsx').includes('StandaloneFieldNamingProps') &&
    read('packages/orbit/src/inputs/Searchbox.tsx').includes('StandaloneFieldNamingProps') &&
    read('packages/orbit/src/inputs/Dropdown.tsx').includes('FieldNamingProps') &&
    read('packages/orbit/src/inputs/FieldNaming.test.tsx').includes("getByRole('textbox', { name: 'Renewal date' })"),
  'Textbox, TextArea, CurrencyInput, DateInput, Searchbox, and Dropdown should require an intentional accessible name.'
);

check(
  'Checkbox relies on a native checkbox input',
  read('packages/orbit/src/inputs/Checkbox.tsx').includes('type="checkbox"') &&
    !read('packages/orbit/src/inputs/Checkbox.tsx').includes('role="checkbox"'),
  'Checkbox should not use a separate focusable role=checkbox span.'
);

check(
  'Toggle relies on a native switch input',
  read('packages/orbit/src/inputs/Toggle.tsx').includes('type="checkbox"') &&
    read('packages/orbit/src/inputs/Toggle.tsx').includes('role="switch"'),
  'Toggle should use native checkbox behavior with switch semantics.'
);

check(
  'Overlay has accessible naming and focus restoration',
  read('packages/orbit/src/feedback/Overlay.tsx').includes('aria-label=') &&
    read('packages/orbit/src/feedback/Overlay.tsx').includes('aria-labelledby=') &&
    read('packages/orbit/src/feedback/Overlay.tsx').includes('previousFocusRef.current?.focus()'),
  'Overlay must expose a dialog name and restore focus on close.'
);

check(
  'InlineBanner matches the feedback strip contract',
  read('packages/orbit/src/feedback/InlineBanner.tsx').includes('styles.iconBox') &&
    read('packages/orbit/src/feedback/InlineBanner.tsx').includes('var(--orbit-color-status-high-bg-style-1)') &&
    read('packages/orbit/src/feedback/InlineBanner.tsx').includes('Figma renders a border only for the high-contrast None banner') &&
    read('packages/orbit/src/feedback/InlineBanner.module.css').includes('.iconBox') &&
    read('packages/orbit/src/feedback/InlineBanner.module.css').includes('var(--orbit-inline-banner-icon-box-size)') &&
    read('packages/orbit/styles/tokens/components.css').includes('--orbit-color-status-high-bg-style-1') &&
    docsExampleText.includes('Neutral and Disabled'),
  'InlineBanner should have a tokenized icon box, a component-scoped Style 1 token, documented None outline behavior, and reference showcase coverage.'
);

check(
  'Banner is disambiguated from InlineBanner',
  read('packages/orbit/src/feedback/Banner.tsx').includes('not the Figma "Feedback Banners" strip') &&
    read('packages/orbit/src/feedback/Banner.tsx').includes("export { Alert as Banner }") &&
    read('packages/orbit/src/feedback/index.ts').includes("export { Alert }") &&
    read('apps/docs/app/design-system/components/alert/Example.tsx').includes('<Alert'),
  'The multiline alert block should be exported as Alert while Banner remains a documented compatibility shim.'
);

check(
  'Tooltip describes the actual trigger element',
  read('packages/orbit/src/feedback/Tooltip.tsx').includes('React.cloneElement') &&
    read('packages/orbit/src/feedback/Tooltip.tsx').includes("'aria-describedby'"),
  'Tooltip should attach aria-describedby to its child trigger.'
);

check(
  'PageHeader separates controlled and default tab state',
  read('packages/orbit/src/navigation/PageHeader.tsx').includes('defaultActiveTab') &&
    read('packages/orbit/src/navigation/PageHeader.tsx').includes('const isControlled = activeTab !== undefined && onTabChange !== undefined') &&
    read('packages/orbit/src/navigation/PageHeader.tsx').includes('getSelectableIndex'),
  'PageHeader should support controlled activeTab/onTabChange and uncontrolled defaultActiveTab without read-only tabs.'
);

check(
  'PageHeader icon-only actions require a meaningful name',
  !read('packages/orbit/src/navigation/PageHeader.tsx').includes("'Page action'") &&
    read('packages/orbit/src/navigation/PageHeader.tsx').includes('const accessibleName = (ariaLabel || label).trim()') &&
    !docsExampleText.includes("label: '', icon:"),
  'PageHeader should not fall back to a generic icon-only action label.'
);

check(
  'SideNav renders sections from data without hard-coded indexes',
  !read('packages/orbit/src/navigation/SideNav.tsx').includes('sections[0]') &&
    !read('packages/orbit/src/navigation/SideNav.tsx').includes('position: \'absolute\''),
  'SideNav should not depend on fixed section indexes or absolute section layout.'
);

check(
  'SideNav expansion state is keyed by stable ids',
  read('packages/orbit/src/navigation/SideNav.tsx').includes('[section.id') &&
    read('packages/orbit/src/navigation/SideNav.tsx').includes('toggleSection(section.id)') &&
    !read('packages/orbit/src/navigation/SideNav.tsx').includes('[section.label') &&
    !read('packages/orbit/src/navigation/SideNav.tsx').includes('[s.label'),
  'SideNav expansion state should be keyed by section.id, not section.label.'
);

check(
  'SideNav default width is token-owned',
  read('packages/orbit/styles/tokens/components.css').includes('--orbit-sidenav-width: 300px') &&
    read('packages/orbit/src/navigation/SideNav.module.css').includes('--sidenav-width: var(--orbit-sidenav-width)') &&
    !read('packages/orbit/src/navigation/SideNav.tsx').includes('width = 300') &&
    read('packages/orbit/src/navigation/SideNav.tsx').includes('width === undefined'),
  'SideNav should use --orbit-sidenav-width as the default and only set an inline width override when the width prop is passed.'
);

check(
  'DESIGN.md generation reports validation truthfully',
  !read('scripts/build-design-md.ts').includes('Validation permanently disabled') &&
    !read('scripts/build-design-md.ts').includes('Figma matches code tokens') &&
    read('scripts/build-design-md.ts').includes("status: 'skipped'") &&
    read('scripts/build-design-md.ts').includes('Figma validation skipped') &&
    // Token loading (incl. structured typography) was extracted to the shared
    // scripts/lib/load-tokens.ts, consumed by build-design-md and build-skills.
    read('scripts/lib/load-tokens.ts').includes('buildTypographyTokens'),
  'build-design-md should not claim Figma parity when validation is skipped, and the shared token loader should emit structured typography tokens.'
);

const docsChromeText = [
  read('apps/docs/app/design-system/page.tsx'),
  read('apps/docs/app/design-system/tokens/page.tsx'),
  read('apps/docs/app/design-system/layout.tsx'),
  existsSync(join(root, 'apps/docs/app/design-system/DesignSystemShell.tsx'))
    ? read('apps/docs/app/design-system/DesignSystemShell.tsx')
    : '',
].join('\n');

check(
  'Design-system docs chrome avoids raw sidebar colors and legacy width',
  !docsChromeText.includes('#fff') &&
    !docsChromeText.includes('#475569') &&
    !docsChromeText.includes('width: 232') &&
    !docsChromeText.includes('minWidth: 232') &&
    docsChromeText.includes('var(--orbit-sidenav-width)'),
  'Docs sidebar/header chrome should use Orbit tokens instead of raw colors or the old 232px width.'
);

check(
  'Card remains a non-interactive container',
  !read('packages/orbit/src/layout/Card.tsx').includes('role="button"') &&
    !read('packages/orbit/src/layout/Card.tsx').includes("role={isInteractive ? 'button'") &&
    !read('packages/orbit/src/layout/Card.tsx').includes('aria-selected') &&
    !read('packages/orbit/src/layout/Card.tsx').includes('onKeyDown='),
  'Card should not expose button or selection semantics; put actions on child buttons or links.'
);

check(
  'RadialIndicator clamps invalid progress',
  read('packages/orbit/src/indicators/RadialIndicator.tsx').includes('boundedProgress'),
  'RadialIndicator should clamp progress to 0-100 before SVG math.'
);

check(
  'Table exposes selectable rows through native buttons',
  read('packages/orbit/src/layout/Table.tsx').includes('getRowSelectionLabel') &&
    read('packages/orbit/src/layout/Table.tsx').includes('className={styles.rowAction}') &&
    read('packages/orbit/src/layout/Table.test.tsx').includes('row-contained buttons'),
  'Selectable tables should expose a named native button inside the row instead of relying on focusable tr elements.'
);

check(
  'Dropzone uses semantic choose-file control',
  read('packages/orbit/src/inputs/Dropzone.tsx').includes('role="group"') &&
    read('packages/orbit/src/inputs/Dropzone.tsx').includes('type="file"') &&
    read('packages/orbit/src/inputs/Dropzone.tsx').includes('className={styles.chooseButton}') &&
    read('packages/orbit/src/inputs/Dropzone.test.tsx').includes("getByRole('button', { name: 'choose files' })"),
  'Dropzone should expose a named group, native file input, and semantic choose-files button.'
);

check(
  'Spinner supports labelled and decorative loading',
  read('packages/orbit/src/indicators/Spinner.tsx').includes("role={decorative ? undefined : 'status'}") &&
    read('packages/orbit/src/indicators/Spinner.tsx').includes('aria-hidden={decorative || undefined}') &&
    docsExampleText.includes('Spinners'),
  'Spinner should be usable as a labelled status or hidden decoration beside visible loading text.'
);

check(
  'Primitives expose semantic hooks',
  read('packages/orbit/src/primitives/Text.tsx').includes('as: Component') &&
    read('packages/orbit/src/primitives/Separator.tsx').includes('role={decorative ?') &&
    read('packages/orbit/src/navigation/Breadcrumb.tsx').includes('aria-current="page"'),
  'Text, Separator, and Breadcrumb should expose semantic behavior.'
);

check(
  'Component DOM test stack is configured',
  read('package.json').includes('"test:components": "vitest run"') &&
    read('vitest.config.ts').includes("environment: 'jsdom'") &&
    componentTestFiles.length >= 5,
  'Vitest, jsdom, and focused component tests should be available for design-system acceptance.'
);

const failed = checks.filter((item) => !item.pass);

for (const item of checks) {
  console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}`);
  if (!item.pass && item.details) console.log(item.details);
}

if (failed.length > 0) {
  console.error(`\n${failed.length} design-system audit check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} design-system audit checks passed.`);
