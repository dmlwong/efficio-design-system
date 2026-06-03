'use client';

import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import {
  Button,
  Card,
  Chip,
  Dropzone,
  FA,
  FaIcon,
  Headings,
  HeaderPresets,
  IconButton,
  MultiStateButton,
  MultiStateGroup,
  Overlay,
  PageHeader,
  Searchbox,
  Spinner,
  Table,
  Text,
  ToolNextStepsCard,
  Toggle,
  type TableColumn,
} from '@efficio/orbit';
import { OrbitAppShell } from '@/components/feature/orbit-shell';
import {
  CLAUSEIQ_FILE_LIMIT_MB,
  CLAUSEIQ_INITIATIVES,
  CLAUSEIQ_PARAMETER_OPTIONS,
  type ClauseIQAnalysisResult,
  type ClauseIQInitiative,
  type ClauseIQParameterOption,
  type ClauseIQUploadedFile,
} from '@/data/clauseiq-mock';
import { clauseIQReducer, buildClauseIQResult, initialClauseIQState } from './state';
import type { ClauseIQCardMode, ClauseIQInitiativeTab, ClauseIQSelectedParameter, ClauseIQState, ClauseIQUploadError } from './types';
import { validateClauseIQFile } from './upload';
import styles from './ClauseIQPrototype.module.css';

const ICON_SEARCH = '\uf002';
const ICON_UPLOAD = '\uf093';
const ICON_PENCIL = '\uf044';
const ICON_DOWNLOAD = '\uf019';
const ICON_ROTATE = '\uf021';
const ICON_VIEW = '\uf688';

const UPLOAD_ERROR_COPY: Record<ClauseIQUploadError, string> = {
  unsupported: "This file type isn't supported. Please upload a PDF file.",
  'too-large': 'This file is too large. Maximum upload size is 100 MB.',
};

const INITIATIVE_COLUMNS: TableColumn<ClauseIQInitiative>[] = [
  { id: 'name', header: 'Initiative name', width: '64%', render: (initiative) => initiative.name },
  { id: 'sector', header: 'Sector', width: '20%', render: (initiative) => initiative.sector },
  { id: 'owner', header: 'Owner', width: '16%', render: (initiative) => initiative.owner },
];

function getActiveCardKey(state: ClauseIQState): string {
  if (state.step === 'select-initiative' && !state.selectedInitiative) return 'select-initiative';
  if (state.step === 'select-parameters') return 'select-parameters';
  if (state.step === 'upload-contract') return 'upload-contract';
  if (state.step === 'processing') return 'processing';
  if (state.step === 'results') return 'results';
  return 'welcome';
}

function FlowCard({
  mode,
  children,
  cardRef,
  className,
}: {
  mode: ClauseIQCardMode;
  children: React.ReactNode;
  cardRef?: (node: HTMLDivElement | null) => void;
  className?: string;
}) {
  const cardState = mode === 'active' ? 'Highlight' : 'Default';

  return (
    <div ref={cardRef} className={styles.cardFrame}>
      <Card
        state={cardState}
        type="Static"
        padding="Base"
        style={{ width: '100%' }}
      >
        <div className={`${styles.cardContent} ${className || ''} ${mode === 'disabled' ? styles.cardDisabled : ''}`} aria-disabled={mode === 'disabled' || undefined}>
          {children}
        </div>
      </Card>
    </div>
  );
}

function ClauseIQIconTile({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`${styles.iconTile} ${compact ? styles.iconTileCompact : ''}`} aria-hidden="true">
      <FaIcon icon={FA.file} size={compact ? 17 : 22} color="var(--orbit-color-white)" />
      <span className={styles.iconBadge}>
        <FaIcon icon={FA.circleInfo} size={compact ? 8 : 9} color="var(--orbit-color-white)" />
      </span>
    </span>
  );
}

function FeatureBullet({ icon, text }: { icon: string; text: string }) {
  return (
    <div className={styles.row}>
      <FaIcon icon={icon} size={16} color="var(--orbit-color-card-border-highlight)" />
      <Text size="Paragraph" variant="Primary">{text}</Text>
    </div>
  );
}

function FullWidthButton({ children }: { children: React.ReactNode }) {
  return <div className={styles.fullWidthButton}>{children}</div>;
}

