'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Breadcrumb,
  Button,
  Headings,
  Text,
  Separator,
  Card,
  Avatar,
  Chip,
  FaIcon,
  StatusIndicator,
  Badge,
  Toast,
  CountryFlag,
} from '@efficio/orbit';
import { SearchBar } from '@/components/feature/SearchBar';
import { suppliers, type Supplier, type Classification } from '@/data/mock-data';

/* ─── Sidebar config ─── */

const sidebarNavItems = [
  { label: 'Dashboard', icon: 'grid' },
  { label: 'Projects', icon: 'folder' },
  { label: 'Suppliers', icon: 'users', active: true },
  { label: 'Analytics', icon: 'chart' },
  { label: 'Reports', icon: 'file' },
  { label: 'Settings', icon: 'gear' },
];

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

/* ─── Classification → status mapping ─── */

const classificationStatus = (c: Classification) => {
  switch (c) {
    case 'Incumbent': return 'Success' as const;
    case 'Recently Awarded': return 'Information' as const;
    case 'Efficio Engaged': return 'Warning' as const;
    case 'COP Approved': return 'Success' as const;
  }
};

/* ─── Component ─── */

export default function SupplierHomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  /* Derived data */
  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q)
      );
    }
    if (activeCategory) {
      result = result.filter(s => s.category === activeCategory);
    }
    return result;
  }, [searchQuery, activeCategory]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    suppliers.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const metrics = useMemo(() => ({
    total: suppliers.length,
    incumbent: suppliers.filter(s => s.classifications.includes('Incumbent')).length,
    recentlyAwarded: suppliers.filter(s => s.classifications.includes('Recently Awarded')).length,
    large: suppliers.filter(s => s.companySize === 'Large').length,
  }), []);

  const handleContact = useCallback((supplier: Supplier) => {
    setToast({ visible: true, message: `Contact request sent to ${supplier.name}` });
  }, []);

  /* ─── Table styles ─── */

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 12, fontWeight: 600,
    textTransform: 'uppercase', color: 'var(--orbit-color-text-secondary)',
    padding: 'var(--orbit-space-s) var(--orbit-space-base)', textAlign: 'left',
    borderBottom: '1px solid var(--orbit-color-card-border-default)', whiteSpace: 'nowrap',
  };

  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14,
    color: 'var(--orbit-color-text-primary)', padding: 'var(--orbit-space-s) var(--orbit-space-base)',
    borderBottom: '1px solid var(--orbit-color-card-border-default)', verticalAlign: 'middle',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 200, minWidth: 200, backgroundColor: 'var(--orbit-color-black-pearl)',
        color: 'var(--orbit-color-text-inverse)', display: 'flex', flexDirection: 'column',
        padding: 'var(--orbit-space-m) 0',
      }}>
        {/* Logo */}
        <div style={{
          padding: 'var(--orbit-space-base) var(--orbit-space-base) var(--orbit-space-m)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: 'var(--orbit-space-base)',
        }}>
          <div style={{
            fontFamily: 'var(--orbit-font-family-brand)',
            fontSize: 'var(--orbit-text-lg)',
            fontWeight: 'var(--orbit-font-weight-bold)' as unknown as number,
            color: 'var(--orbit-color-bright-green)',
            lineHeight: 'var(--orbit-leading-tight)',
          }}>Orbit</div>
          <div style={{
            fontSize: 'var(--orbit-text-xs)',
            fontFamily: 'var(--orbit-font-family-sans)',
            color: 'var(--orbit-color-tiara)',
            marginTop: 'var(--orbit-space-xxs)',
          }}>Connected Platform</div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xxs)' }}>
          {sidebarNavItems.map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)',
                padding: 'var(--orbit-space-s) var(--orbit-space-base)',
                fontSize: 'var(--orbit-text-body-size)',
                fontFamily: 'var(--orbit-font-family-sans)',
                fontWeight: item.active ? 'var(--orbit-font-weight-semibold)' as unknown as number : 'var(--orbit-font-weight-regular)' as unknown as number,
                color: item.active ? 'var(--orbit-color-bright-green)' : 'var(--orbit-color-tiara)',
                backgroundColor: item.active ? 'rgba(0, 189, 158, 0.1)' : 'transparent',
                borderLeft: item.active ? '3px solid var(--orbit-color-bright-green)' : '3px solid transparent',
                cursor: 'pointer',
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

        {/* User */}
        <div style={{ marginTop: 'auto', padding: 'var(--orbit-space-base)' }}>
          <Separator />
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)',
            padding: 'var(--orbit-space-base) 0 0',
          }}>
            <Avatar name="Sarah Chen" size="Small" />
            <div>
              <div style={{
                fontSize: 'var(--orbit-text-sm)',
                fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number,
                color: 'var(--orbit-color-text-inverse)',
              }}>Sarah Chen</div>
              <div style={{ fontSize: 'var(--orbit-text-xs)', color: 'var(--orbit-color-tiara)' }}>Procurement Lead</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          backgroundColor: 'var(--orbit-color-white)',
          padding: 'var(--orbit-space-base) var(--orbit-space-m)',
          borderBottom: '1px solid var(--orbit-color-card-border-default)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Suppliers' }]} />
          <div style={{ display: 'flex', gap: 'var(--orbit-space-s)', alignItems: 'center' }}>
            <Button variant="Secondary" size="Small">Export</Button>
            <Button variant="Primary" size="Small">Add Supplier</Button>
          </div>
        </div>

        {/* Content */}
        <main style={{ flex: 1, padding: 'var(--orbit-space-m)', overflow: 'auto', backgroundColor: 'var(--orbit-color-card-bg-accent)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-m)' }}>

            {/* Page title */}
            <div>
              <Headings size="Heading 2">Suppliers</Headings>
              <Text variant="Secondary" size="Paragraph">Manage and view your supplier network across all categories.</Text>
            </div>

            {/* ── KPI Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--orbit-space-base)' }}>
              {[
                { label: 'Total Suppliers', value: metrics.total, icon: '\uf0c0', color: 'var(--orbit-color-efficio-blue)' },
                { label: 'Incumbent', value: metrics.incumbent, icon: '\uf058', color: 'var(--orbit-color-status-high-bg-success)' },
                { label: 'Recently Awarded', value: metrics.recentlyAwarded, icon: '\uf005', color: 'var(--orbit-color-status-high-bg-information)' },
                { label: 'Enterprise (Large)', value: metrics.large, icon: '\uf1ad', color: 'var(--orbit-color-status-high-bg-warning)' },
              ].map(kpi => (
                <Card key={kpi.label} state="Default" padding="Base">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 'var(--orbit-radius-md)',
                      backgroundColor: 'var(--orbit-color-card-bg-accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <FaIcon icon={kpi.icon} size={18} color={kpi.color} />
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--orbit-font-family-sans)', fontSize: 24,
                        fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number,
                        color: 'var(--orbit-color-text-heading)', lineHeight: 1,
                      }}>{kpi.value}</div>
                      <Text variant="Secondary" size="Small">{kpi.label}</Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* ── Search + Category filters ── */}
            <Card state="Default" padding="Base">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
                <div style={{ maxWidth: 480 }}>
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                </div>
                <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
                  <div style={{ cursor: 'pointer' }} onClick={() => setActiveCategory(null)}>
                    <Chip label={`All (${suppliers.length})`} variant={activeCategory === null ? 'Information' : 'Outline'} size="Small" />
                  </div>
                  {categories.map(([cat, count]) => (
                    <div key={cat} style={{ cursor: 'pointer' }} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}>
                      <Chip label={`${cat} (${count})`} variant={activeCategory === cat ? 'Information' : 'Outline'} size="Small" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ── Supplier Table ── */}
            <Card state="Default" padding="Base">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Headings size="Heading 4">{filteredSuppliers.length} Suppliers</Headings>
                  <Badge label={`${filteredSuppliers.length} results`} status="Green" />
                </div>

                {filteredSuppliers.length > 0 ? (
                  <div style={{ border: '1px solid var(--orbit-color-card-border-default)', borderRadius: 8, overflow: 'hidden', backgroundColor: 'var(--orbit-color-white)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--orbit-color-card-bg-accent)' }}>
                          <th style={thStyle}>Supplier</th>
                          <th style={thStyle}>Category</th>
                          <th style={thStyle}>Region / Country</th>
                          <th style={thStyle}>Size</th>
                          <th style={thStyle}>Classifications</th>
                          <th style={thStyle}>Certifications</th>
                          <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSuppliers.map(supplier => (
                          <tr
                            key={supplier.id}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-bg-hover)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-white)'; }}
                            onClick={() => setSelectedSupplier(supplier)}
                          >
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                                <Avatar name={supplier.name} size="Small" />
                                <span style={{ fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number }}>{supplier.name}</span>
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <Chip label={supplier.category} variant="Outline" size="Small" />
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                                <CountryFlag country={supplier.country} />
                                <span>{supplier.country}, {supplier.region}</span>
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <Chip label={supplier.companySize} variant={supplier.companySize === 'Large' ? 'Information' : supplier.companySize === 'Medium' ? 'Warning' : 'No Status'} size="Small" />
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
                                {supplier.classifications.map(c => (
                                  <StatusIndicator key={c} status={classificationStatus(c)} label={c} size="Small" />
                                ))}
                              </div>
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap' }}>
                                {supplier.certifications.slice(0, 2).map(cert => (
                                  <Chip key={cert} label={cert} variant="Success" size="Mini" />
                                ))}
                                {supplier.certifications.length > 2 && (
                                  <Chip label={`+${supplier.certifications.length - 2}`} variant="Outline" size="Mini" />
                                )}
                              </div>
                            </td>
                            <td style={{ ...tdStyle, textAlign: 'right' }}>
                              <span onClick={e => e.stopPropagation()}>
                                <Button variant="Secondary" size="Small" onClick={() => handleContact(supplier)}>
                                  Contact
                                </Button>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '48px 24px', gap: 'var(--orbit-space-base)',
                    border: '1px solid var(--orbit-color-card-border-default)', borderRadius: 8,
                    backgroundColor: 'var(--orbit-color-white)',
                  }}>
                    <FaIcon icon={'\uf0c0'} size={40} color="var(--orbit-color-silver)" />
                    <Headings size="Heading 5">No suppliers found</Headings>
                    <Text variant="Secondary" size="Paragraph">Try adjusting your search or category filter.</Text>
                  </div>
                )}
              </div>
            </Card>

          </div>
        </main>
      </div>

      {/* ── Supplier Detail Drawer ── */}
      {selectedSupplier && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', justifyContent: 'flex-end' }}
          onClick={() => setSelectedSupplier(null)}
        >
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(4, 9, 33, 0.5)' }} />
          <div
            style={{
              position: 'relative', width: 480, backgroundColor: 'var(--orbit-color-white)',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: 'var(--orbit-space-m)', borderBottom: '1px solid var(--orbit-color-card-border-default)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', gap: 'var(--orbit-space-base)' }}>
                <Avatar name={selectedSupplier.name} size="Large" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Headings size="Heading 4">{selectedSupplier.name}</Headings>
                  <Text variant="Secondary" size="Paragraph">{selectedSupplier.category}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                    <CountryFlag country={selectedSupplier.country} />
                    <Text variant="Secondary" size="Small">{selectedSupplier.country}, {selectedSupplier.region}</Text>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <FaIcon icon={'\uf00d'} size={16} color="var(--orbit-color-text-secondary)" />
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, overflow: 'auto', padding: 'var(--orbit-space-m)', display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-m)' }}>
              <div>
                <Text variant="Bold" size="Paragraph">Classifications</Text>
                <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap', marginTop: 'var(--orbit-space-xs)' }}>
                  {selectedSupplier.classifications.map(c => (
                    <StatusIndicator key={c} status={classificationStatus(c)} label={c} />
                  ))}
                </div>
              </div>

              <Separator />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--orbit-space-base)' }}>
                <div>
                  <Text variant="Secondary" size="Small">Company Size</Text>
                  <Text variant="Primary" size="Paragraph">{selectedSupplier.companySize}</Text>
                </div>
                <div>
                  <Text variant="Secondary" size="Small">Region</Text>
                  <Text variant="Primary" size="Paragraph">{selectedSupplier.region}</Text>
                </div>
              </div>

              <Separator />

              <div>
                <Text variant="Bold" size="Paragraph">Certifications</Text>
                <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', flexWrap: 'wrap', marginTop: 'var(--orbit-space-xs)' }}>
                  {selectedSupplier.certifications.length > 0 ? (
                    selectedSupplier.certifications.map(cert => (
                      <Chip key={cert} label={cert} variant="Success" size="Small" />
                    ))
                  ) : (
                    <Text variant="Secondary" size="Small">No certifications on record</Text>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Text variant="Bold" size="Paragraph">About</Text>
                <div style={{ marginTop: 'var(--orbit-space-xs)' }}>
                  <Text variant="Primary" size="Paragraph">{selectedSupplier.description}</Text>
                </div>
              </div>
            </div>

            {/* Drawer footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: 'var(--orbit-space-base) var(--orbit-space-m)',
              borderTop: '1px solid var(--orbit-color-card-border-default)',
              flexShrink: 0,
            }}>
              <Button variant="Secondary" onClick={() => setSelectedSupplier(null)}>Close</Button>
              <Button variant="Primary" onClick={() => handleContact(selectedSupplier)}>Contact Supplier</Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
        <Toast
          type="Success"
          message={toast.message}
          visible={toast.visible}
          onDismiss={() => setToast(prev => ({ ...prev, visible: false }))}
        />
      </div>
    </div>
  );
}
