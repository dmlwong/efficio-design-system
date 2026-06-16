import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import React, { type ComponentType } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { computeAccessibleName } from 'dom-accessibility-api';
import { afterAll, expect, test } from 'vitest';
import { ClauseIQResultsBenchmark } from '../../apps/docs/app/design-system/benchmarks/clauseiq-results/ClauseIQResultsBenchmark';
import { ProcurementSettingsBenchmark } from '../../apps/docs/app/design-system/benchmarks/form-validation/ProcurementSettingsBenchmark';
import { MarketIQAnalyticsDashboardBenchmark } from '../../apps/docs/app/design-system/benchmarks/analytics-dashboard/MarketIQAnalyticsDashboardBenchmark';
import { LovablePortBenchmark } from '../../apps/docs/app/design-system/benchmarks/lovable-port/LovablePortBenchmark';
import { ConnectedPlatformSeparationBenchmark } from '../../apps/docs/app/design-system/benchmarks/platform-separation/connected-platform/ConnectedPlatformSeparationBenchmark';
import { OrbitMarketIQSeparationBenchmark } from '../../apps/docs/app/design-system/benchmarks/platform-separation/orbit-marketiq/OrbitMarketIQSeparationBenchmark';

type ViolationSeverity = 'blocker' | 'major';

interface BenchmarkRoute {
  path: string;
  name: string;
  Component: ComponentType;
}

interface AccessibilityViolation {
  id: string;
  severity: ViolationSeverity;
  rule: string;
  message: string;
  element?: string;
}

interface KeyboardResult {
  expectedStops: number;
  reachedStops: number;
  sequence: string[];
}

interface RouteResult {
  path: string;
  name: string;
  verdict: 'PASS' | 'FAIL';
  counts: {
    ariaReferences: number;
    formControls: number;
    interactiveNames: number;
    landmarks: number;
    roleAttributes: number;
    tables: number;
  };
  keyboard: KeyboardResult;
  violations: AccessibilityViolation[];
}

const routes: BenchmarkRoute[] = [
  {
    path: '/design-system/benchmarks/clauseiq-results',
    name: 'ClauseIQ results table',
    Component: ClauseIQResultsBenchmark,
  },
  {
    path: '/design-system/benchmarks/form-validation',
    name: 'Procurement settings form',
    Component: ProcurementSettingsBenchmark,
  },
  {
    path: '/design-system/benchmarks/analytics-dashboard',
    name: 'MarketIQ analytics dashboard',
    Component: MarketIQAnalyticsDashboardBenchmark,
  },
  {
    path: '/design-system/benchmarks/lovable-port',
    name: 'Lovable initiatives port',
    Component: LovablePortBenchmark,
  },
  {
    path: '/design-system/benchmarks/platform-separation/connected-platform',
    name: 'Connected Platform separation benchmark',
    Component: ConnectedPlatformSeparationBenchmark,
  },
  {
    path: '/design-system/benchmarks/platform-separation/orbit-marketiq',
    name: 'Orbit MarketIQ separation benchmark',
    Component: OrbitMarketIQSeparationBenchmark,
  },
];

const routeResults: RouteResult[] = [];
const require = createRequire(import.meta.url);
const validRoles = new Set([
  'alert',
  'button',
  'checkbox',
  'combobox',
  'dialog',
  'group',
  'img',
  'link',
  'list',
  'listbox',
  'listitem',
  'main',
  'navigation',
  'note',
  'option',
  'radio',
  'radiogroup',
  'region',
  'status',
  'switch',
  'tab',
  'tablist',
  'tabpanel',
]);
const refAttributes = [
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-labelledby',
  'aria-owns',
];
const nameRequiredSelector = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'table',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="img"]',
  '[role="link"]',
  '[role="listbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="tabpanel"]',
].join(',');
const tabbableSelector = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'summary',
  'textarea',
  '[contenteditable="true"]',
  '[tabindex]',
].join(',');

function isPackageAvailable(name: string) {
  try {
    require.resolve(`${name}/package.json`);
    return true;
  } catch {
    return false;
  }
}

