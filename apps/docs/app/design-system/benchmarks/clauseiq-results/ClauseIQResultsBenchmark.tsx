'use client';

import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  FA,
  FaIcon,
  Headings,
  Overlay,
  Searchbox,
  Table,
  Text,
  Toggle,
  type TableColumn,
} from '@efficio/orbit';
import styles from './ClauseIQResultsBenchmark.module.css';

type Severity = 'Missing' | 'High' | 'Medium' | 'Low' | 'Aligned';
type ReviewStatus = 'Needs review' | 'In negotiation' | 'Approved' | 'Blocked' | 'Accepted';
type ApprovalScope = 'Commercial can approve' | 'Legal owner required';
type ViewState = 'data' | 'loading' | 'empty' | 'error';
type FilterKey = 'all' | 'high' | 'review' | 'locked';
type SortKey = 'clause' | 'severity' | 'exposure' | 'dueDate';
type SortDirection = 'asc' | 'desc';
type BadgeStatus = NonNullable<React.ComponentProps<typeof Badge>['status']>;

interface ClauseFinding {
  id: string;
  clause: string;
  family: string;
  supplierPosition: string;
  playbookGap: string;
  severity: Severity;
  reviewStatus: ReviewStatus;
  exposure: number;
  owner: string;
  dueDate: string;
  approvalScope: ApprovalScope;
  recommendedAction: string;
}

const PAGE_SIZE = 8;

