'use client';

import React, { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  FA,
  FaIcon,
  Headings,
  Table,
  Text,
  Toggle,
  type TableColumn,
} from '@efficio/orbit';
import styles from './MarketIQAnalyticsDashboardBenchmark.module.css';

type PreviewState = 'data' | 'loading' | 'insufficient' | 'stale' | 'failure';
type Density = 'comfortable' | 'compact';
type FilterKey = 'all' | 'high-pressure' | 'low-confidence';
type SortKey = 'category' | 'spend' | 'movement' | 'opportunity' | 'confidence';
type SortDirection = 'asc' | 'desc';
type Pressure = 'High' | 'Medium' | 'Low';
type Confidence = 'High' | 'Medium' | 'Low';
type BadgeStatus = NonNullable<React.ComponentProps<typeof Badge>['status']>;

interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  direction: 'positive' | 'negative' | 'neutral';
  period: string;
  state: React.ComponentProps<typeof Card>['state'];
}

interface TrendPoint {
  period: string;
  label: string;
  index: number;
  opportunity: number;
}

interface CategoryAnalyticsRow {
  id: string;
  category: string;
  portfolio: string;
  spend: number;
  indexMovement: number;
  opportunity: number;
  opportunityRate: number;
  suppliers: number;
  pressure: Pressure;
  confidence: Confidence;
  lastUpdated: string;
  nextAction: string;
}

const CHART_WIDTH = 640;
const CHART_HEIGHT = 240;
const CHART_PADDING = {
  top: 20,
  right: 24,
  bottom: 42,
  left: 56,
};
const TABLE_PAGE_SIZE = 6;
const LAST_REFRESH = new Date('2026-06-14T08:20:00+01:00');

const KPI_METRICS: KpiMetric[] = [
  {
    id: 'addressable-spend',
    label: 'Addressable spend',
    value: '£18.4m',
    delta: '+6.2%',
    direction: 'positive',
    period: 'vs prior quarter',
    state: 'Information',
  },
  {
    id: 'forecast-variance',
    label: 'Forecast variance',
    value: '+4.8%',
    delta: '+1.1 pts',
    direction: 'negative',
    period: 'from approved plan',
    state: 'Warning',
  },
  {
    id: 'open-opportunity',
    label: 'Open savings opportunity',
    value: '£1.24m',
    delta: '+£220k',
    direction: 'positive',
    period: 'identified this cycle',
    state: 'Success',
  },
  {
    id: 'source-coverage',
    label: 'Supplier coverage',
    value: '86%',
    delta: '-4 pts',
    direction: 'negative',
    period: 'from target coverage',
    state: 'Highlight',
  },
];

const TREND_POINTS: TrendPoint[] = [
  { period: 'January 2026', label: 'Jan', index: 100.8, opportunity: 0.72 },
  { period: 'February 2026', label: 'Feb', index: 101.6, opportunity: 0.76 },
  { period: 'March 2026', label: 'Mar', index: 103.1, opportunity: 0.91 },
  { period: 'April 2026', label: 'Apr', index: 104.2, opportunity: 1.02 },
  { period: 'May 2026', label: 'May', index: 105.7, opportunity: 1.16 },
  { period: 'June 2026', label: 'Jun', index: 106.8, opportunity: 1.24 },
];

