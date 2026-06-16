'use client';

import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  FA,
  FaIcon,
  HeaderPresets,
  Headings,
  PageHeader,
  Searchbox,
  Table,
  Text,
  type TableColumn,
} from '@efficio/orbit';
import styles from './LovablePortBenchmark.module.css';

type Status = 'Idea' | 'In flight' | 'Complete' | 'On hold';
type Stage = 'Grey' | 'Green' | 'Amber' | 'Red';
type ViewState = 'data' | 'loading' | 'empty' | 'error' | 'locked';
type ScopeFilter = 'mine' | 'team' | 'triage';
type StatusFilter = 'all' | Status;
type StageFilter = 'all' | Stage;
type ColumnSet = 'all' | 'financial' | 'delivery';
type SortDirection = 'asc' | 'desc';
type ColumnKey =
  | 'id'
  | 'status'
  | 'category'
  | 'methodology'
  | 'resources'
  | 'estimatedSavings'
  | 'actualSavings'
  | 'estimatedSpend'
  | 'actualSpend'
  | 'owner'
  | 'stage'
  | 'actions';
type SortKey = Exclude<ColumnKey, 'resources' | 'actions'>;
type BadgeStatus = NonNullable<React.ComponentProps<typeof Badge>['status']>;

interface Initiative {
  id: string;
  name: string;
  status: Status;
  category: string;
  methodology: string;
  resources: string[];
  estimatedSavings: number;
  actualSavings: number;
  estimatedSpend: number;
  actualSpend: number;
  owner: string;
  stage: Stage;
}

const PAGE_SIZE = 12;
const CURRENT_USER = 'Priya Shah';
const STATUSES: Status[] = ['Idea', 'In flight', 'Complete', 'On hold'];
const STAGES: Stage[] = ['Grey', 'Green', 'Amber', 'Red'];
const CATEGORIES = ['L1 | Fleet', 'L2 | IT', 'L3 | Marketing', 'L1 | HR', 'L2 | Facilities', 'L3 | Logistics'];
const METHODS = ['Complex sourcing', 'RFP', 'Negotiation', 'Demand management', 'Specification change', 'Consolidation'];
const OWNERS = ['David Wong', 'Carla Ahmed', 'Joel Turner', 'Ana Jones', 'Marco Bianchi', 'Priya Shah', 'Liam Owen', 'Sofia Rossi'];
const INITIATIVE_NAMES = [
  'AB test',
  'Cost reduction',
  'Vendor consolidation',
  'Process redesign',
  'Specification harmonisation',
  'Renewal',
  'Tail spend',
  'Joint venture',
  'Tender wave',
  'Maverick spend capture',
];
const COLUMN_SET_KEYS: Record<ColumnSet, ColumnKey[]> = {
  all: ['id', 'status', 'category', 'methodology', 'resources', 'estimatedSavings', 'actualSavings', 'estimatedSpend', 'actualSpend', 'owner', 'stage', 'actions'],
  financial: ['id', 'status', 'category', 'estimatedSavings', 'actualSavings', 'estimatedSpend', 'actualSpend', 'stage', 'actions'],
  delivery: ['id', 'status', 'methodology', 'resources', 'owner', 'stage', 'actions'],
};
const COLUMN_SET_OPTIONS = [
  { label: 'All columns', value: 'all' },
  { label: 'Financial view', value: 'financial' },
  { label: 'Delivery view', value: 'delivery' },
];
const STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  ...STATUSES.map((status) => ({ label: status, value: status })),
];
const STAGE_OPTIONS = [
  { label: 'All stages', value: 'all' },
  ...STAGES.map((stage) => ({ label: stage, value: stage })),
];
const VIEW_STATE_OPTIONS: Array<{ key: ViewState; label: string }> = [
  { key: 'data', label: 'Data' },
  { key: 'loading', label: 'Loading' },
  { key: 'empty', label: 'Empty' },
  { key: 'error', label: 'Error' },
  { key: 'locked', label: 'No permission' },
];
const PROJECT_TABS = [
  { id: 'gantt', label: 'Gantt chart', panelId: 'lovable-port-gantt-panel' },
  { id: 'initiatives', label: 'Initiatives', panelId: 'lovable-port-initiatives-panel' },
  { id: 'deliverables', label: 'Deliverables', panelId: 'lovable-port-deliverables-panel' },
  { id: 'team', label: 'Team', panelId: 'lovable-port-team-panel' },
  { id: 'qc-tasks', label: 'My QC tasks', badge: 2, panelId: 'lovable-port-qc-panel' },
  { id: 'benefits', label: 'Benefits', panelId: 'lovable-port-benefits-panel' },
  { id: 'settings', label: 'Settings', panelId: 'lovable-port-settings-panel' },
];

