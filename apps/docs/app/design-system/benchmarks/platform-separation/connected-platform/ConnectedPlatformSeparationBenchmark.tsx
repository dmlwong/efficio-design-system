'use client';

import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  FA,
  FaIcon,
  Headings,
  Searchbox,
  Table,
  Text,
  type TableColumn,
} from '@efficio/orbit';
import styles from './ConnectedPlatformSeparationBenchmark.module.css';

type InitiativeStatus = 'Mobilising' | 'In delivery' | 'At risk' | 'Blocked' | 'Complete';
type Stage = 'Diagnose' | 'Source' | 'Negotiate' | 'Implement';
type Workstream = 'Commercial' | 'Operations' | 'Legal' | 'Finance';
type ViewState = 'data' | 'loading' | 'empty' | 'error' | 'locked';
type Density = 'comfortable' | 'compact';
type Scope = 'mine' | 'team' | 'exceptions';
type StatusFilter = 'all' | InitiativeStatus;
type BadgeStatus = NonNullable<React.ComponentProps<typeof Badge>['status']>;

interface Initiative {
  id: string;
  name: string;
  client: string;
  category: string;
  status: InitiativeStatus;
  stage: Stage;
  owner: string;
  workstream: Workstream;
  dueDate: string;
  spend: number;
  saving: number;
  riskCount: number;
  nextAction: string;
  internalNote: string;
}

const CURRENT_USER = 'Priya Shah';

const INITIATIVES: Initiative[] = [
  {
    id: 'CP-1184',
    name: 'Facilities mobilisation wave',
    client: 'Aster Manufacturing',
    category: 'Facilities management',
    status: 'At risk',
    stage: 'Source',
    owner: 'Priya Shah',
    workstream: 'Operations',
    dueDate: '2026-06-19',
    spend: 4200000,
    saving: 360000,
    riskCount: 4,
    nextAction: 'Confirm incumbent exit assumptions before supplier workshop.',
    internalNote: 'Delivery lead waiting on regional FM baseline from ops PMO.',
  },
  {
    id: 'CP-1191',
    name: 'IT services renewal',
    client: 'Northstar Retail',
    category: 'Managed services',
    status: 'In delivery',
    stage: 'Negotiate',
    owner: 'Carla Ahmed',
    workstream: 'Commercial',
    dueDate: '2026-06-21',
    spend: 3100000,
    saving: 210000,
    riskCount: 1,
    nextAction: 'Issue revised rate-card counterproposal to shortlisted supplier.',
    internalNote: 'Partner sign-off required before revised commercial model is released.',
  },
  {
    id: 'CP-1197',
    name: 'Logistics surcharge review',
    client: 'Helio Foods',
    category: 'Transport',
    status: 'Blocked',
    stage: 'Diagnose',
    owner: 'Joel Turner',
    workstream: 'Finance',
    dueDate: '2026-06-18',
    spend: 3600000,
    saving: 310000,
    riskCount: 6,
    nextAction: 'Escalate missing lane volumes to the client finance controller.',
    internalNote: 'Baseline extract is incomplete for two UK distribution centres.',
  },
  {
    id: 'CP-1203',
    name: 'Agency roster consolidation',
    client: 'Orion Health',
    category: 'Marketing agencies',
    status: 'Mobilising',
    stage: 'Diagnose',
    owner: 'Maya Patel',
    workstream: 'Commercial',
    dueDate: '2026-06-25',
    spend: 1900000,
    saving: 118000,
    riskCount: 2,
    nextAction: 'Load stakeholder map and current roster into project workspace.',
    internalNote: 'Discovery call scheduled with brand leads and procurement sponsor.',
  },
  {
    id: 'CP-1210',
    name: 'Maintenance materials RFQ',
    client: 'Vertex Utilities',
    category: 'MRO',
    status: 'In delivery',
    stage: 'Source',
    owner: 'Priya Shah',
    workstream: 'Operations',
    dueDate: '2026-06-28',
    spend: 2900000,
    saving: 246000,
    riskCount: 3,
    nextAction: 'Complete supplier shortlist QA before RFQ launch.',
    internalNote: 'Category analyst has flagged catalogue coverage gaps for review.',
  },
  {
    id: 'CP-1218',
    name: 'Energy hedge validation',
    client: 'Aster Manufacturing',
    category: 'Utilities',
    status: 'Complete',
    stage: 'Implement',
    owner: 'Liam Owen',
    workstream: 'Finance',
    dueDate: '2026-06-30',
    spend: 2800000,
    saving: 268000,
    riskCount: 0,
    nextAction: 'Archive award evidence and hand over monthly tracking cadence.',
    internalNote: 'Implementation pack accepted by finance and sustainability leads.',
  },
];

