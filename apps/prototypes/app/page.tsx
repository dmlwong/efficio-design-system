'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Breadcrumb,
  TabButton,
  Button,
  Headings,
  Separator,
  Toast,
} from '@efficio/orbit';
import { SearchBar } from '@/components/feature/SearchBar';
import { ViewToggle } from '@/components/feature/ViewToggle';
import { ActiveFilters } from '@/components/feature/ActiveFilters';
import { MetricCards } from '@/components/feature/MetricCards';
import { FilterPanel, type FilterState } from '@/components/feature/FilterPanel';
import { SupplierTable } from '@/components/feature/SupplierTable';
import { SupplierCardGrid } from '@/components/feature/SupplierCardGrid';
import { SupplierDetailModal } from '@/components/feature/SupplierDetailModal';
import { SimilarProjectsModal } from '@/components/feature/SimilarProjectsModal';
import { suppliers, type Supplier } from '@/data/mock-data';

type DataState = 'loading' | 'typical' | 'empty-search' | 'empty-filters' | 'error';

const sidebarNavItems = [
  { label: 'Dashboard', icon: 'grid' },
  { label: 'Projects', icon: 'folder', active: true },
  { label: 'Suppliers', icon: 'users' },
  { label: 'Analytics', icon: 'chart' },
  { label: 'Reports', icon: 'file' },
  { label: 'Settings', icon: 'gear' },
];

const initiativeTabs = ['Workspace', 'Methodology', 'Suppliers', 'Initiative Milestones', 'Initiative Benefits'];

