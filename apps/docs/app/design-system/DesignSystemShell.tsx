'use client';

import React from 'react';
import Link from 'next/link';
import { Headings, Text } from '@efficio/orbit';

export type DesignSystemMode = 'efficio' | 'orbit';

export interface DesignSystemNavItem {
  label: string;
  id: string;
}

export interface DesignSystemNavGroup {
  group: string;
  items: DesignSystemNavItem[];
}

export function DesignSystemShell({
  mode,
  onModeChange,
  title,
  subtitle,
  currentPage,
  navGroups,
  navItems,
  activeSection,
  onNavItemClick,
  linkBase,
  sidebarRef,
  contentPadding = 'var(--orbit-space-0) var(--orbit-space-mega) var(--orbit-space-mega)',
  children,
}: {
  mode: DesignSystemMode;
  onModeChange: (mode: DesignSystemMode) => void;
  title: string;
  subtitle: string;
  currentPage: 'components' | 'tokens' | 'foundations';
  navGroups?: DesignSystemNavGroup[];
  navItems?: DesignSystemNavItem[];
  activeSection?: string;
  /**
   * When set, grouped nav items become real route links (`${linkBase}/${id}`)
   * via next/link — client-side navigation that preserves this shell's parent
   * layout (and its mode state). When unset, items are in-page anchor links.
   */
  linkBase?: string;
  onNavItemClick?: (id: string) => void;
  sidebarRef?: React.Ref<HTMLElement>;
  contentPadding?: string;
  children: React.ReactNode;
}) {
  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    if (onNavItemClick) {
      onNavItemClick(id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const modeButtonStyle = (value: DesignSystemMode): React.CSSProperties => ({
    padding: 'var(--orbit-space-s) var(--orbit-space-base)',
    borderRadius: 'var(--orbit-radius-sm)',
    border: mode === value
      ? 'calc(var(--orbit-space-px) * 2) solid var(--orbit-color-border-selected)'
      : 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
    background: mode === value ? 'var(--orbit-color-bg-selected)' : 'var(--orbit-color-bg-default)',
    fontWeight: mode === value ? 'var(--orbit-font-weight-semibold)' : 'var(--orbit-font-weight-regular)',
    cursor: 'pointer',
    fontSize: 'var(--orbit-text-sm)',
  });

  const pageLinkStyle = (page: 'components' | 'tokens' | 'foundations'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--orbit-space-xs)',
    padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
    height: 'var(--orbit-space-l)',
    borderRadius: 'var(--orbit-radius-sm)',
    backgroundColor: currentPage === page ? 'var(--orbit-color-sidenav-active-bg)' : 'transparent',
    fontSize: 'var(--orbit-text-sm)',
    color: currentPage === page ? 'var(--orbit-color-white)' : 'var(--orbit-color-sidenav-muted)',
    textDecoration: 'none',
    fontWeight: 'var(--orbit-font-weight-regular)',
  });

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    display: 'block',
    padding: 'var(--orbit-space-xs) var(--orbit-space-s) var(--orbit-space-xs) calc(var(--orbit-space-s) + var(--orbit-space-xs))',
    fontSize: '13px',
    textDecoration: 'none',
    color: active ? 'var(--orbit-color-white)' : 'var(--orbit-color-sidenav-muted)',
    fontWeight: active ? 'var(--orbit-font-weight-medium)' : 'var(--orbit-font-weight-regular)',
    backgroundColor: active ? 'var(--orbit-color-sidenav-active-bg)' : 'transparent',
    borderRadius: 'var(--orbit-radius-sm)',
    cursor: 'pointer',
    lineHeight: 'var(--orbit-leading-relaxed)',
  });

  return (
    <div
      data-theme={mode === 'orbit' ? 'orbit' : undefined}
      style={{ display: 'flex', fontFamily: 'var(--orbit-font-family-sans)', minHeight: '100vh' }}
    >
      <style>{`
        .ds-shell-sidebar { overflow-y: auto; }
        .ds-shell-sidebar::-webkit-scrollbar { width: var(--orbit-space-xs); }
        .ds-shell-sidebar::-webkit-scrollbar-track { background: transparent; }
        .ds-shell-sidebar::-webkit-scrollbar-thumb {
          background: var(--orbit-color-text-secondary);
          border-radius: var(--orbit-radius-sm);
        }
        .ds-shell-nav-link { transition: background-color 0.15s ease; }
        .ds-shell-nav-link:hover { background-color: var(--orbit-color-sidenav-active-bg) !important; }
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
          backgroundColor: 'var(--orbit-color-sidenav-bg)',
          padding: 'var(--orbit-sidenav-padding-top) var(--orbit-space-none)',
          boxSizing: 'border-box',
          fontFamily: 'var(--orbit-font-family-sans)',
        }}
      >
        <div
          style={{
            padding: 'var(--orbit-space-none) var(--orbit-sidenav-header-padding-inline) var(--orbit-sidenav-header-padding-block-end)',
            borderBottom: 'var(--orbit-space-px) solid var(--orbit-color-sidenav-divider)',
            marginBottom: 'var(--orbit-space-base)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--orbit-space-s)',
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
          <div>
            <div style={{ fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-bold)', color: 'var(--orbit-color-white)', lineHeight: 'var(--orbit-leading-tight)' }}>Orbit</div>
            <div style={{ fontSize: 'var(--orbit-text-xs)', color: 'var(--orbit-color-sidenav-muted)', lineHeight: 'var(--orbit-leading-relaxed)' }}>Design System</div>
          </div>
        </div>

        <div style={{ padding: 'var(--orbit-space-none) var(--orbit-space-s)', marginBottom: 'var(--orbit-space-base)' }}>
          <Link href="/design-system" aria-current={currentPage === 'components' ? 'page' : undefined} style={pageLinkStyle('components')}>
            Components
          </Link>
          <Link href="/design-system/tokens" aria-current={currentPage === 'tokens' ? 'page' : undefined} style={pageLinkStyle('tokens')}>
            Design Tokens
          </Link>
          <Link href="/design-system/foundations" aria-current={currentPage === 'foundations' ? 'page' : undefined} style={pageLinkStyle('foundations')}>
            Foundations
          </Link>
        </div>

        <div style={{ width: 'calc(var(--orbit-sidenav-width) - var(--orbit-space-l))', margin: 'var(--orbit-space-none) auto var(--orbit-space-base)', borderBottom: 'var(--orbit-space-px) solid var(--orbit-color-sidenav-divider)' }} />

        <div style={{ padding: 'var(--orbit-space-none) var(--orbit-space-s)' }}>
          {navGroups?.map((group) => (
            <div key={group.group} style={{ marginBottom: 'calc(var(--orbit-space-s) + var(--orbit-space-xs))' }}>
              <div
                style={{
                  padding: 'var(--orbit-space-none) var(--orbit-space-s)',
                  fontSize: '11px',
                  fontWeight: 'var(--orbit-font-weight-semibold)',
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.06em',
                  color: 'var(--orbit-color-sidenav-muted)',
                  marginBottom: 'var(--orbit-space-xs)',
                }}
              >
                {group.group}
              </div>
              {group.items.map((item) => {
                const active = activeSection === item.id;
                if (linkBase) {
                  return (
                    <Link
                      key={item.id}
                      href={`${linkBase}/${item.id}`}
                      className="ds-shell-nav-link"
                      data-section-id={item.id}
                      style={navLinkStyle(active)}
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="ds-shell-nav-link"
                    data-section-id={item.id}
                    onClick={(event) => handleNavClick(event, item.id)}
                    style={navLinkStyle(active)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          ))}
          {navItems?.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="ds-shell-nav-link"
              onClick={(event) => handleNavClick(event, item.id)}
              style={navLinkStyle(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div
          style={{
            position: 'sticky',
            top: 'var(--orbit-space-none)',
            zIndex: 'var(--orbit-z-sticky)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--orbit-space-base) var(--orbit-space-mega)',
            backgroundColor: 'var(--orbit-color-white)',
            borderBottom: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
            boxSizing: 'border-box',
          }}
        >
          <div>
            <Headings size="Heading 4">{title}</Headings>
            <Text variant="Secondary" size="Small">{subtitle}</Text>
          </div>
          <div style={{ display: 'flex', gap: 'var(--orbit-space-s)', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-semibold)', color: 'var(--orbit-color-text-secondary)' }}>Mode:</span>
            <button type="button" onClick={() => onModeChange('efficio')} style={modeButtonStyle('efficio')}>
              Efficio
            </button>
            <button type="button" onClick={() => onModeChange('orbit')} style={modeButtonStyle('orbit')}>
              Orbit
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: contentPadding, maxWidth: 960, boxSizing: 'border-box', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