const VIEW_STATE_OPTIONS: Array<{ key: ViewState; label: string }> = [
  { key: 'data', label: 'Data' },
  { key: 'loading', label: 'Loading' },
  { key: 'empty', label: 'Empty' },
  { key: 'error', label: 'Error' },
  { key: 'locked', label: 'No access' },
];

const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Mobilising', value: 'Mobilising' },
  { label: 'In delivery', value: 'In delivery' },
  { label: 'At risk', value: 'At risk' },
  { label: 'Blocked', value: 'Blocked' },
  { label: 'Complete', value: 'Complete' },
];

function getStatusBadge(status: InitiativeStatus): BadgeStatus {
  if (status === 'Complete') return 'Success';
  if (status === 'In delivery') return 'Information';
  if (status === 'At risk') return 'Warning';
  if (status === 'Blocked') return 'Error';
  return 'No Status';
}

function getStageBadge(stage: Stage): BadgeStatus {
  if (stage === 'Implement') return 'Success';
  if (stage === 'Negotiate') return 'Information';
  if (stage === 'Source') return 'Warning';
  return 'No Status';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    compactDisplay: 'short',
    currency: 'GBP',
    maximumFractionDigits: 1,
    notation: 'compact',
    style: 'currency',
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00+01:00`));
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function filterInitiatives(rows: Initiative[], scope: Scope, status: StatusFilter, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesScope =
      scope === 'team'
      || (scope === 'mine' && row.owner === CURRENT_USER)
      || (scope === 'exceptions' && (row.status === 'At risk' || row.status === 'Blocked' || row.riskCount > 2));
    const matchesStatus = status === 'all' || row.status === status;
    const matchesQuery =
      !normalizedQuery
      || [
        row.id,
        row.name,
        row.client,
        row.category,
        row.owner,
        row.workstream,
        row.nextAction,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesScope && matchesStatus && matchesQuery;
  });
}

function OwnerCell({ owner, workstream }: { owner: string; workstream: Workstream }) {
  return (
    <span className={styles.ownerCell}>
      <span className={styles.initials} aria-hidden="true">{getInitials(owner)}</span>
      <span className={styles.cellStack}>
        <span className={styles.nowrapCell}>{owner}</span>
        <span className={styles.cellMeta}>{workstream}</span>
      </span>
    </span>
  );
}

function LoadingPreview() {
  return (
    <Card state="Information" padding="Small" type="Static">
      <div className={styles.loadingRegion} role="status" aria-live="polite">
        <Text variant="Bold" size="Small">Loading initiative queue</Text>
        <span className={styles.skeletonLine} aria-hidden="true" />
        <span className={styles.skeletonLineShort} aria-hidden="true" />
      </div>
    </Card>
  );
}

export function ConnectedPlatformSeparationBenchmark() {
  const [viewState, setViewState] = useState<ViewState>('data');
  const [density, setDensity] = useState<Density>('comfortable');
  const [scope, setScope] = useState<Scope>('team');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(INITIATIVES[0].id);

  const filteredRows = useMemo(
    () => filterInitiatives(INITIATIVES, scope, statusFilter, query),
    [query, scope, statusFilter],
  );
  const tableRows = viewState === 'empty' ? [] : filteredRows;
  const selectedInitiative =
    tableRows.find((row) => row.id === selectedId)
    ?? tableRows[0]
    ?? INITIATIVES.find((row) => row.id === selectedId)
    ?? INITIATIVES[0];
  const disabledControls = viewState === 'loading' || viewState === 'error' || viewState === 'locked';

  const columns = useMemo<Array<TableColumn<Initiative>>>(() => [
    {
      id: 'initiative',
      header: 'Initiative',
      render: (row) => (
        <span className={styles.primaryCell}>
          <span className={styles.cellTitle}>{row.name}</span>
          <span className={styles.cellMeta}>{row.id} · {row.client} · {row.category}</span>
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row) => <Badge label={row.status} status={getStatusBadge(row.status)} />,
    },
    {
      id: 'stage',
      header: 'Stage',
      render: (row) => <Badge label={row.stage} status={getStageBadge(row.stage)} />,
    },
    {
      id: 'owner',
      header: 'Owner',
      render: (row) => <OwnerCell owner={row.owner} workstream={row.workstream} />,
    },
    {
      id: 'nextAction',
      header: 'Next action',
      render: (row) => <span className={styles.wrapCell}>{row.nextAction}</span>,
    },
    {
      id: 'due',
      header: 'Due',
      render: (row) => <span className={styles.nowrapCell}>{formatDate(row.dueDate)}</span>,
    },
    {
      id: 'actions',
      header: 'Action',
      render: (row) => (
        <Button
          aria-label={`Open ${row.name}`}
          size="Small"
          state={disabledControls ? 'Disabled' : 'Default'}
          variant="Secondary"
          onClick={() => setSelectedId(row.id)}
        >
          Open
        </Button>
      ),
    },
  ], [disabledControls]);

  return (
    <main className={styles.page}>
      <section className={styles.benchmarkHeader}>
        <div className={styles.headingStack}>
          <Text variant="Secondary" size="Small">Connected Platform benchmark</Text>
          <Headings size="Heading 1">Internal initiative operations</Headings>
          <p className={styles.bodyText}>
            Dense internal list/detail workspace for consultants and delivery teams managing live initiatives.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            icon={<FaIcon icon={FA.file} />}
            state={viewState === 'locked' ? 'Disabled' : 'Default'}
            variant="Secondary"
          >
            Bulk import
          </Button>
          <Button
            icon={<FaIcon icon={FA.chevronRight} />}
            state={viewState === 'locked' ? 'Disabled' : 'Default'}
            variant="Primary"
          >
            Export queue
          </Button>
        </div>
      </section>

      <section className={styles.stateToolbar} aria-label="Benchmark preview controls">
        <div className={styles.stateControls}>
          <Text variant="Bold" size="Small">State</Text>
          {VIEW_STATE_OPTIONS.map((option) => (
            <Button
              key={option.key}
              aria-pressed={viewState === option.key}
              className={styles.toggleButton}
              onClick={() => setViewState(option.key)}
              size="Small"
              variant="Secondary"
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className={styles.stateControls}>
          <Text variant="Bold" size="Small">Density</Text>
          <Button
            aria-pressed={density === 'comfortable'}
            className={styles.toggleButton}
            onClick={() => setDensity('comfortable')}
            size="Small"
            variant="Secondary"
          >
            Comfortable
          </Button>
          <Button
            aria-pressed={density === 'compact'}
            className={styles.toggleButton}
            onClick={() => setDensity('compact')}
            size="Small"
            variant="Secondary"
          >
            Compact
          </Button>
        </div>
      </section>

      <section className={styles.connectedShell} aria-label="Connected Platform screen preview">
        <nav className={styles.internalNav} aria-label="Connected Platform navigation">
          <div className={styles.navBrand}>
            <span className={styles.navMark} aria-hidden="true">CP</span>
            <span>
              <Text variant="Inverse" size="Small">Connected Platform</Text>
              <span className={styles.navSubtitle}>Internal workspace</span>
            </span>
          </div>
          <div className={styles.navGroup}>
            <Text variant="Inverse" size="Small">Work</Text>
            {['Home', 'Projects', 'Initiatives', 'Supplier tracker'].map((item) => (
              <a
                key={item}
                aria-current={item === 'Initiatives' ? 'page' : undefined}
                className={item === 'Initiatives' ? styles.navItemActive : styles.navItem}
                href="#connected-platform-initiative-list"
              >
                {item}
              </a>
            ))}
          </div>
          <div className={styles.navGroup}>
            <Text variant="Inverse" size="Small">Admin</Text>
            {['Team capacity', 'Import logs'].map((item) => (
              <a key={item} className={styles.navItem} href="#connected-platform-initiative-list">
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className={styles.workSurface}>
          <section className={styles.summaryStrip} aria-label="Operational summary">
            <div className={styles.summaryItem}>
              <Text variant="Secondary" size="Small">Open initiatives</Text>
              <strong>{INITIATIVES.filter((row) => row.status !== 'Complete').length}</strong>
            </div>
            <div className={styles.summaryItem}>
              <Text variant="Secondary" size="Small">Exception rows</Text>
              <strong>{INITIATIVES.filter((row) => row.status === 'At risk' || row.status === 'Blocked').length}</strong>
            </div>
            <div className={styles.summaryItem}>
              <Text variant="Secondary" size="Small">Tracked savings</Text>
              <strong>{formatCurrency(INITIATIVES.reduce((total, row) => total + row.saving, 0))}</strong>
            </div>
          </section>

          <section className={styles.toolbar} aria-label="Initiative filters">
            <div className={styles.scopeControls}>
              {([
                ['mine', 'My work'],
                ['team', 'Team view'],
                ['exceptions', 'Exceptions'],
              ] as Array<[Scope, string]>).map(([value, label]) => (
                <Button
                  key={value}
                  aria-pressed={scope === value}
                  className={styles.toggleButton}
                  onClick={() => setScope(value)}
                  size="Small"
                  variant="Secondary"
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className={styles.toolbarRow}>
              <div className={styles.searchArea}>
                <Searchbox
                  ariaLabel="Search internal initiatives"
                  disabled={disabledControls}
                  onChange={setQuery}
                  placeholder="Search initiative, owner, client"
                  value={query}
                />
              </div>
              <div className={styles.filterField}>
                <Dropdown
                  ariaLabel="Filter initiatives by status"
                  disabled={disabledControls}
                  onChange={(value) => setStatusFilter(value as StatusFilter)}
                  options={STATUS_OPTIONS}
                  value={statusFilter}
                />
              </div>
            </div>
          </section>

          {viewState === 'locked' && (
            <Card state="Warning" padding="Small" type="Static">
              <div className={styles.permissionNotice} role="alert">
                <FaIcon icon={FA.circleExclamation} />
                <Text as="p" variant="Primary">
                  You can view initiative metadata, but import and export actions require Delivery Operations access.
                </Text>
              </div>
            </Card>
          )}

          <section className={styles.listDetailGrid} aria-label="Initiative list and selected detail">
            <div className={styles.tableRegion} id="connected-platform-initiative-list">
              <div className={styles.tableHeader}>
                <div className={styles.headingStack}>
                  <Headings size="Heading 2">Initiative queue</Headings>
                  <Text variant="Secondary" size="Small">
                    {tableRows.length} rows · selected {selectedInitiative.id}
                  </Text>
                </div>
                <Badge label={density === 'compact' ? 'Compact' : 'Comfortable'} status="Information" />
              </div>

              {viewState === 'loading' ? (
                <LoadingPreview />
              ) : viewState === 'error' ? (
                <Card state="Error" padding="Small" type="Static">
                  <div className={styles.statePanel} role="alert">
                    <div className={styles.headingStack}>
                      <Text variant="Bold" size="Small">Initiatives did not load</Text>
                      <Text as="p" variant="Primary">
                        Refresh the queue or check the import log for the latest source-system sync.
                      </Text>
                    </div>
                    <Button size="Small" variant="Secondary">Retry sync</Button>
                  </div>
                </Card>
              ) : (
                <Table
                  ariaLabel="Connected Platform internal initiative list"
                  columns={columns}
                  density={density === 'compact' ? 'Compact' : 'Default'}
                  emptyState={(
                    <div className={styles.emptyState}>
                      <Text variant="Bold">No initiatives match these controls</Text>
                      <Text as="p" variant="Secondary">
                        Clear search or switch to Team view to restore the queue.
                      </Text>
                    </div>
                  )}
                  getRowKey={(row) => row.id}
                  getRowSelectionLabel={(row) => `Select ${row.name}`}
                  onRowSelect={(row) => setSelectedId(row.id)}
                  rows={tableRows}
                />
              )}
            </div>

            <aside className={styles.detailPanel} aria-labelledby="connected-platform-detail-heading">
              <Card
                state={viewState === 'locked' ? 'Disabled' : selectedInitiative.status === 'Blocked' ? 'Error' : 'Default'}
                padding="Small"
                type="Static"
              >
                <div className={styles.detailContent}>
                  <div className={styles.detailTitleRow}>
                    <div className={styles.headingStack} id="connected-platform-detail-heading">
                      <Headings size="Heading 3">{selectedInitiative.name}</Headings>
                      <Text variant="Secondary" size="Small">
                        {selectedInitiative.id} · {selectedInitiative.client}
                      </Text>
                    </div>
                    <Badge label={selectedInitiative.status} status={getStatusBadge(selectedInitiative.status)} />
                  </div>

                  <dl className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <dt>Owner</dt>
                      <dd>{selectedInitiative.owner}</dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt>Spend</dt>
                      <dd>{formatCurrency(selectedInitiative.spend)}</dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt>Saving</dt>
                      <dd>{formatCurrency(selectedInitiative.saving)}</dd>
                    </div>
                    <div className={styles.detailItem}>
                      <dt>Risks</dt>
                      <dd>{selectedInitiative.riskCount}</dd>
                    </div>
                  </dl>

                  <div className={styles.detailCallout}>
                    <Text variant="Bold" size="Small">Next action</Text>
                    <Text as="p" variant="Primary">{selectedInitiative.nextAction}</Text>
                  </div>
                  <div className={styles.detailCallout}>
                    <Text variant="Bold" size="Small">Internal note</Text>
                    <Text as="p" variant="Secondary">{selectedInitiative.internalNote}</Text>
                  </div>

                  <div className={styles.actionGroup}>
                    <Button
                      state={viewState === 'locked' || viewState === 'error' ? 'Disabled' : 'Default'}
                      size="Small"
                      variant="Primary"
                    >
                      Open workspace
                    </Button>
                    <Button
                      state={viewState === 'locked' || viewState === 'error' ? 'Disabled' : 'Default'}
                      size="Small"
                      variant="Secondary"
                    >
                      Add update
                    </Button>
                  </div>
                </div>
              </Card>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
