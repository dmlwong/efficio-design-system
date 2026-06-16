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
  Overlay,
  PageHeader,
  Searchbox,
  Table,
  Text,
  type TableColumn,
} from '@efficio/orbit';
import styles from './OrbitMarketIQSeparationBenchmark.module.css';

type WorkflowState = 'ready' | 'generating' | 'results' | 'partial' | 'permission';
type Ownership = 'my' | 'shared' | 'all';
type Horizon = '3 months' | '6 months' | '12 months';
type BadgeStatus = NonNullable<React.ComponentProps<typeof Badge>['status']>;

interface ClientInitiative {
  id: string;
  name: string;
  category: string;
  owner: string;
  status: 'Preparing' | 'In progress' | 'Ready for review';
  nextMilestone: string;
  spend: number;
}

const INITIATIVES: ClientInitiative[] = [
  {
    id: 'ORB-2048',
    name: 'Facilities market reset',
    category: 'Facilities management',
    owner: 'Maya Patel',
    status: 'In progress',
    nextMilestone: 'Supplier briefing',
    spend: 4200000,
  },
  {
    id: 'ORB-2051',
    name: 'Logistics rate-card review',
    category: 'Logistics',
    owner: 'Priya Shah',
    status: 'Preparing',
    nextMilestone: 'Baseline sign-off',
    spend: 3600000,
  },
  {
    id: 'ORB-2056',
    name: 'IT managed services renewal',
    category: 'Technology',
    owner: 'Amelia Brown',
    status: 'Ready for review',
    nextMilestone: 'Negotiation plan',
    spend: 3100000,
  },
  {
    id: 'ORB-2060',
    name: 'Marketing agency roster',
    category: 'Marketing',
    owner: 'Joel Turner',
    status: 'In progress',
    nextMilestone: 'Shortlist review',
    spend: 1900000,
  },
];

const WORKFLOW_STATES: Array<{ key: WorkflowState; label: string }> = [
  { key: 'ready', label: 'Ready' },
  { key: 'generating', label: 'Generating' },
  { key: 'results', label: 'Results' },
  { key: 'partial', label: 'Partial data' },
  { key: 'permission', label: 'No permission' },
];