function seeded(seed: number) {
  const value = Math.sin(seed) * 10000;
  return value - Math.floor(value);
}

function makeInitiatives(count: number): Initiative[] {
  return Array.from({ length: count }, (_, index) => {
    const random = (offset: number) => seeded(index * 13 + offset);
    const resourceCount = 1 + Math.floor(random(1) * 4);
    const estimatedSavings = Math.floor(random(5) * 500000);
    const actualSavings = Math.floor(random(6) * 520000);

    return {
      id: `AUT01-${(2000 - index).toString().padStart(4, '0')}`,
      name: `${INITIATIVE_NAMES[index % INITIATIVE_NAMES.length]} ${index + 1}`,
      status: STATUSES[Math.floor(random(2) * STATUSES.length)],
      category: CATEGORIES[Math.floor(random(3) * CATEGORIES.length)],
      methodology: METHODS[Math.floor(random(4) * METHODS.length)],
      resources: Array.from({ length: resourceCount }, (_, resourceIndex) => (
        OWNERS[Math.floor(seeded(index * 7 + resourceIndex * 3) * OWNERS.length)]
      )),
      estimatedSavings,
      actualSavings,
      estimatedSpend: Math.floor(random(7) * 1200000),
      actualSpend: Math.floor(random(8) * 1000000),
      owner: OWNERS[Math.floor(random(9) * OWNERS.length)],
      stage: STAGES[Math.floor(random(10) * STAGES.length)],
    };
  });
}

const INITIATIVES = makeInitiatives(72);

function getStatusBadge(status: Status): BadgeStatus {
  if (status === 'Complete') return 'Success';
  if (status === 'In flight') return 'Information';
  if (status === 'On hold') return 'Warning';
  return 'No Status';
}

function getStageBadge(stage: Stage): BadgeStatus {
  if (stage === 'Green') return 'Success';
  if (stage === 'Amber') return 'Warning';
  if (stage === 'Red') return 'Error';
  return 'No Status';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    currency: 'EUR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getSortValue(row: Initiative, key: SortKey): string | number {
  if (key === 'status') return STATUSES.indexOf(row.status);
  if (key === 'stage') return STAGES.indexOf(row.stage);
  if (key === 'estimatedSavings') return row.estimatedSavings;
  if (key === 'actualSavings') return row.actualSavings;
  if (key === 'estimatedSpend') return row.estimatedSpend;
  if (key === 'actualSpend') return row.actualSpend;
  return row[key];
}

function filterRows(rows: Initiative[], scope: ScopeFilter, status: StatusFilter, stage: StageFilter, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesScope =
      scope === 'team'
      || (scope === 'mine' && row.owner === CURRENT_USER)
      || (scope === 'triage' && (row.status === 'On hold' || row.stage === 'Red'));
    const matchesStatus = status === 'all' || row.status === status;
    const matchesStage = stage === 'all' || row.stage === stage;
    const matchesQuery =
      !normalizedQuery
      || [
        row.id,
        row.name,
        row.category,
        row.methodology,
        row.owner,
        row.status,
        row.stage,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesScope && matchesStatus && matchesStage && matchesQuery;
  });
}

function sortRows(rows: Initiative[], key: SortKey, direction: SortDirection) {
  return [...rows].sort((first, second) => {
    const firstValue = getSortValue(first, key);
    const secondValue = getSortValue(second, key);
    const comparison = typeof firstValue === 'number' && typeof secondValue === 'number'
      ? firstValue - secondValue
      : String(firstValue).localeCompare(String(secondValue));

    return direction === 'asc' ? comparison : -comparison;
  });
}