function WelcomeCard({ started, onStart, cardRef }: { started: boolean; onStart: () => void; cardRef?: (node: HTMLDivElement | null) => void }) {
  return (
    <FlowCard mode="default" cardRef={cardRef}>
      <div className={styles.welcomeTitleRow}>
        <ClauseIQIconTile />
        <Headings size="Heading 3">ClauseIQ</Headings>
      </div>
      <Text variant="Secondary" size="Paragraph">
        ClauseIQ helps accelerate contract analyses across key clauses in addition to flagging risks and deviations to best practice.
      </Text>
      <div className={styles.summaryBox}>
        <div className={styles.stack}>
          <Headings size="Heading 5">Summary</Headings>
          <div className={styles.stack}>
            <FeatureBullet icon={'\uf94b'} text="Extraction of payment terms, SLAs, renewal terms, and other key clauses" />
            <FeatureBullet icon={'\uf0eb'} text="Analysis of deviation against best practices" />
            <FeatureBullet icon={'\uf559'} text="Clear and actionable insights to support contract optimisation" />
          </div>
        </div>
      </div>
      {!started && (
        <FullWidthButton>
          <Button
            variant="Primary"
            onClick={onStart}
            icon={<FaIcon icon={FA.star} size={14} color="var(--orbit-color-white)" />}
          >
            Get Started
          </Button>
        </FullWidthButton>
      )}
    </FlowCard>
  );
}

function SelectInitiativeCard({ onSearch, cardRef }: { onSearch: () => void; cardRef?: (node: HTMLDivElement | null) => void }) {
  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <div className={styles.stackSmall}>
        <Headings size="Heading 5">Select Initiative</Headings>
        <Text variant="Secondary" size="Paragraph">Choose the initiative to analyse the contract against.</Text>
      </div>
      <FullWidthButton>
        <Button variant="Primary" onClick={onSearch} icon={<FaIcon icon={ICON_SEARCH} size={14} color="var(--orbit-color-white)" />}>
          Search Initiatives
        </Button>
      </FullWidthButton>
    </FlowCard>
  );
}

function InitiativeSelectedCard({
  initiative,
  mode,
  compact = false,
  onEdit,
  cardRef,
}: {
  initiative: ClauseIQInitiative;
  mode: ClauseIQCardMode;
  compact?: boolean;
  onEdit: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const disabled = mode === 'disabled';

  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Initiative Selected</Headings>
      {!compact && (
        <div className={`${styles.selectionRow} ${disabled ? styles.selectionRowDisabled : ''}`}>
          <div className={styles.row}>
            <FaIcon icon={FA.check} size={16} color={disabled ? 'var(--orbit-color-btn-secondary-fg-disabled)' : 'var(--orbit-color-text-primary)'} />
            <Text variant={disabled ? 'Secondary' : 'Primary'} size="Paragraph">{initiative.name}</Text>
          </div>
          {!disabled && (
            <Button variant="Tertiary" onClick={onEdit} icon={<FaIcon icon={ICON_PENCIL} size={14} color="currentColor" />}>
              Edit
            </Button>
          )}
        </div>
      )}
    </FlowCard>
  );
}

