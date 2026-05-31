import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CLAUSEIQ_DEFAULT_PLAYBOOK, CLAUSEIQ_INITIATIVES, CLAUSEIQ_RESULT } from '@/data/clauseiq-mock';
import { ClauseIQPrototype } from './ClauseIQPrototype';
import { clauseIQReducer, initialClauseIQState } from './state';
import { validateClauseIQFile } from './upload';

function stubScrollIntoView() {
  const scrollIntoView = vi.fn();
  Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoView,
  });
  return scrollIntoView;
}

async function openInitiativeModal(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /get started/i }));
  await user.click(screen.getByRole('button', { name: /search initiatives/i }));
}

async function selectFirstInitiative(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /select initiative legal tech platform upgrade, row 1/i }));
}

async function selectPlaybookParameter(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^playbook$/i }));
  await user.click(screen.getByRole('option', { name: CLAUSEIQ_DEFAULT_PLAYBOOK }));
}

describe('ClauseIQ prototype flow', () => {
  beforeEach(() => {
    stubScrollIntoView();
  });

  it('renders the reference Orbit side navigation state with interactive rows', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype />);

    expect(screen.getByText('Connected Platform')).toBeInTheDocument();
    expect(screen.getByText('Yorkshire Water')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Content Search')).toBeInTheDocument();
    expect(screen.getByText('Derek Wong')).toBeInTheDocument();
    expect(screen.getByText('DW')).toBeInTheDocument();
    expect(screen.getAllByText('ClauseIQ')).toHaveLength(4);
    expect(screen.getByText('5d ago | TestClientTaxonomyCreatedBy')).toBeInTheDocument();
    expect(screen.getByText('MarketIQ')).toBeInTheDocument();
    expect(screen.getByText('1w ago | dfgdfgsdfg')).toBeInTheDocument();
    expect(screen.getByText('Home').closest('[aria-current="page"]')).toBeInTheDocument();
    expect(screen.getByText('MarketIQ').closest('[aria-current="page"]')).not.toBeInTheDocument();
    expect(screen.queryByText('Project Management')).not.toBeInTheDocument();

    await user.click(screen.getByText('Content Search'));
    expect(screen.getByText('Content Search').closest('[aria-current="page"]')).toBeInTheDocument();
    expect(screen.getByText('Home').closest('[aria-current="page"]')).not.toBeInTheDocument();

    await user.click(screen.getByText('MarketIQ'));
    expect(screen.getByText('MarketIQ').closest('[aria-current="page"]')).toBeInTheDocument();
    expect(screen.getByText('Content Search').closest('[aria-current="page"]')).not.toBeInTheDocument();
  });

  it('starts the flow, opens initiative search, and selects an initiative', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype />);

    expect(screen.getByRole('heading', { name: 'ClauseIQ' })).toBeInTheDocument();

    await openInitiativeModal(user);
    expect(screen.getByRole('dialog', { name: 'Select An Initiative' })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: 'Search initiatives' }), 'legal');
    await selectFirstInitiative(user);

    expect(screen.queryByRole('dialog', { name: 'Select An Initiative' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contract Analysis Parameters' })).toBeInTheDocument();
    expect(screen.getByText('Legal Tech Platform Upgrade')).toBeInTheDocument();
  });

  it('renders Contract Analysis Parameters card after initiative selection', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype processingDelayMs={0} />);

    await openInitiativeModal(user);
    await selectFirstInitiative(user);

    expect(screen.getByRole('heading', { name: 'Contract Analysis Parameters' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^playbook$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^category$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^country$/i })).toBeInTheDocument();
  });

  it('expands a dropdown with searchable options when a parameter is clicked', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype processingDelayMs={0} />);

    await openInitiativeModal(user);
    await selectFirstInitiative(user);

    const playbookCombo = screen.getByRole('button', { name: /^playbook$/i });
    expect(playbookCombo).toHaveAttribute('aria-expanded', 'false');

    await user.click(playbookCombo);
    expect(playbookCombo).toHaveAttribute('aria-expanded', 'true');

    const listbox = screen.getByRole('listbox', { name: /playbook options/i });
    expect(within(listbox).getAllByRole('option').length).toBeGreaterThanOrEqual(2);
    expect(within(listbox).getByRole('option', { name: CLAUSEIQ_DEFAULT_PLAYBOOK })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /search playbook options/i }), 'standard');
    expect(within(listbox).queryByRole('option', { name: CLAUSEIQ_DEFAULT_PLAYBOOK })).not.toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /Procurement_Playbook_Standard_v3\.pdf/i })).toBeInTheDocument();

    await user.click(within(listbox).getByRole('option', { name: /Procurement_Playbook_Standard_v3\.pdf/i }));

    expect(screen.queryByRole('listbox', { name: /playbook options/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upload Contract' })).toBeInTheDocument();
    expect(screen.getByText('Procurement_Playbook_Standard_v3.pdf')).toBeInTheDocument();
  });

  it('after picking a parameter shows Upload Contract card and a Change Playbook action', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype processingDelayMs={0} />);

    await openInitiativeModal(user);
    await selectFirstInitiative(user);
    await selectPlaybookParameter(user);

    expect(screen.getByRole('heading', { name: 'Upload Contract' })).toBeInTheDocument();
    expect(screen.getByText(CLAUSEIQ_DEFAULT_PLAYBOOK)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change playbook/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /change playbook/i }));

    expect(screen.getByRole('heading', { name: 'Contract Analysis Parameters' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Upload Contract' })).not.toBeInTheDocument();
  });

  it('shows at least seven initiatives in the default Mine tab', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype />);

    await openInitiativeModal(user);

    const initiativeTable = screen.getByRole('table', { name: 'Initiatives' });
    expect(within(initiativeTable).getAllByRole('row')).toHaveLength(8);
    expect(within(initiativeTable).getAllByText('Legal Tech Platform Upgrade')).toHaveLength(7);
    expect(within(initiativeTable).getAllByText('Technology')).toHaveLength(7);
    expect(within(initiativeTable).getAllByText('Sarah Chen')).toHaveLength(7);
  });

  it('keeps the welcome card informational after the flow starts', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype />);

    await user.click(screen.getByRole('button', { name: /get started/i }));

    expect(screen.queryByRole('button', { name: /get started/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Select Initiative' })).toBeInTheDocument();
  });

  it('smooth-scrolls newly active cards into view', async () => {
    const user = userEvent.setup();
    const scrollIntoView = stubScrollIntoView();

    render(<ClauseIQPrototype />);

    await user.click(screen.getByRole('button', { name: /get started/i }));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });
  });

  it('selects an initiative from the modal by keyboard', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype />);

    await openInitiativeModal(user);

    screen.getByRole('button', { name: 'Select initiative Legal Tech Platform Upgrade, row 1' }).focus();
    await user.keyboard('{Enter}');

    expect(screen.queryByRole('dialog', { name: 'Select An Initiative' })).not.toBeInTheDocument();
    expect(screen.getByText('Legal Tech Platform Upgrade')).toBeInTheDocument();
  });

  it('shows upload validation errors for unsupported files', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype />);

    await openInitiativeModal(user);
    await selectFirstInitiative(user);
    await selectPlaybookParameter(user);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['content'], 'Contract.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })],
      },
    });

    expect(screen.getByRole('alert')).toHaveTextContent("This file type isn't supported. Please upload a PDF file.");
  });

  it('shows upload validation errors for oversized PDFs', async () => {
    const user = userEvent.setup();
    const largePdf = new File(['content'], 'Large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largePdf, 'size', { value: 101 * 1024 * 1024 });

    render(<ClauseIQPrototype />);

    await openInitiativeModal(user);
    await selectFirstInitiative(user);
    await selectPlaybookParameter(user);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [largePdf],
      },
    });

    expect(screen.getByRole('alert')).toHaveTextContent('This file is too large. Maximum upload size is 100 MB.');
  });

  it('moves from upload to results, then starts a new analysis below the completed result', async () => {
    const user = userEvent.setup();

    render(<ClauseIQPrototype processingDelayMs={1} />);

    await openInitiativeModal(user);
    await selectFirstInitiative(user);
    await selectPlaybookParameter(user);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['content'], 'Test.pdf', { type: 'application/pdf' })],
      },
    });

    expect(screen.getByRole('heading', { name: 'Analysing Your Contract' })).toBeInTheDocument();
    expect(screen.getByText('Finding clauses in your contract...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Contract Analysis Parameters' })).not.toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Here is your Analysis Result' })).toBeInTheDocument();
    expect(screen.getByText('Legal Tech Platform Upgrade')).toBeInTheDocument();
    expect(screen.getByText('Test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Next, you can...' })).toBeInTheDocument();
    expect(screen.getByText('ClauseIQ turns dense contracts into clear, structured insights.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view result/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download report/i })).toBeInTheDocument();
    const analyseAnother = screen.getByRole('button', { name: /Analyse Contract on Another Initiative/i });
    const updateMilestone = screen.getByRole('button', { name: /Update Milestone/i });
    const completeInitiative = screen.getByRole('button', { name: /Complete Initiative/i });
    expect(screen.getByText('Start fresh with a new initiative.')).toBeInTheDocument();
    expect(screen.getByText('Track your initiative progress.')).toBeInTheDocument();
    expect(screen.getByText('Mark this initiative as complete.')).toBeInTheDocument();
    expect(analyseAnother.compareDocumentPosition(updateMilestone) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(updateMilestone.compareDocumentPosition(completeInitiative) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(updateMilestone).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('columnheader', { name: 'Milestone' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Due Date' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Gate 1')).toBeInTheDocument();
    expect(screen.getByText('Gate 5')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Mark Complete' })).toHaveLength(5);
    expect(screen.getByText('Missing clauses: 13')).toBeInTheDocument();
    expect(screen.getByText('High deviation: 12')).toBeInTheDocument();
    expect(screen.getByText('Medium deviation: 5')).toBeInTheDocument();
    expect(screen.getByText('Low deviation: 12')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Contract Analysis Parameters' })).not.toBeInTheDocument();
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /run another analysis/i }));

    expect(screen.queryByRole('heading', { name: 'Next, you can...' })).not.toBeInTheDocument();
    expect(screen.getByText('New Analysis')).toBeInTheDocument();
    expect(screen.getByText('Legal Tech Platform Upgrade')).toBeInTheDocument();
    expect(screen.getByText('Test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Upload Contract' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Select Initiative' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Contract Analysis Parameters' })).not.toBeInTheDocument();

    const nextFileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(nextFileInput, {
      target: {
        files: [new File(['content'], 'Second.pdf', { type: 'application/pdf' })],
      },
    });

    expect(screen.getByRole('heading', { name: 'Analysing Your Contract' })).toBeInTheDocument();
    expect(screen.getByText('Test.pdf')).toBeInTheDocument();
    expect(screen.getByText('Second.pdf')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('heading', { name: 'Here is your Analysis Result' })).toHaveLength(2);
    });
    expect(screen.getByText('New Analysis')).toBeInTheDocument();
    expect(screen.getByText('Second.pdf')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Next, you can...' })).toBeInTheDocument();
  });

  it('does not emit console warnings or errors through the core flow', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    try {
      render(<ClauseIQPrototype processingDelayMs={1} />);

      await openInitiativeModal(user);
      await selectFirstInitiative(user);
      await selectPlaybookParameter(user);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      fireEvent.change(fileInput, {
        target: {
          files: [new File(['content'], 'Test.pdf', { type: 'application/pdf' })],
        },
      });

      expect(await screen.findByRole('heading', { name: 'Here is your Analysis Result' })).toBeInTheDocument();
      expect(warn).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
      error.mockRestore();
    }
  });
});