const CLAUSE_FINDINGS: ClauseFinding[] = [
  {
    id: 'CIQ-001',
    clause: 'Liability cap',
    family: 'Risk allocation',
    supplierPosition: 'Cap reduced to annual fees with broad indirect loss exclusions.',
    playbookGap: 'Playbook expects at least contract value with carve-outs for confidentiality, IP, data, and wilful misconduct.',
    severity: 'High',
    reviewStatus: 'Needs review',
    exposure: 420000,
    owner: 'Sarah Chen',
    dueDate: '2026-06-18',
    approvalScope: 'Legal owner required',
    recommendedAction: 'Restore carve-outs and raise the cap before commercial approval.',
  },
  {
    id: 'CIQ-002',
    clause: 'Service credits',
    family: 'Performance',
    supplierPosition: 'Credits are discretionary and capped at 3% of monthly charges.',
    playbookGap: 'Minimum credit table and automatic earn-back rules are missing.',
    severity: 'Medium',
    reviewStatus: 'In negotiation',
    exposure: 180000,
    owner: 'Priya Shah',
    dueDate: '2026-06-20',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Insert the standard credit table and remove discretionary language.',
  },
  {
    id: 'CIQ-003',
    clause: 'Data processing',
    family: 'Compliance',
    supplierPosition: 'Supplier has not accepted the current data processing addendum.',
    playbookGap: 'Controller and processor obligations are unresolved for customer data.',
    severity: 'Missing',
    reviewStatus: 'Blocked',
    exposure: 610000,
    owner: 'Amelia Brown',
    dueDate: '2026-06-17',
    approvalScope: 'Legal owner required',
    recommendedAction: 'Attach the approved DPA and confirm sub-processor notice periods.',
  },
  {
    id: 'CIQ-004',
    clause: 'Termination assistance',
    family: 'Exit',
    supplierPosition: 'Assistance limited to 30 calendar days after termination.',
    playbookGap: 'Exit support should cover transition services for the agreed migration window.',
    severity: 'High',
    reviewStatus: 'Needs review',
    exposure: 260000,
    owner: 'Maya Patel',
    dueDate: '2026-06-21',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Extend assistance to the transition period and lock day rates.',
  },
  {
    id: 'CIQ-005',
    clause: 'Benchmarking',
    family: 'Commercial control',
    supplierPosition: 'Benchmark right removed from the latest supplier mark-up.',
    playbookGap: 'Benchmarking is required for contracts above the spend threshold.',
    severity: 'Medium',
    reviewStatus: 'Needs review',
    exposure: 150000,
    owner: 'Sarah Chen',
    dueDate: '2026-06-24',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Reinstate benchmark rights with a clear remediation period.',
  },
  {
    id: 'CIQ-006',
    clause: 'Price indexation',
    family: 'Commercial control',
    supplierPosition: 'Annual CPI uplift has no cap and no deflation protection.',
    playbookGap: 'Indexation should include a cap, floor, and evidence requirement.',
    severity: 'High',
    reviewStatus: 'In negotiation',
    exposure: 330000,
    owner: 'Tom Ellis',
    dueDate: '2026-06-19',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Cap annual uplift and require published index evidence.',
  },
  {
    id: 'CIQ-007',
    clause: 'Audit rights',
    family: 'Governance',
    supplierPosition: 'Audit access limited to once per year with supplier consent.',
    playbookGap: 'Regulatory and incident-triggered audits must remain available.',
    severity: 'Medium',
    reviewStatus: 'Accepted',
    exposure: 90000,
    owner: 'Priya Shah',
    dueDate: '2026-06-26',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Keep annual audit limit but add regulatory and incident exceptions.',
  },
  {
    id: 'CIQ-008',
    clause: 'Confidentiality',
    family: 'Risk allocation',
    supplierPosition: 'Confidentiality survives for three years after expiry.',
    playbookGap: 'Sensitive information should survive indefinitely where permitted.',
    severity: 'Low',
    reviewStatus: 'Approved',
    exposure: 70000,
    owner: 'Amelia Brown',
    dueDate: '2026-06-28',
    approvalScope: 'Legal owner required',
    recommendedAction: 'Extend survival for trade secrets and regulated information.',
  },
  {
    id: 'CIQ-009',
    clause: 'Change control',
    family: 'Governance',
    supplierPosition: 'Supplier may reject change requests where delivery resources are unavailable.',
    playbookGap: 'Critical regulatory and operational changes need priority treatment.',
    severity: 'Medium',
    reviewStatus: 'Needs review',
    exposure: 120000,
    owner: 'Maya Patel',
    dueDate: '2026-06-25',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Add priority handling for regulatory and business-critical changes.',
  },
  {
    id: 'CIQ-010',
    clause: 'Insurance',
    family: 'Risk allocation',
    supplierPosition: 'Professional indemnity evidence is annual but cyber cover is absent.',
    playbookGap: 'Cyber cover is mandatory for hosted service providers.',
    severity: 'High',
    reviewStatus: 'Blocked',
    exposure: 390000,
    owner: 'Sarah Chen',
    dueDate: '2026-06-16',
    approvalScope: 'Legal owner required',
    recommendedAction: 'Require cyber insurance certificate before signature.',
  },
  {
    id: 'CIQ-011',
    clause: 'Payment terms',
    family: 'Commercial control',
    supplierPosition: 'Supplier requested 14-day payment from invoice date.',
    playbookGap: 'Standard term is net 45 from valid invoice receipt.',
    severity: 'Low',
    reviewStatus: 'In negotiation',
    exposure: 45000,
    owner: 'Tom Ellis',
    dueDate: '2026-06-27',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Return to net 45 or document the cash-flow exception.',
  },
  {
    id: 'CIQ-012',
    clause: 'Modern slavery',
    family: 'Compliance',
    supplierPosition: 'Supplier accepted the policy schedule without amendment.',
    playbookGap: 'No deviation detected against the standard schedule.',
    severity: 'Aligned',
    reviewStatus: 'Approved',
    exposure: 0,
    owner: 'Priya Shah',
    dueDate: '2026-06-29',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'No action required beyond final approval evidence.',
  },
  {
    id: 'CIQ-013',
    clause: 'Step-in rights',
    family: 'Continuity',
    supplierPosition: 'Step-in right excluded unless there is a prolonged outage.',
    playbookGap: 'Critical services require step-in for material breach, insolvency, or regulatory trigger.',
    severity: 'High',
    reviewStatus: 'Needs review',
    exposure: 510000,
    owner: 'Amelia Brown',
    dueDate: '2026-06-18',
    approvalScope: 'Legal owner required',
    recommendedAction: 'Add standard step-in triggers and operational cooperation duties.',
  },
  {
    id: 'CIQ-014',
    clause: 'Assignment',
    family: 'Governance',
    supplierPosition: 'Supplier can assign to affiliates without notice.',
    playbookGap: 'Affiliate assignment should require notice and service continuity assurance.',
    severity: 'Medium',
    reviewStatus: 'Accepted',
    exposure: 60000,
    owner: 'Maya Patel',
    dueDate: '2026-06-30',
    approvalScope: 'Commercial can approve',
    recommendedAction: 'Add notice requirement and continuity obligation.',
  },
];