const CATEGORY_ROWS: CategoryAnalyticsRow[] = [
  {
    id: 'cat-fm',
    category: 'Facilities management',
    portfolio: 'Indirect operations',
    spend: 4200000,
    indexMovement: 7.4,
    opportunity: 360000,
    opportunityRate: 86,
    suppliers: 18,
    pressure: 'High',
    confidence: 'High',
    lastUpdated: '2026-06-14',
    nextAction: 'Reopen rate-card benchmarks before renewing the regional FM framework.',
  },
  {
    id: 'cat-logistics',
    category: 'Logistics',
    portfolio: 'Supply chain',
    spend: 3600000,
    indexMovement: 6.9,
    opportunity: 310000,
    opportunityRate: 74,
    suppliers: 14,
    pressure: 'High',
    confidence: 'Medium',
    lastUpdated: '2026-06-13',
    nextAction: 'Compare lane-level fuel surcharge clauses against the market index.',
  },
  {
    id: 'cat-it-services',
    category: 'IT services',
    portfolio: 'Technology',
    spend: 3100000,
    indexMovement: 3.8,
    opportunity: 210000,
    opportunityRate: 50,
    suppliers: 23,
    pressure: 'Medium',
    confidence: 'High',
    lastUpdated: '2026-06-14',
    nextAction: 'Prioritise managed service contracts with renewal dates before September.',
  },
  {
    id: 'cat-marketing',
    category: 'Marketing agencies',
    portfolio: 'Commercial',
    spend: 1900000,
    indexMovement: 2.1,
    opportunity: 118000,
    opportunityRate: 28,
    suppliers: 9,
    pressure: 'Medium',
    confidence: 'Low',
    lastUpdated: '2026-06-11',
    nextAction: 'Confirm rate-card coverage before using the benchmark in negotiations.',
  },
  {
    id: 'cat-professional',
    category: 'Professional services',
    portfolio: 'Advisory',
    spend: 2700000,
    indexMovement: 1.6,
    opportunity: 142000,
    opportunityRate: 34,
    suppliers: 12,
    pressure: 'Low',
    confidence: 'Medium',
    lastUpdated: '2026-06-12',
    nextAction: 'Use blended rate variance as a watch item for the next sourcing wave.',
  },
  {
    id: 'cat-maintenance',
    category: 'Maintenance materials',
    portfolio: 'Plant operations',
    spend: 2900000,
    indexMovement: 5.2,
    opportunity: 246000,
    opportunityRate: 59,
    suppliers: 21,
    pressure: 'High',
    confidence: 'Low',
    lastUpdated: '2026-06-10',
    nextAction: 'Map supplier catalogue coverage before presenting savings forecast.',
  },
  {
    id: 'cat-travel',
    category: 'Business travel',
    portfolio: 'People operations',
    spend: 1200000,
    indexMovement: -0.8,
    opportunity: 52000,
    opportunityRate: 12,
    suppliers: 6,
    pressure: 'Low',
    confidence: 'High',
    lastUpdated: '2026-06-14',
    nextAction: 'Hold the current programme and monitor air corridor pricing monthly.',
  },
  {
    id: 'cat-energy',
    category: 'Energy',
    portfolio: 'Utilities',
    spend: 2800000,
    indexMovement: 4.9,
    opportunity: 268000,
    opportunityRate: 64,
    suppliers: 8,
    pressure: 'Medium',
    confidence: 'Medium',
    lastUpdated: '2026-06-13',
    nextAction: 'Validate hedged-volume assumptions before moving to award recommendation.',
  },
];

const VIEW_STATE_OPTIONS: Array<{ key: PreviewState; label: string }> = [
  { key: 'data', label: 'Data' },
  { key: 'loading', label: 'Loading' },
  { key: 'insufficient', label: 'Insufficient data' },
  { key: 'stale', label: 'Stale' },
  { key: 'failure', label: 'Load issue' },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    compactDisplay: 'short',
    currency: 'GBP',
    maximumFractionDigits: 1,
    notation: 'compact',
    style: 'currency',
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 1,
    signDisplay: 'exceptZero',
    style: 'percent',
  }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZone: 'Europe/London',
    timeZoneName: 'short',
    year: 'numeric',
  }).format(value);
}

function getPressureStatus(pressure: Pressure): BadgeStatus {
  if (pressure === 'High') return 'Error';
  if (pressure === 'Medium') return 'Warning';
  return 'Success';
}

function getConfidenceStatus(confidence: Confidence): BadgeStatus {
  if (confidence === 'Low') return 'Warning';
  if (confidence === 'Medium') return 'Information';
  return 'Success';
}

function getDeltaIcon(direction: KpiMetric['direction']) {
  if (direction === 'positive') return FA.angleUp;
  if (direction === 'negative') return FA.angleDown;
  return FA.minus;
}

function getBarTone(row: CategoryAnalyticsRow) {
  if (row.pressure === 'High') return styles.barHigh;
  if (row.pressure === 'Medium') return styles.barMedium;
  return styles.barLow;
}