function trimText(value: string, maxLength = 80) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 3)}...`;
}

function elementSummary(element: Element) {
  const tag = element.tagName.toLowerCase();
  const parts = [tag];
  const id = element.getAttribute('id');
  const role = element.getAttribute('role');
  const name = trimText(computeAccessibleName(element));
  const text = trimText(element.textContent || '');

  if (id) parts.push(`#${id}`);
  if (role) parts.push(`[role="${role}"]`);
  if (name) parts.push(`"${name}"`);
  else if (text) parts.push(`text="${text}"`);

  return parts.join(' ');
}

function hasHiddenAncestor(element: Element) {
  for (let current: Element | null = element; current; current = current.parentElement) {
    if (current.hasAttribute('hidden')) return true;
    if (current.getAttribute('aria-hidden') === 'true') return true;
  }

  return false;
}

function isDisabled(element: Element) {
  if (element.getAttribute('aria-disabled') === 'true') return true;
  if ('disabled' in element && Boolean((element as HTMLButtonElement).disabled)) return true;
  return Boolean(element.closest('fieldset[disabled]'));
}

function isTabbable(element: HTMLElement) {
  if (hasHiddenAncestor(element)) return false;
  if (isDisabled(element)) return false;

  const tabindex = element.getAttribute('tabindex');
  if (tabindex !== null) return Number.parseInt(tabindex, 10) >= 0;

  const tag = element.tagName.toLowerCase();
  if (tag === 'a') return Boolean((element as HTMLAnchorElement).href);
  return ['button', 'input', 'select', 'summary', 'textarea'].includes(tag);
}

function addViolation(
  violations: AccessibilityViolation[],
  violation: AccessibilityViolation,
) {
  violations.push(violation);
}

function checkLandmarks(container: HTMLElement, violations: AccessibilityViolation[]) {
  const mains = Array.from(container.querySelectorAll('main, [role="main"]'));
  const h1s = Array.from(container.querySelectorAll('h1, [role="heading"][aria-level="1"]'));

  if (mains.length !== 1) {
    addViolation(violations, {
      id: 'landmark-main-count',
      severity: 'blocker',
      rule: 'AGENTS.md / accessibility.md: every benchmark route must expose one main landmark.',
      message: `Expected exactly one main landmark, found ${mains.length}.`,
    });
  }

  if (h1s.length < 1) {
    addViolation(violations, {
      id: 'heading-level-one',
      severity: 'blocker',
      rule: 'accessibility.md: pages need a navigable heading structure.',
      message: 'No h1 or aria-level 1 heading was found.',
    });
  }

  return mains.length;
}

function checkDuplicateIds(container: HTMLElement, violations: AccessibilityViolation[]) {
  const ids = new Map<string, Element[]>();

  for (const element of Array.from(container.querySelectorAll('[id]'))) {
    const id = element.getAttribute('id');
    if (!id) continue;
    ids.set(id, [...(ids.get(id) || []), element]);
  }

  for (const [id, elements] of ids) {
    if (elements.length <= 1) continue;
    addViolation(violations, {
      id: 'duplicate-id',
      severity: 'blocker',
      rule: 'WCAG parsing and ARIA references require unique IDs.',
      message: `ID "${id}" is used ${elements.length} times.`,
      element: elements.map(elementSummary).join('; '),
    });
  }
}

function checkAriaReferences(container: HTMLElement, violations: AccessibilityViolation[]) {
  let referenceCount = 0;

  for (const element of Array.from(container.querySelectorAll(refAttributes.map((attr) => `[${attr}]`).join(',')))) {
    for (const attribute of refAttributes) {
      const value = element.getAttribute(attribute);
      if (!value) continue;

      for (const id of value.trim().split(/\s+/)) {
        referenceCount += 1;
        if (document.getElementById(id)) continue;

        addViolation(violations, {
          id: 'broken-aria-reference',
          severity: 'blocker',
          rule: 'accessibility.md: ARIA must fill gaps correctly and reference mounted elements.',
          message: `${attribute} references missing ID "${id}".`,
          element: elementSummary(element),
        });
      }
    }
  }

  return referenceCount;
}

function checkNames(container: HTMLElement, violations: AccessibilityViolation[]) {
  const elements = Array.from(container.querySelectorAll(nameRequiredSelector));
  let formControls = 0;
  let tables = 0;

  for (const element of elements) {
    if (hasHiddenAncestor(element)) continue;
    const tag = element.tagName.toLowerCase();
    if (['input', 'select', 'textarea'].includes(tag) || element.getAttribute('role') === 'switch') {
      formControls += 1;
    }
    if (tag === 'table') tables += 1;

    const name = trimText(computeAccessibleName(element));
    if (name) continue;

    addViolation(violations, {
      id: 'missing-accessible-name',
      severity: 'blocker',
      rule: 'accessibility.md: controls, tables, and meaningful images need accessible names.',
      message: 'Element has no computed accessible name.',
      element: elementSummary(element),
    });
  }

  return {
    formControls,
    interactiveNames: elements.length,
    tables,
  };
}