const SEVERITY_RANK: Record<Severity, number> = {
  Missing: 5,
  High: 4,
  Medium: 3,
  Low: 2,
  Aligned: 1,
};

const VIEW_STATE_OPTIONS: Array<{ key: ViewState; label: string }> = [
  { key: 'data', label: 'Data' },
  { key: 'loading', label: 'Loading' },
  { key: 'empty', label: 'Empty' },
  { key: 'error', label: 'Error' },
];

function getSeverityStatus(severity: Severity): BadgeStatus {
  if (severity === 'Missing' || severity === 'High') return 'Error';
  if (severity === 'Medium') return 'Warning';
  if (severity === 'Low') return 'Information';
  return 'Success';
}

function getReviewStatus(status: ReviewStatus): BadgeStatus {
  if (status === 'Blocked') return 'Error';
  if (status === 'Needs review') return 'Warning';
  if (status === 'In negotiation') return 'Information';
  if (status === 'Approved' || status === 'Accepted') return 'Success';
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
  }).format(new Date(`${value}T00:00:00Z`));
}

function filterRows(rows: ClauseFinding[], filter: FilterKey, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesFilter =
      filter === 'all'
      || (filter === 'high' && (row.severity === 'Missing' || row.severity === 'High'))
      || (filter === 'review' && (row.reviewStatus === 'Needs review' || row.reviewStatus === 'Blocked'))
      || (filter === 'locked' && row.approvalScope === 'Legal owner required');

    if (!matchesFilter) return false;
    if (!normalizedQuery) return true;

    return [
      row.id,
      row.clause,
      row.family,
      row.supplierPosition,
      row.playbookGap,
      row.owner,
      row.reviewStatus,
      row.severity,
    ].some((value) => value.toLowerCase().includes(normalizedQuery));
  });
}

