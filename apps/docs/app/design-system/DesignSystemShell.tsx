'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaIcon } from '@efficio/orbit';
import {
  clearDesignSystemSession,
  getSafeDesignSystemNextPath,
  readDesignSystemSession,
} from '../auth';
import type { DesignSystemSession } from '../auth';
import {
  COMPONENT_SECTION_IDS,
  getComponentDoc,
  getComponentNavGroups,
} from './componentDocs';
import { TOKEN_SECTION_IDS } from './tokenNav';

export type DesignSystemMode = 'efficio' | 'orbit';

export interface DesignSystemNavItem {
  label: string;
  id: string;
  href?: string;
}

export interface DesignSystemNavGroup {
  group: string;
  items: DesignSystemNavItem[];
}

const SIDEBAR_ICONS = {
  clear: '\uf00d',
  components: '\uf1b3',
  search: '\uf002',
  signOut: '\uf2f5',
  tokens: '\uf121',
};

const GROUP_ICON_MAP: Record<string, string> = {
  actions: '\uf0e7',
  'data display': '\uf0ce',
  feedback: '\uf075',
  foundations: '\uf5fd',
  inputs: '\uf11c',
  navigation: '\uf14e',
  'tool mode': '\uf0ae',
};

const COMPONENT_ICON_MAP: Partial<Record<string, string>> = {
  alert: '\uf071',
  avatar: '\uf007',
  breadcrumb: '\uf105',
  buttons: '\uf245',
  card: '\uf2bb',
  checkbox: '\uf14a',
  chip: '\uf02b',
  'country-flag': '\uf024',
  'cp-workspace-shell': '\uf1ad',
  'currency-input': '\uf3d1',
  'date-input': '\uf073',
  'document-glyph': '\uf15b',
  dropdown: '\uf078',
  dropzone: '\uf093',
  'file-item': '\uf15c',
  filter: '\uf0b0',
  'form-elements': '\uf044',
  'grouped-buttons': '\uf00a',
  'icon-buttons': '\uf013',
  indicators: '\uf201',
  links: '\uf0c1',
  'multi-select-dropdown': '\uf0ca',
  'multistate-buttons': '\uf00a',
  'next-steps-card': '\uf0ae',
  'page-header': '\uf022',
  'quick-filters': '\uf0b0',
  radio: '\uf192',
  searchbox: '\uf002',
  separator: '\uf068',
  'side-nav': '\uf0c9',
  'status-indicator': '\uf111',
  table: '\uf0ce',
  'tab-buttons': '\uf0db',
  'text-area': '\uf036',
  'text-input': '\uf031',
  textbox: '\uf246',
  toast: '\uf0f3',
  toggle: '\uf205',
  'toggle-card': '\uf205',
  tooltip: '\uf059',
  typography: '\uf031',
};

function getGroupIcon(group: string) {
  return GROUP_ICON_MAP[group.toLowerCase()] ?? '\uf0c8';
}

function getComponentIcon(id: string) {
  return COMPONENT_ICON_MAP[id] ?? '\uf0c8';
}