function ResourceStack({ resources }: { resources: string[] }) {
  const visibleResources = resources.slice(0, 3);
  const remaining = resources.length - visibleResources.length;

  return (
    <span className={styles.resourceStack}>
      <span className={styles.visuallyHidden}>Resources: {resources.join(', ')}</span>
      {visibleResources.map((resource, index) => (
        <span key={`${resource}-${index}`} className={styles.resourceInitial} aria-hidden="true">
          {getInitials(resource)}
        </span>
      ))}
      {remaining > 0 && (
        <span className={styles.resourceOverflow} aria-hidden="true">
          +{remaining}
        </span>
      )}
    </span>
  );
}

function OwnerCell({ owner }: { owner: string }) {
  return (
    <span className={styles.ownerCell}>
      <span className={styles.ownerInitial} aria-hidden="true">{getInitials(owner)}</span>
      <span className={styles.nowrapCell}>{owner}</span>
    </span>
  );
}

function SavingsCell({ row }: { row: Initiative }) {
  const isAboveEstimate = row.actualSavings >= row.estimatedSavings;

  return (
    <span className={styles.numericStack}>
      <span className={styles.numericCell}>{formatCurrency(row.actualSavings)}</span>
      <Badge
        label={isAboveEstimate ? 'Above estimate' : 'Below estimate'}
        status={isAboveEstimate ? 'Success' : 'Warning'}
      />
    </span>
  );
}

function SelectedInitiativePanel({
  initiative,
  onClose,
}: {
  initiative: Initiative;
  onClose: () => void;
}) {
  return (
    <Card type="Static" padding="Base" state="Information">
      <div className={styles.detailPanel}>
        <div className={styles.detailCopy}>
          <Text variant="Secondary" size="Small">Selected initiative</Text>
          <div className={styles.detailTitleRow}>
            <Headings size="Heading 5">{initiative.id} | {initiative.name}</Headings>
            <Badge label={initiative.status} status={getStatusBadge(initiative.status)} />
          </div>
          <div className={styles.detailGrid}>
            <span className={styles.detailItem}>
              <Text variant="Bold" size="Small">Owner</Text>
              <Text variant="Primary" size="Paragraph">{initiative.owner}</Text>
            </span>
            <span className={styles.detailItem}>
              <Text variant="Bold" size="Small">Methodology</Text>
              <Text variant="Primary" size="Paragraph">{initiative.methodology}</Text>
            </span>
            <span className={styles.detailItem}>
              <Text variant="Bold" size="Small">Actual savings</Text>
              <Text variant="Primary" size="Paragraph">{formatCurrency(initiative.actualSavings)}</Text>
            </span>
          </div>
        </div>
        <Button variant="Tertiary" onClick={onClose} icon={<FaIcon icon={FA.xmark} />}>
          Close detail
        </Button>
      </div>
    </Card>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className={styles.emptyState}>
      <Text variant="Bold" size="Paragraph">No initiatives match this view.</Text>
      <Text variant="Secondary" size="Paragraph">
        {hasFilters
          ? 'Clear search or change filters to return project initiatives.'
          : 'Add an initiative when sourcing work is ready to track.'}
      </Text>
    </div>
  );
}

function LoadingTable({
  columns,
  density,
}: {
  columns: TableColumn<Initiative>[];
  density: 'Default' | 'Compact';
}) {
  const loadingRows = Array.from({ length: PAGE_SIZE }, (_, index) => ({ id: `loading-${index}` }));
  const loadingColumns: TableColumn<{ id: string }>[] = columns.map((column) => ({
    id: column.id,
    header: column.header,
    width: column.width,
    render: () => <span className={styles.skeletonLine} />,
  }));

  return (
    <div className={styles.loadingRegion}>
      <div aria-hidden="true">
        <Table
          ariaLabel="Initiatives loading"
          columns={loadingColumns}
          rows={loadingRows}
          getRowKey={(row) => row.id}
          density={density}
        />
      </div>
      <span className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        Loading initiatives.
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
            <Headings size="Heading 5">Initiatives did not load</Headings>
            <Text variant="Secondary" size="Paragraph">
              The project initiative data could not be retrieved. Retry loading before updating sourcing actions.
            </Text>
          </div>
          <Button variant="Secondary" onClick={onRetry}>
            Retry load
          </Button>
        </div>
      </Card>
    </div>
  );
}