function sortRows(rows: ClauseFinding[], key: SortKey, direction: SortDirection) {
  return [...rows].sort((first, second) => {
    let comparison = 0;

    if (key === 'severity') {
      comparison = SEVERITY_RANK[first.severity] - SEVERITY_RANK[second.severity];
    } else if (key === 'exposure') {
      comparison = first.exposure - second.exposure;
    } else if (key === 'dueDate') {
      comparison = first.dueDate.localeCompare(second.dueDate);
    } else {
      comparison = first.clause.localeCompare(second.clause);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

function MetricCard({
  label,
  value,
  helper,
  state,
}: {
  label: string;
  value: string;
  helper: string;
  state: React.ComponentProps<typeof Card>['state'];
}) {
  return (
    <Card type="Static" padding="Small" state={state}>
      <div className={styles.metricCard}>
        <Text variant="Secondary" size="Small">{label}</Text>
        <span className={styles.metricValue}>{value}</span>
        <span className={styles.metricHelper}>{helper}</span>
      </div>
    </Card>
  );
}

function BadgeStack({ row }: { row: ClauseFinding }) {
  return (
    <div className={styles.badgeStack}>
      <Badge
        label={row.severity}
        status={getSeverityStatus(row.severity)}
        ariaLabel={`${row.severity} deviation severity`}
      />
      <Badge
        label={row.reviewStatus}
        status={getReviewStatus(row.reviewStatus)}
      />
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className={styles.emptyState}>
      <Text variant="Bold" size="Paragraph">No ClauseIQ results match this view.</Text>
      <Text variant="Secondary" size="Paragraph">
        {query.trim()
          ? 'Clear search or change filters to return reviewed clauses.'
          : 'Run analysis or change filters to review clause findings.'}
      </Text>
    </div>
  );
}

function LoadingTable({ columns }: { columns: TableColumn<ClauseFinding>[] }) {
  const loadingRows = Array.from({ length: PAGE_SIZE }, (_, index) => ({
    id: `loading-${index}`,
  }));
  const loadingColumns: TableColumn<{ id: string }>[] = columns.map((column) => ({
    id: column.id,
    header: column.header,
    render: () => <span className={styles.skeletonLine} />,
  }));

  return (
    <div className={styles.loadingRegion}>
      <div aria-hidden="true">
        <Table
          ariaLabel="ClauseIQ results loading"
          columns={loadingColumns}
          rows={loadingRows}
          getRowKey={(row) => row.id}
          density="Compact"
        />
      </div>
      <span className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        Loading ClauseIQ results.
      </span>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert">
      <Card type="Static" padding="Base" state="Error">
        <div className={styles.statePanel}>
          <div className={styles.statePanelCopy}>
            <Headings size="Heading 5">Clause results did not load</Headings>
            <Text variant="Secondary" size="Paragraph">
              The analysis data could not be retrieved. Retry the results request before continuing review.
            </Text>
          </div>
          <Button variant="Secondary" onClick={onRetry} icon={<FaIcon icon={FA.angleDown} />}>
            Retry results
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ClauseDetailDialog({
  finding,
  onClose,
}: {
  finding?: ClauseFinding;
  onClose: () => void;
}) {
  const canApprove = finding?.approvalScope === 'Commercial can approve';

  return (
    <Overlay
      visible={Boolean(finding)}
      onClose={onClose}
      ariaLabelledBy="clauseiq-result-detail-title"
      size="Large"
      height="Content"
    >
      {finding && (
        <div className={styles.dialogLayout}>
          <div className={styles.dialogHeader}>
            <div className={styles.dialogTitleBlock}>
              <Text variant="Secondary" size="Small">{finding.id}</Text>
              <div id="clauseiq-result-detail-title">
                <Headings size="Heading 4">{finding.clause}</Headings>
              </div>
            </div>
            <Button variant="Tertiary" onClick={onClose} icon={<FaIcon icon={FA.xmark} />}>
              Close
            </Button>
          </div>

          <div className={styles.dialogBody}>
            <div className={styles.dialogBadgeRow}>
              <Badge
                label={finding.severity}
                status={getSeverityStatus(finding.severity)}
                ariaLabel={`${finding.severity} deviation severity`}
              />
              <Badge label={finding.reviewStatus} status={getReviewStatus(finding.reviewStatus)} />
              <Badge
                label={finding.approvalScope}
                status={canApprove ? 'Success' : 'Warning'}
              />
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <Text variant="Bold" size="Small">Supplier position</Text>
                <Text variant="Primary" size="Paragraph">{finding.supplierPosition}</Text>
              </div>
              <div className={styles.detailItem}>
                <Text variant="Bold" size="Small">Playbook gap</Text>
                <Text variant="Primary" size="Paragraph">{finding.playbookGap}</Text>
              </div>
              <div className={styles.detailItem}>
                <Text variant="Bold" size="Small">Commercial exposure</Text>
                <Text variant="Primary" size="Paragraph">{formatCurrency(finding.exposure)}</Text>
              </div>
              <div className={styles.detailItem}>
                <Text variant="Bold" size="Small">Owner and due date</Text>
                <Text variant="Primary" size="Paragraph">{finding.owner} - {formatDate(finding.dueDate)}</Text>
              </div>
            </div>

            <div className={styles.recommendationPanel}>
              <Text variant="Bold" size="Small">Recommended action</Text>
              <Text variant="Primary" size="Paragraph">{finding.recommendedAction}</Text>
            </div>

            {!canApprove && (
              <div className={styles.permissionNotice} role="note">
                <FaIcon icon={FA.triangleExclamation} />
                <Text variant="Warning" size="Paragraph">
                  Approval is restricted to Legal owner role for this finding.
                </Text>
              </div>
            )}
          </div>

          <div className={styles.dialogFooter}>
            <Button variant="Secondary" onClick={onClose}>
              Return to table
            </Button>
            <Button variant="Primary" disabled={!canApprove} icon={<FaIcon icon={FA.check} />}>
              Approve clause
            </Button>
          </div>
        </div>
      )}
    </Overlay>
  );
}

export function ClauseIQResultsBenchmark() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [viewState, setViewState] = useState<ViewState>('data');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'severity',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState<'Default' | 'Compact'>('Default');
  const [selectedFinding, setSelectedFinding] = useState<ClauseFinding | undefined>();

  const filteredRows = useMemo(() => filterRows(CLAUSE_FINDINGS, filter, query), [filter, query]);
  const sortedRows = useMemo(() => sortRows(filteredRows, sort.key, sort.direction), [filteredRows, sort]);
  const currentPage = Math.min(page, Math.max(Math.ceil(sortedRows.length / PAGE_SIZE), 1));
  const pagedRows = sortedRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const highPriorityCount = CLAUSE_FINDINGS.filter((row) => row.severity === 'Missing' || row.severity === 'High').length;
  const reviewCount = CLAUSE_FINDINGS.filter((row) => row.reviewStatus === 'Needs review' || row.reviewStatus === 'Blocked').length;
  const lockedCount = CLAUSE_FINDINGS.filter((row) => row.approvalScope === 'Legal owner required').length;
  const exposureTotal = CLAUSE_FINDINGS.reduce((total, row) => total + row.exposure, 0);

  const filterOptions: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: `All ${CLAUSE_FINDINGS.length}` },
    { key: 'high', label: `High priority ${highPriorityCount}` },
    { key: 'review', label: `Needs action ${reviewCount}` },
    { key: 'locked', label: `Legal only ${lockedCount}` },
  ];

  const updateFilter = (nextFilter: FilterKey) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setPage(1);
  };

  const updateViewState = (nextState: ViewState) => {
    setViewState(nextState);
    setPage(1);
  };

  const updateSort = (key: SortKey) => (direction: SortDirection) => {
    setSort({ key, direction });
    setPage(1);
  };

  const columns = useMemo<TableColumn<ClauseFinding>[]>(
    () => [
      {
        id: 'clause',
        header: 'Clause',
        sortable: true,
        sortDirection: sort.key === 'clause' ? sort.direction : undefined,
        onSortChange: updateSort('clause'),
        info: 'Open a clause row to review the analysis details.',
        render: (row) => (
          <span className={styles.primaryCell}>
            <span className={styles.cellTitle}>{row.clause}</span>
            <span className={styles.cellMeta}>{row.id} - {row.family}</span>
          </span>
        ),
      },
      {
        id: 'supplierPosition',
        header: 'Supplier position',
        render: (row) => <span className={styles.wrapCell}>{row.supplierPosition}</span>,
      },
      {
        id: 'playbookGap',
        header: 'Playbook gap',
        render: (row) => <span className={styles.wrapCell}>{row.playbookGap}</span>,
      },
      {
        id: 'severity',
        header: 'Severity',
        sortable: true,
        sortDirection: sort.key === 'severity' ? sort.direction : undefined,
        onSortChange: updateSort('severity'),
        render: (row) => <BadgeStack row={row} />,
      },
      {
        id: 'exposure',
        header: 'Exposure',
        sortable: true,
        sortDirection: sort.key === 'exposure' ? sort.direction : undefined,
        onSortChange: updateSort('exposure'),
        render: (row) => <span className={styles.numericCell}>{formatCurrency(row.exposure)}</span>,
      },
      {
        id: 'owner',
        header: 'Owner',
        render: (row) => <span className={styles.nowrapCell}>{row.owner}</span>,
      },
      {
        id: 'dueDate',
        header: 'Due',
        sortable: true,
        sortDirection: sort.key === 'dueDate' ? sort.direction : undefined,
        onSortChange: updateSort('dueDate'),
        render: (row) => <span className={styles.nowrapCell}>{formatDate(row.dueDate)}</span>,
      },
      {
        id: 'permission',
        header: 'Approval',
        render: (row) => (
          <Badge
            label={row.approvalScope}
            status={row.approvalScope === 'Commercial can approve' ? 'Success' : 'Warning'}
          />
        ),
      },
    ],
    [sort],
  );

  const tableRows = viewState === 'empty' ? [] : pagedRows;
  const showPagination = viewState === 'data' && sortedRows.length > PAGE_SIZE;
  const resetDisabled = !query && filter === 'all';
  const screenReaderStatus = useMemo(() => {
    if (viewState === 'loading') return '';
    if (viewState === 'error') return 'ClauseIQ results did not load. Retry results is available.';
    if (viewState === 'empty') return 'ClauseIQ empty state selected. No findings match this view.';
    return `ClauseIQ results loaded. ${sortedRows.length} findings available.`;
  }, [viewState, sortedRows.length]);

  return (
    <main className={styles.page}>
      <div className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </div>
      <section className={styles.header}>
        <div className={styles.headerCopy}>
          <Text variant="Secondary" size="Small">Benchmark Task 1</Text>
          <div className={styles.headingStack}>
            <Headings size="Heading 1">ClauseIQ results table</Headings>
            <Text variant="Secondary" size="Paragraph">
              Dense clause findings with contract status, commercial exposure, role-limited approval, and row-level review.
            </Text>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="Secondary"
            disabled={resetDisabled}
            onClick={() => {
              setQuery('');
              updateFilter('all');
            }}
          >
            Clear filters
          </Button>
          <Button variant="Primary" icon={<FaIcon icon={FA.file} />}>
            Export findings
          </Button>
        </div>
      </section>

      <section className={styles.summaryGrid} aria-label="ClauseIQ result summary">
        <MetricCard
          label="Analysed clauses"
          value={String(CLAUSE_FINDINGS.length)}
          helper="Across procurement playbook controls"
          state="Information"
        />
        <MetricCard
          label="High priority"
          value={String(highPriorityCount)}
          helper="Missing or high deviation findings"
          state="Error"
        />
        <MetricCard
          label="Commercial exposure"
          value={formatCurrency(exposureTotal)}
          helper="Estimated exposure requiring review"
          state="Warning"
        />
        <MetricCard
          label="Legal owner approval"
          value={String(lockedCount)}
          helper="Restricted by role-based approval"
          state="Highlight"
        />
      </section>

      <section className={styles.resultsRegion} aria-labelledby="clauseiq-results-heading">
        <div className={styles.toolbar}>
          <div className={styles.toolbarRow}>
            <div className={styles.titleBlock}>
              <Headings size="Heading 3">Results queue</Headings>
              <span className={styles.queueMeta}>
                {viewState === 'data'
                  ? `${sortedRows.length} findings shown from Procurement_Playbook_Yorkshire_Water.pdf`
                  : 'State preview for ClauseIQ result review'}
              </span>
            </div>
            <div className={styles.stateControls} role="group" aria-label="Result state">
              {VIEW_STATE_OPTIONS.map((option) => (
                <Button
                  key={option.key}
                  variant="Secondary"
                  size="Small"
                  aria-pressed={viewState === option.key}
                  className={styles.toggleButton}
                  onClick={() => updateViewState(option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className={styles.toolbarRow}>
            <div className={styles.searchArea}>
              <Searchbox
                ariaLabel="Search ClauseIQ results"
                placeholder="Search clauses, owners, statuses..."
                value={query}
                onChange={updateQuery}
                disabled={viewState === 'loading' || viewState === 'error'}
              />
            </div>
            <div className={styles.filterControls} role="group" aria-label="Result filters">
              {filterOptions.map((option) => (
                <Button
                  key={option.key}
                  variant="Secondary"
                  size="Small"
                  aria-pressed={filter === option.key}
                  className={styles.toggleButton}
                  onClick={() => updateFilter(option.key)}
                  disabled={viewState === 'loading' || viewState === 'error'}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Toggle
              checked={density === 'Compact'}
              onChange={(checked) => setDensity(checked ? 'Compact' : 'Default')}
              label="Compact rows"
            />
          </div>
        </div>

        <div className={styles.tableHeader}>
          <div id="clauseiq-results-heading">
            <Headings size="Heading 4">Clause findings</Headings>
          </div>
          <Button
            variant="Secondary"
            size="Small"
            disabled
          >
            Approve 0 selected
          </Button>
        </div>

        {viewState === 'loading' && <LoadingTable columns={columns} />}
        {viewState === 'error' && <ErrorState onRetry={() => updateViewState('data')} />}
        {(viewState === 'data' || viewState === 'empty') && (
          <Table
            ariaLabelledBy="clauseiq-results-heading"
            columns={columns}
            rows={tableRows}
            getRowKey={(row) => row.id}
            onRowSelect={(row) => setSelectedFinding(row)}
            getRowSelectionLabel={(row, index) => `Open finding ${row.id}, ${row.clause}, row ${index + 1}`}
            density={density}
            emptyState={<EmptyState query={query} />}
            pagination={showPagination ? {
              page: currentPage,
              pageSize: PAGE_SIZE,
              totalRows: sortedRows.length,
              onPageChange: setPage,
            } : undefined}
          />
        )}
      </section>

      <ClauseDetailDialog
        finding={selectedFinding}
        onClose={() => setSelectedFinding(undefined)}
      />
    </main>
  );
}