function getComponentIdFromPath(pathname: string) {
  const match = pathname.match(/^\/design-system\/components\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getHashSectionId(sectionIds: string[]) {
  if (typeof window === 'undefined') return null;
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return sectionIds.includes(id) ? id : null;
}

function setSectionHash(id: string, mode: 'push' | 'replace') {
  if (typeof window === 'undefined') return;
  const hash = `#${encodeURIComponent(id)}`;
  if (window.location.hash === hash) return;
  const url = `${window.location.pathname}${window.location.search}${hash}`;

  if (mode === 'push') {
    window.history.pushState(null, '', url);
    return;
  }

  window.history.replaceState(null, '', url);
}

export function DesignSystemShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<DesignSystemMode>('efficio');
  const [activeSection, setActiveSection] = useState('');
  const [componentSearch, setComponentSearch] = useState('');
  const [session, setSession] = useState<DesignSystemSession | null>(null);
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated'>('checking');
  const sidebarRef = useRef<HTMLElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const pageMaxWidth = 1180;

  const componentId = getComponentIdFromPath(pathname);
  const componentDoc = componentId ? getComponentDoc(componentId) : undefined;
  const isTokensPage = pathname.startsWith('/design-system/tokens');
  const isComponentDetailPage = Boolean(componentDoc);
  const isComponentsLandingPage = pathname === '/design-system';
  const currentPage = isTokensPage ? 'tokens' : 'components';
  const sectionIds = isTokensPage ? TOKEN_SECTION_IDS : COMPONENT_SECTION_IDS;
  const navGroups = useMemo(
    () => (isTokensPage ? undefined : getComponentNavGroups('routes')),
    [isTokensPage],
  );
  const normalizedComponentSearch = componentSearch.trim().toLowerCase();
  const filteredNavGroups = useMemo(() => {
    if (!navGroups) return undefined;
    if (!normalizedComponentSearch) return navGroups;

    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const searchableText = `${item.label} ${item.id}`.toLowerCase();
          return searchableText.includes(normalizedComponentSearch);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [navGroups, normalizedComponentSearch]);
  const hasComponentNav = Boolean(navGroups?.length);
  const hasFilteredNavResults = Boolean(filteredNavGroups?.length);

  const contentPadding = 'calc(var(--orbit-space-l) + var(--orbit-space-s)) var(--orbit-space-mega)';

  useEffect(() => {
    const storedSession = readDesignSystemSession();
    if (storedSession) {
      setSession(storedSession);
      setAuthStatus('authenticated');
      return;
    }

    const nextPath = getSafeDesignSystemNextPath(
      `${window.location.pathname}${window.location.search}${window.location.hash}`,
    );

    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [router, pathname]);

  const handleSignOut = () => {
    clearDesignSystemSession();
    setSession(null);
    setAuthStatus('checking');
    router.replace('/login');
  };

  useEffect(() => {
    if (isComponentDetailPage && componentDoc) {
      setActiveSection(componentDoc.id);
      return;
    }

    if (isTokensPage) {
      setActiveSection('tokens');
      return;
    }

    setActiveSection('');
  }, [componentDoc, isComponentDetailPage, isTokensPage, pathname]);

  useEffect(() => {
    if (!sidebarRef.current || !activeSection) return;
    const activeLink = sidebarRef.current.querySelector(`[data-section-id="${activeSection}"]`) as HTMLElement | null;
    activeLink?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeSection]);

  useEffect(() => {
    if (isComponentDetailPage || isTokensPage || pathname === '/design-system') return;

    let observer: IntersectionObserver | null = null;
    let frameId = 0;

    const syncFromHash = () => {
      const id = getHashSectionId(sectionIds);
      if (!id) return;

      isProgrammaticScrollRef.current = true;
      setActiveSection(id);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
      window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 500);
    };

    const startObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          if (isProgrammaticScrollRef.current) return;

          const visible = entries.filter((entry) => entry.isIntersecting);
          if (visible.length === 0) return;

          const sorted = visible.sort((a, b) => {
            const ai = sectionIds.indexOf(a.target.id);
            const bi = sectionIds.indexOf(b.target.id);
            return ai - bi;
          });
          const nextSection = sorted[0].target.id;
          setActiveSection(nextSection);
          setSectionHash(nextSection, 'replace');
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
      );

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer?.observe(element);
      });
    };

    syncFromHash();
    frameId = window.requestAnimationFrame(startObserver);
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [isComponentDetailPage, isTokensPage, pathname, sectionIds]);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, item: DesignSystemNavItem) => {
    const href = item.href ?? `#${item.id}`;

    setActiveSection(item.id);

    if (!href.startsWith('#')) {
      return;
    }

    event.preventDefault();
    isProgrammaticScrollRef.current = true;
    setSectionHash(item.id, 'push');
    document.getElementById(item.id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 500);
  };

  const modeButtonStyle = (value: DesignSystemMode): React.CSSProperties => ({
    padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
    borderRadius: 'var(--orbit-radius-sm)',
    border: mode === value
      ? 'calc(var(--orbit-space-px) * 2) solid var(--orbit-color-border-selected)'
      : 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
    background: mode === value ? 'var(--orbit-color-bg-selected)' : 'var(--orbit-color-bg-default)',
    color: 'var(--orbit-color-text-primary)',
    fontWeight: mode === value ? 'var(--orbit-font-weight-semibold)' : 'var(--orbit-font-weight-regular)',
    cursor: 'pointer',
    fontSize: 'var(--orbit-text-sm)',
    fontFamily: 'var(--orbit-font-family-sans)',
    lineHeight: 'var(--orbit-leading-normal)',
    minWidth: 0,
  });

  const pageLinkStyle = (page: 'components' | 'tokens'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-s)',
    padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
    minHeight: 'var(--orbit-space-xl)',
    borderRadius: 'var(--orbit-radius-sm)',
    backgroundColor: currentPage === page ? 'var(--orbit-color-bg-hover)' : 'transparent',
    fontSize: 'var(--orbit-text-sm)',
    color: currentPage === page ? 'var(--orbit-color-text-primary)' : 'var(--orbit-color-text-secondary)',
    textDecoration: 'none',
    fontWeight: currentPage === page ? 'var(--orbit-font-weight-medium)' : 'var(--orbit-font-weight-regular)',
    minWidth: 0,
    lineHeight: 'var(--orbit-leading-normal)',
    boxShadow: currentPage === page ? 'inset calc(var(--orbit-space-px) * 3) 0 0 var(--orbit-color-border-selected)' : undefined,
  });

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-s)',
    padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
    fontSize: 'var(--orbit-sidenav-row-font-size)',
    textDecoration: 'none',
    color: active ? 'var(--orbit-color-text-primary)' : 'var(--orbit-color-text-secondary)',
    fontWeight: active ? 'var(--orbit-font-weight-medium)' : 'var(--orbit-font-weight-regular)',
    backgroundColor: active ? 'var(--orbit-color-bg-selected)' : 'transparent',
    borderRadius: 'var(--orbit-radius-sm)',
    cursor: 'pointer',
    lineHeight: 'var(--orbit-leading-relaxed)',
    minHeight: 'var(--orbit-space-l)',
    minWidth: 0,
    overflowWrap: 'anywhere',
    boxShadow: active ? 'inset calc(var(--orbit-space-px) * 3) 0 0 var(--orbit-color-border-selected)' : undefined,
  });

  const sidebarIconStyle = (active = false): React.CSSProperties => ({
    width: 'var(--orbit-space-base)',
    flexShrink: 0,
    color: active ? 'var(--orbit-color-text-primary)' : 'var(--orbit-color-text-secondary)',
    textAlign: 'center',
  });

  const renderNavLink = (item: DesignSystemNavItem) => {
    const href = item.href ?? `#${item.id}`;
    const active = activeSection === item.id;
    const isRouteLink = !href.startsWith('#');
    const commonProps = {
      className: 'ds-shell-nav-link',
      'data-section-id': item.id,
      'aria-current': active && isRouteLink ? 'page' as const : undefined,
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(event, item),
      style: navLinkStyle(active),
      children: (
        <>
          <span aria-hidden="true" style={sidebarIconStyle(active)}>
            <FaIcon icon={getComponentIcon(item.id)} color="currentColor" />
          </span>
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{item.label}</span>
        </>
      ),
    };

    if (href.startsWith('#')) {
      return <a key={item.id} href={href} {...commonProps} />;
    }

    return <Link key={item.id} href={href} {...commonProps} />;
  };

  const themeToggle = (
    <div
      className="ds-shell-theme-toggle"
      role="group"
      aria-label="Theme"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--orbit-space-xs)',
        marginBottom: 'var(--orbit-space-base)',
        paddingBottom: 'var(--orbit-space-base)',
        borderBottom: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
        minWidth: 0,
      }}
    >
      <span
        style={{
          color: 'var(--orbit-color-text-secondary)',
          fontSize: 'var(--orbit-text-xs)',
          fontWeight: 'var(--orbit-font-weight-semibold)',
          lineHeight: 'var(--orbit-leading-tight)',
        }}
      >
        Theme
      </span>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--orbit-space-xs)',
          minWidth: 0,
        }}
      >
        <button
          type="button"
          aria-pressed={mode === 'efficio'}
          onClick={() => setMode('efficio')}
          style={modeButtonStyle('efficio')}
        >
          Efficio
        </button>
        <button
          type="button"
          aria-pressed={mode === 'orbit'}
          onClick={() => setMode('orbit')}
          style={modeButtonStyle('orbit')}
        >
          Orbit
        </button>
      </div>
    </div>
  );

  if (authStatus === 'checking') {
    return (
      <div
        role="status"
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--orbit-color-bg-canvas)',
          color: 'var(--orbit-color-text-secondary)',
          fontFamily: 'var(--orbit-font-family-sans)',
          fontSize: 'var(--orbit-text-sm)',
          lineHeight: 'var(--orbit-leading-normal)',
        }}
      >
        Loading design system
      </div>
    );
  }

  return (
    <div
      className="ds-shell-root"
      style={{ display: 'flex', fontFamily: 'var(--orbit-font-family-sans)', minHeight: '100vh' }}
    >
      <style>{`
        .ds-shell-sidebar {
          overflow-y: auto;
          scrollbar-color: transparent transparent;
          scrollbar-width: none;
        }
        .ds-shell-sidebar::-webkit-scrollbar { width: var(--orbit-space-none); }
        .ds-shell-sidebar::-webkit-scrollbar-track { background: transparent; }
        .ds-shell-sidebar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: var(--orbit-radius-sm);
        }
        .ds-shell-sidebar:hover,
        .ds-shell-sidebar:focus-within {
          scrollbar-color: var(--orbit-color-text-secondary) transparent;
          scrollbar-width: thin;
        }
        .ds-shell-sidebar:hover::-webkit-scrollbar,
        .ds-shell-sidebar:focus-within::-webkit-scrollbar {
          width: var(--orbit-space-xs);
        }
        .ds-shell-sidebar:hover::-webkit-scrollbar-thumb,
        .ds-shell-sidebar:focus-within::-webkit-scrollbar-thumb {
          background: var(--orbit-color-text-secondary);
        }
        .ds-shell-nav-link,
        .ds-shell-page-link,
        .ds-shell-sign-out { transition: background-color 0.15s ease; }
        .ds-shell-nav-link:hover,
        .ds-shell-page-link:hover,
        .ds-shell-sign-out:hover { background-color: var(--orbit-color-bg-hover) !important; }
        .ds-shell-root :where(a, button):focus-visible,
        .ds-shell-search-input:focus-visible {
          outline: calc(var(--orbit-space-px) * 2) solid var(--orbit-color-border-focused) !important;
          outline-offset: var(--orbit-space-xxs);
        }
        .ds-shell-sidebar-utility {
          position: sticky;
          top: var(--orbit-space-none);
          z-index: 2;
          background: var(--orbit-color-white);
          padding: var(--orbit-sidenav-padding-top) var(--orbit-space-s) var(--orbit-space-base);
          border-bottom: var(--orbit-space-px) solid var(--orbit-color-border-default);
          margin-bottom: var(--orbit-space-base);
        }
        .ds-shell-search-input::placeholder {
          color: var(--orbit-color-text-secondary);
        }
        .ds-shell-search-input::-webkit-search-cancel-button {
          appearance: none;
        }
        @media (max-width: 900px) {
          .ds-shell-root { flex-direction: column !important; }
          .ds-shell-sidebar {
            position: relative !important;
            width: 100% !important;
            min-width: 0 !important;
            height: auto !important;
            max-height: 42vh !important;
            overflow-x: hidden !important;
          }
          .ds-shell-sidebar-utility {
            position: sticky !important;
            top: var(--orbit-space-none) !important;
          }
          .ds-shell-nav-link,
          .ds-shell-page-link,
          .ds-shell-search-input,
          .ds-shell-theme-toggle {
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .ds-shell-main { min-width: 0 !important; }
          .ds-shell-content {
            max-width: none !important;
            padding: var(--orbit-space-base) !important;
            overflow-x: hidden !important;
          }
        }
      `}</style>

      <nav
        ref={sidebarRef}
        className="ds-shell-sidebar"
        style={{
          width: 'var(--orbit-sidenav-width)',
          minWidth: 'var(--orbit-sidenav-width)',
          position: 'sticky',
          top: 'var(--orbit-space-none)',
          height: '100vh',
          backgroundColor: 'var(--orbit-color-white)',
          borderRight: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
          padding: 'var(--orbit-space-none)',
          boxSizing: 'border-box',
          fontFamily: 'var(--orbit-font-family-sans)',
        }}
      >
        <div className="ds-shell-sidebar-utility">
          <div
            style={{
              padding: 'var(--orbit-space-none) var(--orbit-space-none) var(--orbit-sidenav-header-padding-block-end)',
              borderBottom: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
              marginBottom: 'var(--orbit-space-base)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--orbit-space-s)',
              minWidth: 0,
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'var(--orbit-space-l)',
                height: 'var(--orbit-space-l)',
                borderRadius: 'var(--orbit-radius-sm)',
                background: 'linear-gradient(to bottom, var(--orbit-color-sidenav-gradient-from), var(--orbit-color-sidenav-gradient-to))',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <span style={{ fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-white)', fontWeight: 'var(--orbit-font-weight-bold)' }}>O</span>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-bold)', color: 'var(--orbit-color-text-primary)', lineHeight: 'var(--orbit-leading-tight)', overflowWrap: 'anywhere' }}>Design System</div>
            </div>
          </div>

          {themeToggle}

          {hasComponentNav && (
            <div style={{ position: 'relative', marginBottom: 'var(--orbit-space-base)' }}>
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 'var(--orbit-space-s)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--orbit-color-text-secondary)',
                  display: 'inline-flex',
                  pointerEvents: 'none',
                }}
              >
                <FaIcon icon={SIDEBAR_ICONS.search} color="currentColor" />
              </span>
              <input
                aria-label="Search components"
                className="ds-shell-search-input"
                type="search"
                value={componentSearch}
                onChange={(event) => setComponentSearch(event.target.value)}
                placeholder="Search components"
                style={{
                  width: '100%',
                  height: 'var(--orbit-space-xl)',
                  border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
                  borderRadius: 'var(--orbit-radius-sm)',
                  background: 'var(--orbit-color-bg-default)',
                  color: 'var(--orbit-color-text-primary)',
                  boxSizing: 'border-box',
                  padding: 'var(--orbit-space-xs) calc(var(--orbit-space-xl) + var(--orbit-space-xs)) var(--orbit-space-xs) var(--orbit-space-xl)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  fontSize: 'var(--orbit-text-sm)',
                  lineHeight: 'var(--orbit-leading-normal)',
                  outline: 'none',
                }}
              />
              {componentSearch && (
                <button
                  type="button"
                  aria-label="Clear component search"
                  onClick={() => setComponentSearch('')}
                  style={{
                    position: 'absolute',
                    right: 'var(--orbit-space-xs)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 'var(--orbit-space-l)',
                    height: 'var(--orbit-space-l)',
                    border: 'var(--orbit-space-none)',
                    borderRadius: 'var(--orbit-radius-sm)',
                    background: 'transparent',
                    color: 'var(--orbit-color-text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 'var(--orbit-space-none)',
                  }}
                >
                  <FaIcon icon={SIDEBAR_ICONS.clear} color="currentColor" />
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xs)' }}>
            <Link className="ds-shell-page-link" href="/design-system" aria-current={isComponentsLandingPage ? 'page' : undefined} style={pageLinkStyle('components')}>
              <span aria-hidden="true" style={sidebarIconStyle(currentPage === 'components')}>
                <FaIcon icon={SIDEBAR_ICONS.components} color="currentColor" />
              </span>
              <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>Components</span>
            </Link>
            <Link className="ds-shell-page-link" href="/design-system/tokens" aria-current={isTokensPage ? 'page' : undefined} style={pageLinkStyle('tokens')}>
              <span aria-hidden="true" style={sidebarIconStyle(currentPage === 'tokens')}>
                <FaIcon icon={SIDEBAR_ICONS.tokens} color="currentColor" />
              </span>
              <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>Design Tokens</span>
            </Link>
          </div>
        </div>

        <div style={{ padding: 'var(--orbit-space-none) var(--orbit-space-s)' }}>
          {filteredNavGroups?.map((group) => (
            <div key={group.group} style={{ marginBottom: 'calc(var(--orbit-space-s) + var(--orbit-space-xs))' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--orbit-space-s)',
                  padding: 'var(--orbit-space-none) var(--orbit-space-s)',
                  fontSize: 'var(--orbit-text-xs)',
                  fontWeight: 'var(--orbit-font-weight-semibold)',
                  textTransform: 'uppercase' as const,
                  color: 'var(--orbit-color-text-primary)',
                  marginBottom: 'var(--orbit-space-xs)',
                  minWidth: 0,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    ...sidebarIconStyle(true),
                    color: 'var(--orbit-color-text-secondary)',
                  }}
                >
                  <FaIcon icon={getGroupIcon(group.group)} color="currentColor" />
                </span>
                <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{group.group}</span>
              </div>
              {group.items.map(renderNavLink)}
            </div>
          ))}
          {hasComponentNav && !hasFilteredNavResults && (
            <div
              role="status"
              style={{
                padding: 'var(--orbit-space-base) var(--orbit-space-s)',
                color: 'var(--orbit-color-text-secondary)',
                fontSize: 'var(--orbit-text-sm)',
                lineHeight: 'var(--orbit-leading-relaxed)',
              }}
            >
              No components found
            </div>
          )}
        </div>

        <div
          style={{
            position: 'sticky',
            bottom: 'var(--orbit-space-none)',
            zIndex: 'var(--orbit-z-sticky)',
            margin: 'var(--orbit-space-base) var(--orbit-space-none) var(--orbit-space-none)',
            padding: 'var(--orbit-space-base) var(--orbit-space-s)',
            borderTop: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
            backgroundColor: 'var(--orbit-color-white)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--orbit-space-xs)',
            minWidth: 0,
          }}
        >
          <span
            style={{
              color: 'var(--orbit-color-text-secondary)',
              fontSize: 'var(--orbit-text-xs)',
              fontWeight: 'var(--orbit-font-weight-semibold)',
              lineHeight: 'var(--orbit-leading-tight)',
              textTransform: 'uppercase',
            }}
          >
            Signed in
          </span>
          <span
            style={{
              color: 'var(--orbit-color-text-primary)',
              fontSize: 'var(--orbit-text-sm)',
              fontWeight: 'var(--orbit-font-weight-medium)',
              lineHeight: 'var(--orbit-leading-normal)',
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {session?.name ?? 'Design system user'}
          </span>
          <button
            className="ds-shell-sign-out"
            type="button"
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--orbit-space-s)',
              minHeight: 'var(--orbit-space-xl)',
              border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
              borderRadius: 'var(--orbit-radius-sm)',
              background: 'var(--orbit-color-bg-default)',
              color: 'var(--orbit-color-text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--orbit-font-family-sans)',
              fontSize: 'var(--orbit-text-sm)',
              lineHeight: 'var(--orbit-leading-normal)',
              padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
              textAlign: 'left',
            }}
          >
            <span aria-hidden="true" style={sidebarIconStyle(false)}>
              <FaIcon icon={SIDEBAR_ICONS.signOut} color="currentColor" />
            </span>
            <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>Sign out</span>
          </button>
        </div>
      </nav>

      <div
        className="ds-shell-main"
        data-theme={mode === 'orbit' ? 'orbit' : undefined}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
      >
        <div
          className="ds-shell-content"
          style={{
            flex: 1,
            width: '100%',
            maxWidth: pageMaxWidth,
            marginInline: 'auto',
            padding: contentPadding,
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