const HORIZON_OPTIONS = [
  { label: '3 months', value: '3 months' },
  { label: '6 months', value: '6 months' },
  { label: '12 months', value: '12 months' },
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

function getStatusBadge(status: ClientInitiative['status']): BadgeStatus {
  if (status === 'Ready for review') return 'Success';
  if (status === 'In progress') return 'Information';
  return 'No Status';
}

function filterInitiatives(rows: ClientInitiative[], ownership: Ownership, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return rows.filter((row, index) => {
    const matchesOwnership =
      ownership === 'all'
      || (ownership === 'my' && index < 2)
      || (ownership === 'shared' && index >= 1);
    const matchesQuery =
      !normalizedQuery
      || [row.id, row.name, row.category, row.owner, row.status].some((value) => (
        value.toLowerCase().includes(normalizedQuery)
      ));

    return matchesOwnership && matchesQuery;
  });
}

function SelectedContext({ initiative }: { initiative: ClientInitiative }) {
  return (
    <div className={styles.selectedContext}>
      <div className={styles.headingStack}>
        <Text variant="Secondary" size="Small">Selected initiative</Text>
        <Headings size="Heading 3">{initiative.name}</Headings>
      </div>
      <dl className={styles.contextGrid}>
        <div>
          <dt>Reference</dt>
          <dd>{initiative.id}</dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{initiative.category}</dd>
        </div>
        <div>
          <dt>Spend baseline</dt>
          <dd>{formatCurrency(initiative.spend)}</dd>
        </div>
        <div>
          <dt>Milestone</dt>
          <dd>{initiative.nextMilestone}</dd>
        </div>
      </dl>
    </div>
  );
}

function GeneratingState() {
  return (
    <Card state="Information" padding="Small" type="Static">
      <div className={styles.statePanel} role="status" aria-live="polite">
        <div className={styles.headingStack}>
          <Text variant="Bold" size="Small">Generating MarketIQ brief</Text>
          <Text as="p" variant="Primary">
            Gathering market movement, supplier signals, and negotiation prompts for review.
          </Text>
        </div>
        <span className={styles.skeletonLine} aria-hidden="true" />
        <span className={styles.skeletonLineShort} aria-hidden="true" />
      </div>
    </Card>
  );
}

export function OrbitMarketIQSeparationBenchmark() {
  const [workflowState, setWorkflowState] = useState<WorkflowState>('results');
  const [selectedId, setSelectedId] = useState(INITIATIVES[0].id);
  const [ownership, setOwnership] = useState<Ownership>('my');
  const [query, setQuery] = useState('');
  const [horizon, setHorizon] = useState<Horizon>('6 months');
  const [pickerOpen, setPickerOpen] = useState(false);
  const selectedInitiative = INITIATIVES.find((row) => row.id === selectedId) ?? INITIATIVES[0];
  const filteredInitiatives = useMemo(
    () => filterInitiatives(INITIATIVES, ownership, query),
    [ownership, query],
  );
  const generationDisabled = workflowState === 'generating' || workflowState === 'permission';

  const pickerColumns = useMemo<Array<TableColumn<ClientInitiative>>>(() => [
    {
      id: 'initiative',
      header: 'Initiative',
      render: (row) => (
        <span className={styles.primaryCell}>
          <span className={styles.cellTitle}>{row.name}</span>
          <span className={styles.cellMeta}>{row.id} · {row.category}</span>
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      render: (row) => <Badge label={row.status} status={getStatusBadge(row.status)} />,
    },
    {
      id: 'owner',
      header: 'Owner',
      render: (row) => <span className={styles.nowrapCell}>{row.owner}</span>,
    },
    {
      id: 'milestone',
      header: 'Next milestone',
      render: (row) => <span className={styles.wrapCell}>{row.nextMilestone}</span>,
    },
  ], []);

  const closePicker = () => setPickerOpen(false);

  return (
    <main className={styles.page} data-theme="orbit">
      <section className={styles.benchmarkHeader}>
        <div className={styles.headingStack}>
          <Text variant="Secondary" size="Small">Orbit / Client Connected Platform benchmark</Text>
          <Headings size="Heading 1">MarketIQ guided workflow</Headings>
          <p className={styles.bodyText}>
            Client-facing MarketIQ flow that preserves selected context, parameters, generated output, and next actions.
          </p>
        </div>
      </section>

      <section className={styles.stateToolbar} aria-label="Benchmark preview controls">
        <Text variant="Bold" size="Small">Workflow state</Text>
        <div className={styles.stateControls}>
          {WORKFLOW_STATES.map((option) => (
            <Button
              key={option.key}
              aria-pressed={workflowState === option.key}
              className={styles.toggleButton}
              onClick={() => setWorkflowState(option.key)}
              size="Small"
              variant="Secondary"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.workflowSurface} aria-label="Orbit MarketIQ screen preview">
        <PageHeader
          type="tool"
          title="MarketIQ"
          subtitle="Create a market brief from selected initiative context and procurement parameters."
          icon={FA.circleInfo}
          iconGradient={HeaderPresets.identify.iconGradient}
          borderColor={HeaderPresets.identify.borderColor}
          pill={{ code: selectedInitiative.id, label: selectedInitiative.name }}
          actions={[
            {
              id: 'download-latest',
              label: 'Download latest',
              icon: FA.file,
              variant: 'Secondary',
              disabled: workflowState !== 'results',
            },
            {
              id: 'generate-market-brief',
              label: workflowState === 'generating' ? 'Generating' : 'Generate brief',
              icon: FA.chevronRight,
              variant: 'Primary',
              disabled: generationDisabled,
              onClick: () => setWorkflowState('generating'),
            },
          ]}
        />

        <section className={styles.workflowColumn} aria-label="Guided MarketIQ workflow">
          <Card state="Information" padding="Small" type="Static">
            <div className={styles.workflowCard}>
              <div className={styles.stepHeader}>
                <Badge label="Step 1" status="Information" />
                <Text variant="Bold">Choose context</Text>
              </div>
              <Text as="p" variant="Primary">
                Select the initiative that should anchor the research brief. This keeps generated recommendations traceable.
              </Text>
              <SelectedContext initiative={selectedInitiative} />
              <div className={styles.actionGroup}>
                <Button
                  icon={<FaIcon icon={FA.chevronRight} />}
                  onClick={() => setPickerOpen(true)}
                  size="Small"
                  state={workflowState === 'permission' ? 'Disabled' : 'Default'}
                  variant="Secondary"
                >
                  Change initiative
                </Button>
                <Button
                  size="Small"
                  state={workflowState === 'permission' ? 'Disabled' : 'Default'}
                  variant="Tertiary"
                >
                  Run without initiative
                </Button>
              </div>
            </div>
          </Card>

          <Card state="Default" padding="Small" type="Static">
            <div className={styles.workflowCard}>
              <div className={styles.stepHeader}>
                <Badge label="Step 2" status="Information" />
                <Text variant="Bold">Confirm research parameters</Text>
              </div>
              <div className={styles.parameterGrid}>
                <div className={styles.parameterItem}>
                  <Text variant="Secondary" size="Small">Market</Text>
                  <Text variant="Bold">{selectedInitiative.category}</Text>
                </div>
                <div className={styles.parameterItem}>
                  <Text variant="Secondary" size="Small">Geography</Text>
                  <Text variant="Bold">United Kingdom</Text>
                </div>
                <div className={styles.parameterItem}>
                  <Dropdown
                    ariaLabel="Select research horizon"
                    disabled={workflowState === 'permission' || workflowState === 'generating'}
                    onChange={(value) => setHorizon(value as Horizon)}
                    options={HORIZON_OPTIONS}
                    value={horizon}
                  />
                </div>
              </div>
            </div>
          </Card>

          {workflowState === 'permission' && (
            <Card state="Warning" padding="Small" type="Static">
              <div className={styles.permissionNotice} role="alert">
                <FaIcon icon={FA.circleExclamation} />
                <Text as="p" variant="Primary">
                  You can review saved MarketIQ briefs. Ask the initiative owner to grant generation access for this workspace.
                </Text>
              </div>
            </Card>
          )}

          {workflowState === 'generating' ? (
            <GeneratingState />
          ) : workflowState === 'partial' ? (
            <Card state="Warning" padding="Small" type="Static">
              <div className={styles.statePanel} role="alert">
                <div className={styles.headingStack}>
                  <Text variant="Bold" size="Small">Market data is incomplete</Text>
                  <Text as="p" variant="Primary">
                    The brief can be generated with supplier movement and rate-card evidence, but commodity index coverage is partial.
                  </Text>
                </div>
                <Button size="Small" variant="Secondary">Generate with caveat</Button>
              </div>
            </Card>
          ) : (
            <Card state={workflowState === 'results' ? 'Success' : 'Default'} padding="Small" type="Static">
              <div className={styles.workflowCard}>
                <div className={styles.stepHeader}>
                  <Badge label={workflowState === 'results' ? 'Generated' : 'Ready'} status={workflowState === 'results' ? 'Success' : 'No Status'} />
                  <Text variant="Bold">Review MarketIQ brief</Text>
                </div>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <Text variant="Secondary" size="Small">Market movement</Text>
                    <strong>+6.8%</strong>
                    <Text as="p" variant="Secondary">Supplier cost pressure remains elevated across bundled FM services.</Text>
                  </div>
                  <div className={styles.resultItem}>
                    <Text variant="Secondary" size="Small">Negotiation prompt</Text>
                    <strong>Rate-card reset</strong>
                    <Text as="p" variant="Secondary">Prioritise transparent labour indexation and service-credit thresholds.</Text>
                  </div>
                  <div className={styles.resultItem}>
                    <Text variant="Secondary" size="Small">Confidence</Text>
                    <strong>High</strong>
                    <Text as="p" variant="Secondary">Matched supplier signals, renewal timing, and current spend baseline.</Text>
                  </div>
                </div>
                <div className={styles.actionGroup}>
                  <Button
                    icon={<FaIcon icon={FA.file} />}
                    size="Small"
                    state={workflowState === 'results' ? 'Default' : 'Disabled'}
                    variant="Primary"
                  >
                    Download report
                  </Button>
                  <Button
                    size="Small"
                    state={workflowState === 'results' ? 'Default' : 'Disabled'}
                    variant="Secondary"
                  >
                    Save to initiative
                  </Button>
                  <Button size="Small" variant="Tertiary" onClick={() => setWorkflowState('ready')}>
                    Run again
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <section className={styles.nextActions} aria-labelledby="marketiq-next-actions-heading">
            <div className={styles.headingStack} id="marketiq-next-actions-heading">
              <Headings size="Heading 2">Next actions</Headings>
              <Text variant="Secondary" size="Small">Client-safe follow-on actions tied to the generated brief.</Text>
            </div>
            <div className={styles.nextActionGrid}>
              {[
                ['Update milestone', 'Attach the MarketIQ brief to the supplier briefing milestone.'],
                ['Prepare supplier questions', 'Convert negotiation prompts into review questions for the next meeting.'],
                ['Share with stakeholders', 'Send the client-safe summary to category and finance reviewers.'],
              ].map(([title, description]) => (
                <Card key={title} state="Default" padding="Small" type="Static">
                  <div className={styles.nextActionCard}>
                    <Text variant="Bold">{title}</Text>
                    <Text as="p" variant="Secondary">{description}</Text>
                    <Button size="Small" state={workflowState === 'results' ? 'Default' : 'Disabled'} variant="Secondary">
                      Open action
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </section>
      </section>

      <Overlay
        visible={pickerOpen}
        onClose={closePicker}
        ariaLabelledBy="marketiq-picker-title"
        size="Large"
        height="Content"
      >
        <div className={styles.dialogLayout}>
          <div className={styles.dialogHeader}>
            <div className={styles.headingStack} id="marketiq-picker-title">
              <Headings size="Heading 2">Select initiative</Headings>
              <Text variant="Secondary" size="Small">Choose the initiative context for this MarketIQ brief.</Text>
            </div>
            <Button
              aria-label="Close initiative picker"
              icon={<FaIcon icon={FA.xmark} />}
              onClick={closePicker}
              size="Small"
              variant="Secondary"
            >
              Close
            </Button>
          </div>
          <div className={styles.dialogControls}>
            <div className={styles.stateControls}>
              {([
                ['my', 'My initiatives'],
                ['shared', 'Shared'],
                ['all', 'All'],
              ] as Array<[Ownership, string]>).map(([value, label]) => (
                <Button
                  key={value}
                  aria-pressed={ownership === value}
                  className={styles.toggleButton}
                  onClick={() => setOwnership(value)}
                  size="Small"
                  variant="Secondary"
                >
                  {label}
                </Button>
              ))}
            </div>
            <div className={styles.searchArea}>
              <Searchbox
                ariaLabel="Search client initiatives"
                onChange={setQuery}
                placeholder="Search initiative, owner, category"
                value={query}
              />
            </div>
          </div>
          <Table
            ariaLabel="Client initiative picker"
            columns={pickerColumns}
            density="Compact"
            emptyState={(
              <div className={styles.emptyState}>
                <Text variant="Bold">No initiatives found</Text>
                <Text as="p" variant="Secondary">Clear search or switch ownership to All.</Text>
              </div>
            )}
            getRowKey={(row) => row.id}
            getRowSelectionLabel={(row) => `Select ${row.name}`}
            onRowSelect={(row) => {
              setSelectedId(row.id);
              closePicker();
            }}
            rows={filteredInitiatives}
            variant="SeparatedRows"
          />
        </div>
      </Overlay>
    </main>
  );
}