function filterRows(rows: CategoryAnalyticsRow[], filter: FilterKey) {
  if (filter === 'high-pressure') return rows.filter((row) => row.pressure === 'High');
  if (filter === 'low-confidence') return rows.filter((row) => row.confidence === 'Low');
  return rows;
}

function sortRows(rows: CategoryAnalyticsRow[], key: SortKey, direction: SortDirection) {
  return [...rows].sort((first, second) => {
    let comparison = 0;

    if (key === 'spend') {
      comparison = first.spend - second.spend;
    } else if (key === 'movement') {
      comparison = first.indexMovement - second.indexMovement;
    } else if (key === 'opportunity') {
      comparison = first.opportunity - second.opportunity;
    } else if (key === 'confidence') {
      comparison = confidenceRank(first.confidence) - confidenceRank(second.confidence);
    } else {
      comparison = first.category.localeCompare(second.category);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

function confidenceRank(confidence: Confidence) {
  if (confidence === 'High') return 3;
  if (confidence === 'Medium') return 2;
  return 1;
}

function getTrendChart() {
  const values = TREND_POINTS.map((point) => point.index);
  const minValue = Math.floor(Math.min(...values)) - 1;
  const maxValue = Math.ceil(Math.max(...values)) + 1;
  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  const getX = (index: number) => CHART_PADDING.left + (plotWidth / (TREND_POINTS.length - 1)) * index;
  const getY = (value: number) => CHART_PADDING.top + ((maxValue - value) / (maxValue - minValue)) * plotHeight;

  const points = TREND_POINTS.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(point.index),
  }));
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = `${path} L ${points[points.length - 1].x} ${CHART_HEIGHT - CHART_PADDING.bottom} L ${points[0].x} ${CHART_HEIGHT - CHART_PADDING.bottom} Z`;
  const yTicks = Array.from({ length: maxValue - minValue + 1 }, (_, index) => minValue + index)
    .filter((tick) => tick % 2 === 0 || tick === minValue || tick === maxValue);

  return { areaPath, maxValue, minValue, path, points, yTicks };
}

function KpiCard({ metric, stale }: { metric: KpiMetric; stale: boolean }) {
  return (
    <Card type="Static" padding="Small" state={stale ? 'Warning' : metric.state}>
      <div className={styles.kpiCard}>
        <span className={styles.kpiValue}>{metric.value}</span>
        <div className={styles.kpiLabelRow}>
          <Text variant="Secondary" size="Small">{metric.label}</Text>
          {stale && <Badge label="Stale" status="Warning" />}
        </div>
        <span className={`${styles.delta} ${styles[metric.direction]}`}>
          <FaIcon icon={getDeltaIcon(metric.direction)} />
          <span>{metric.delta}</span>
          <span className={styles.deltaPeriod}>{metric.period}</span>
        </span>
      </div>
    </Card>
  );
}

function KpiSkeleton() {
  return (
    <Card type="Static" padding="Small" state="Disabled">
      <div className={styles.kpiCard} aria-hidden="true">
        <span className={styles.skeletonValue} />
        <span className={styles.skeletonLine} />
        <span className={styles.skeletonLineShort} />
      </div>
    </Card>
  );
}

function TrendChart({ stale }: { stale: boolean }) {
  const chart = getTrendChart();
  const chartTitleId = 'marketiq-trend-chart-title';
  const chartDescriptionId = 'marketiq-trend-chart-description';

  return (
    <Card type="Static" padding="Small" state={stale ? 'Warning' : 'Default'}>
      <div className={styles.chartPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.headingStack}>
            <Text variant="Secondary" size="Small">Market index trend</Text>
            <div id={chartTitleId}>
              <Headings size="Heading 4">Benchmark pressure over six months</Headings>
            </div>
          </div>
          <Badge label={stale ? 'Stale source' : 'Live benchmark'} status={stale ? 'Warning' : 'Information'} />
        </div>

        <div className={styles.trendFrame}>
          <svg
            className={styles.trendSvg}
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            role="img"
            aria-labelledby={`${chartTitleId} ${chartDescriptionId}`}
          >
            <desc id={chartDescriptionId}>
              Market benchmark index rises from {TREND_POINTS[0].index} in January 2026 to {TREND_POINTS[TREND_POINTS.length - 1].index} in June 2026.
            </desc>
            {chart.yTicks.map((tick) => {
              const y = CHART_PADDING.top
                + ((chart.maxValue - tick) / (chart.maxValue - chart.minValue))
                * (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom);

              return (
                <g key={tick}>
                  <line
                    className={styles.gridLine}
                    x1={CHART_PADDING.left}
                    x2={CHART_WIDTH - CHART_PADDING.right}
                    y1={y}
                    y2={y}
                  />
                  <text className={styles.axisTick} x={CHART_PADDING.left - 12} y={y}>
                    {tick}
                  </text>
                </g>
              );
            })}
            <path className={styles.trendArea} d={chart.areaPath} />
            <path className={styles.trendLine} d={chart.path} />
            {chart.points.map((point) => (
              <g key={point.period}>
                <circle className={styles.trendPoint} cx={point.x} cy={point.y} r="var(--orbit-space-xs)" aria-hidden="true" />
                <text className={styles.xAxisLabel} x={point.x} y={CHART_HEIGHT - CHART_PADDING.bottom + 26}>
                  {point.label}
                </text>
              </g>
            ))}
          </svg>

          <div className={styles.chartLegend} aria-label="Trend chart legend">
            <span className={styles.legendItem}>
              <span className={`${styles.legendSwatch} ${styles.legendMarket}`} aria-hidden="true" />
              Market index
            </span>
            <span className={styles.legendMeta}>
              Latest opportunity: {formatCurrency(TREND_POINTS[TREND_POINTS.length - 1].opportunity * 1000000)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CategoryComparison({ rows, stale }: { rows: CategoryAnalyticsRow[]; stale: boolean }) {
  const visibleRows = rows.slice(0, 6);

  return (
    <Card type="Static" padding="Small" state={stale ? 'Warning' : 'Default'}>
      <div className={styles.chartPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.headingStack}>
            <Text variant="Secondary" size="Small">Category comparison</Text>
            <Headings size="Heading 4">Savings opportunity by category</Headings>
          </div>
          <Badge label={`${visibleRows.length} categories`} status="Information" />
        </div>

        <div className={styles.categoryBars} role="list" aria-label="Savings opportunity comparison by category">
          {visibleRows.map((row) => (
            <div
              key={row.id}
              className={styles.categoryBarRow}
              role="listitem"
              aria-label={`${row.category}: ${formatCurrency(row.opportunity)} opportunity, ${row.pressure.toLowerCase()} market pressure`}
            >
              <div className={styles.barLabel}>
                <span className={styles.cellTitle}>{row.category}</span>
                <span className={styles.cellMeta}>{row.portfolio}</span>
              </div>
              <div className={styles.barTrack} aria-hidden="true">
                <span
                  className={`${styles.barFill} ${getBarTone(row)}`}
                  style={{ '--bar-value': String(row.opportunityRate) } as React.CSSProperties}
                />
              </div>
              <div className={styles.barValue}>
                <span>{formatCurrency(row.opportunity)}</span>
                <Badge label={row.pressure} status={getPressureStatus(row.pressure)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function LoadingDashboard({ columns }: { columns: TableColumn<CategoryAnalyticsRow>[] }) {
  const loadingRows = Array.from({ length: TABLE_PAGE_SIZE }, (_, index) => ({ id: `loading-${index}` }));
  const loadingColumns: TableColumn<{ id: string }>[] = columns.map((column) => ({
    id: column.id,
    header: column.header,
    render: () => <span className={styles.skeletonLine} />,
  }));

  return (
    <div className={styles.loadingRegion}>
      <div aria-hidden="true">
        <section className={styles.kpiGrid} aria-label="MarketIQ KPI loading skeleton">
          {KPI_METRICS.map((metric) => <KpiSkeleton key={metric.id} />)}
        </section>
        <section className={styles.chartGrid} aria-label="MarketIQ chart loading skeleton">
          <Card type="Static" padding="Small" state="Disabled">
            <div className={styles.chartSkeleton} aria-hidden="true">
              <span className={styles.skeletonLineShort} />
              <span className={styles.skeletonChart} />
            </div>
          </Card>
          <Card type="Static" padding="Small" state="Disabled">
            <div className={styles.chartSkeleton} aria-hidden="true">
              <span className={styles.skeletonLineShort} />
              <span className={styles.skeletonChart} />
            </div>
          </Card>
        </section>
        <Table
          ariaLabel="MarketIQ category analytics loading"
          columns={loadingColumns}
          rows={loadingRows}
          getRowKey={(row) => row.id}
          density="Compact"
        />
      </div>
      <span className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        Loading MarketIQ analytics.
      </span>
    </div>
  );
}

function InsufficientDataState({ onReset }: { onReset: () => void }) {
  return (
    <Card type="Static" padding="Base" state="Information">
      <div className={styles.statePanel} role="status" aria-live="polite">
        <div className={styles.stateIcon}>
          <FaIcon icon={FA.circleInfo} />
        </div>
        <div className={styles.statePanelCopy}>
          <Headings size="Heading 4">MarketIQ needs more source coverage</Headings>
          <Text variant="Secondary" size="Paragraph">
            Only two supplier feeds are mapped to this category set. Add at least three active feeds before using trend or category comparisons in a recommendation.
          </Text>
        </div>
        <Button variant="Secondary" onClick={onReset}>
          Review mapped feeds
        </Button>
      </div>
    </Card>
  );
}

function FailureState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card type="Static" padding="Base" state="Error">
      <div className={styles.statePanel} role="alert">
        <div className={styles.errorIcon}>
          <FaIcon icon={FA.circleExclamation} />
        </div>
        <div className={styles.statePanelCopy}>
          <Headings size="Heading 4">Analytics did not load</Headings>
          <Text variant="Secondary" size="Paragraph">
            MarketIQ could not retrieve the benchmark index and category rows. Retry before exporting this dashboard.
          </Text>
        </div>
        <Button variant="Secondary" onClick={onRetry}>
          Retry analytics
        </Button>
      </div>
    </Card>
  );
}

function StaleNotice({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card type="Static" padding="Base" state="Warning">
      <div className={styles.statePanel} role="status" aria-live="polite">
        <div className={styles.warningIcon}>
          <FaIcon icon={FA.triangleExclamation} />
        </div>
        <div className={styles.statePanelCopy}>
          <Headings size="Heading 5">Benchmark data is stale</Headings>
          <Text variant="Warning" size="Paragraph">
            Last refreshed {formatDateTime(LAST_REFRESH)}. Refresh MarketIQ before using the forecast variance in an award recommendation.
          </Text>
        </div>
        <Button variant="Primary" onClick={onRefresh}>
          Refresh stale analytics
        </Button>
      </div>
    </Card>
  );
}

function EmptyTableState() {
  return (
    <div className={styles.emptyState}>
      <Text variant="Bold" size="Paragraph">No category rows are ready for this view.</Text>
      <Text variant="Secondary" size="Paragraph">
        Map supplier feeds or change filters before using MarketIQ analytics for category recommendations.
      </Text>
    </div>
  );
}

export function MarketIQAnalyticsDashboardBenchmark() {
  const [previewState, setPreviewState] = useState<PreviewState>('data');
  const [density, setDensity] = useState<Density>('comfortable');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [actionAnnouncement, setActionAnnouncement] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'opportunity',
    direction: 'desc',
  });
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => filterRows(CATEGORY_ROWS, filter), [filter]);
  const sortedRows = useMemo(() => sortRows(filteredRows, sort.key, sort.direction), [filteredRows, sort]);
  const currentPage = Math.min(page, Math.max(Math.ceil(sortedRows.length / TABLE_PAGE_SIZE), 1));
  const pagedRows = sortedRows.slice((currentPage - 1) * TABLE_PAGE_SIZE, currentPage * TABLE_PAGE_SIZE);
  const isLoading = previewState === 'loading';
  const isInsufficient = previewState === 'insufficient';
  const isFailure = previewState === 'failure';
  const isStale = previewState === 'stale';

  const pressureCount = CATEGORY_ROWS.filter((row) => row.pressure === 'High').length;
  const lowConfidenceCount = CATEGORY_ROWS.filter((row) => row.confidence === 'Low').length;
  const filterOptions: Array<{ key: FilterKey; label: string }> = [
    { key: 'all', label: `All ${CATEGORY_ROWS.length}` },
    { key: 'high-pressure', label: `High pressure ${pressureCount}` },
    { key: 'low-confidence', label: `Low confidence ${lowConfidenceCount}` },
  ];

  const updateViewState = (nextState: PreviewState) => {
    setPreviewState(nextState);
    setActionAnnouncement(null);
    setPage(1);
  };

  const refreshAnalytics = () => {
    setPreviewState('data');
    setActionAnnouncement('MarketIQ analytics refreshed. Data view is ready.');
    setPage(1);
  };

  const retryAnalytics = () => {
    setPreviewState('data');
    setActionAnnouncement('MarketIQ analytics loaded after retry.');
    setPage(1);
  };

  const updateFilter = (nextFilter: FilterKey) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const updateSort = (key: SortKey) => (direction: SortDirection) => {
    setSort({ key, direction });
    setPage(1);
  };

  const columns = useMemo<TableColumn<CategoryAnalyticsRow>[]>(
    () => [
      {
        id: 'category',
        header: 'Category',
        sortable: true,
        sortDirection: sort.key === 'category' ? sort.direction : undefined,
        onSortChange: updateSort('category'),
        info: 'Category rows are the source data behind the KPI and chart views.',
        render: (row) => (
          <span className={styles.primaryCell}>
            <span className={styles.cellTitle}>{row.category}</span>
            <span className={styles.cellMeta}>{row.id} - {row.portfolio}</span>
          </span>
        ),
      },
      {
        id: 'spend',
        header: 'Spend',
        sortable: true,
        sortDirection: sort.key === 'spend' ? sort.direction : undefined,
        onSortChange: updateSort('spend'),
        render: (row) => <span className={styles.numericCell}>{formatCurrency(row.spend)}</span>,
      },
      {
        id: 'movement',
        header: 'Index movement',
        sortable: true,
        sortDirection: sort.key === 'movement' ? sort.direction : undefined,
        onSortChange: updateSort('movement'),
        render: (row) => (
          <span className={`${styles.deltaCell} ${row.indexMovement > 0 ? styles.negative : styles.positive}`}>
            <FaIcon icon={row.indexMovement > 0 ? FA.angleUp : FA.angleDown} />
            {formatPercent(row.indexMovement)}
          </span>
        ),
      },
      {
        id: 'opportunity',
        header: 'Opportunity',
        sortable: true,
        sortDirection: sort.key === 'opportunity' ? sort.direction : undefined,
        onSortChange: updateSort('opportunity'),
        render: (row) => <span className={styles.numericCell}>{formatCurrency(row.opportunity)}</span>,
      },
      {
        id: 'suppliers',
        header: 'Suppliers',
        render: (row) => <span className={styles.numericCell}>{row.suppliers}</span>,
      },
      {
        id: 'status',
        header: 'Signals',
        sortable: true,
        sortDirection: sort.key === 'confidence' ? sort.direction : undefined,
        onSortChange: updateSort('confidence'),
        render: (row) => (
          <span className={styles.badgeStack}>
            <Badge label={`${row.pressure} pressure`} status={getPressureStatus(row.pressure)} />
            <Badge label={`${row.confidence} confidence`} status={getConfidenceStatus(row.confidence)} />
          </span>
        ),
      },
      {
        id: 'updated',
        header: 'Updated',
        render: (row) => <span className={styles.nowrapCell}>{formatDate(row.lastUpdated)}</span>,
      },
      {
        id: 'action',
        header: 'Next action',
        render: (row) => <span className={styles.wrapCell}>{row.nextAction}</span>,
      },
    ],
    [sort],
  );

  const tableRows = isInsufficient ? [] : pagedRows;
  const showPagination = !isInsufficient && sortedRows.length > TABLE_PAGE_SIZE;
  const screenReaderStatus = useMemo(() => {
    if (actionAnnouncement) return actionAnnouncement;
    if (previewState === 'loading') return '';
    if (previewState === 'failure') return 'MarketIQ analytics did not load. Retry analytics is available.';
    if (previewState === 'insufficient') return 'Insufficient data selected. More source coverage is required before analytics can be used.';
    if (previewState === 'stale') return 'Stale data selected. Refresh stale analytics is available.';
    return `MarketIQ analytics data view loaded. ${sortedRows.length} category rows available.`;
  }, [actionAnnouncement, previewState, sortedRows.length]);

  return (
    <main className={styles.page}>
      <div className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        {screenReaderStatus}
      </div>
      <section className={styles.header}>
        <div className={styles.headerCopy}>
          <Text variant="Secondary" size="Small">Benchmark Task 3</Text>
          <div className={styles.headingStack}>
            <Headings size="Heading 1">MarketIQ analytics dashboard</Headings>
            <Text variant="Secondary" size="Paragraph">
              KPI-led procurement analytics with trend context, category comparison, and underlying rows for recommendation review.
            </Text>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Toggle
            checked={density === 'compact'}
            label="Compact density"
            onChange={(checked) => setDensity(checked ? 'compact' : 'comfortable')}
          />
          <Button variant="Secondary" disabled={isLoading || isFailure || isInsufficient}>
            Export category rows
          </Button>
          <Button variant="Primary" onClick={refreshAnalytics} disabled={isLoading}>
            Refresh analytics
          </Button>
        </div>
      </section>

      <section className={styles.stateToolbar} aria-label="Analytics dashboard state preview">
        <div className={styles.toolbarCopy}>
          <Text variant="Bold" size="Small">State</Text>
          <Text variant="Secondary" size="Small">Preview the required MarketIQ analytics states in the same layout.</Text>
        </div>
        <div className={styles.stateControls} role="group" aria-label="MarketIQ analytics dashboard state">
          {VIEW_STATE_OPTIONS.map((option) => (
            <Button
              key={option.key}
              variant="Secondary"
              size="Small"
              aria-pressed={previewState === option.key}
              className={styles.toggleButton}
              onClick={() => updateViewState(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <LoadingDashboard columns={columns} />
      ) : isFailure ? (
        <FailureState onRetry={retryAnalytics} />
      ) : (
        <>
          {isStale && <StaleNotice onRefresh={refreshAnalytics} />}
          {isInsufficient ? (
            <InsufficientDataState onReset={() => updateViewState('data')} />
          ) : (
            <>
              <section className={styles.kpiGrid} data-density={density} aria-label="MarketIQ KPI summary">
                {KPI_METRICS.map((metric) => (
                  <KpiCard key={metric.id} metric={metric} stale={isStale} />
                ))}
              </section>

              <section className={styles.chartGrid} data-density={density} aria-label="MarketIQ chart summary">
                <TrendChart stale={isStale} />
                <CategoryComparison rows={sortedRows} stale={isStale} />
              </section>
            </>
          )}

          <section className={styles.tableRegion} aria-labelledby="marketiq-underlying-data-heading">
            <div className={styles.toolbar}>
              <div className={styles.tableHeader}>
                <div className={styles.headingStack}>
                  <div id="marketiq-underlying-data-heading">
                    <Headings size="Heading 3">Underlying category rows</Headings>
                  </div>
                  <span className={styles.tableMeta}>
                    {isInsufficient
                      ? 'Source coverage is below the benchmark threshold'
                      : `${sortedRows.length} rows available from MarketIQ category benchmarks`}
                  </span>
                </div>
                <div className={styles.filterControls} role="group" aria-label="Category row filters">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.key}
                      variant="Secondary"
                      size="Small"
                      aria-pressed={filter === option.key}
                      className={styles.toggleButton}
                      onClick={() => updateFilter(option.key)}
                      disabled={isInsufficient}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className={styles.permissionNotice} role="note">
                <FaIcon icon={FA.triangleExclamation} />
                <Text variant="Secondary" size="Small">
                  Supplier-level export is limited to MarketIQ administrators; category rows remain available in the table.
                </Text>
              </div>
            </div>

            <Table
              ariaLabelledBy="marketiq-underlying-data-heading"
              columns={columns}
              rows={tableRows}
              getRowKey={(row) => row.id}
              density={density === 'compact' ? 'Compact' : 'Default'}
              emptyState={<EmptyTableState />}
              pagination={showPagination ? {
                page: currentPage,
                pageSize: TABLE_PAGE_SIZE,
                totalRows: sortedRows.length,
                onPageChange: setPage,
              } : undefined}
            />
          </section>
        </>
      )}
    </main>
  );
}