function LockedNotice() {
  return (
    <Card type="Static" padding="Base" state="Warning">
      <div className={styles.permissionNotice} role="note">
        <FaIcon icon={FA.triangleExclamation} />
        <div className={styles.statePanelCopy}>
          <Text variant="Bold" size="Small">Editing is restricted</Text>
          <Text variant="Warning" size="Paragraph">
            Your current role can review initiatives but cannot add, edit, or change stage values for this project.
          </Text>
        </div>
      </div>
    </Card>
  );
}

export function LovablePortBenchmark() {
  const [projectTab, setProjectTab] = useState(1);
  const [scope, setScope] = useState<ScopeFilter>('team');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [columnSet, setColumnSet] = useState<ColumnSet>('all');
  const [viewState, setViewState] = useState<ViewState>('data');
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'id',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);
  const [density, setDensity] = useState<'Default' | 'Compact'>('Default');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | undefined>();
  const [actionAnnouncement, setActionAnnouncement] = useState<string | null>(null);
  const [stageOverrides, setStageOverrides] = useState<Record<string, Stage>>({});

  const isLoading = viewState === 'loading';
  const isError = viewState === 'error';
  const isLocked = viewState === 'locked';
  const hasActiveFilters = scope !== 'team' || statusFilter !== 'all' || stageFilter !== 'all' || query.trim().length > 0;
  const teamCount = INITIATIVES.length;
  const mineCount = INITIATIVES.filter((row) => row.owner === CURRENT_USER).length;
  const triageCount = INITIATIVES.filter((row) => row.status === 'On hold' || row.stage === 'Red').length;

  const rowsWithStageOverrides = useMemo(
    () => INITIATIVES.map((row) => ({
      ...row,
      stage: stageOverrides[row.id] ?? row.stage,
    })),
    [stageOverrides],
  );
  const filteredRows = useMemo(
    () => filterRows(rowsWithStageOverrides, scope, statusFilter, stageFilter, query),
    [query, rowsWithStageOverrides, scope, stageFilter, statusFilter],
  );
  const sortedRows = useMemo(
    () => sortRows(filteredRows, sort.key, sort.direction),
    [filteredRows, sort],
  );
  const displayRows = viewState === 'empty' ? [] : sortedRows;
  const totalPages = Math.max(Math.ceil(displayRows.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const pagedRows = displayRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilters = [
    scope !== 'team' ? `Scope: ${scope === 'mine' ? 'Mine' : 'Triage'}` : undefined,
    statusFilter !== 'all' ? `Status: ${statusFilter}` : undefined,
    stageFilter !== 'all' ? `Stage: ${stageFilter}` : undefined,
    query.trim() ? `Search: ${query.trim()}` : undefined,
  ].filter(Boolean);

  const resetFilters = () => {
    setScope('team');
    setQuery('');
    setStatusFilter('all');
    setStageFilter('all');
    setPage(1);
  };

  const updateSort = (key: SortKey) => (direction: SortDirection) => {
    setSort({ key, direction });
    setPage(1);
  };

  const updateViewState = (nextState: ViewState) => {
    setViewState(nextState);
    setSelectedInitiative(undefined);
    setActionAnnouncement(null);
    setPage(1);
  };

  const selectInitiative = (initiative: Initiative) => {
    setSelectedInitiative(initiative);
    setActionAnnouncement(`Selected initiative ${initiative.id} ${initiative.name}. Detail summary is available before the table.`);
  };

  const cycleStage = (initiative: Initiative) => {
    if (isLocked) return;
    const currentIndex = STAGES.indexOf(initiative.stage);
    const nextStage = STAGES[(currentIndex + 1) % STAGES.length];

    setStageOverrides((current) => ({
      ...current,
      [initiative.id]: nextStage,
    }));
    setActionAnnouncement(`Stage for initiative ${initiative.id} changed to ${nextStage}.`);
  };

  const buildColumn = (key: ColumnKey): TableColumn<Initiative> => {
    if (key === 'id') {
      return {
        id: key,
        header: 'Initiative',
        width: 'calc(var(--orbit-space-mega) * 4)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        info: 'Open a row to review the initiative detail summary.',
        render: (row) => (
          <span className={styles.primaryCell}>
            <span className={styles.cellTitle}>{row.id}</span>
            <span className={styles.cellMeta}>{row.name}</span>
          </span>
        ),
      };
    }

    if (key === 'status') {
      return {
        id: key,
        header: 'Status',
        width: 'calc(var(--orbit-space-mega) * 2)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <Badge label={row.status} status={getStatusBadge(row.status)} />,
      };
    }

    if (key === 'category') {
      return {
        id: key,
        header: 'Category',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <span className={styles.nowrapCell}>{row.category}</span>,
      };
    }

    if (key === 'methodology') {
      return {
        id: key,
        header: 'Methodology',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <span className={styles.nowrapCell}>{row.methodology}</span>,
      };
    }

    if (key === 'resources') {
      return {
        id: key,
        header: 'Resources',
        width: 'calc(var(--orbit-space-mega) * 2)',
        render: (row) => <ResourceStack resources={row.resources} />,
      };
    }

    if (key === 'estimatedSavings') {
      return {
        id: key,
        header: 'Estimated savings',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <span className={styles.numericCell}>{formatCurrency(row.estimatedSavings)}</span>,
      };
    }

    if (key === 'actualSavings') {
      return {
        id: key,
        header: 'Actual savings',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <SavingsCell row={row} />,
      };
    }

    if (key === 'estimatedSpend') {
      return {
        id: key,
        header: 'Estimated spend',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <span className={styles.numericCell}>{formatCurrency(row.estimatedSpend)}</span>,
      };
    }

    if (key === 'actualSpend') {
      return {
        id: key,
        header: 'Actual spend',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <span className={styles.numericCell}>{formatCurrency(row.actualSpend)}</span>,
      };
    }

    if (key === 'owner') {
      return {
        id: key,
        header: 'Owner',
        width: 'calc(var(--orbit-space-mega) * 3)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => <OwnerCell owner={row.owner} />,
      };
    }

    if (key === 'stage') {
      return {
        id: key,
        header: 'Stage',
        width: 'calc(var(--orbit-space-mega) * 2)',
        sortable: true,
        sortDirection: sort.key === key ? sort.direction : undefined,
        onSortChange: updateSort(key),
        render: (row) => (
          <Button
            variant="Secondary"
            size="Small"
            className={styles.stageButton}
            disabled={isLocked}
            onClick={() => cycleStage(row)}
            iconRight={<FaIcon icon={FA.angleDown} />}
            aria-label={`Change stage for ${row.id}. Current stage: ${row.stage}`}
          >
            <Badge label={row.stage} status={getStageBadge(row.stage)} ariaLabel={`${row.stage} stage`} />
          </Button>
        ),
      };
    }

    return {
      id: key,
      header: 'Actions',
      width: 'calc(var(--orbit-space-mega) * 3)',
      render: (row) => (
        <span className={styles.actionGroup}>
          <Button
            variant="Secondary"
            size="Small"
            aria-label={`View initiative ${row.id} ${row.name}`}
            onClick={() => selectInitiative(row)}
          >
            View
          </Button>
          <Button
            variant="Tertiary"
            size="Small"
            disabled={isLocked}
            aria-label={`Edit initiative ${row.id} ${row.name}`}
            onClick={() => selectInitiative(row)}
          >
            Edit
          </Button>
        </span>
      ),
    };
  };

  const columns = COLUMN_SET_KEYS[columnSet].map(buildColumn);
  const activePanelId = PROJECT_TABS[projectTab]?.panelId ?? PROJECT_TABS[1].panelId;
  const screenReaderStatus = useMemo(() => {
    if (actionAnnouncement) return actionAnnouncement;
    if (projectTab !== 1) return `${PROJECT_TABS[projectTab]?.label} tab selected. This panel is outside the benchmark.`;
    if (viewState === 'loading') return '';
    if (viewState === 'error') return 'Initiatives did not load. Retry load is available.';
    if (viewState === 'empty') return 'Empty state selected. No initiatives match this view.';
    if (viewState === 'locked') return 'No permission state selected. Editing controls are disabled.';
    return `Initiatives data view loaded. ${displayRows.length} initiatives available.`;
  }, [actionAnnouncement, displayRows.length, projectTab, viewState]);

  return (
    <main className={styles.page}>
      <div className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </div>
      <section className={styles.benchmarkHeader}>
        <div className={styles.headingStack}>
          <Text variant="Secondary" size="Small">Benchmark Task 4</Text>
          <Headings size="Heading 1">Lovable initiatives port</Headings>
          <Text variant="Secondary" size="Paragraph">
            External AUT01 initiatives table translated into Orbit components, token-backed layout, full states, and accessible controls.
          </Text>
        </div>
      </section>

      <section className={styles.projectShell}>
        <PageHeader
          type="tool"
          title="AUT01 - Training - AutoScout24"
          subtitle="Projects and initiatives"
          icon={FA.file}
          {...HeaderPresets.deliver}
          pill={{ code: 'AUT01', label: 'Training - AutoScout24' }}
          actions={[
            {
              id: 'export',
              label: 'Export view',
              icon: FA.file,
              variant: 'Secondary',
            },
            {
              id: 'add',
              label: 'Add initiative',
              variant: 'Primary',
              disabled: isLocked || isLoading,
            },
          ]}
          tabs={PROJECT_TABS}
          activeTab={projectTab}
          onTabChange={(index) => {
            setProjectTab(index);
            setActionAnnouncement(null);
          }}
        />

        {PROJECT_TABS.map((tab, index) => (
          index === projectTab ? null : (
            <section
              key={tab.panelId}
              id={tab.panelId}
              role="tabpanel"
              aria-labelledby={tab.id}
              hidden
            />
          )
        ))}

        <section
          id={activePanelId}
          role="tabpanel"
          aria-labelledby={PROJECT_TABS[projectTab]?.id}
          className={styles.projectPanel}
        >
          {projectTab !== 1 ? (
            <Card type="Static" padding="Base" state="Information">
              <div className={styles.statePanel}>
                <div className={styles.statePanelCopy}>
                  <Headings size="Heading 5">{PROJECT_TABS[projectTab]?.label} is outside this benchmark.</Headings>
                  <Text variant="Secondary" size="Paragraph">
                    Task 4 ports the Lovable initiatives table. Return to the Initiatives tab to inspect the converted workflow.
                  </Text>
                </div>
                <Button variant="Secondary" onClick={() => setProjectTab(1)}>
                  Open initiatives
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <section className={styles.stateToolbar} aria-label="Benchmark state preview">
                <div className={styles.toolbarCopy}>
                  <Text variant="Bold" size="Small">State</Text>
                  <Text variant="Secondary" size="Small">Preview missing Lovable states against the same table composition.</Text>
                </div>
                <div className={styles.stateControls} role="group" aria-label="Initiatives table state">
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
              </section>

              <section className={styles.summaryStrip} aria-label="Initiatives summary">
                <span className={styles.summaryItem}>
                  <Text variant="Secondary" size="Small">Team initiatives</Text>
                  <strong>{teamCount.toLocaleString('en-GB')}</strong>
                </span>
                <span className={styles.summaryItem}>
                  <Text variant="Secondary" size="Small">My initiatives</Text>
                  <strong>{mineCount.toLocaleString('en-GB')}</strong>
                </span>
                <span className={styles.summaryItem}>
                  <Text variant="Secondary" size="Small">Triage queue</Text>
                  <strong>{triageCount.toLocaleString('en-GB')}</strong>
                </span>
              </section>

              <section className={styles.toolbar} aria-label="Initiative controls">
                <div className={styles.toolbarRow}>
                  <div className={styles.scopeControls} role="group" aria-label="Initiative scope">
                    {[
                      { key: 'mine' as const, label: `Mine ${mineCount}` },
                      { key: 'team' as const, label: `Team ${teamCount}` },
                      { key: 'triage' as const, label: `Triage ${triageCount}` },
                    ].map((option) => (
                      <Button
                        key={option.key}
                        variant="Secondary"
                        size="Small"
                        aria-pressed={scope === option.key}
                        className={styles.toggleButton}
                        onClick={() => {
                          setScope(option.key);
                          setPage(1);
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>

                  <div className={styles.searchArea}>
                    <Searchbox
                      ariaLabel="Search initiatives"
                      placeholder="Search initiatives"
                      value={query}
                      onChange={(value) => {
                        setQuery(value);
                        setPage(1);
                      }}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className={styles.toolbarRow}>
                  <div className={styles.filterControls}>
                    <div className={styles.filterField}>
                      <Dropdown
                        label="Status"
                        options={STATUS_OPTIONS}
                        value={statusFilter}
                        onChange={(value) => {
                          setStatusFilter(value as StatusFilter);
                          setPage(1);
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles.filterField}>
                      <Dropdown
                        label="Stage"
                        options={STAGE_OPTIONS}
                        value={stageFilter}
                        onChange={(value) => {
                          setStageFilter(value as StageFilter);
                          setPage(1);
                        }}
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles.filterField}>
                      <Dropdown
                        label="Column set"
                        options={COLUMN_SET_OPTIONS}
                        value={columnSet}
                        onChange={(value) => setColumnSet(value as ColumnSet)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className={styles.densityControls} role="group" aria-label="Table density">
                    {[
                      { key: 'Default' as const, label: 'Comfortable' },
                      { key: 'Compact' as const, label: 'Compact' },
                    ].map((option) => (
                      <Button
                        key={option.key}
                        variant="Secondary"
                        size="Small"
                        aria-pressed={density === option.key}
                        className={styles.toggleButton}
                        onClick={() => setDensity(option.key)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </section>

              <section className={styles.activeFilters} aria-label="Active filters">
                <div className={styles.activeFilterList}>
                  {activeFilters.length > 0 ? (
                    activeFilters.map((filter) => (
                      <Badge key={filter} label={filter ?? ''} status="Information" />
                    ))
                  ) : (
                    <Text variant="Secondary" size="Small">No active filters</Text>
                  )}
                  {hasActiveFilters && (
                    <Button variant="Tertiary" size="Small" onClick={resetFilters} icon={<FaIcon icon={FA.xmark} />}>
                      Clear filters
                    </Button>
                  )}
                </div>
                <Text variant="Secondary" size="Small">
                  {displayRows.length.toLocaleString('en-GB')} initiatives
                </Text>
              </section>

              {isLocked && <LockedNotice />}
              {selectedInitiative && !isLoading && !isError && (
                <SelectedInitiativePanel
                  initiative={selectedInitiative}
                  onClose={() => setSelectedInitiative(undefined)}
                />
              )}

              {isError ? (
                <ErrorState onRetry={() => updateViewState('data')} />
              ) : isLoading ? (
                <LoadingTable columns={columns} density={density} />
              ) : (
                <section className={styles.tableRegion} aria-labelledby="lovable-port-project-heading">
                  <div id="lovable-port-project-heading" className={styles.tableHeader}>
                    <div className={styles.headingStack}>
                      <Headings size="Heading 3">Initiatives</Headings>
                      <Text variant="Secondary" size="Paragraph">
                        Sort, filter, and review project initiatives with Orbit table semantics.
                      </Text>
                    </div>
                  </div>
                  <Table
                    ariaLabel="AUT01 initiatives"
                    columns={columns}
                    rows={pagedRows}
                    getRowKey={(row) => row.id}
                    density={density}
                    emptyState={<EmptyState hasFilters={hasActiveFilters || viewState === 'empty'} />}
                    onRowSelect={selectInitiative}
                    getRowSelectionLabel={(row) => `View initiative ${row.id} ${row.name}`}
                    pagination={{
                      page: currentPage,
                      pageSize: PAGE_SIZE,
                      totalRows: displayRows.length,
                      onPageChange: setPage,
                    }}
                  />
                </section>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}