const emptyFilterState: FilterState = {
  categories: [],
  regions: [],
  classifications: [],
  certifications: [],
  companySizes: [],
  diversityOnly: false,
};

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Suppliers');
  const [secondaryTab, setSecondaryTab] = useState<'discovery' | 'tracker'>('discovery');
  const [view, setView] = useState<'table' | 'card'>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(emptyFilterState);
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set());
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showSimilarProjects, setShowSimilarProjects] = useState(false);
  const [dataState, setDataState] = useState<DataState>('typical');
  const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Info'; message: string; visible: boolean }>({
    type: 'Success',
    message: '',
    visible: false,
  });

  const filteredSuppliers = useMemo(() => {
    if (dataState === 'loading' || dataState === 'error') return [];

    let result = [...suppliers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.certifications.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((s) => filters.categories.includes(s.category));
    }
    if (filters.regions.length > 0) {
      result = result.filter((s) => filters.regions.includes(s.region));
    }
    if (filters.classifications.length > 0) {
      result = result.filter((s) =>
        s.classifications.some((c) => filters.classifications.includes(c))
      );
    }
    if (filters.certifications.length > 0) {
      result = result.filter((s) =>
        s.certifications.some((c) => filters.certifications.includes(c))
      );
    }
    if (filters.companySizes.length > 0) {
      result = result.filter((s) => filters.companySizes.includes(s.companySize));
    }

    return result;
  }, [searchQuery, filters, dataState]);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    filters.categories.forEach((c) => chips.push({ key: `cat-${c}`, label: c }));
    filters.regions.forEach((r) => chips.push({ key: `reg-${r}`, label: r }));
    filters.classifications.forEach((c) => chips.push({ key: `cls-${c}`, label: c }));
    filters.certifications.forEach((c) => chips.push({ key: `cert-${c}`, label: c }));
    filters.companySizes.forEach((s) => chips.push({ key: `size-${s}`, label: s }));
    if (filters.diversityOnly) chips.push({ key: 'diversity', label: 'Diversity certified' });
    return chips;
  }, [filters]);

  const handleRemoveFilter = useCallback(
    (key: string) => {
      const newFilters = { ...filters };
      if (key.startsWith('cat-')) {
        newFilters.categories = newFilters.categories.filter((c) => c !== key.replace('cat-', ''));
      } else if (key.startsWith('reg-')) {
        newFilters.regions = newFilters.regions.filter((r) => r !== key.replace('reg-', ''));
      } else if (key.startsWith('cls-')) {
        newFilters.classifications = newFilters.classifications.filter(
          (c) => c !== key.replace('cls-', '')
        );
      } else if (key.startsWith('cert-')) {
        newFilters.certifications = newFilters.certifications.filter(
          (c) => c !== key.replace('cert-', '')
        );
      } else if (key.startsWith('size-')) {
        newFilters.companySizes = newFilters.companySizes.filter(
          (s) => s !== key.replace('size-', '')
        );
      } else if (key === 'diversity') {
        newFilters.diversityOnly = false;
      }
      setFilters(newFilters);
    },
    [filters]
  );

  const handleToggleTrack = useCallback(
    (id: string) => {
      setTrackedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
          setToast({ type: 'Info', message: 'Supplier removed from tracker', visible: true });
        } else {
          next.add(id);
          setToast({ type: 'Success', message: 'Supplier added to tracker', visible: true });
        }
        return next;
      });
    },
    []
  );

  const metricCounts = useMemo(() => {
    const incumbent = suppliers.filter((s) => s.classifications.includes('Incumbent')).length;
    const recentlyAwarded = suppliers.filter((s) => s.classifications.includes('Recently Awarded')).length;
    const efficioEngaged = suppliers.filter((s) => s.classifications.includes('Efficio Engaged')).length;
    const copApproved = suppliers.filter((s) => s.classifications.includes('COP Approved')).length;
    return [
      { label: 'Incumbent', count: incumbent, status: 'Information' as const },
      { label: 'Recently Awarded', count: recentlyAwarded, status: 'Success' as const },
      { label: 'Efficio Engaged', count: efficioEngaged, status: 'Warning' as const },
      { label: 'COP Approved', count: copApproved, status: 'Success' as const },
    ];
  }, []);

  const sparkleIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5L8 1z"
        fill="currentColor"
      />
    </svg>
  );

  const filterIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 3h12M4 8h8M6 13h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const switchIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4-4 4 4M4 10l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const projectsIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 3h5l2 2h5v8H2V3z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const sidebarIcons: Record<string, React.ReactNode> = {
    grid: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="2" y="11" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="11" y="11" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    folder: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4h5l2 2h7v9H2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    users: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 16c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    chart: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="10" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="7.5" y="5" width="3" height="11" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
        <rect x="13" y="2" width="3" height="14" rx="0.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
    file: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 2h7l5 5v9H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M11 2v5h5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
    gear: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.3 3.3l1.4 1.4M13.3 13.3l1.4 1.4M3.3 14.7l1.4-1.4M13.3 4.7l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  };

  // Determine effective display state
  const getDisplayState = (): DataState => {
    if (dataState === 'loading' || dataState === 'error') return dataState;
    if (filteredSuppliers.length === 0 && searchQuery.trim()) return 'empty-search';
    if (filteredSuppliers.length === 0 && activeFilterChips.length > 0) return 'empty-filters';
    return 'typical';
  };

  const displayState = getDisplayState();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '200px',
          minWidth: '200px',
          backgroundColor: 'var(--orbit-color-black-pearl)',
          color: 'var(--orbit-color-text-inverse)',
          display: 'flex',
          flexDirection: 'column',
          padding: `var(--orbit-space-m) var(--orbit-space-0)`,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: `var(--orbit-space-base) var(--orbit-space-base) var(--orbit-space-m)`,
            borderBottom: `var(--orbit-space-micro) solid rgba(255,255,255,0.1)`,
            marginBottom: 'var(--orbit-space-base)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--orbit-font-family-brand)',
              fontSize: 'var(--orbit-text-lg)',
              fontWeight: 'var(--orbit-font-weight-bold)',
              color: 'var(--orbit-color-bright-green)',
              lineHeight: 'var(--orbit-leading-tight)',
            }}
          >
            Orbit
          </div>
          <div
            style={{
              fontSize: 'var(--orbit-text-xs)',
              fontFamily: 'var(--orbit-font-family-sans)',
              color: 'var(--orbit-color-tiara)',
              marginTop: 'var(--orbit-space-xxs)',
              lineHeight: 'var(--orbit-leading-tight)',
            }}
          >
            Connected Platform
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xxs)' }}>
          {sidebarNavItems.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--orbit-space-s)',
                padding: `var(--orbit-space-s) var(--orbit-space-base)`,
                fontSize: 'var(--orbit-text-body-size)',
                fontFamily: 'var(--orbit-font-family-sans)',
                fontWeight: item.active ? 'var(--orbit-font-weight-semibold)' : 'var(--orbit-font-weight-regular)',
                color: item.active ? 'var(--orbit-color-bright-green)' : 'var(--orbit-color-tiara)',
                backgroundColor: item.active ? 'rgba(0, 189, 158, 0.1)' : 'transparent',
                borderLeft: item.active
                  ? `var(--orbit-space-xxs) solid var(--orbit-color-bright-green)`
                  : `var(--orbit-space-xxs) solid transparent`,
                cursor: 'pointer',
                lineHeight: 'var(--orbit-text-body-leading)',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ display: 'inline-flex', opacity: item.active ? 1 : 0.7 }}>
                {sidebarIcons[item.icon]}
              </span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Bottom user area */}
        <div style={{ marginTop: 'auto', padding: `var(--orbit-space-base)` }}>
          <Separator />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--orbit-space-s)',
              marginTop: 'var(--orbit-space-base)',
            }}
          >
            <div
              style={{
                width: 'var(--orbit-space-l)',
                height: 'var(--orbit-space-l)',
                borderRadius: '50%',
                backgroundColor: 'var(--orbit-color-chambray)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--orbit-text-xs)',
                fontWeight: 'var(--orbit-font-weight-semibold)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: 'var(--orbit-color-white)',
                lineHeight: 'var(--orbit-leading-tight)',
              }}
            >
              DW
            </div>
            <div>
              <div
                style={{
                  fontSize: 'var(--orbit-text-small-size)',
                  fontWeight: 'var(--orbit-font-weight-medium)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  color: 'var(--orbit-color-white)',
                  lineHeight: 'var(--orbit-leading-tight)',
                }}
              >
                Derek Wong
              </div>
              <div
                style={{
                  fontSize: 'var(--orbit-text-xs)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  color: 'var(--orbit-color-granny-smith)',
                  lineHeight: 'var(--orbit-leading-tight)',
                }}
              >
                Procurement Lead
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'var(--orbit-color-bg-default)',
        }}
      >
        {/* Top header area */}
        <div
          style={{
            padding: `var(--orbit-space-base) var(--orbit-space-m) var(--orbit-space-0)`,
            borderBottom: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
          }}
        >
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Projects & Initiatives', href: '#' },
              { label: 'YRK22 - Yorkshire Water', href: '#' },
              { label: 'YRK22-1109 | Test suppliers' },
            ]}
          />

          {/* Initiative Tabs */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--orbit-space-0)',
              marginTop: 'var(--orbit-space-base)',
              borderBottom: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
            }}
          >
            {initiativeTabs.map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </TabButton>
            ))}
          </div>
        </div>

        {/* Scrollable content area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--orbit-space-m)' }}>
          {/* Secondary toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--orbit-space-base)',
              marginBottom: 'var(--orbit-space-base)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                border: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
                borderRadius: 'var(--orbit-radius-sm)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setSecondaryTab('discovery')}
                style={{
                  padding: `var(--orbit-space-xs) var(--orbit-space-base)`,
                  fontSize: 'var(--orbit-text-body-size)',
                  fontWeight:
                    secondaryTab === 'discovery'
                      ? 'var(--orbit-font-weight-semibold)'
                      : 'var(--orbit-font-weight-regular)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  color:
                    secondaryTab === 'discovery'
                      ? 'var(--orbit-color-text-inverse)'
                      : 'var(--orbit-color-text-primary)',
                  backgroundColor:
                    secondaryTab === 'discovery'
                      ? 'var(--orbit-color-efficio-blue)'
                      : 'var(--orbit-color-bg-default)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  lineHeight: 'var(--orbit-text-body-leading)',
                }}
              >
                Insights &amp; Discovery
              </button>
              <button
                onClick={() => setSecondaryTab('tracker')}
                style={{
                  padding: `var(--orbit-space-xs) var(--orbit-space-base)`,
                  fontSize: 'var(--orbit-text-body-size)',
                  fontWeight:
                    secondaryTab === 'tracker'
                      ? 'var(--orbit-font-weight-semibold)'
                      : 'var(--orbit-font-weight-regular)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  color:
                    secondaryTab === 'tracker'
                      ? 'var(--orbit-color-text-inverse)'
                      : 'var(--orbit-color-text-primary)',
                  backgroundColor:
                    secondaryTab === 'tracker'
                      ? 'var(--orbit-color-efficio-blue)'
                      : 'var(--orbit-color-bg-default)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  lineHeight: 'var(--orbit-text-body-leading)',
                }}
              >
                My Suppliers Tracker
              </button>
            </div>
          </div>

          {/* Search bar + AI Insights */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--orbit-space-s)',
              alignItems: 'center',
              marginBottom: 'var(--orbit-space-base)',
            }}
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <Button variant="Secondary" icon={sparkleIcon}>
              AI Insights
            </Button>
          </div>

          {/* Action bar */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--orbit-space-s)',
              alignItems: 'center',
              marginBottom: 'var(--orbit-space-base)',
            }}
          >
            <Button variant="Secondary" size="Small" icon={switchIcon}>
              Switch Category
            </Button>
            <Button
              variant={showFilters ? 'Primary' : 'Secondary'}
              size="Small"
              icon={filterIcon}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters{activeFilterChips.length > 0 ? ` (${activeFilterChips.length})` : ''}
            </Button>
            <Button
              variant="Secondary"
              size="Small"
              icon={projectsIcon}
              onClick={() => setShowSimilarProjects(true)}
            >
              Suppliers in Similar Projects
            </Button>

            {/* Data state demo toggles */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--orbit-space-xs)' }}>
              <select
                value={dataState}
                onChange={(e) => setDataState(e.target.value as DataState)}
                style={{
                  padding: `var(--orbit-space-xs) var(--orbit-space-s)`,
                  fontSize: 'var(--orbit-text-small-size)',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  border: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
                  borderRadius: 'var(--orbit-radius-sm)',
                  backgroundColor: 'var(--orbit-color-bg-default)',
                  color: 'var(--orbit-color-text-secondary)',
                  cursor: 'pointer',
                  lineHeight: 'var(--orbit-leading-tight)',
                }}
              >
                <option value="typical">Typical (15)</option>
                <option value="loading">Loading</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          {/* Summary metric cards */}
          <div style={{ marginBottom: 'var(--orbit-space-base)' }}>
            <MetricCards metrics={metricCounts} />
          </div>

          {/* View toggle + result count */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--orbit-space-s)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--orbit-text-body-size)',
                fontFamily: 'var(--orbit-font-family-sans)',
                color: 'var(--orbit-color-text-secondary)',
                lineHeight: 'var(--orbit-text-body-leading)',
              }}
            >
              {filteredSuppliers.length} suppliers available in database
            </span>
            <ViewToggle view={view} onViewChange={setView} />
          </div>

          {/* Active filters */}
          <ActiveFilters
            filters={activeFilterChips}
            onRemove={handleRemoveFilter}
            onClearAll={() => setFilters(emptyFilterState)}
          />

          {/* Content area with optional filter panel */}
          <div style={{ display: 'flex', gap: 'var(--orbit-space-base)' }}>
            {/* Filter panel */}
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              visible={showFilters}
              resultCount={filteredSuppliers.length}
            />

            {/* Results */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {displayState === 'loading' && (
                view === 'table' ? (
                  <SupplierTable
                    suppliers={[]}
                    trackedIds={trackedIds}
                    onToggleTrack={handleToggleTrack}
                    onSelectSupplier={setSelectedSupplier}
                    loading
                  />
                ) : (
                  <SupplierCardGrid
                    suppliers={[]}
                    trackedIds={trackedIds}
                    onToggleTrack={handleToggleTrack}
                    onSelectSupplier={setSelectedSupplier}
                    loading
                  />
                )
              )}

              {displayState === 'error' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--orbit-space-mega)',
                    textAlign: 'center',
                    gap: 'var(--orbit-space-base)',
                  }}
                >
                  <div
                    style={{
                      width: 'var(--orbit-space-mega)',
                      height: 'var(--orbit-space-mega)',
                      borderRadius: '50%',
                      backgroundColor: 'var(--orbit-color-status-low-bg-error)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--orbit-text-xl)',
                      color: 'var(--orbit-color-status-low-icon-error)',
                    }}
                  >
                    !
                  </div>
                  <Headings size="Heading 4">Something went wrong</Headings>
                  <p
                    style={{
                      fontSize: 'var(--orbit-text-body-size)',
                      fontFamily: 'var(--orbit-font-family-sans)',
                      color: 'var(--orbit-color-text-secondary)',
                      lineHeight: 'var(--orbit-text-body-leading)',
                      maxWidth: '400px',
                    }}
                  >
                    We were unable to load supplier data. Please check your connection and try again.
                  </p>
                  <Button variant="Primary" onClick={() => setDataState('typical')}>
                    Retry
                  </Button>
                </div>
              )}

              {displayState === 'empty-search' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--orbit-space-mega)',
                    textAlign: 'center',
                    gap: 'var(--orbit-space-base)',
                  }}
                >
                  <div
                    style={{
                      width: 'var(--orbit-space-mega)',
                      height: 'var(--orbit-space-mega)',
                      borderRadius: '50%',
                      backgroundColor: 'var(--orbit-color-light-gray)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--orbit-text-xl)',
                      color: 'var(--orbit-color-mid-gray)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <Headings size="Heading 4">No results found</Headings>
                  <p
                    style={{
                      fontSize: 'var(--orbit-text-body-size)',
                      fontFamily: 'var(--orbit-font-family-sans)',
                      color: 'var(--orbit-color-text-secondary)',
                      lineHeight: 'var(--orbit-text-body-leading)',
                      maxWidth: '400px',
                    }}
                  >
                    No suppliers match &ldquo;{searchQuery}&rdquo;. Try adjusting your search terms or
                    browse all suppliers.
                  </p>
                  <Button variant="Secondary" onClick={() => setSearchQuery('')}>
                    Clear search
                  </Button>
                </div>
              )}

              {displayState === 'empty-filters' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--orbit-space-mega)',
                    textAlign: 'center',
                    gap: 'var(--orbit-space-base)',
                  }}
                >
                  <div
                    style={{
                      width: 'var(--orbit-space-mega)',
                      height: 'var(--orbit-space-mega)',
                      borderRadius: '50%',
                      backgroundColor: 'var(--orbit-color-status-low-bg-warning)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--orbit-text-xl)',
                      color: 'var(--orbit-color-status-low-icon-warning)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 3h12M4 8h8M6 13h4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <Headings size="Heading 4">No suppliers match your filters</Headings>
                  <p
                    style={{
                      fontSize: 'var(--orbit-text-body-size)',
                      fontFamily: 'var(--orbit-font-family-sans)',
                      color: 'var(--orbit-color-text-secondary)',
                      lineHeight: 'var(--orbit-text-body-leading)',
                      maxWidth: '400px',
                    }}
                  >
                    The current combination of filters returned zero results. Try removing some filters
                    or clearing all to see available suppliers.
                  </p>
                  <div style={{ display: 'flex', gap: 'var(--orbit-space-s)' }}>
                    <Button variant="Secondary" onClick={() => setFilters(emptyFilterState)}>
                      Clear all filters
                    </Button>
                    <Button variant="Primary" onClick={() => setShowFilters(true)}>
                      Edit filters
                    </Button>
                  </div>
                </div>
              )}

              {displayState === 'typical' && (
                <>
                  {view === 'table' ? (
                    <SupplierTable
                      suppliers={filteredSuppliers}
                      trackedIds={trackedIds}
                      onToggleTrack={handleToggleTrack}
                      onSelectSupplier={setSelectedSupplier}
                    />
                  ) : (
                    <SupplierCardGrid
                      suppliers={filteredSuppliers}
                      trackedIds={trackedIds}
                      onToggleTrack={handleToggleTrack}
                      onSelectSupplier={setSelectedSupplier}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SupplierDetailModal
        supplier={selectedSupplier}
        isTracked={selectedSupplier ? trackedIds.has(selectedSupplier.id) : false}
        onToggleTrack={handleToggleTrack}
        onClose={() => setSelectedSupplier(null)}
      />

      <SimilarProjectsModal
        visible={showSimilarProjects}
        onClose={() => setShowSimilarProjects(false)}
      />

      {/* Toast */}
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onDismiss={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
