'use client';

import React, { useState } from 'react';
import {
  Card,
  Headings,
  Text,
  Button,
  Textbox,
  TextArea,
  Dropdown,
  DateInput,
  CurrencyInput,
  Checkbox,
  Toggle,
  Searchbox,
  FaIcon,
  Separator,
  Chip,
  StatusIndicator,
} from '@efficio/orbit';

/* ─── Step Indicator ─── */
function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const isComplete = i < current;
        const isActive = i === current;
        const isLast = i === steps.length - 1;

        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                backgroundColor: isComplete
                  ? 'var(--orbit-color-status-high-bg-success)'
                  : isActive
                    ? 'var(--orbit-color-btn-primary-bg)'
                    : 'var(--orbit-color-card-border-default)',
                color: isComplete || isActive ? 'var(--orbit-color-white)' : 'var(--orbit-color-text-secondary)',
                fontFamily: 'var(--orbit-font-family-sans)',
                fontSize: 'var(--orbit-text-xs)',
                fontWeight: 600,
              }}>
                {isComplete ? <FaIcon icon={'\uf00c'} size={12} color="var(--orbit-color-white)" /> : i + 1}
              </span>
              <span style={{
                fontFamily: 'var(--orbit-font-family-sans)',
                fontSize: 'var(--orbit-text-sm)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--orbit-color-text-primary)' : isComplete ? 'var(--orbit-color-text-success)' : 'var(--orbit-color-text-secondary)',
                whiteSpace: 'nowrap',
              }}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div style={{
                flex: 1, height: 2, minWidth: 40, margin: '0 var(--orbit-space-base)',
                backgroundColor: isComplete ? 'var(--orbit-color-status-high-bg-success)' : 'var(--orbit-color-card-border-default)',
                borderRadius: 1,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Form Data ─── */
interface FormData {
  projectName: string;
  company: string;
  category: string;
  startDate: string;
  description: string;
  budget: string;
  currency: string;
  notifyTeam: boolean;
  agreeTerms: boolean;
}

const initialData: FormData = {
  projectName: '',
  company: '',
  category: '',
  startDate: '',
  description: '',
  budget: '',
  currency: 'GBP',
  notifyTeam: true,
  agreeTerms: false,
};

/* ─── Main Page ─── */
export default function FormPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const steps = ['Project Details', 'Scope & Budget', 'Review & Submit'];

  const update = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const canNext = () => {
    if (step === 0) return data.projectName && data.company && data.category;
    if (step === 1) return data.description && data.budget;
    if (step === 2) return data.agreeTerms;
    return false;
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div data-theme="orbit" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--orbit-color-card-bg-accent)', fontFamily: 'var(--orbit-font-family-sans)' }}>
        <Card state="Default" padding="Medium" style={{ width: 560, textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--orbit-space-base)', padding: '40px 0' }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: '50%',
              backgroundColor: 'var(--orbit-color-status-low-bg-success)',
            }}>
              <FaIcon icon={'\uf00c'} size={24} color="var(--orbit-color-text-success)" />
            </span>
            <Headings size="Heading 3">Submission Complete</Headings>
            <Text variant="Secondary" size="Paragraph">
              Your project has been submitted successfully. You will receive a confirmation shortly.
            </Text>
            <div style={{ marginTop: 'var(--orbit-space-base)' }}>
              <Button variant="Primary" onClick={() => { setSubmitted(false); setStep(0); setData(initialData); }}>
                Create Another
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div data-theme="orbit" style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backgroundColor: 'var(--orbit-color-card-bg-accent)', fontFamily: 'var(--orbit-font-family-sans)', padding: '64px var(--orbit-space-m)' }}>
      <Card state="Default" padding="Medium" style={{ width: 640 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--orbit-space-base)' }}>
            <Headings size="Heading 3">New Project Submission</Headings>
            <Text variant="Secondary" size="Paragraph">
              Complete the form below to submit a new project for review.
            </Text>
          </div>

          <Separator />

          {/* Step indicator */}
          <div style={{ marginTop: 'var(--orbit-space-m)' }}>
            <StepIndicator steps={steps} current={step} />
          </div>

          {/* Step 1: Project Details */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
              <Headings size="Heading 5">Project Details</Headings>
              <Text variant="Secondary" size="Paragraph">
                Provide basic information about the project.
              </Text>

              <Textbox
                label="Project Name"
                placeholder="Enter project name"
                value={data.projectName}
                onChange={(v) => update('projectName', v)}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--orbit-space-base)' }}>
                <Dropdown
                  label="Company"
                  placeholder="Select company..."
                  options={[
                    { label: 'Yorkshire Water', value: 'yw' },
                    { label: 'Thames Water', value: 'tw' },
                    { label: 'Severn Trent', value: 'st' },
                    { label: 'United Utilities', value: 'uu' },
                  ]}
                  value={data.company}
                  onChange={(v) => update('company', v)}
                  required
                />
                <Dropdown
                  label="Category"
                  placeholder="Select category..."
                  options={[
                    { label: 'Technology', value: 'tech' },
                    { label: 'Legal', value: 'legal' },
                    { label: 'Operations', value: 'ops' },
                    { label: 'Finance', value: 'fin' },
                  ]}
                  value={data.category}
                  onChange={(v) => update('category', v)}
                  required
                />
              </div>

              <DateInput
                ariaLabel="Target start date"
                value={data.startDate}
                onChange={(v) => update('startDate', v)}
                placeholder="Target start date"
              />
            </div>
          )}

          {/* Step 2: Scope & Budget */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
              <Headings size="Heading 5">Scope & Budget</Headings>
              <Text variant="Secondary" size="Paragraph">
                Define the project scope and estimated budget.
              </Text>

              <TextArea
                label="Project Description"
                placeholder="Describe the project scope, objectives, and key deliverables..."
                value={data.description}
                onChange={(v) => update('description', v)}
                maxLength={500}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--orbit-space-base)' }}>
                <CurrencyInput
                  label="Estimated Budget"
                  placeholder="Enter amount"
                  value={data.budget}
                  onChange={(v) => update('budget', v)}
                  currency={data.currency}
                  required
                />
                <Dropdown
                  label="Currency"
                  placeholder="Select..."
                  options={[
                    { label: 'GBP', value: 'GBP' },
                    { label: 'USD', value: 'USD' },
                    { label: 'EUR', value: 'EUR' },
                  ]}
                  value={data.currency}
                  onChange={(v) => update('currency', v)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--orbit-space-s) 0' }}>
                <Text variant="Primary" size="Paragraph">Notify team members on submission</Text>
                <Toggle checked={data.notifyTeam} onChange={(v) => update('notifyTeam', v)} />
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
              <Headings size="Heading 5">Review & Submit</Headings>
              <Text variant="Secondary" size="Paragraph">
                Review your submission before confirming.
              </Text>

              {/* Review card */}
              <Card state="Accent" type="Static" padding="Base">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
                  <ReviewRow label="Project Name" value={data.projectName} />
                  <Separator />
                  <ReviewRow label="Company" value={
                    { yw: 'Yorkshire Water', tw: 'Thames Water', st: 'Severn Trent', uu: 'United Utilities' }[data.company] || '—'
                  } />
                  <Separator />
                  <ReviewRow label="Category" value={
                    { tech: 'Technology', legal: 'Legal', ops: 'Operations', fin: 'Finance' }[data.category] || '—'
                  } />
                  <Separator />
                  <ReviewRow label="Start Date" value={data.startDate || 'Not specified'} />
                  <Separator />
                  <ReviewRow label="Description" value={data.description} />
                  <Separator />
                  <ReviewRow label="Budget" value={data.budget ? `${data.budget} ${data.currency}` : '—'} />
                  <Separator />
                  <ReviewRow label="Notify Team" value={data.notifyTeam ? 'Yes' : 'No'} />
                </div>
              </Card>

              {/* Terms */}
              <div style={{ padding: 'var(--orbit-space-s) 0' }}>
                <Checkbox
                  checked={data.agreeTerms}
                  onChange={(v) => update('agreeTerms', v)}
                  label="I confirm the details above are accurate and agree to the submission terms."
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 'var(--orbit-space-base)', borderTop: '1px solid var(--orbit-color-card-border-default)' }}>
            <div>
              {step > 0 && (
                <Button variant="Secondary" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
            </div>
            <div style={{ display: 'flex', gap: 'var(--orbit-space-s)' }}>
              <Text variant="Secondary" size="Small">
                Step {step + 1} of {steps.length}
              </Text>
              {step < 2 ? (
                <Button
                  variant="Primary"
                  state={canNext() ? 'Default' : 'Disabled'}
                  onClick={() => canNext() && setStep(step + 1)}
                  iconRight={<FaIcon icon={'\uf054'} size={12} color="var(--orbit-color-white)" />}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="Primary"
                  state={canNext() ? 'Default' : 'Disabled'}
                  onClick={() => canNext() && handleSubmit()}
                  icon={<FaIcon icon={'\uf00c'} size={14} color="var(--orbit-color-white)" />}
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ─── Review Row ─── */
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--orbit-space-base)' }}>
      <Text variant="Secondary" size="Paragraph">{label}</Text>
      <Text variant="Bold" size="Paragraph">{value || '—'}</Text>
    </div>
  );
}
