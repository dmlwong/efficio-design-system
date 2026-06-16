'use client';

import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Dropdown,
  FA,
  FaIcon,
  Headings,
  Input,
  Spinner,
  Text,
  Toggle,
} from '@efficio/orbit';
import styles from './ProcurementSettingsBenchmark.module.css';

type PreviewState = 'ready' | 'loading' | 'validation' | 'locked' | 'error';
type Density = 'comfortable' | 'compact';

interface FormValues {
  policyName: string;
  approvalRoute: string;
}

interface FieldErrors {
  policyName?: string;
  approvalRoute?: string;
}

const DEFAULT_VALUES: FormValues = {
  policyName: 'Professional services RFP controls',
  approvalRoute: 'commercial-owner',
};

const APPROVAL_ROUTE_OPTIONS = [
  { label: 'Commercial owner first', value: 'commercial-owner' },
  { label: 'Category lead and Legal', value: 'category-legal' },
  { label: 'Executive approval required', value: 'executive' },
];

const PREVIEW_OPTIONS: Array<{ key: PreviewState; label: string }> = [
  { key: 'ready', label: 'Ready' },
  { key: 'loading', label: 'Loading' },
  { key: 'validation', label: 'Validation' },
  { key: 'locked', label: 'No permission' },
  { key: 'error', label: 'Save error' },
];

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  const trimmedName = values.policyName.trim();

  if (!trimmedName) {
    errors.policyName = 'Error: Enter a policy name before saving settings.';
  } else if (trimmedName.length < 4) {
    errors.policyName = 'Error: Use at least 4 characters for the policy name.';
  }

  if (!values.approvalRoute) {
    errors.approvalRoute = 'Error: Choose a default approval route before saving settings.';
  }

  return errors;
}

function FieldShell({
  children,
  error,
  helpText,
  label,
  labelId,
  required,
}: {
  children: React.ReactNode;
  error?: string;
  helpText: string;
  label: string;
  labelId: string;
  required?: boolean;
}) {
  const helpId = `${labelId}-help`;
  const errorId = `${labelId}-error`;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span id={labelId} className={styles.labelText}>
          {label}
        </span>
        {required && <span className={styles.requiredText}>Required</span>}
      </div>
      {children}
      <span id={helpId} className={styles.helpText}>
        {helpText}
      </span>
      {error && (
        <span id={errorId} className={styles.errorText}>
          <FaIcon icon={FA.circleExclamation} />
          {error}
        </span>
      )}
    </div>
  );
}

function LoadingForm() {
  const skeletonRows = ['policy-name', 'approval-route', 'permission-note'];

  return (
    <section className={styles.loadingPanel} role="status" aria-live="polite" aria-label="Loading procurement settings">
      <div className={styles.loadingHeader}>
        <Spinner label="Loading procurement settings" decorative />
        <Text variant="Secondary" size="Paragraph">Loading procurement settings...</Text>
      </div>
      <div className={styles.skeletonStack} aria-hidden="true">
        {skeletonRows.map((row) => (
          <span key={row} className={styles.skeletonBlock} />
        ))}
      </div>
    </section>
  );
}

function PermissionNotice() {
  return (
    <Card type="Static" padding="Base" state="Warning">
      <div className={styles.noticeContent} role="note">
        <span className={styles.noticeIcon}>
          <FaIcon icon={FA.triangleExclamation} />
        </span>
        <div className={styles.noticeCopy}>
          <Text variant="Bold" size="Small">Editing is restricted</Text>
          <Text variant="Warning" size="Paragraph">
            Your current role can view procurement settings but cannot change approval routing. Ask a workspace owner to grant edit access.
          </Text>
        </div>
      </div>
    </Card>
  );
}

