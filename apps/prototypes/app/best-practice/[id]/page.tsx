'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headings,
  Button,
  FaIcon,
  Chip,
  IconButton,
  TextArea,
} from '@efficio/orbit';

/* ─── Types ─── */

interface ClauseRow {
  id: string;
  clauseName: string;
  subClauseName: string;
  subClauseDescription: string;
  bestPractice: string;
}

type SortField = 'clauseName' | 'subClauseName' | 'subClauseDescription' | 'bestPractice';
type SortDir = 'asc' | 'desc';

/* ─── Demo data ─── */

const INITIAL_CLAUSES: ClauseRow[] = Array.from({ length: 37 }, (_, i) => ({
  id: String(i + 1),
  clauseName: 'Confidentiality',
  subClauseName: 'Non-Disclosure Obligations',
  subClauseDescription: 'Obligations of receiving party to protect confidential information.',
  bestPractice: 'Require mutual NDA with standard terms and specific carve-outs for pre-existing information.',
}));

let nextClauseId = 100;

/* ─── Component ─── */

export default function ClauseDetailPage() {
  const [clauses, setClauses] = useState<ClauseRow[]>(INITIAL_CLAUSES);
  const [sortField, setSortField] = useState<SortField>('clauseName');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  /* Pagination */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(clauses.length / pageSize);

  /* Add Clause panel */
  const [isAddClauseOpen, setIsAddClauseOpen] = useState(false);
  const [newClauseName, setNewClauseName] = useState('');
  const [newSubClauseName, setNewSubClauseName] = useState('');
  const [newSubClauseDesc, setNewSubClauseDesc] = useState('');
  const [newBestPractice, setNewBestPractice] = useState('');

  /* Lock background scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ── Sort logic ── */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedClauses = [...clauses].sort((a, b) => {
    const cmp = a[sortField].localeCompare(b[sortField]);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const paginatedClauses = sortedClauses.slice((page - 1) * pageSize, page * pageSize);

  const handleDelete = (id: string) => {
    setClauses(prev => prev.filter(c => c.id !== id));
  };

  const handleAddClause = () => {
    const newRow: ClauseRow = {
      id: String(nextClauseId++),
      clauseName: newClauseName || 'Untitled',
      subClauseName: newSubClauseName || '',
      subClauseDescription: newSubClauseDesc || '',
      bestPractice: newBestPractice || '',
    };
    setClauses(prev => [...prev, newRow]);
    setNewClauseName('');
    setNewSubClauseName('');
    setNewSubClauseDesc('');
    setNewBestPractice('');
    setIsAddClauseOpen(false);
  };

  /* ── Sort icon ── */
  const SortIcon = ({ field }: { field: SortField }) => (
    <span style={{ marginLeft: 4, opacity: sortField === field ? 1 : 0.4 }}>
      <FaIcon icon={sortField === field && sortDir === 'desc' ? '\uf0dd' : '\uf0de'} size={10} color="var(--orbit-color-text-secondary)" />
    </span>
  );

  /* ── Table styles ── */
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

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--orbit-font-family-sans)',
    fontSize: 'var(--orbit-text-sm)',
    fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number,
    color: 'var(--orbit-color-text-primary)',
    marginBottom: 4,
  };

  return (
    <div data-theme="orbit" style={{ fontFamily: 'var(--orbit-font-family-sans)' }}>
      {/* Full-screen modal backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        backgroundColor: 'rgba(4, 9, 33, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Modal container */}
        <div style={{
          backgroundColor: 'var(--orbit-color-white)',
          borderRadius: 'var(--orbit-radius-md)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          width: '90vw', maxWidth: 1100,
          height: '85vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* ── Modal Header ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 'var(--orbit-space-base) var(--orbit-space-m)',
            borderBottom: '1px solid var(--orbit-color-card-border-default)',
            flexShrink: 0,
          }}>
            <Headings size="Heading 3">Playbook_123_ABC</Headings>
            <button
              onClick={() => window.history.back()}
              aria-label="Close"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, padding: 0,
              }}
            >
              <FaIcon icon={'\uf00d'} size={16} color="var(--orbit-color-text-heading)" />
            </button>
          </div>

          {/* ── Modal Body ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Metadata chips + Add Clause — same row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: 'var(--orbit-space-base) var(--orbit-space-m)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', gap: 'var(--orbit-space-s)', flexWrap: 'wrap' }}>
                <Chip variant="Outline" size="Small" label="Contract Template: Contract_123_ABC.pdf" />
                <Chip variant="Outline" size="Small" label="Category: Financial Service" />
                <Chip variant="Outline" size="Small" label="Company: Company_ABC_123" />
              </div>
              <Button
                variant="Secondary"
                icon={<FaIcon icon={'\uf067'} size={14} color="var(--orbit-color-text-primary)" />}
                onClick={() => setIsAddClauseOpen(!isAddClauseOpen)}
              >
                Add Clause
              </Button>
            </div>

            {/* Main content: table + optional side panel */}
            <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

              {/* Table section */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto', padding: '0 var(--orbit-space-m)' }}>
                <div style={{ border: '1px solid var(--orbit-color-card-border-default)', borderRadius: 8, overflow: 'hidden', backgroundColor: 'var(--orbit-color-white)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle} onClick={() => handleSort('clauseName')}>Clause Name <SortIcon field="clauseName" /></th>
                        <th style={thStyle} onClick={() => handleSort('subClauseName')}>Sub-Clause Name <SortIcon field="subClauseName" /></th>
                        <th style={thStyle} onClick={() => handleSort('subClauseDescription')}>Sub-Clause Description <SortIcon field="subClauseDescription" /></th>
                        {!isAddClauseOpen && (
                          <th style={thStyle} onClick={() => handleSort('bestPractice')}>Best Practice <SortIcon field="bestPractice" /></th>
                        )}
                        <th style={{ ...thStyle, cursor: 'default', width: 80 }} />
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence initial={false}>
                        {paginatedClauses.map(clause => (
                          <motion.tr
                            key={clause.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ cursor: 'default' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-bg-hover)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--orbit-color-white)'; }}
                          >
                            <td style={tdStyle}>
                              <Chip label={clause.clauseName} variant="Information" size="Mini" />
                            </td>
                            <td style={tdStyle}>{clause.subClauseName}</td>
                            <td style={{ ...tdStyle, maxWidth: isAddClauseOpen ? 240 : 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {clause.subClauseDescription}
                            </td>
                            {!isAddClauseOpen && (
                              <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {clause.bestPractice}
                              </td>
                            )}
                            <td style={{ ...tdStyle, display: 'flex', gap: 'var(--orbit-space-xs)' }}>
                              <IconButton
                                variant="Tertiary"
                                size="Small"
                                icon={<FaIcon icon={'\uf044'} size={14} color="var(--orbit-color-text-secondary)" />}
                                ariaLabel="Edit clause"
                              />
                              <IconButton
                                variant="Tertiary"
                                size="Small"
                                icon={<FaIcon icon={'\uf2ed'} size={14} color="var(--orbit-color-text-secondary)" />}
                                ariaLabel="Delete clause"
                                onClick={() => handleDelete(clause.id)}
                              />
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination — only when side panel is open */}
                {isAddClauseOpen && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 'var(--orbit-space-s) var(--orbit-space-base)',
                    fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)',
                    color: 'var(--orbit-color-text-secondary)', marginTop: 'var(--orbit-space-s)',
                    flexShrink: 0,
                  }}>
                    <span>View {pageSize} &nbsp;|&nbsp; {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, clauses.length)} of {clauses.length} items</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ background: 'none', border: 'none', cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.4 : 1, padding: 4 }}
                      >
                        <FaIcon icon={'\uf053'} size={12} color="var(--orbit-color-text-secondary)" />
                      </button>
                      <span style={{ fontFamily: 'var(--orbit-font-family-sans)', fontSize: 'var(--orbit-text-sm)', color: 'var(--orbit-color-text-primary)', fontWeight: 'var(--orbit-font-weight-semibold)' as unknown as number }}>
                        {page}
                      </span>
                      <span>of {totalPages} pages</span>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{ background: 'none', border: 'none', cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.4 : 1, padding: 4 }}
                      >
                        <FaIcon icon={'\uf054'} size={12} color="var(--orbit-color-text-secondary)" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Clause side panel */}
              {isAddClauseOpen && (
                <div style={{
                  width: 350, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)',
                  padding: 'var(--orbit-space-base)',
                  borderLeft: '1px solid var(--orbit-color-card-border-default)',
                  overflowY: 'auto',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Headings size="Heading 5">Add Clause</Headings>
                    <div style={{ display: 'flex', gap: 'var(--orbit-space-s)' }}>
                      <Button variant="Secondary" size="Small" onClick={handleAddClause}>Save</Button>
                      <Button variant="Secondary" size="Small" onClick={() => setIsAddClauseOpen(false)}>Cancel</Button>
                    </div>
                  </div>

                  <div>
                    <div id="add-clause-name-label" style={labelStyle}>Clause Name</div>
                    <TextArea ariaLabelledBy="add-clause-name-label" placeholder="Add the clause name here..." value={newClauseName} onChange={setNewClauseName} />
                  </div>
                  <div>
                    <div id="add-subclause-name-label" style={labelStyle}>SubClause Name</div>
                    <TextArea ariaLabelledBy="add-subclause-name-label" placeholder="Add the subclause name here..." value={newSubClauseName} onChange={setNewSubClauseName} />
                  </div>
                  <div>
                    <div id="add-subclause-description-label" style={labelStyle}>Subclause Description</div>
                    <TextArea ariaLabelledBy="add-subclause-description-label" placeholder="Add the subclause description here..." value={newSubClauseDesc} onChange={setNewSubClauseDesc} />
                  </div>
                  <div>
                    <div id="add-best-practice-label" style={labelStyle}>Best Practice</div>
                    <TextArea ariaLabelledBy="add-best-practice-label" placeholder="Add the best practice here..." value={newBestPractice} onChange={setNewBestPractice} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Modal Footer ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: 'var(--orbit-space-base) var(--orbit-space-m)',
            borderTop: '1px solid var(--orbit-color-card-border-default)',
            flexShrink: 0,
          }}>
            <Button variant="Secondary" onClick={() => window.history.back()}>Close</Button>
            <Button variant="Primary" state={isAddClauseOpen ? 'Disabled' : 'Default'}>Save Changes</Button>
          </div>

        </div>
      </div>
    </div>
  );
}