function checkRoles(container: HTMLElement, violations: AccessibilityViolation[]) {
  const elements = Array.from(container.querySelectorAll('[role]'));

  for (const element of elements) {
    const roles = (element.getAttribute('role') || '').trim().split(/\s+/).filter(Boolean);

    if (roles.length === 0) {
      addViolation(violations, {
        id: 'empty-role',
        severity: 'blocker',
        rule: 'accessibility.md: ARIA roles must be valid when used.',
        message: 'Element has an empty role attribute.',
        element: elementSummary(element),
      });
      continue;
    }

    for (const role of roles) {
      if (validRoles.has(role)) continue;
      addViolation(violations, {
        id: 'invalid-role',
        severity: 'blocker',
        rule: 'accessibility.md: ARIA roles must be valid when used.',
        message: `Unknown role "${role}".`,
        element: elementSummary(element),
      });
    }
  }

  return elements.length;
}

function checkAriaHiddenFocus(container: HTMLElement, violations: AccessibilityViolation[]) {
  const ariaHiddenNodes = Array.from(container.querySelectorAll('[aria-hidden="true"]'));

  for (const node of ariaHiddenNodes) {
    const focusableDescendants = Array.from(node.querySelectorAll<HTMLElement>(tabbableSelector))
      .filter(isTabbable);

    for (const focusable of focusableDescendants) {
      addViolation(violations, {
        id: 'aria-hidden-focusable',
        severity: 'blocker',
        rule: 'accessibility.md: hidden content must not contain keyboard stops.',
        message: 'aria-hidden content contains a tabbable descendant.',
        element: elementSummary(focusable),
      });
    }
  }
}

async function checkKeyboard(container: HTMLElement, violations: AccessibilityViolation[]) {
  const expected = Array.from(container.querySelectorAll<HTMLElement>(tabbableSelector))
    .filter(isTabbable);
  const user = userEvent.setup();
  const seen = new Set<HTMLElement>();
  const sequence: string[] = [];
  const maxSteps = expected.length + 5;

  for (let step = 0; step < maxSteps; step += 1) {
    await user.tab();

    const active = document.activeElement;
    if (!(active instanceof HTMLElement)) continue;
    if (!container.contains(active)) continue;

    if (!seen.has(active)) {
      seen.add(active);
      sequence.push(elementSummary(active));
    }
  }

  for (const element of expected) {
    if (seen.has(element)) continue;
    addViolation(violations, {
      id: 'keyboard-unreachable',
      severity: 'blocker',
      rule: 'accessibility.md: every interactive element must be reachable by keyboard.',
      message: 'A tabbable element was not reached during sequential Tab navigation.',
      element: elementSummary(element),
    });
  }

  return {
    expectedStops: expected.length,
    reachedStops: seen.size,
    sequence,
  };
}

async function evaluateRoute(route: BenchmarkRoute): Promise<RouteResult> {
  const { container } = render(<route.Component />);
  const violations: AccessibilityViolation[] = [];

  const landmarks = checkLandmarks(container, violations);
  checkDuplicateIds(container, violations);
  const ariaReferences = checkAriaReferences(container, violations);
  const names = checkNames(container, violations);
  const roleAttributes = checkRoles(container, violations);
  checkAriaHiddenFocus(container, violations);
  const keyboard = await checkKeyboard(container, violations);

  return {
    path: route.path,
    name: route.name,
    verdict: violations.length === 0 ? 'PASS' : 'FAIL',
    counts: {
      ariaReferences,
      formControls: names.formControls,
      interactiveNames: names.interactiveNames,
      landmarks,
      roleAttributes,
      tables: names.tables,
    },
    keyboard,
    violations,
  };
}

