import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const cssEntry = path.join(repoRoot, 'packages/orbit/tokens.css');
const outputFile = path.join(repoRoot, 'apps/docs/public/orbit-style-guide.json');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'),
);

const seenFiles = new Set();

function toRepoPath(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, '/');
}

function collectCssFiles(filePath) {
  const absolutePath = path.resolve(filePath);
  if (seenFiles.has(absolutePath)) {
    return [];
  }

  seenFiles.add(absolutePath);

  const css = fs.readFileSync(absolutePath, 'utf8');
  const imports = [...css.matchAll(/@import\s+['"]([^'"]+)['"]\s*;/g)]
    .map((match) => match[1])
    .filter((importPath) => importPath.endsWith('.css'))
    .map((importPath) => path.resolve(path.dirname(absolutePath), importPath));

  return [
    ...imports.flatMap((importPath) => collectCssFiles(importPath)),
    absolutePath,
  ];
}

function normalizeText(text) {
  return text
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getSectionFromComment(comment) {
  const body = comment.replace(/\/\*+/g, '').replace(/\*+\//g, '');
  const lines = body
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter(Boolean)
    .filter((line) => !/^[-=]{3,}$/.test(line));

  const numberedLine = lines.find((line) => /^\d+[a-z]?\.\s+/.test(line));
  if (numberedLine) {
    return normalizeText(numberedLine.replace(/^\d+[a-z]?\.\s+/, ''));
  }

  const dashedLine = lines.find((line) => /^---\s+.+\s+---$/.test(line));
  if (dashedLine) {
    return normalizeText(dashedLine.replace(/^---\s+/, '').replace(/\s+---$/, ''));
  }

  return null;
}

function extractReferences(value) {
  return [...value.matchAll(/var\(\s*(--orbit-[\w-]+)/g)].map((match) => match[1]);
}

function classifyType(name, value) {
  if (name.includes('color') || /^#/.test(value) || /^rgba?\(/.test(value) || value.startsWith('color-mix(')) {
    return 'color';
  }

  if (name.includes('shadow')) {
    return 'shadow';
  }

  if (name.includes('font-family')) {
    return 'fontFamily';
  }

  if (name.includes('font-weight') || name.endsWith('-weight')) {
    return 'fontWeight';
  }

  if (name.includes('leading') || name.includes('line-height')) {
    return 'lineHeight';
  }

  if (name.includes('z-')) {
    return 'zIndex';
  }

  if (name.includes('radius')) {
    return 'borderRadius';
  }

  if (
    name.includes('space') ||
    name.includes('size') ||
    name.includes('width') ||
    name.includes('height') ||
    name.includes('padding') ||
    name.includes('gap') ||
    name.includes('offset') ||
    name.includes('stroke') ||
    /\d(px|rem|em|vh|vw)$/.test(value)
  ) {
    return 'dimension';
  }

  if (name.includes('text-')) {
    return 'typography';
  }

  return 'other';
}

function classifyCategory(name, section) {
  const normalizedSection = section.toLowerCase();

  if (/^--orbit-color-swatch-/.test(name)) {
    return 'primitive';
  }

  if (/^--orbit-color-(text|border|bg)-/.test(name)) {
    return 'semantic';
  }

  if (/^--orbit-color-status-/.test(name)) {
    return 'status';
  }

  if (
    /^--orbit-color-(btn|card|radial|chip|checkbox|toggle|link|flag|sidenav|overlay|doc|header)-/.test(
      name,
    )
  ) {
    return 'component';
  }

  if (normalizedSection.includes('primitive') || normalizedSection.includes('swatch')) {
    return 'primitive';
  }

  if (normalizedSection.includes('semantic')) {
    return 'semantic';
  }

  if (
    normalizedSection.includes('typography') ||
    name.includes('font') ||
    name.includes('text-') ||
    name.includes('leading')
  ) {
    return 'typography';
  }

  if (normalizedSection.includes('spacing') || name.includes('space')) {
    return 'spacing';
  }

  if (
    normalizedSection.includes('radius') ||
    normalizedSection.includes('elevation') ||
    normalizedSection.includes('shadow') ||
    normalizedSection.includes('z-index') ||
    normalizedSection.includes('focus')
  ) {
    return 'foundation';
  }

  if (normalizedSection.includes('status')) {
    return 'status';
  }

  if (name.startsWith('--orbit-color-')) {
    return 'primitive';
  }

  return 'component';
}

function parseCssVariables(filePath) {
  const css = fs.readFileSync(filePath, 'utf8');
  const lines = css.split(/\r?\n/);
  const tokens = [];
  let currentMode = null;
  let currentSection = 'Ungrouped';
  let commentBuffer = [];
  let inComment = false;

  for (const originalLine of lines) {
    const declarationLine = originalLine.replace(/\/\*.*?\*\//g, '');
    const declaration = declarationLine.match(/(--orbit-[\w-]+)\s*:\s*([^;]+);/);

    if (declaration && currentMode) {
      const [, name, rawValue] = declaration;
      const value = normalizeText(rawValue);
      const section = currentSection;

      tokens.push({
        name,
        cssVariable: `var(${name})`,
        value,
        references: extractReferences(value),
        type: classifyType(name, value),
        category: classifyCategory(name, section),
        section,
        mode: currentMode,
        selector: currentMode === 'orbit' ? '[data-theme="orbit"]' : ':root',
        source: toRepoPath(filePath),
      });
    }

    if (!declaration) {
      if (inComment) {
        commentBuffer.push(originalLine);
        if (originalLine.includes('*/')) {
          inComment = false;
          const section = getSectionFromComment(commentBuffer.join('\n'));
          if (section) {
            currentSection = section;
          }
          commentBuffer = [];
        }
      } else if (originalLine.includes('/*') && !originalLine.includes('*/')) {
        inComment = true;
        commentBuffer = [originalLine];
      } else if (originalLine.includes('/*') && originalLine.includes('*/')) {
        const section = getSectionFromComment(originalLine);
        if (section) {
          currentSection = section;
        }
      }
    }

    if (/^\s*:root\s*\{/.test(declarationLine)) {
      currentMode = 'default';
    } else if (/^\s*\[data-theme=["']orbit["']\]\s*\{/.test(declarationLine)) {
      currentMode = 'orbit';
    } else if (/^\s*}\s*$/.test(declarationLine)) {
      currentMode = null;
    }
  }

  return tokens;
}

function tokenMap(tokens, combinedValues) {
  return Object.fromEntries(
    tokens.map((token) => [
      token.name,
      {
        $value: token.value,
        $type: token.type,
        cssVariable: token.cssVariable,
        resolvedValue: resolveValue(token.value, combinedValues),
        references: token.references,
        category: token.category,
        section: token.section,
        source: token.source,
      },
    ]),
  );
}

function resolveValue(value, valuesByName, visited = new Set()) {
  return value.replace(/var\(\s*(--orbit-[\w-]+)\s*\)/g, (match, tokenName) => {
    if (visited.has(tokenName) || !valuesByName[tokenName]) {
      return match;
    }

    visited.add(tokenName);
    const resolved = resolveValue(valuesByName[tokenName], valuesByName, visited);
    visited.delete(tokenName);

    return resolved;
  });
}

function groupedIndex(tokens) {
  const groups = new Map();

  for (const token of tokens) {
    const key = `${token.category}::${token.section}`;
    const existing = groups.get(key) ?? {
      category: token.category,
      section: token.section,
      tokens: [],
    };

    existing.tokens.push(token.name);
    groups.set(key, existing);
  }

  return [...groups.values()].sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }

    return a.section.localeCompare(b.section);
  });
}

const cssFiles = collectCssFiles(cssEntry);
const parsedTokens = cssFiles.flatMap((filePath) => parseCssVariables(filePath));
const defaultTokens = parsedTokens.filter((token) => token.mode === 'default');
const orbitTokens = parsedTokens.filter((token) => token.mode === 'orbit');
const defaultValues = Object.fromEntries(defaultTokens.map((token) => [token.name, token.value]));
const orbitValues = Object.fromEntries(orbitTokens.map((token) => [token.name, token.value]));
const combinedOrbitValues = { ...defaultValues, ...orbitValues };

const output = {
  $schema: 'https://design-tokens.github.io/community-group/format/',
  name: 'Efficio Orbit Style Guide',
  description:
    'Machine-readable export of Orbit CSS design tokens, semantic aliases, component styles, and theme overrides.',
  generatedAt: new Date().toISOString(),
  package: {
    name: packageJson.name,
    version: packageJson.version,
  },
  source: {
    cssEntry: toRepoPath(cssEntry),
    publicPath: '/orbit-style-guide.json',
    figma: {
      file: 'Main Component Library',
      url: 'https://www.figma.com/design/5RUsy0uKtFarK7nO8Y3nLL',
      sourceDate: '2026-03-26',
    },
    files: cssFiles.map((filePath) => toRepoPath(filePath)),
  },
  summary: {
    defaultTokenCount: defaultTokens.length,
    orbitOverrideCount: orbitTokens.length,
    totalDefinitions: parsedTokens.length,
  },
  modes: {
    default: {
      selector: ':root',
      tokens: tokenMap(defaultTokens, defaultValues),
      groups: groupedIndex(defaultTokens),
    },
    orbit: {
      selector: '[data-theme="orbit"]',
      description:
        'Overrides applied when data-theme="orbit" is present on a parent element.',
      overrides: tokenMap(orbitTokens, combinedOrbitValues),
      groups: groupedIndex(orbitTokens),
    },
  },
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(output, null, 2)}\n`);

console.log(
  `Exported ${parsedTokens.length} token definitions to ${toRepoPath(outputFile)}`,
);
