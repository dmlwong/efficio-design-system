'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SideNav,
  PageHeader,
  Card,
  Headings,
  Text,
  Button,
  Dropdown,
  FaIcon,
  Chip,
  Toast,
  Overlay,
  IconButton,
  DocumentGlyph,
  InlineBanner,
  TextArea,
} from '@efficio/orbit';

/* ─── Types ─── */

interface Submission {
  id: string;
  playbookName: string;
  company: string;
  category: string;
  status: 'Pending' | 'Awaiting Review' | 'Published';
  dateCreated: string;
}

type SecondaryInputType = 'contract_template' | 'preset_csv' | null;
type SortField = 'playbookName' | 'company' | 'category' | 'status' | 'dateCreated';
type SortDir = 'asc' | 'desc';

/* ─── Helpers ─── */

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

const validateFile = (file: File, allowedExtensions: string[]): string | null => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!allowedExtensions.includes(ext)) {
    return `This file type isn't supported. Please upload a ${allowedExtensions.map(e => e.toUpperCase()).join(' or ')} file.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'This file is too large. Maximum upload size is 100 MB.';
  }
  return null;
};

const statusChipVariant = (s: Submission['status']) => {
  switch (s) {
    case 'Pending': return 'Warning' as const;
    case 'Awaiting Review': return 'Warning' as const;
    case 'Published': return 'Success' as const;
  }
};

const INITIAL_ROWS: Submission[] = [
  { id: '1', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Pending', dateCreated: '15/12/2024' },
  { id: '2', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Pending', dateCreated: '15/12/2024' },
  { id: '3', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Awaiting Review', dateCreated: '15/12/2024' },
  { id: '4', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024' },
  { id: '5', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024' },
  { id: '6', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024' },
  { id: '7', playbookName: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024' },
];

let nextId = 100;

/* ─── Component ─── */

export default function BestPracticePage() {
  /* Table state */
  const [rows, setRows] = useState<Submission[]>(INITIAL_ROWS);
  const [sortField, setSortField] = useState<SortField>('dateCreated');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  /* Modal state */
  const [isOpen, setIsOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [playbookFile, setPlaybookFile] = useState<File | null>(null);
  const [secondaryInputType, setSecondaryInputType] = useState<SecondaryInputType>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [modalCompany, setModalCompany] = useState<string | null>(null);

  /* Error state */
  const [playbookError, setPlaybookError] = useState<string | null>(null);
  const [secondaryError, setSecondaryError] = useState<string | null>(null);

  /* Detail modal state */
  const [detailOpen, setDetailOpen] = useState(false);

  /* Toast state */
  const [toastVisible, setToastVisible] = useState(false);

  /* Refs */
  const playbookInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const secondaryDropzoneRef = useRef<HTMLDivElement>(null);

  /* ── Lock background scroll when modal is open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Sort logic ── */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedRows = [...rows].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const cmp = aVal.localeCompare(bVal);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const filteredRows = sortedRows;

  /* ── Modal handlers ── */
  const resetModal = () => {
    setModalStep(1);
    setPlaybookFile(null);
    setSecondaryInputType(null);
    setSecondaryFile(null);
    setModalCategory(null);
    setModalCompany(null);
    setPlaybookError(null);
    setSecondaryError(null);
  };

  const handleOpenModal = () => {
    resetModal();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    resetModal();
  };

  const handlePlaybookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateFile(file, ['pdf']);
    if (error) { setPlaybookError(error); return; }
    setPlaybookError(null);
    setPlaybookFile(file);
  };

  const handleSecondaryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedExts = secondaryInputType === 'contract_template' ? ['pdf'] : ['csv'];
    const error = validateFile(file, allowedExts);
    if (error) { setSecondaryError(error); return; }
    setSecondaryError(null);
    setSecondaryFile(file);
  };

  const handleSubmit = () => {
    const newRow: Submission = {
      id: String(nextId++),
      playbookName: playbookFile?.name.replace(/\.pdf$/i, '') ?? 'Untitled',
      company: modalCompany ?? 'Unknown',
      category: modalCategory ?? 'Uncategorized',
      status: 'Pending',
      dateCreated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };
    setRows(prev => [newRow, ...prev]);
    handleCloseModal();
    setToastVisible(true);
  };

  const handleDelete = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  /* ── Sort icon ── */
  const SortIcon = ({ field }: { field: SortField }) => (
    <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.4 }}>
      <FaIcon icon={sortField === field && sortDir === 'desc' ? '\uf0dd' : '\uf0de'} size={10} color="var(--orbit-color-text-secondary)" />
    </span>
  );

  /* ── File dropzone component ── */
  const FileDropzone = ({ inputId, inputRef, accept, onFileChange, fileTypeLabel }: { inputId: string; inputRef?: React.RefObject<HTMLInputElement>; accept: string; onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void; fileTypeLabel?: string }) => (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 'var(--orbit-space-s)', paddingTop: 'var(--orbit-space-base)', paddingBottom: 'var(--orbit-space-l)',
        border: '2px dashed var(--orbit-color-card-border-accent)',
        borderRadius: 'var(--orbit-space-s)', backgroundColor: 'var(--orbit-color-card-bg-accent)',
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
          const fakeEvt = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
          onFileChange(fakeEvt);
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64 }}>
        <FaIcon icon={'\ue09a'} size={32} color="var(--orbit-color-dove-gray)" />
      </div>
      <input type="file" accept={accept} id={inputId} ref={inputRef} style={{ display: 'none' }} onChange={onFileChange} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
        <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-medium)', color: 'var(--orbit-color-text-primary)' }}>
          Drag &amp; drop or choose file
        </span>
        <label htmlFor={inputId} style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-medium)', color: 'var(--orbit-color-btn-tertiary-fg)', textDecoration: 'underline', cursor: 'pointer' }}>
          choose files
        </label>
        <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-medium)', color: 'var(--orbit-color-text-primary)' }}>
          to upload
        </span>
      </div>
      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-primary)', lineHeight: '24px' }}>File types supported: {fileTypeLabel ?? 'PDF'}</span>
      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-primary)', lineHeight: '24px' }}>Maximum upload file size: 100 MB</span>
    </div>
  );

  /* ── Uploaded file row (matches Figma "File Uploaded" design) ── */
  const FileRow = ({ name, onRemove }: { name: string; onRemove?: () => void }) => {
    const ext = name.split('.').pop()?.toUpperCase() ?? '';
    const docType = (['XLS', 'DOC', 'PDF', 'ZIP', 'IMG'].includes(ext) ? ext : 'Unknown') as 'XLS' | 'DOC' | 'PDF' | 'ZIP' | 'IMG' | 'Unknown';
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <span style={{
          fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)',
          fontWeight: 'var(--orbit-font-weight-semibold)', color: 'var(--orbit-color-text-primary)',
          lineHeight: '16px',
        }}>File Uploaded</span>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 32, padding: '0 var(--orbit-space-base)',
          border: '1px solid var(--orbit-color-silver)',
          borderRadius: 4, backgroundColor: 'var(--orbit-color-white)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DocumentGlyph documentType={docType} size="Extra Small" />
            <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-heading)' }}>{name}</span>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label="Remove file"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaIcon icon={'\uf2ed'} size={14} color="var(--orbit-color-text-secondary)" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  /* ── Unique company values for filter ── */
  const companyOptions = Array.from(new Set(rows.map(r => r.company))).map(c => ({ label: c, value: c }));
  const categoryOptions = Array.from(new Set(rows.map(r => r.category))).map(c => ({ label: c, value: c }));

  /* ── Table header style ── */
  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    color: 'var(--orbit-color-text-secondary)',
    padding: 'var(--orbit-space-s) var(--orbit-space-base)',
    textAlign: 'left',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--orbit-color-card-border-default)',
  };

  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)',
    fontSize: 14,
    color: 'var(--orbit-color-text-primary)',
    padding: 'var(--orbit-space-s) var(--orbit-space-base)',
    borderBottom: '1px solid var(--orbit-color-card-border-default)',
  };

  return (
    <div data-theme="orbit" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--orbit-font-family-sans)' }}>
      {/* Sidebar */}
      <SideNav
        appName="Efficio Orbit"
        clientName="Yorkshire Water"
        navItems={[
          { id: 'notifications', icon: '\uf0f3', label: 'Notifications', badge: 1 },
          { id: 'home', icon: '\uf015', label: 'Home', active: true },
          { id: 'data-tracker-insights', icon: '\uf1c0', label: 'Data Tracker & Insights' },
          { id: 'document-search', icon: '\uf15c', label: 'Document Search' },
        ]}
        sections={[
          { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)' },
          { id: 'deliver', label: 'Deliver', color: 'var(--orbit-color-header-deliver-from)' },
          { id: 'sustain', label: 'Sustain', color: 'var(--orbit-color-header-sustain-from)' },
        ]}
        workItems={[
          { id: 'research-agent', title: 'Research Agent (2)', subtitle: '1min ago' },
          { id: 'route-recommendation', title: 'Route Recommendation', subtitle: '2h ago | Legal Tech Platform Up...' },
          { id: 'spend-guard', title: 'Spend Guard', subtitle: '3h ago | Legal Tech Platform Up...' },
          { id: 'rfp-analytics', title: 'RFP Analytics', subtitle: '6h ago | Fleet Cost Optimitisatio...' },
          { id: 'clause-iq', title: 'Clause IQ', subtitle: '1d ago | Fleet Cost Optimitisatio...' },
        ]}
        userName="Chris Hurley"
        userInitials="CH"
      />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--orbit-color-card-bg-accent)' }}>
        {/* Header */}
        <PageHeader
          type="main"
          title="Data Tracker & Insights"
          subtitle="Here's your overview for today"
          tabs={[
            { label: 'Insights' },
            { label: 'Data Overview' },
          ]}
          defaultActiveTab={1}
          showTabUnderline={true}
        />

        {/* Content */}
        <main style={{ flex: 1, padding: 'var(--orbit-space-m)', overflow: 'auto' }}>
          <Card state="Default" padding="Base">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>

              {/* Title row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Headings size="Heading 4">Best Practice Library</Headings>
                  <Text variant="Primary" size="Paragraph">
                    Manage your contract playbooks and best practice tables.
                  </Text>
                </div>
                <div style={{ display: 'flex', gap: 'var(--orbit-space-s)' }}>
                  <Button
                    variant="Secondary"
                    icon={<FaIcon icon={'\uf067'} size={14} color="var(--orbit-color-text-primary)" />}
                  >
                    Add Parameters
                  </Button>
                  <Button
                    variant="Primary"
                    icon={<FaIcon icon={'\uf067'} size={14} color="var(--orbit-color-white)" />}
                    onClick={handleOpenModal}
                  >
                    Add New Playbook
                  </Button>
                </div>
              </div>

              {/* Table */}
              {filteredRows.length > 0 ? (
                <div style={{ border: '1px solid var(--orbit-color-card-border-default)', borderRadius: 8, overflow: 'hidden', backgroundColor: 'var(--orbit-color-white)', marginTop: 8 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle} onClick={() => handleSort('playbookName')}>Playbook Name <SortIcon field="playbookName" /></th>
                        <th style={thStyle} onClick={() => handleSort('company')}>Company <SortIcon field="company" /></th>
                        <th style={thStyle} onClick={() => handleSort('category')}>Category <SortIcon field="category" /></th>
                        <th style={thStyle} onClick={() => handleSort('status')}>Status <SortIcon field="status" /></th>
                        <th style={thStyle} onClick={() => handleSort('dateCreated')}>Date Created <SortIcon field="dateCreated" /></th>
                        <th style={{ ...thStyle, cursor: 'default' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {filteredRows.map(row => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0, backgroundColor: 'var(--orbit-color-white)' }}
                            animate={{ opacity: 1, backgroundColor: 'var(--orbit-color-white)' }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ cursor: 'default' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-bg-hover)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-white)'; }}
                          >
                            <td style={tdStyle}>{row.playbookName}</td>
                            <td style={tdStyle}>{row.company}</td>
                            <td style={tdStyle}><Chip label={row.category} variant="Information" size="Mini" /></td>
                            <td style={tdStyle}>
                              <Chip label={row.status} variant={statusChipVariant(row.status)} size="Mini" />
                            </td>
                            <td style={tdStyle}>{row.dateCreated}</td>
                            <td style={{ ...tdStyle, display: 'flex', gap: 'var(--orbit-space-xs)' }}>
                              {row.status === 'Awaiting Review' && (
                                <Button variant="Primary" size="Small" onClick={() => setDetailOpen(true)}>Review</Button>
                              )}
                              {row.status === 'Published' && (
                                <IconButton
                                  variant="Tertiary"
                                  size="Small"
                                  icon={<FaIcon icon={'\uf044'} size={14} color="var(--orbit-color-text-secondary)" />}
                                  ariaLabel="Edit"
                                  onClick={() => setDetailOpen(true)}
                                />
                              )}
                              <IconButton
                                variant="Tertiary"
                                size="Small"
                                icon={<FaIcon icon={'\uf2ed'} size={14} color="var(--orbit-color-text-secondary)" />}
                                ariaLabel="Delete"
                                onClick={() => handleDelete(row.id)}
                              />
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty state */
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 'var(--orbit-space-base)',
                  padding: '40px 24px',
                  border: '1px solid var(--orbit-color-card-border-default)',
                  borderRadius: 8,
                  backgroundColor: 'var(--orbit-color-white)',
                  marginTop: 8,
                }}>
                  <div style={{ position: 'relative', width: 308, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                      width: 308, height: 64,
                      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.08) 0%, transparent 70%)',
                      borderRadius: '50%',
                    }} />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FaIcon icon={'\uf15c'} size={40} color="#5b8efd" />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FaIcon icon={'\uf07c'} size={32} color="#ff9a0d" />
                        <FaIcon icon={'\uf002'} size={20} color="#01968a" />
                      </div>
                      <FaIcon icon={'\uf4fc'} size={44} color="#615fff" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Headings size="Heading 5">No Playbooks Yet</Headings>
                    <Text variant="Primary" size="Paragraph">
                      Create your first submission to generate a Best Practice Table.
                    </Text>
                  </div>
                </div>
              )}

            </div>
          </Card>
        </main>
      </div>

      {/* ── New Playbook Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <Overlay visible={isOpen} onClose={handleCloseModal}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Sticky Header ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--orbit-space-base)', flexShrink: 0, borderBottom: '1px solid var(--orbit-color-card-border-default)' }}>
                <Headings size="Heading 3">New Playbook</Headings>
                <button
                  onClick={handleCloseModal}
                  aria-label="Close"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32,
                    padding: 0, flexShrink: 0,
                  }}
                >
                  <FaIcon icon={'\uf00d'} size={16} color="var(--orbit-color-text-heading)" />
                </button>
              </div>

              {/* ── Scrollable Body ── */}
              <div ref={modalBodyRef} style={{ flex: '1 1 0', minHeight: 0, overflowY: 'auto', overflowX: 'hidden', padding: 'var(--orbit-space-base) var(--orbit-space-base) var(--orbit-space-m)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-m)' }}>

              {/* ── Stepper ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                {/* Step 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: modalStep > 1 ? 'var(--orbit-color-status-high-bg-success)' : 'var(--orbit-color-btn-primary-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {modalStep > 1 ? (
                      <FaIcon icon={'\uf00c'} size={14} color="var(--orbit-color-white)" />
                    ) : (
                      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16, color: 'var(--orbit-color-white)' }}>1</span>
                    )}
                  </div>
                  <span style={{
                    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)',
                    color: 'var(--orbit-color-text-primary)',
                  }}>Upload Playbook</span>
                </div>
                {/* Separator line */}
                <div style={{ flex: 1, height: 1, backgroundColor: 'var(--orbit-color-card-border-default)' }} />
                {/* Step 2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)', flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: modalStep >= 2 ? 'var(--orbit-color-btn-primary-bg)' : 'var(--orbit-color-silver)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'var(--orbit-font-family-sans)', fontSize: 16,
                      color: modalStep >= 2 ? 'var(--orbit-color-white)' : 'var(--orbit-color-text-disabled)',
                    }}>2</span>
                  </div>
                  <span style={{
                    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)',
                    color: modalStep >= 2 ? 'var(--orbit-color-text-primary)' : 'var(--orbit-color-text-disabled)',
                  }}>Configure &amp; Submit</span>
                </div>
              </div>

              {/* ── Step 1: Upload Playbook ── */}
              {modalStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Error banner */}
                  {playbookError && <InlineBanner variant="Error" contrast="Low" label={playbookError} />}

                  {/* Section heading + description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xs)' }}>
                    <Headings size="Heading 5">1. Upload Playbook</Headings>
                    <Text variant="Secondary" size="Paragraph">
                      Upload a contract playbook and either a contract template or preset clauses CSV to generate a Best Practice Table.
                    </Text>
                  </div>

                  {/* File upload card */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)',
                    padding: 'var(--orbit-space-base)',
                    border: '1px solid var(--orbit-color-card-border-default)',
                    borderRadius: 'var(--orbit-radius-md)',
                    backgroundColor: 'var(--orbit-color-white)',
                  }}>
                    <input type="file" accept=".pdf" id="playbook-upload" ref={playbookInputRef} style={{ display: 'none' }} onChange={handlePlaybookUpload} />
                    <AnimatePresence mode="wait" initial={false}>
                      {!playbookFile ? (
                        <motion.div
                          key="playbook-dropzone"
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ height: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.1 } }}
                        >
                          <FileDropzone inputId="playbook-upload" accept=".pdf" onFileChange={handlePlaybookUpload} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="playbook-file"
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ height: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.1 } }}
                        >
                          <FileRow name={playbookFile.name} onRemove={() => { setPlaybookFile(null); setPlaybookError(null); if (playbookInputRef.current) playbookInputRef.current.value = ''; }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* ── Step 2: Configure & Submit ── */}
              {modalStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Error banner */}
                  {secondaryError && <InlineBanner variant="Error" contrast="Low" label={secondaryError} />}

                  {/* Section heading + description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xs)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                      <Headings size="Heading 5">2. Configure &amp; Submit</Headings>
                      <Chip label="Optional" variant="Outline" size="Mini" />
                    </div>
                    <Text variant="Secondary" size="Paragraph">
                      Refine the analysis by adding a category, company, or secondary document.
                    </Text>
                  </div>

                  {/* Category dropdown */}
                  <div>
                    <div id="playbook-category-label" style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-semibold)', color: 'var(--orbit-color-text-primary)', lineHeight: '16px', marginBottom: 4 }}>Category</div>
                    <Dropdown ariaLabelledBy="playbook-category-label" placeholder="Please Select..." options={categoryOptions} value={modalCategory ?? ''} onChange={(val: string) => setModalCategory(val)} />
                  </div>

                  {/* Company dropdown */}
                  <div>
                    <div id="playbook-company-label" style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-semibold)', color: 'var(--orbit-color-text-primary)', lineHeight: '16px', marginBottom: 4 }}>Company</div>
                    <Dropdown ariaLabelledBy="playbook-company-label" placeholder="Please Select..." options={companyOptions} value={modalCompany ?? ''} onChange={(val: string) => setModalCompany(val)} />
                  </div>

                  {/* Upload File section */}
                  <div style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-semibold)', color: 'var(--orbit-color-text-primary)' }}>Upload File</div>

                  {/* Upload File card with radio + dropzone */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)',
                    padding: 'var(--orbit-space-base)',
                    border: '1px solid var(--orbit-color-card-border-default)',
                    borderRadius: 'var(--orbit-radius-md)',
                    backgroundColor: 'var(--orbit-color-white)',
                  }}>
                    {/* Radio option cards */}
                    <div style={{ display: 'flex', gap: 'var(--orbit-space-s)' }}>
                      {(['contract_template', 'preset_csv'] as const).map(type => {
                        const isSelected = secondaryInputType === type;
                        const title = type === 'contract_template' ? 'Contract Template' : 'Preset Clauses CSV';
                        const desc = type === 'contract_template' ? 'Upload a contract template document' : 'Upload a CSV with clause data';
                        return (
                          <button
                            key={type}
                            onClick={() => { setSecondaryInputType(type); setSecondaryFile(null); setSecondaryError(null); }}
                            style={{
                              flex: 1, padding: 'var(--orbit-space-s)',
                              border: isSelected ? '2px solid var(--orbit-color-btn-primary-bg)' : '1px solid var(--orbit-color-card-border-default)',
                              borderRadius: 'var(--orbit-radius-sm)',
                              backgroundColor: 'var(--orbit-color-white)',
                              fontFamily: 'var(--orbit-font-family-sans)',
                              color: 'var(--orbit-color-text-primary)', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)',
                              textAlign: 'left',
                            }}
                          >
                            <span style={{
                              width: 15, height: 15, borderRadius: '50%', flexShrink: 0,
                              border: isSelected ? '5px solid var(--orbit-color-btn-primary-bg)' : '2px solid var(--orbit-color-silver)',
                              display: 'inline-block', boxSizing: 'border-box',
                            }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xxs)' }}>
                              <span style={{ fontSize: 'var(--orbit-text-sm)', fontWeight: 'var(--orbit-font-weight-semibold)' }}>{title}</span>
                              <span style={{ fontSize: 'var(--orbit-text-xs)', color: 'var(--orbit-color-text-secondary)', fontWeight: 'var(--orbit-font-weight-regular)' }}>{desc}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* File upload dropzone */}
                    <AnimatePresence mode="wait" initial={false}>
                      {secondaryInputType && !secondaryFile && (
                        <motion.div
                          ref={secondaryDropzoneRef}
                          key="sec-dropzone"
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ height: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.1 } }}
                          onAnimationComplete={(def) => {
                            if (def === 'animate' || (typeof def === 'object' && 'opacity' in def)) {
                              secondaryDropzoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                        >
                          <FileDropzone
                            inputId="secondary-upload"
                            inputRef={secondaryInputRef}
                            accept={secondaryInputType === 'contract_template' ? '.pdf' : '.csv'}
                            onFileChange={handleSecondaryUpload}
                            fileTypeLabel={secondaryInputType === 'contract_template' ? 'PDF' : 'CSV'}
                          />
                        </motion.div>
                      )}
                      {secondaryFile && (
                        <motion.div
                          key="sec-file"
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          transition={{ height: { duration: 0.3, ease: 'easeInOut' }, opacity: { duration: 0.2, delay: 0.1 } }}
                        >
                          <FileRow name={secondaryFile.name} onRemove={() => { setSecondaryFile(null); setSecondaryError(null); if (secondaryInputRef.current) secondaryInputRef.current.value = ''; }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              </div></div>
              {/* ── End Scrollable Body ── */}

              {/* ── Sticky Footer ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--orbit-space-base)', borderTop: '1px solid var(--orbit-color-card-border-default)', flexShrink: 0 }}>
                {modalStep === 1 ? (
                  <Button variant="Secondary" onClick={handleCloseModal}>Cancel</Button>
                ) : (
                  <Button variant="Secondary" onClick={() => setModalStep(1)}>Back</Button>
                )}
                {modalStep === 1 ? (
                  <Button
                    variant="Primary"
                    state={playbookFile ? 'Default' : 'Disabled'}
                    onClick={playbookFile ? () => setModalStep(2) : undefined}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="Primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </motion.div>
          </Overlay>
        )}
      </AnimatePresence>

      {/* ── Playbook Detail Modal (overlay on current page) ── */}
      {detailOpen && <PlaybookDetailModal onClose={() => setDetailOpen(false)} />}

      {/* Toast */}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999 }}>
        <Toast
          type="Success"
          message="You have successfully submitted a playbook for review"
          visible={toastVisible}
          onDismiss={() => setToastVisible(false)}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Playbook Detail Modal — rendered inline as overlay
   ═══════════════════════════════════════════════════════════ */

interface ClauseRow {
  id: string;
  clauseName: string;
  subClauseName: string;
  subClauseDescription: string;
  bestPractice: string;
}

const DEMO_CLAUSES: ClauseRow[] = Array.from({ length: 37 }, (_, i) => ({
  id: String(i + 1),
  clauseName: 'Confidentiality',
  subClauseName: 'Non-Disclosure Obligations',
  subClauseDescription: 'Obligations of receiving party to protect confidential information.',
  bestPractice: 'Require mutual NDA with standard terms and specific carve-outs for pre-existing information.',
}));

let nextClauseId = 200;

function PlaybookDetailModal({ onClose }: { onClose: () => void }) {
  const [clauses, setClauses] = React.useState<ClauseRow[]>(DEMO_CLAUSES);
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(clauses.length / pageSize);
  const paginatedClauses = clauses.slice((page - 1) * pageSize, page * pageSize);

  const [isAddClauseOpen, setIsAddClauseOpen] = React.useState(false);
  const [newClauseName, setNewClauseName] = React.useState('');
  const [newSubClauseName, setNewSubClauseName] = React.useState('');
  const [newSubClauseDesc, setNewSubClauseDesc] = React.useState('');
  const [newBestPractice, setNewBestPractice] = React.useState('');

  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAddClause = () => {
    setClauses(prev => [...prev, {
      id: String(nextClauseId++),
      clauseName: newClauseName || 'Untitled',
      subClauseName: newSubClauseName || '',
      subClauseDescription: newSubClauseDesc || '',
      bestPractice: newBestPractice || '',
    }]);
    setNewClauseName(''); setNewSubClauseName(''); setNewSubClauseDesc(''); setNewBestPractice('');
    setIsAddClauseOpen(false);
  };

  const thStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 12, fontWeight: 600,
    textTransform: 'uppercase', color: 'var(--orbit-color-text-secondary)',
    padding: 'var(--orbit-space-s) var(--orbit-space-base)', textAlign: 'left',
    whiteSpace: 'nowrap', borderBottom: '1px solid var(--orbit-color-card-border-default)',
  };

  const tdStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 14,
    color: 'var(--orbit-color-text-primary)', padding: 'var(--orbit-space-s) var(--orbit-space-base)',
    borderBottom: '1px solid var(--orbit-color-card-border-default)', verticalAlign: 'middle',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)',
    fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number,
    color: 'var(--orbit-color-text-primary)', marginBottom: 4,
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(4, 9, 33, 0.5)' }}>
      <div style={{
        backgroundColor: 'var(--orbit-color-white)', borderRadius: 'var(--orbit-radius-md)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)', width: '90vw', maxWidth: 1100, height: '85vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'var(--orbit-space-base) var(--orbit-space-m)',
          borderBottom: '1px solid var(--orbit-color-card-border-default)', flexShrink: 0,
        }}>
          <Headings size="Heading 3">Playbook_123_ABC</Headings>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, padding: 0 }}>
            <FaIcon icon={'\uf00d'} size={16} color="var(--orbit-color-text-heading)" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chips + Add Clause */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--orbit-space-base) var(--orbit-space-m)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 'var(--orbit-space-s)', flexWrap: 'wrap' }}>
              <Chip variant="Outline" size="Small" label="Contract Template: Contract_123_ABC.pdf" />
              <Chip variant="Outline" size="Small" label="Category: Financial Service" />
              <Chip variant="Outline" size="Small" label="Company: Company_ABC_123" />
            </div>
            <Button variant="Secondary" icon={<FaIcon icon={'\uf067'} size={14} color="var(--orbit-color-text-primary)" />} onClick={() => setIsAddClauseOpen(!isAddClauseOpen)}>
              Add Clause
            </Button>
          </div>

          {/* Table + side panel */}
          <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {/* Table */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto', padding: '0 var(--orbit-space-m)' }}>
              <div style={{ border: '1px solid var(--orbit-color-card-border-default)', borderRadius: 8, overflow: 'hidden', backgroundColor: 'var(--orbit-color-white)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Clause Name</th>
                      <th style={thStyle}>Sub-Clause Name</th>
                      <th style={thStyle}>Sub-Clause Description</th>
                      {!isAddClauseOpen && <th style={thStyle}>Best Practice</th>}
                      <th style={{ ...thStyle, width: 80 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClauses.map(clause => (
                      <tr key={clause.id} style={{ cursor: 'default' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-bg-hover)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-white)'; }}
                      >
                        <td style={tdStyle}><Chip label={clause.clauseName} variant="Information" size="Mini" /></td>
                        <td style={tdStyle}>{clause.subClauseName}</td>
                        <td style={{ ...tdStyle, maxWidth: isAddClauseOpen ? 240 : 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clause.subClauseDescription}</td>
                        {!isAddClauseOpen && <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{clause.bestPractice}</td>}
                        <td style={{ ...tdStyle, display: 'flex', gap: 'var(--orbit-space-xs)' }}>
                          <IconButton variant="Tertiary" size="Small" icon={<FaIcon icon={'\uf044'} size={14} color="var(--orbit-color-text-secondary)" />} ariaLabel="Edit clause" />
                          <IconButton variant="Tertiary" size="Small" icon={<FaIcon icon={'\uf2ed'} size={14} color="var(--orbit-color-text-secondary)" />} ariaLabel="Delete clause" onClick={() => setClauses(prev => prev.filter(c => c.id !== clause.id))} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination — only with side panel */}
              {isAddClauseOpen && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--orbit-space-s) var(--orbit-space-base)', fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-secondary)', marginTop: 'var(--orbit-space-s)', flexShrink: 0 }}>
                  <span>View {pageSize} &nbsp;|&nbsp; {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, clauses.length)} of {clauses.length} items</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'none', border: 'none', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1, padding: 4 }}>
                      <FaIcon icon={'\uf053'} size={12} color="var(--orbit-color-text-secondary)" />
                    </button>
                    <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-primary)', fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number }}>{page}</span>
                    <span>of {totalPages} pages</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'none', border: 'none', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.4 : 1, padding: 4 }}>
                      <FaIcon icon={'\uf054'} size={12} color="var(--orbit-color-text-secondary)" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Add Clause side panel */}
            {isAddClauseOpen && (
              <div style={{ width: 350, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)', padding: 'var(--orbit-space-base)', borderLeft: '1px solid var(--orbit-color-card-border-default)', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Headings size="Heading 5">Add Clause</Headings>
                  <div style={{ display: 'flex', gap: 'var(--orbit-space-s)' }}>
                    <Button variant="Secondary" size="Small" onClick={handleAddClause}>Save</Button>
                    <Button variant="Secondary" size="Small" onClick={() => setIsAddClauseOpen(false)}>Cancel</Button>
                  </div>
                </div>
                <div><div id="add-clause-name-label" style={labelStyle}>Clause Name</div><TextArea ariaLabelledBy="add-clause-name-label" placeholder="Add the clause name here..." value={newClauseName} onChange={setNewClauseName} /></div>
                <div><div id="add-subclause-name-label" style={labelStyle}>SubClause Name</div><TextArea ariaLabelledBy="add-subclause-name-label" placeholder="Add the subclause name here..." value={newSubClauseName} onChange={setNewSubClauseName} /></div>
                <div><div id="add-subclause-description-label" style={labelStyle}>Subclause Description</div><TextArea ariaLabelledBy="add-subclause-description-label" placeholder="Add the subclause description here..." value={newSubClauseDesc} onChange={setNewSubClauseDesc} /></div>
                <div><div id="add-best-practice-label" style={labelStyle}>Best Practice</div><TextArea ariaLabelledBy="add-best-practice-label" placeholder="Add the best practice here..." value={newBestPractice} onChange={setNewBestPractice} /></div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--orbit-space-base) var(--orbit-space-m)', borderTop: '1px solid var(--orbit-color-card-border-default)', flexShrink: 0 }}>
          <Button variant="Secondary" onClick={onClose}>Close</Button>
          <Button variant="Primary" state={isAddClauseOpen ? 'Disabled' : 'Default'}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