function markdownEscape(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function buildArtifact() {
  const generatedAt = new Date().toISOString();
  const command = process.env.BENCHMARK_A11Y_COMMAND || 'npm run bench:a11y';
  const axeAvailable = isPackageAvailable('axe-core') || isPackageAvailable('jest-axe') || isPackageAvailable('@axe-core/playwright');
  const playwrightAvailable = isPackageAvailable('@playwright/test') || isPackageAvailable('playwright');
  const allPassed = routeResults.every((result) => result.verdict === 'PASS');

  const lines = [
    '---',
    'type: benchmark-accessibility-artifact',
    'status: stable',
    'owner: design-system',
    'surfaces: [docs, benchmarks]',
    'source: generated',
    'last_reviewed: 2026-06-15',
    'tags: [orbit, accessibility, benchmark]',
    '---',
    '',
    '# Benchmark Accessibility Artifact',
    '',
    `Generated: ${generatedAt}`,
    '',
    `Command: \`${command}\``,
    '',
    `Overall verdict: **${allPassed ? 'PASS' : 'FAIL'}**`,
    '',
    '## Tooling Inventory',
    '',
    '| Tool | Available | Used | Notes |',
    '| ---- | --------- | ---- | ----- |',
    `| Vitest + Testing Library + jsdom | yes | yes | Existing repo test stack. |`,
    `| dom-accessibility-api | yes | yes | Used for computed accessible names. |`,
    `| Playwright | ${playwrightAvailable ? 'yes' : 'no'} | no | Not a project dependency for this pass. |`,
    `| axe / jest-axe / @axe-core/playwright | ${axeAvailable ? 'yes' : 'no'} | no | ${axeAvailable ? 'Available but not wired into this route artifact.' : 'Not installed; no new dependency added.'} |`,
    '',
    '## Automated Checks',
    '',
    '- One main landmark and at least one level-one page heading.',
    '- Duplicate IDs and broken ARIA ID references.',
    '- Computed accessible names for controls, tables, tab panels, and meaningful images.',
    '- Known role attribute values.',
    '- No tabbable descendants inside `aria-hidden` content.',
    '- Sequential keyboard Tab pass reaches every tabbable element in the rendered route.',
    '',
    '## Route Results',
    '',
    '| Route | Verdict | Keyboard stops | Named elements | ARIA refs | Roles | Tables | Violations |',
    '| ----- | ------- | -------------- | -------------- | --------- | ----- | ------ | ---------- |',
    ...routeResults.map((result) => (
      `| ${markdownEscape(result.path)} | ${result.verdict} | ${result.keyboard.reachedStops}/${result.keyboard.expectedStops} | ${result.counts.interactiveNames} | ${result.counts.ariaReferences} | ${result.counts.roleAttributes} | ${result.counts.tables} | ${result.violations.length} |`
    )),
    '',
    '## Violations',
    '',
  ];

  for (const result of routeResults) {
    lines.push(`### ${result.name}`, '');
    lines.push(`Route: \`${result.path}\``);
    lines.push('');

    if (result.violations.length === 0) {
      lines.push('No automated violations found.');
      lines.push('');
      continue;
    }

    for (const violation of result.violations) {
      lines.push(`- **${violation.severity.toUpperCase()}** ${violation.id}: ${violation.message}`);
      lines.push(`  - Rule: ${violation.rule}`);
      if (violation.element) lines.push(`  - Element: \`${violation.element}\``);
    }
    lines.push('');
  }

  lines.push('## Remaining Manual Checks', '');
  lines.push('- Verify visible focus ring styling in a real browser for every keyboard stop.');
  lines.push('- Verify WCAG 2.2 AA contrast in both `efficio` and `orbit` themes with rendered CSS.');
  lines.push('- Verify compact and comfortable density target sizes visually.');
  lines.push('- Verify screen reader announcement quality for async status, alerts, dialogs, and tab changes.');
  lines.push('- Run axe/Playwright when that stack becomes a project dependency or the benchmark gate is expanded.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

afterAll(() => {
  const artifactPath = process.env.BENCHMARK_A11Y_ARTIFACT_PATH;
  if (!artifactPath) return;

  mkdirSync(path.dirname(artifactPath), { recursive: true });
  writeFileSync(artifactPath, buildArtifact(), 'utf8');
});

for (const route of routes) {
  test(`${route.path} accessibility artifact checks`, async () => {
    const result = await evaluateRoute(route);
    routeResults.push(result);

    expect(result.violations.map((violation) => `${violation.id}: ${violation.message}`)).toEqual([]);
  });
}