function ErrorRecovery({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" id="procurement-settings-save-error">
      <Card type="Static" padding="Base" state="Error">
        <div className={styles.recoveryPanel}>
          <div className={styles.noticeContent}>
            <span className={styles.errorIcon}>
              <FaIcon icon={FA.circleExclamation} />
            </span>
            <div className={styles.noticeCopy}>
              <Headings size="Heading 5">Settings were not saved</Headings>
              <Text variant="Secondary" size="Paragraph">
                The approval route could not be updated. Retry the save before publishing the next RFP template.
              </Text>
            </div>
          </div>
          <Button variant="Secondary" className={styles.retryButton} onClick={onRetry}>
            Retry save
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ValidationSummary({ errors }: { errors: FieldErrors }) {
  const messages = Object.values(errors).filter(Boolean);

  if (messages.length === 0) return null;

  return (
    <div role="alert" aria-labelledby="procurement-settings-validation-heading">
      <Card type="Static" padding="Base" state="Error">
        <div className={styles.validationSummary}>
          <span className={styles.errorIcon}>
            <FaIcon icon={FA.circleExclamation} />
          </span>
          <div className={styles.noticeCopy}>
            <div id="procurement-settings-validation-heading">
              <Headings size="Heading 5">Review required fields</Headings>
            </div>
            <ul className={styles.errorList}>
              {messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ContextPanel({ isLocked }: { isLocked: boolean }) {
  return (
    <aside className={styles.contextPanel} aria-labelledby="settings-context-heading">
      <div className={styles.contextHeader}>
        <Text variant="Secondary" size="Small">Workspace controls</Text>
        <div id="settings-context-heading">
          <Headings size="Heading 4">RFP Builder defaults</Headings>
        </div>
      </div>

      <div className={styles.definitionList}>
        <div className={styles.definitionItem}>
          <span className={styles.definitionLabel}>Workspace</span>
          <span className={styles.definitionValue}>UK indirect procurement</span>
        </div>
        <div className={styles.definitionItem}>
          <span className={styles.definitionLabel}>Effective role</span>
          <span className={styles.definitionValue}>{isLocked ? 'Viewer' : 'Category manager'}</span>
        </div>
        <div className={styles.definitionItem}>
          <span className={styles.definitionLabel}>Applies to</span>
          <span className={styles.definitionValue}>Services RFPs above approval threshold</span>
        </div>
        <div className={styles.definitionItem}>
          <span className={styles.definitionLabel}>Last reviewed</span>
          <span className={styles.definitionValue}>14 Jun 2026</span>
        </div>
      </div>
    </aside>
  );
}

export function ProcurementSettingsBenchmark() {
  const [previewState, setPreviewState] = useState<PreviewState>('ready');
  const [density, setDensity] = useState<Density>('comfortable');
  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLocked = previewState === 'locked';
  const isLoading = previewState === 'loading';
  const showSaveError = previewState === 'error';
  const isDisabled = isLocked || isLoading;
  const errors = useMemo(
    () => (submitted || previewState === 'validation' ? validate(values) : {}),
    [previewState, submitted, values],
  );
  const policyHelpId = 'procurement-policy-name-label-help';
  const policyErrorId = 'procurement-policy-name-label-error';
  const policyDescription = [policyHelpId, errors.policyName ? policyErrorId : undefined].filter(Boolean).join(' ');
  const routeHelpText = 'Sets the first approver for new RFPs created in this workspace.';
  const routeMessage = errors.approvalRoute ?? routeHelpText;
  const validationErrorCount = Object.keys(errors).length;
  const screenReaderStatus = useMemo(() => {
    if (saved) return '';
    if (previewState === 'loading') return '';
    if (previewState === 'validation') return `${validationErrorCount} validation errors in approval defaults. Review required fields before saving settings.`;
    if (previewState === 'locked') return 'No permission preview selected. Approval defaults are disabled.';
    if (previewState === 'error') return 'Save error preview selected. Settings were not saved. Retry save is available.';
    return 'Procurement settings ready for editing.';
  }, [previewState, saved, validationErrorCount]);

  const updatePreviewState = (nextState: PreviewState) => {
    setPreviewState(nextState);
    setSaved(false);

    if (nextState === 'validation') {
      setSubmitted(true);
      setValues({ policyName: '', approvalRoute: '' });
      return;
    }

    setSubmitted(false);
    setValues(DEFAULT_VALUES);
  };

  const updateField = (field: keyof FormValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSaved(false);

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) return;

    if (showSaveError) return;
    setSaved(true);
  };

  return (
    <main className={styles.page}>
      {screenReaderStatus && (
        <div className={styles.visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
          {screenReaderStatus}
        </div>
      )}
      <section className={styles.header}>
        <div className={styles.headerCopy}>
          <Text variant="Secondary" size="Small">Benchmark Task 2</Text>
          <div className={styles.headingStack}>
            <Headings size="Heading 1">Procurement settings form</Headings>
            <Text variant="Secondary" size="Paragraph">
              RFP Builder approval defaults with inline validation, permission-aware controls, and recoverable save states.
            </Text>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Toggle
            checked={density === 'compact'}
            label="Compact density"
            onChange={(checked) => setDensity(checked ? 'compact' : 'comfortable')}
          />
          <Button variant="Secondary" onClick={() => updatePreviewState('ready')}>
            Reset
          </Button>
        </div>
      </section>

      <section className={styles.stateToolbar} aria-label="Form state preview">
        <div className={styles.toolbarCopy}>
          <Text variant="Bold" size="Small">State</Text>
          <Text variant="Secondary" size="Small">Preview the required form states against the same field composition.</Text>
        </div>
        <div className={styles.stateControls} role="group" aria-label="Procurement settings form state">
          {PREVIEW_OPTIONS.map((option) => (
            <Button
              key={option.key}
              variant="Secondary"
              size="Small"
              aria-pressed={previewState === option.key}
              className={styles.toggleButton}
              onClick={() => updatePreviewState(option.key)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.contentGrid} data-density={density}>
        <div className={styles.formRegion}>
          {isLoading ? (
            <LoadingForm />
          ) : (
            <form className={styles.formPanel} onSubmit={handleSubmit} noValidate aria-describedby={showSaveError ? 'procurement-settings-save-error' : undefined}>
              <div className={styles.formHeader}>
                <div className={styles.headingStack}>
                  <Headings size="Heading 3">Approval defaults</Headings>
                  <Text variant="Secondary" size="Paragraph">
                    Applies to new sourcing events created from the professional services RFP template.
                  </Text>
                </div>
              </div>

              {isLocked && <PermissionNotice />}
              {showSaveError && <ErrorRecovery onRetry={() => updatePreviewState('ready')} />}
              {saved && (
                <div role="status" aria-live="polite" aria-atomic="true">
                  <Card type="Static" padding="Base" state="Success">
                    <div className={styles.noticeContent}>
                      <span className={styles.successIcon}>
                        <FaIcon icon={FA.circleCheck} />
                      </span>
                      <Text variant="Bold" size="Small">Settings saved for future RFPs.</Text>
                    </div>
                  </Card>
                </div>
              )}
              <ValidationSummary errors={errors} />

              <div className={styles.formGrid}>
                <FieldShell
                  label="Policy name"
                  labelId="procurement-policy-name-label"
                  helpText="Use the name procurement teams see when selecting an RFP approval policy."
                  error={errors.policyName}
                  required
                >
                  <Input
                    id="procurement-policy-name"
                    ariaLabelledBy="procurement-policy-name-label"
                    ariaDescribedBy={policyDescription}
                    value={values.policyName}
                    onChange={updateField('policyName')}
                    placeholder="Enter policy name"
                    icon={<FaIcon icon={FA.file} />}
                    required
                    disabled={isDisabled}
                    invalid={Boolean(errors.policyName)}
                  />
                </FieldShell>

                <Dropdown
                  label="Default approval route"
                  placeholder="Choose approval route"
                  options={APPROVAL_ROUTE_OPTIONS}
                  value={values.approvalRoute}
                  onChange={updateField('approvalRoute')}
                  message={routeMessage}
                  required
                  disabled={isDisabled}
                  invalid={Boolean(errors.approvalRoute)}
                />
              </div>

              <div className={styles.actionRow}>
                <Button
                  variant="Secondary"
                  onClick={() => {
                    setValues(DEFAULT_VALUES);
                    setSubmitted(false);
                    setSaved(false);
                  }}
                  disabled={isDisabled}
                >
                  Revert changes
                </Button>
                <Button
                  variant="Primary"
                  type="submit"
                  icon={<FaIcon icon={FA.check} />}
                  disabled={isDisabled}
                >
                  Save settings
                </Button>
              </div>
            </form>
          )}
        </div>

        <ContextPanel isLocked={isLocked} />
      </section>
    </main>
  );
}
