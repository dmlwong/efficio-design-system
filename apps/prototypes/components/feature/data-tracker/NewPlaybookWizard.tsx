'use client';

import React, { useState } from 'react';
import { Button, FaIcon, FA, IconButton, Overlay } from '@efficio/orbit';
import type { InputType } from '@/data/data-tracker-mock';
import { WizardStepper } from './WizardStepper';
import { WizardStepInputType } from './WizardStepInputType';
import { WizardStepUpload } from './WizardStepUpload';
import { WizardStepConfigure } from './WizardStepConfigure';
import type { DropzoneError } from './PdfDropzone';

interface NewPlaybookWizardProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (draft: WizardDraft) => void;
}

export interface WizardDraft {
  inputType: InputType;
  uploadedFile: string;
  secondaryFile?: string;
  category?: string;
  entity?: string;
  governingLaw?: string;
  agreementType?: string;
}

const STEPS = [
  { number: 1, label: 'Input Type' },
  { number: 2, label: 'Upload Your Files' },
  { number: 3, label: 'Additional Details & Submit' },
];

export const NewPlaybookWizard: React.FC<NewPlaybookWizardProps> = ({ open, onCancel, onSubmit }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputType, setInputType] = useState<InputType | undefined>(undefined);
  const [uploadedFile, setUploadedFile] = useState<string | undefined>(undefined);
  const [secondaryFile, setSecondaryFile] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [entity, setEntity] = useState<string | undefined>(undefined);
  const [governingLaw, setGoverningLaw] = useState<string | undefined>(undefined);
  const [agreementType, setAgreementType] = useState<string | undefined>(undefined);
  const [error, setError] = useState<DropzoneError | undefined>(undefined);

  const reset = () => {
    setStep(1);
    setInputType(undefined);
    setUploadedFile(undefined);
    setSecondaryFile(undefined);
    setCategory(undefined);
    setEntity(undefined);
    setGoverningLaw(undefined);
    setAgreementType(undefined);
    setError(undefined);
  };

  const handleCancel = () => { reset(); onCancel(); };

  const canAdvance = step === 1 ? Boolean(inputType) : step === 2 ? Boolean(uploadedFile) : true;

  const handleNext = () => {
    if (!canAdvance) return;
    if (step === 3) {
      if (!inputType || !uploadedFile) return;
      onSubmit({ inputType, uploadedFile, secondaryFile, category, entity, governingLaw, agreementType });
      reset();
      return;
    }
    setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((s) => (s - 1) as 1 | 2 | 3);
  };

  return (
    <Overlay visible={open} onClose={handleCancel} ariaLabel="New playbook wizard">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '85vh' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderBottom: '1px solid #e6e6e6',
          }}
        >
          <h2 style={{ margin: 0, fontFamily: 'var(--orbit-font-family-sans)', fontSize: 26, fontWeight: 600, color: '#040921' }}>
            New Playbook
          </h2>
          <IconButton
            ariaLabel="Close wizard"
            variant="Tertiary"
            size="Small"
            icon={<FaIcon icon={FA.xmark} size={16} color="#040921" />}
            onClick={handleCancel}
          />
        </div>

        {/* Stepper */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e6e6e6' }}>
          <WizardStepper steps={STEPS} current={step} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
          {step === 1 && <WizardStepInputType selected={inputType} onSelect={setInputType} />}
          {step === 2 && (
            <WizardStepUpload
              uploadedFile={uploadedFile}
              error={error}
              onFileSelected={(f) => { setUploadedFile(f); setError(undefined); }}
              onRemove={() => setUploadedFile(undefined)}
              secondaryFile={secondaryFile}
              onSecondaryFileSelected={setSecondaryFile}
              onSecondaryRemove={() => setSecondaryFile(undefined)}
              onTriggerError={setError}
            />
          )}
          {step === 3 && (
            <WizardStepConfigure
              category={category}
              entity={entity}
              governingLaw={governingLaw}
              agreementType={agreementType}
              onSetCategory={setCategory}
              onSetEntity={setEntity}
              onSetGoverningLaw={setGoverningLaw}
              onSetAgreementType={setAgreementType}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            borderTop: '1px solid #e6e6e6',
          }}
        >
          {step === 1 ? (
            <Button variant="Secondary" onClick={handleCancel}>Cancel</Button>
          ) : (
            <Button variant="Secondary" onClick={handleBack}>Back</Button>
          )}
          <Button variant="Primary" disabled={!canAdvance} onClick={handleNext}>
            {step === 3 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </div>
    </Overlay>
  );
};