describe('clauseIQReducer', () => {
  it('moves from initiative selection through processing to results', () => {
    const selected = clauseIQReducer(initialClauseIQState, { type: 'START_FLOW' });
    const initiative = CLAUSEIQ_INITIATIVES[0];
    const withInitiative = clauseIQReducer(selected, { type: 'SELECT_INITIATIVE', initiative });
    const withParameter = clauseIQReducer(withInitiative, {
      type: 'SELECT_PARAMETER',
      parameter: { kind: 'Playbook', label: CLAUSEIQ_DEFAULT_PLAYBOOK },
    });
    const processing = clauseIQReducer(withParameter, {
      type: 'SELECT_FILE',
      file: { name: 'Test.pdf', size: 1024, type: 'application/pdf' },
    });
    const results = clauseIQReducer(processing, { type: 'PROCESSING_COMPLETE', result: CLAUSEIQ_RESULT });

    expect(withInitiative.step).toBe('select-parameters');
    expect(withParameter.step).toBe('upload-contract');
    expect(processing.step).toBe('processing');
    expect(results.step).toBe('results');
    expect(results.analysisResult?.reviewedClauses).toBe(47);
  });

  it('keeps the completed result and starts a new upload for another analysis', () => {
    const state = clauseIQReducer(
      {
        ...initialClauseIQState,
        step: 'results',
        selectedInitiative: CLAUSEIQ_INITIATIVES[0],
        selectedParameter: { kind: 'Playbook', label: CLAUSEIQ_DEFAULT_PLAYBOOK },
        uploadedFile: { name: 'Test.pdf', size: 1024, type: 'application/pdf' },
        analysisResult: CLAUSEIQ_RESULT,
        saveToDocuments: true,
      },
      { type: 'RUN_ANOTHER_ANALYSIS' },
    );

    expect(state.step).toBe('upload-contract');
    expect(state.selectedInitiative).toBe(CLAUSEIQ_INITIATIVES[0]);
    expect(state.selectedParameter?.label).toBe(CLAUSEIQ_DEFAULT_PLAYBOOK);
    expect(state.previousAnalysis?.file.name).toBe('Test.pdf');
    expect(state.previousAnalysis?.result.reviewedClauses).toBe(47);
    expect(state.previousAnalysis?.saveToDocuments).toBe(true);
    expect(state.uploadedFile).toBeUndefined();
    expect(state.analysisResult).toBeUndefined();
    expect(state.initiativeModalOpen).toBe(false);
  });
});

describe('validateClauseIQFile', () => {
  it('accepts PDF files and rejects unsupported or oversized files', () => {
    const pdf = new File(['content'], 'Test.pdf', { type: 'application/pdf' });
    const docx = new File(['content'], 'Test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const largePdf = new File(['content'], 'Large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largePdf, 'size', { value: 101 * 1024 * 1024 });

    expect(validateClauseIQFile(pdf).file?.name).toBe('Test.pdf');
    expect(validateClauseIQFile(docx).error).toBe('unsupported');
    expect(validateClauseIQFile(largePdf).error).toBe('too-large');
  });
});