function ParametersSelectionCard({
  options,
  expandedKind,
  search,
  onToggleExpand,
  onSearchChange,
  onPickOption,
  cardRef,
}: {
  options: ClauseIQParameterOption[];
  expandedKind?: ClauseIQSelectedParameter['kind'];
  search: string;
  onToggleExpand: (kind: ClauseIQSelectedParameter['kind']) => void;
  onSearchChange: (value: string) => void;
  onPickOption: (option: ClauseIQParameterOption, value: string) => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const expandedOption = options.find((option) => option.kind === expandedKind);

  const filteredOptions = useMemo(() => {
    if (!expandedOption) return [] as string[];
    const query = search.trim().toLowerCase();
    if (!query) return expandedOption.options;
    return expandedOption.options.filter((value) => value.toLowerCase().includes(query));
  }, [expandedOption, search]);

  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <div className={styles.stackSmall}>
        <Headings size="Heading 5">Contract Analysis Parameters</Headings>
        <Text variant="Secondary" size="Paragraph">Choose a parameter to analyse this contract.</Text>
      </div>
      <div className={styles.parameterRow}>
        {options.map((option) => {
          const expanded = option.kind === expandedKind;
          return (
            <button
              key={option.kind}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={expanded}
              aria-controls={`clauseiq-parameter-listbox-${option.kind}`}
              className={`${styles.parameterCard} ${expanded ? styles.parameterCardExpanded : ''}`}
              onClick={() => onToggleExpand(option.kind)}
            >
              <span className={styles.parameterLeft}>
                <span
                  className={`${styles.parameterRadio} ${expanded ? styles.parameterRadioChecked : ''}`}
                  aria-hidden="true"
                />
                <Text variant="Primary" size="Paragraph">{option.label}</Text>
              </span>
              <span
                className={styles.parameterIconTile}
                style={{ '--_bg': option.iconBg } as React.CSSProperties}
                aria-hidden="true"
              >
                <FaIcon icon={option.icon} size={12} color={option.iconFg} />
              </span>
            </button>
          );
        })}
      </div>
      {expandedOption && (
        <div
          className={styles.parameterDropdown}
          id={`clauseiq-parameter-listbox-${expandedOption.kind}`}
          role="listbox"
          aria-label={`${expandedOption.label} options`}
        >
          <div className={styles.parameterSearchRow}>
            <Searchbox
              ariaLabel={`Search ${expandedOption.label.toLowerCase()} options`}
              placeholder="Search..."
              value={search}
              onChange={onSearchChange}
            />
          </div>
          <ul className={styles.parameterOptionList}>
            {filteredOptions.length === 0 ? (
              <li className={styles.parameterOptionEmpty}>
                <Text variant="Secondary" size="Paragraph">No options match your search.</Text>
              </li>
            ) : (
              filteredOptions.map((value) => (
                <li key={value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    className={styles.parameterOption}
                    onClick={() => onPickOption(expandedOption, value)}
                  >
                    <Text variant="Primary" size="Paragraph">{value}</Text>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </FlowCard>
  );
}

function ParametersSelectedCard({
  parameter,
  mode,
  onEdit,
  cardRef,
}: {
  parameter: ClauseIQSelectedParameter;
  mode: ClauseIQCardMode;
  onEdit: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const disabled = mode === 'disabled';

  return (
    <FlowCard mode={mode} cardRef={cardRef}>
      <Headings size="Heading 5">Contract Analysis Parameters</Headings>
      <div className={`${styles.selectionRow} ${disabled ? styles.selectionRowDisabled : ''}`}>
        <div className={styles.row}>
          <FaIcon icon={FA.check} size={16} color={disabled ? 'var(--orbit-color-btn-secondary-fg-disabled)' : 'var(--orbit-color-text-success)'} />
          <Text variant={disabled ? 'Secondary' : 'Primary'} size="Paragraph">{parameter.label}</Text>
        </div>
        {!disabled && (
          <Button variant="Tertiary" onClick={onEdit} icon={<FaIcon icon={ICON_PENCIL} size={14} color="currentColor" />}>
            Change {parameter.kind}
          </Button>
        )}
      </div>
    </FlowCard>
  );
}

function InitiativeSelectionModal({
  open,
  tab,
  search,
  onSetTab,
  onSetSearch,
  onSelect,
  onClose,
}: {
  open: boolean;
  tab: ClauseIQInitiativeTab;
  search: string;
  onSetTab: (tab: ClauseIQInitiativeTab) => void;
  onSetSearch: (value: string) => void;
  onSelect: (initiative: ClauseIQInitiative) => void;
  onClose: () => void;
}) {
  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return CLAUSEIQ_INITIATIVES.filter((initiative) => {
      if (initiative.scope !== tab) return false;
      if (!query) return true;
      return [initiative.name, initiative.sector, initiative.owner].some((value) => value.toLowerCase().includes(query));
    });
  }, [search, tab]);

  const handleTabChange = (nextTab: string) => {
    if (nextTab === 'mine' || nextTab === 'team') onSetTab(nextTab);
  };

  return (
    <Overlay visible={open} onClose={onClose} ariaLabelledBy="clauseiq-initiative-modal-title" size="Large" height="Content">
      <div className={styles.modalLayout}>
        <div className={styles.modalHeader}>
          <div id="clauseiq-initiative-modal-title">
            <Headings size="Heading 4">Select An Initiative</Headings>
          </div>
          <IconButton
            ariaLabel="Close initiative selection"
            variant="Tertiary"
            size="Small"
            icon={<FaIcon icon={FA.xmark} size={14} color="var(--orbit-color-text-primary)" />}
            onClick={onClose}
          />
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalToolbar}>
            <div className={styles.tabs}>
              <MultiStateGroup value={tab} onValueChange={handleTabChange} ariaLabel="Initiative ownership" fullWidth>
                <MultiStateButton value="mine" label="Mine" />
                <MultiStateButton value="team" label="Team" />
              </MultiStateGroup>
            </div>
            <div className={styles.modalSearch}>
              <Searchbox
                ariaLabel="Search initiatives"
                placeholder="Search initiative..."
                value={search}
                onChange={onSetSearch}
              />
            </div>
          </div>
          <Table
            ariaLabel="Initiatives"
            columns={INITIATIVE_COLUMNS}
            rows={rows}
            getRowKey={(initiative) => initiative.id}
            onRowSelect={onSelect}
            getRowSelectionLabel={(initiative, index) => `Select initiative ${initiative.name}, row ${index + 1}`}
            emptyState={<Text variant="Secondary" size="Paragraph">No initiatives found.</Text>}
            variant="SeparatedRows"
          />
        </div>
        <div className={styles.modalFooter}>
          <Button variant="Secondary" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Overlay>
  );
}

function UploadContractCard({
  error,
  onError,
  onFileSelected,
  cardRef,
}: {
  error?: ClauseIQUploadError;
  onError: (error?: ClauseIQUploadError) => void;
  onFileSelected: (file: ClauseIQUploadedFile) => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  const handleFile = (file: File) => {
    const result = validateClauseIQFile(file);
    if (result.error) {
      onError(result.error);
      return;
    }
    if (result.file) onFileSelected(result.file);
  };

  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <Headings size="Heading 5">Upload Contract</Headings>
      <Dropzone
        ariaLabel="Upload PDF contract"
        accept=".pdf,application/pdf"
        onFileSelected={handleFile}
        error={error ? UPLOAD_ERROR_COPY[error] : undefined}
        icon={<FaIcon icon={ICON_UPLOAD} size={46} color="var(--orbit-color-text-secondary)" />}
        promptPrefix="Drag & drop or choose file"
        chooseButtonLabel="choose files"
        promptSuffix="to upload"
        acceptedFileTypesLabel="File types supported: PDF"
        maxFileSizeLabel={`Maximum upload file size: ${CLAUSEIQ_FILE_LIMIT_MB} MB`}
      />
    </FlowCard>
  );
}

function ProcessingCard({ file, cardRef }: { file: ClauseIQUploadedFile; cardRef?: (node: HTMLDivElement | null) => void }) {
  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <Headings size="Heading 5">Analysing Your Contract</Headings>
      <StatusLine label={file.name} status="Uploaded" icon={FA.check} tone="success" surface="success" />
      <div className={styles.processingLine}>
        <Spinner size="Inline" decorative />
        <Text variant="Primary" size="Paragraph">Finding clauses in your contract...</Text>
      </div>
      <Text variant="Secondary" size="Paragraph">This may take a moment. We will notify you when the analysis is completed</Text>
    </FlowCard>
  );
}

function StatusLine({
  label,
  status,
  icon,
  tone,
  surface = 'plain',
}: {
  label: string;
  status: string;
  icon: string;
  tone: 'success' | 'neutral';
  surface?: 'plain' | 'success' | 'neutral';
}) {
  const color = tone === 'success' ? 'var(--orbit-color-text-success)' : 'var(--orbit-color-text-primary)';

  return (
    <div className={`${styles.statusRow} ${surface === 'success' ? styles.statusRowSuccess : ''} ${surface === 'neutral' ? styles.statusRowNeutral : ''}`}>
      <div className={styles.row}>
        <FaIcon icon={icon} size={16} color={color} />
        <span className={tone === 'success' ? styles.statusTextSuccess : styles.statusText}>{label}</span>
      </div>
      <span className={tone === 'success' ? styles.statusTextSuccess : styles.statusText}>{status}</span>
    </div>
  );
}

function SeverityChip({ severity }: { severity: ClauseIQAnalysisResult['severities'][number] }) {
  return (
    <Chip
      variant={severity.tone}
      size="Mini"
      label={`${severity.label}: ${severity.count}`}
    />
  );
}

function AnalysisResultCard({
  file,
  result,
  saveToDocuments,
  onToggleSave,
  onRunAnother,
  cardRef,
}: {
  file: ClauseIQUploadedFile;
  result: ClauseIQAnalysisResult;
  saveToDocuments: boolean;
  onToggleSave: (checked: boolean) => void;
  onRunAnother: () => void;
  cardRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <FlowCard mode="active" cardRef={cardRef}>
      <div className={styles.stack}>
        <div className={styles.stackSmall}>
          <div className={styles.rowBetween}>
            <Chip variant="Outline" size="Mini" label="Analysis Result" />
            <Text variant="Secondary" size="Small">{result.timestamp}</Text>
          </div>
          <div className={styles.rowBetween}>
            <Headings size="Heading 5">Here is your Analysis Result</Headings>
            <Toggle label="Save To My Documents" checked={saveToDocuments} onChange={onToggleSave} />
          </div>
        </div>
        <div className={styles.stackSmall}>
          <StatusLine label={file.name} status="Uploaded" icon={FA.file} tone="neutral" surface="neutral" />
          <StatusLine label={`Reviewed ${result.reviewedClauses} clauses`} status="Completed" icon={FA.check} tone="success" surface="success" />
        </div>
        <div className={styles.stackSmall}>
          <Text variant="Primary" size="Paragraph">Summary shown below. Download the report for full details.</Text>
          <div className={styles.severityRow}>
            {result.severities.map((severity) => <SeverityChip key={severity.label} severity={severity} />)}
          </div>
        </div>
      </div>
      <div className={styles.stackSmall}>
        <FullWidthButton>
          <Button variant="Primary" icon={<FaIcon icon={ICON_VIEW} size={14} color="var(--orbit-color-btn-primary-icon)" />}>
            View Result
          </Button>
        </FullWidthButton>
        <div className={styles.resultButtonRow}>
          <Button variant="Secondary" onClick={onRunAnother} icon={<FaIcon icon={ICON_ROTATE} size={14} />}>
            Run Another Analysis
          </Button>
          <Button variant="Secondary" icon={<FaIcon icon={ICON_DOWNLOAD} size={14} />}>
            Download Report
          </Button>
        </div>
      </div>
    </FlowCard>
  );
}

function NewAnalysisDivider() {
  return (
    <div className={styles.newAnalysisDivider}>
      <Chip variant="Outline" size="Mini" label="New Analysis" />
    </div>
  );
}

export function ClauseIQPrototype({ processingDelayMs = 10000 }: { processingDelayMs?: number } = {}) {
  const [state, dispatch] = useReducer(clauseIQReducer, initialClauseIQState);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const activeCardKey = getActiveCardKey(state);

  useEffect(() => {
    if (state.step !== 'processing') return;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'PROCESSING_COMPLETE', result: buildClauseIQResult() });
    }, processingDelayMs);

    return () => window.clearTimeout(timer);
  }, [processingDelayMs, state.step, state.uploadedFile?.name]);

  useEffect(() => {
    const node = cardRefs.current[activeCardKey];
    if (!node || activeCardKey === 'welcome') return;
    window.requestAnimationFrame(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, [activeCardKey, state.selectedInitiative?.id]);

  const setCardRef = (key: string) => (node: HTMLDivElement | null) => {
    cardRefs.current[key] = node;
  };

  const started = state.step !== 'welcome';
  const initiativeLocked = state.step === 'processing' || state.step === 'results' || Boolean(state.previousAnalysis);

  return (
    <OrbitAppShell activeItem="Home">
      <PageHeader
        title="ClauseIQ"
        subtitle={state.step === 'results' ? 'ClauseIQ turns dense contracts into clear, structured insights.' : 'AI tool for detailed contract analyses'}
        icon={FA.file}
        {...HeaderPresets.identify}
      />
      <main className={styles.content}>
        <div className={styles.column}>
          <WelcomeCard
            started={started}
            onStart={() => dispatch({ type: 'START_FLOW' })}
            cardRef={setCardRef('welcome')}
          />
          {state.step === 'select-initiative' && !state.selectedInitiative && (
            <SelectInitiativeCard
              onSearch={() => dispatch({ type: 'OPEN_INITIATIVE_MODAL' })}
              cardRef={setCardRef('select-initiative')}
            />
          )}
          {state.selectedInitiative && state.step !== 'welcome' && (
            <InitiativeSelectedCard
              initiative={state.selectedInitiative}
              mode={initiativeLocked ? 'disabled' : 'default'}
              onEdit={() => dispatch({ type: 'EDIT_INITIATIVE' })}
              cardRef={setCardRef('initiative-selected')}
            />
          )}
          {state.step === 'select-parameters' && (
            <ParametersSelectionCard
              options={CLAUSEIQ_PARAMETER_OPTIONS}
              expandedKind={state.expandedParameter}
              search={state.parameterSearch}
              onToggleExpand={(kind) => dispatch({ type: 'TOGGLE_PARAMETER_EXPANSION', kind })}
              onSearchChange={(value) => dispatch({ type: 'SET_PARAMETER_SEARCH', value })}
              onPickOption={(option, value) => dispatch({
                type: 'SELECT_PARAMETER',
                parameter: { kind: option.kind, label: value },
              })}
              cardRef={setCardRef('select-parameters')}
            />
          )}
          {state.selectedParameter && state.step === 'upload-contract' && !state.previousAnalysis && (
            <ParametersSelectedCard
              parameter={state.selectedParameter}
              mode="default"
              onEdit={() => dispatch({ type: 'EDIT_PARAMETER' })}
              cardRef={setCardRef('parameters-selected')}
            />
          )}
          {state.previousAnalysis && (
            <>
              <AnalysisResultCard
                file={state.previousAnalysis.file}
                result={state.previousAnalysis.result}
                saveToDocuments={state.previousAnalysis.saveToDocuments}
                onToggleSave={(checked) => dispatch({ type: 'TOGGLE_PREVIOUS_ANALYSIS_SAVE', checked })}
                onRunAnother={() => dispatch({ type: 'RUN_ANOTHER_ANALYSIS' })}
              />
              <NewAnalysisDivider />
            </>
          )}
          {state.step === 'upload-contract' && state.selectedInitiative && state.selectedParameter && (
            <UploadContractCard
              error={state.uploadError}
              onError={(error) => dispatch({ type: 'SET_UPLOAD_ERROR', error })}
              onFileSelected={(file) => dispatch({ type: 'SELECT_FILE', file })}
              cardRef={setCardRef('upload-contract')}
            />
          )}
          {state.step === 'processing' && state.uploadedFile && (
            <ProcessingCard file={state.uploadedFile} cardRef={setCardRef('processing')} />
          )}
          {state.step === 'results' && state.uploadedFile && state.analysisResult && (
            <>
              <AnalysisResultCard
                file={state.uploadedFile}
                result={state.analysisResult}
                saveToDocuments={state.saveToDocuments}
                onToggleSave={(checked) => dispatch({ type: 'TOGGLE_SAVE', checked })}
                onRunAnother={() => dispatch({ type: 'RUN_ANOTHER_ANALYSIS' })}
                cardRef={setCardRef('results')}
              />
              <ToolNextStepsCard />
            </>
          )}
        </div>
      </main>
      <InitiativeSelectionModal
        open={state.initiativeModalOpen}
        tab={state.initiativeTab}
        search={state.initiativeSearch}
        onSetTab={(tab) => dispatch({ type: 'SET_INITIATIVE_TAB', tab })}
        onSetSearch={(value) => dispatch({ type: 'SET_INITIATIVE_SEARCH', value })}
        onSelect={(initiative) => dispatch({ type: 'SELECT_INITIATIVE', initiative })}
        onClose={() => dispatch({ type: 'CLOSE_INITIATIVE_MODAL' })}
      />
    </OrbitAppShell>
  );
}
