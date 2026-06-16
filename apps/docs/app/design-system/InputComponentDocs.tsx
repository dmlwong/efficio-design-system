'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Checkbox,
  CurrencyInput,
  DateInput,
  Dropzone,
  Dropdown,
  Headings,
  Input,
  MultiSelectDropdown,
  Radio,
  RadioGroup,
  Searchbox,
  Text,
  TextArea,
  Textbox,
  Toggle,
} from '@efficio/orbit';
import { getComponentDoc, type ComponentDoc, type InputComponentId } from './componentDocs';

interface AnatomyItem {
  label: string;
  description: string;
}

interface InputComponentContent {
  lead: string;
  overview: string[];
  anatomy: AnatomyItem[];
  guidance: string[];
  accessibility: string[];
  related: string[];
}

const SECTION_NAV = [
  { id: 'preview', label: 'Preview' },
  { id: 'overview', label: 'Overview' },
  { id: 'anatomy', label: 'Anatomy' },
  { id: 'variants', label: 'Variants & States' },
  { id: 'guidance', label: 'Usage Guidance' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'related', label: 'Related Components' },
];

const OPTIONS = [
  { label: 'Legal Tech Platform', value: 'legal-tech' },
  { label: 'Fleet Optimisation', value: 'fleet' },
  { label: 'Cloud Consolidation', value: 'cloud' },
];

const INPUT_DOC_CONTENT: Record<InputComponentId, InputComponentContent> = {
  'text-input': {
    lead: 'A compact single-line field for free text when the surrounding interface already supplies the label or context.',
    overview: [
      'Text Input is the lightweight standalone input primitive. Use it in search bars, table controls, inline editing surfaces, or compact forms where a visible label would add unnecessary repetition.',
      'For normal form fields with labels, helper text, and validation messaging, prefer Textbox.',
    ],
    anatomy: [
      { label: 'Container', description: 'Applies border, background, focus, hover, disabled, and invalid states.' },
      { label: 'Input value', description: 'The editable text value controlled by the consuming view.' },
      { label: 'Optional icon', description: 'A leading visual cue for compact controls that need recognition.' },
    ],
    guidance: [
      'Provide an accessible name whenever there is no visible label.',
      'Keep placeholders short and descriptive; do not rely on them as the only instruction.',
      'Use invalid state only with adjacent validation feedback in the surrounding UI.',
    ],
    accessibility: [
      'Use ariaLabel or ariaLabelledBy for standalone fields.',
      'Set disabled for fields that cannot be edited.',
      'Use required and invalid only when the parent form communicates those requirements.',
    ],
    related: ['textbox', 'searchbox', 'date-input'],
  },
  textbox: {
    lead: 'A labelled single-line form field with helper text, validation, required, disabled, and locked states.',
    overview: [
      'Textbox is the default choice for text entry inside forms. It combines the input, label, required marker, helper text, and validation state in one consistent field pattern.',
      'Use it when the user needs a clear field name and supporting message, especially in workflows with multiple fields.',
    ],
    anatomy: [
      { label: 'Label', description: 'Names the field and anchors the input for assistive technology.' },
      { label: 'Required marker', description: 'Shows that the field must be completed before submission.' },
      { label: 'Input container', description: 'Communicates hover, focus, invalid, disabled, and locked states.' },
      { label: 'Message', description: 'Provides helper text or validation feedback below the field.' },
    ],
    guidance: [
      'Use helper text to clarify format, not to repeat the label.',
      'Use locked for read-only values that are intentionally visible but not editable.',
      'Use disabled for unavailable fields that are not currently actionable.',
    ],
    accessibility: [
      'The visible label is associated with the input.',
      'Helper and error messages are exposed through aria-describedby.',
      'Invalid and required states are passed to the native input semantics.',
    ],
    related: ['text-input', 'text-area', 'currency-input', 'dropdown'],
  },
  'text-area': {
    lead: 'A labelled multiline field for longer notes, descriptions, and instructions.',
    overview: [
      'Text Area supports longer free-text entry with helper text, validation, and character count. It is intended for content that benefits from multiple lines.',
      'Use Textbox instead when the expected value is short or structured.',
    ],
    anatomy: [
      { label: 'Label', description: 'Identifies the content users should enter.' },
      { label: 'Text area', description: 'The multiline input surface with hover, focus, invalid, disabled, and filled states.' },
      { label: 'Footer', description: 'Contains helper or error text and character count.' },
    ],
    guidance: [
      'Set a max length when the workflow or downstream system has a limit.',
      'Keep rows proportional to the expected content length.',
      'Use validation messages for actionable corrections, not generic warnings.',
    ],
    accessibility: [
      'Expose a label or aria label for every text area.',
      'Use aria-invalid when validation fails.',
      'Keep character limits visible when they constrain submission.',
    ],
    related: ['textbox', 'text-input'],
  },
  searchbox: {
    lead: 'A compact search field with search icon treatment for filtering or querying collections.',
    overview: [
      'Searchbox is for entering search terms that affect a list, table, or result set. Its visual treatment distinguishes it from ordinary text entry.',
      'Use it near the content being searched so the relationship is obvious.',
    ],
    anatomy: [
      { label: 'Search field', description: 'The controlled text value used to filter or query content.' },
      { label: 'Search icon', description: 'A persistent icon that identifies the field as search.' },
      { label: 'State container', description: 'Shows hover, focus, invalid, disabled, and filled states.' },
    ],
    guidance: [
      'Use placeholder text to describe the searchable object, such as suppliers or documents.',
      'Keep search close to the list, table, or collection it affects.',
      'Do not use Searchbox for arbitrary text entry inside normal forms.',
    ],
    accessibility: [
      'Always provide ariaLabel or ariaLabelledBy.',
      'Use invalid only when search input can fail validation.',
      'Disabled search should not be focusable.',
    ],
    related: ['text-input', 'dropdown', 'multi-select-dropdown'],
  },
  dropzone: {
    lead: 'A file upload target for drag-and-drop or file picker upload flows.',
    overview: [
      'Dropzone gives users a clear upload surface with accepted file type and size guidance. Use it for import steps, document upload, and attachment workflows.',
      'It supports click, drag, disabled, and error states while keeping file handling controlled by the parent view.',
    ],
    anatomy: [
      { label: 'Error message', description: 'Optional feedback displayed before the upload surface.' },
      { label: 'Hidden file input', description: 'Native upload control triggered by the visual dropzone.' },
      { label: 'Upload surface', description: 'The visible drag-and-drop and file picker target.' },
      { label: 'Guidance text', description: 'Accepted file type and maximum size information.' },
    ],
    guidance: [
      'State accepted file types and size limits before the user uploads.',
      'Show validation errors near the upload target.',
      'Keep the selected file feedback close to the Dropzone.',
    ],
    accessibility: [
      'Provide a clear ariaLabel describing the upload purpose.',
      'Use role alert for upload validation errors.',
      'Ensure disabled upload flows explain why upload is unavailable.',
    ],
    related: ['file-item', 'document-glyph'],
  },
  'date-input': {
    lead: 'A compact date field for consistent date entry in product workflows.',
    overview: [
      'Date Input is a date-formatted standalone input with an icon affordance. Use it when date values need a consistent surface and validation state.',
      'It is best for compact filters, table controls, and simple date fields.',
    ],
    anatomy: [
      { label: 'Date value', description: 'The controlled date string shown in the text input.' },
      { label: 'Calendar affordance', description: 'A bordered icon area that identifies the field as date-related.' },
      { label: 'State container', description: 'Shows hover, focus, invalid, disabled, and filled states.' },
    ],
    guidance: [
      'Use clear date formatting guidance in the surrounding label or placeholder.',
      'Use invalid state for impossible, malformed, or disallowed dates.',
      'Disable the field when dates cannot be edited in the current workflow state.',
    ],
    accessibility: [
      'Provide ariaLabel or ariaLabelledBy.',
      'Use aria-invalid for invalid dates.',
      'Do not rely on the icon alone to communicate date requirements.',
    ],
    related: ['text-input', 'dropdown'],
  },
  'currency-input': {
    lead: 'A labelled numeric field with an attached currency code.',
    overview: [
      'Currency Input is for monetary values where the unit must be visible and consistent. It combines a form label, helper text, input value, validation state, and currency marker.',
      'Use it for savings, prices, budgets, commercial values, and other financial inputs.',
    ],
    anatomy: [
      { label: 'Label', description: 'Names the monetary value being collected.' },
      { label: 'Value field', description: 'The controlled input value entered by the user.' },
      { label: 'Currency marker', description: 'Displays the configured currency code at the end of the field.' },
      { label: 'Message', description: 'Helper text or validation feedback below the field.' },
    ],
    guidance: [
      'Set the correct currency code for the workflow context.',
      'Do not ask users to type the currency into the value field.',
      'Use validation messaging for formatting or range constraints.',
    ],
    accessibility: [
      'Associate the visible label with the input.',
      'Expose helper and validation messages through aria-describedby.',
      'Use aria-invalid and aria-required where appropriate.',
    ],
    related: ['textbox', 'text-input'],
  },
  dropdown: {
    lead: 'A labelled single-select control for choosing one value from a finite option set.',
    overview: [
      'Dropdown is used when users need to select exactly one option. It supports label, required, disabled, invalid, helper messaging, keyboard navigation, and selected state.',
      'Use it when choices are known and the list is not better represented as visible radio options.',
    ],
    anatomy: [
      { label: 'Label row', description: 'Names the selection and can show required state.' },
      { label: 'Trigger', description: 'Shows the current value or placeholder and opens the listbox.' },
      { label: 'Listbox', description: 'Contains selectable options with active and selected states.' },
      { label: 'Message', description: 'Helper or validation text displayed below the trigger.' },
    ],
    guidance: [
      'Keep option labels clear and unique.',
      'Use placeholder text that describes the expected decision.',
      'Prefer Radio when there are only two or three high-priority choices that should stay visible.',
    ],
    accessibility: [
      'The trigger exposes expanded, controls, labelled-by, and active-descendant semantics.',
      'Keyboard users can open and navigate with arrow, enter, space, escape, home, and end keys.',
      'Use invalid state with clear validation messaging.',
    ],
    related: ['multi-select-dropdown', 'radio', 'searchbox'],
  },
  'multi-select-dropdown': {
    lead: 'A labelled multi-select control with removable selected-value chips.',
    overview: [
      'Multi-select Dropdown supports choosing multiple options from a defined set while keeping selected values visible in the trigger.',
      'Use it for filters, categorisation, tags, and forms where multiple values are valid.',
    ],
    anatomy: [
      { label: 'Label row', description: 'Names the multi-select field and can show required state.' },
      { label: 'Trigger', description: 'Displays selected chips or placeholder text.' },
      { label: 'Selected chips', description: 'Show chosen values with individual remove controls.' },
      { label: 'Listbox', description: 'Displays all selectable options with selected and active states.' },
    ],
    guidance: [
      'Use for finite option sets where multiple choices are expected.',
      'Avoid using it for very large lists unless search or filtering is added.',
      'Keep selected-value labels short enough to scan in the trigger.',
    ],
    accessibility: [
      'The trigger uses combobox semantics and exposes multiselect state in the listbox.',
      'Selected chips include remove button labels.',
      'Keyboard users can open and move through options using arrows and selection keys.',
    ],
    related: ['dropdown', 'chip', 'filter'],
  },
  checkbox: {
    lead: 'A binary control for independent choices and multi-select lists.',
    overview: [
      'Checkbox is used for on/off choices that do not immediately imply a settings change, or for selecting multiple independent options.',
      'Use it when more than one option can be selected or when a value is confirmed as part of form submission.',
    ],
    anatomy: [
      { label: 'Input box', description: 'Shows checked, unchecked, hover, and disabled states.' },
      { label: 'Label', description: 'Explains the choice controlled by the checkbox.' },
      { label: 'Alignment', description: 'Supports left and right label alignment where needed.' },
    ],
    guidance: [
      'Use Checkbox for independent choices, not mutually exclusive groups.',
      'Write labels as clear statements or objects that can be selected.',
      'Use disabled only when the choice is unavailable in the current context.',
    ],
    accessibility: [
      'Provide a label or ariaLabel for every checkbox.',
      'The native checked and disabled semantics are preserved.',
      'Enter toggles the checkbox for keyboard users.',
    ],
    related: ['radio', 'toggle', 'multi-select-dropdown'],
  },
  radio: {
    lead: 'A grouped single-choice control for mutually exclusive options.',
    overview: [
      'Radio is used when users must choose one value from a small, visible set. The group keeps keyboard movement and selection behaviour consistent.',
      'Use Dropdown instead when the option set is long or not important enough to keep visible.',
    ],
    anatomy: [
      { label: 'Radio group', description: 'Defines the single-choice set and accessible group label.' },
      { label: 'Radio item', description: 'A selectable option with checked, hover, disabled, and error states.' },
      { label: 'Label', description: 'Explains each available choice.' },
    ],
    guidance: [
      'Use for mutually exclusive options where visibility aids comparison.',
      'Keep group sizes small and labels concise.',
      'Avoid mixing enabled and disabled options unless the reason is clear nearby.',
    ],
    accessibility: [
      'Use RadioGroup with an ariaLabel to describe the decision.',
      'Arrow keys move between enabled radio options.',
      'Use error state when selection has failed validation.',
    ],
    related: ['checkbox', 'dropdown', 'toggle'],
  },
  toggle: {
    lead: 'An immediate on/off switch for binary settings.',
    overview: [
      'Toggle represents a setting that can be switched on or off. It is best when the change is immediate or clearly tied to a configuration state.',
      'Use Checkbox instead for submit-time choices or confirmations.',
    ],
    anatomy: [
      { label: 'Switch input', description: 'The native control that exposes switch semantics.' },
      { label: 'Track', description: 'Shows active, inactive, and disabled states.' },
      { label: 'Handle', description: 'Moves to communicate checked state.' },
      { label: 'Label', description: 'Names the setting being toggled.' },
    ],
    guidance: [
      'Use Toggle for settings, not one-off actions.',
      'Make labels describe what becomes active when the toggle is on.',
      'Avoid using Toggle when users need to review changes before submitting.',
    ],
    accessibility: [
      'The control uses switch semantics.',
      'Provide a visible label or ariaLabel.',
      'Enter toggles the switch for keyboard users.',
    ],
    related: ['checkbox', 'radio'],
  },
};

function DocsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-doc-section style={{ scrollMarginTop: 96, marginBottom: 56 }}>
      <div style={{ marginBottom: 16 }}>
        <Headings size="Heading 3">{title}</Headings>
      </div>
      {children}
    </section>
  );
}

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
        borderRadius: 'var(--orbit-radius-md)',
        background: 'var(--orbit-color-bg-default)',
        minHeight: 220,
        padding: 'var(--orbit-space-l)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: 'min(100%, 460px)' }}>{children}</div>
    </div>
  );
}

function StateGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--orbit-space-base)',
      }}
    >
      {children}
    </div>
  );
}

function StateExample({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
        borderRadius: 'var(--orbit-radius-sm)',
        background: 'var(--orbit-color-bg-default)',
        padding: 'var(--orbit-space-base)',
        minHeight: 112,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--orbit-space-base)',
      }}
    >
      <Text variant="Secondary" size="Small">{label}</Text>
      <div>{children}</div>
    </div>
  );
}

function AnatomyList({ items }: { items: AnatomyItem[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 'var(--orbit-space-base)',
      }}
    >
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            borderTop: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
            paddingTop: 'var(--orbit-space-base)',
          }}
        >
          <Headings size="Heading 5">{item.label}</Headings>
          <p style={{ margin: 'var(--orbit-space-xs) 0 0', color: 'var(--orbit-color-text-secondary)', fontSize: 'var(--orbit-text-sm)', lineHeight: 1.6 }}>
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul
      style={{
        margin: 0,
        paddingInlineStart: 'var(--orbit-space-base)',
        color: 'var(--orbit-color-text-secondary)',
        fontSize: 'var(--orbit-text-sm)',
        lineHeight: 1.7,
      }}
    >
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function TokenList({ tokens }: { tokens: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--orbit-space-s)' }}>
      {tokens.map((token) => (
        <code
          key={token}
          style={{
            border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
            borderRadius: 'var(--orbit-radius-sm)',
            background: 'var(--orbit-color-bg-hover)',
            padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
            fontSize: 'var(--orbit-text-xs)',
            color: 'var(--orbit-color-text-primary)',
          }}
        >
          {token}
        </code>
      ))}
    </div>
  );
}

function RelatedComponents({ ids }: { ids: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--orbit-space-s)' }}>
      {ids.map((id) => {
        const related = getComponentDoc(id);
        if (!related) return null;

        return (
          <Link
            key={id}
            href={`/design-system/components/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 'var(--orbit-space-l)',
              border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
              borderRadius: 'var(--orbit-radius-sm)',
              padding: 'var(--orbit-space-xs) var(--orbit-space-s)',
              textDecoration: 'none',
              color: 'var(--orbit-color-text-primary)',
              fontSize: 'var(--orbit-text-sm)',
            }}
          >
            {related.title}
          </Link>
        );
      })}
    </div>
  );
}

function PrimaryPreview({ id }: { id: InputComponentId }) {
  const [textInputValue, setTextInputValue] = useState('Supplier review');
  const [textboxValue, setTextboxValue] = useState('Acme Ltd');
  const [textareaValue, setTextareaValue] = useState('Summarise contract exposure and recommended next steps.');
  const [searchValue, setSearchValue] = useState('contracts');
  const [selectedFile, setSelectedFile] = useState('');
  const [dateValue, setDateValue] = useState('26-06-04');
  const [currencyValue, setCurrencyValue] = useState('125000');
  const [dropdownValue, setDropdownValue] = useState('legal-tech');
  const [multiValue, setMultiValue] = useState<string[]>(['legal-tech', 'cloud']);
  const [checked, setChecked] = useState(true);
  const [radioValue, setRadioValue] = useState('team');
  const [toggleValue, setToggleValue] = useState(true);

  switch (id) {
    case 'text-input':
      return <Input ariaLabel="Initiative name" placeholder="Enter initiative" value={textInputValue} onChange={setTextInputValue} />;
    case 'textbox':
      return <Textbox label="Supplier name" message="Use the registered supplier name." value={textboxValue} onChange={setTextboxValue} required />;
    case 'text-area':
      return <TextArea label="Analysis notes" message="Keep notes concise and action-oriented." value={textareaValue} onChange={setTextareaValue} maxLength={180} />;
    case 'searchbox':
      return <Searchbox ariaLabel="Search documents" placeholder="Search documents..." value={searchValue} onChange={setSearchValue} />;
    case 'dropzone':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-s)' }}>
          <Dropzone
            ariaLabel="Upload contract"
            accept=".pdf"
            onFileSelected={(file) => setSelectedFile(file.name)}
            acceptedFileTypesLabel="File types supported: PDF"
            maxFileSizeLabel="Maximum upload file size: 100 MB"
          />
          {selectedFile && <Text variant="Secondary" size="Small">Selected file: {selectedFile}</Text>}
        </div>
      );
    case 'date-input':
      return <DateInput ariaLabel="Target date" value={dateValue} onChange={setDateValue} />;
    case 'currency-input':
      return <CurrencyInput label="Projected savings" message="Enter value before tax." value={currencyValue} onChange={setCurrencyValue} currency="GBP" />;
    case 'dropdown':
      return <Dropdown label="Initiative" message="Choose one initiative." options={OPTIONS} value={dropdownValue} onChange={setDropdownValue} required />;
    case 'multi-select-dropdown':
      return <MultiSelectDropdown label="Initiatives" options={OPTIONS} value={multiValue} onChange={setMultiValue} required />;
    case 'checkbox':
      return <Checkbox checked={checked} onChange={setChecked} label="Include archived documents" />;
    case 'radio':
      return (
        <RadioGroup value={radioValue} name="ownership-preview" ariaLabel="Ownership" onChange={setRadioValue}>
          <Radio value="mine" checked={false} onChange={() => {}} label="Mine" />
          <Radio value="team" checked={false} onChange={() => {}} label="Team" />
          <Radio value="all" checked={false} onChange={() => {}} label="All" />
        </RadioGroup>
      );
    case 'toggle':
      return <Toggle checked={toggleValue} onChange={setToggleValue} label="Show completed initiatives" />;
  }
}

function VariantExamples({ id }: { id: InputComponentId }) {
  switch (id) {
    case 'text-input':
      return (
        <StateGrid>
          <StateExample label="Default"><Input ariaLabel="Default input" placeholder="Placeholder text" value="" onChange={() => {}} /></StateExample>
          <StateExample label="Filled"><Input ariaLabel="Filled input" value="Acme review" onChange={() => {}} /></StateExample>
          <StateExample label="Focused"><Input ariaLabel="Focused input" placeholder="Placeholder text" value="" onChange={() => {}} previewState="focus" /></StateExample>
          <StateExample label="Invalid"><Input ariaLabel="Invalid input" value="Invalid value" onChange={() => {}} invalid /></StateExample>
          <StateExample label="Disabled"><Input ariaLabel="Disabled input" placeholder="Unavailable" value="" onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'textbox':
      return (
        <StateGrid>
          <StateExample label="Default"><Textbox label="Label" message="Helper text" value="" onChange={() => {}} /></StateExample>
          <StateExample label="Filled"><Textbox label="Label" message="Helper text" value="Filled value" onChange={() => {}} /></StateExample>
          <StateExample label="Required"><Textbox label="Label" message="Required field" value="" onChange={() => {}} required /></StateExample>
          <StateExample label="Invalid"><Textbox label="Label" message="Error message" value="Invalid" onChange={() => {}} invalid /></StateExample>
          <StateExample label="Locked"><Textbox label="Label" message="Read-only value" value="Locked" onChange={() => {}} locked /></StateExample>
          <StateExample label="Disabled"><Textbox label="Label" message="Unavailable" value="" onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'text-area':
      return (
        <StateGrid>
          <StateExample label="Default"><TextArea label="Label" message="Helper text" value="" onChange={() => {}} /></StateExample>
          <StateExample label="Filled"><TextArea label="Label" message="Helper text" value="Filled content" onChange={() => {}} /></StateExample>
          <StateExample label="Invalid"><TextArea label="Label" message="Error message" value="Invalid content" onChange={() => {}} invalid /></StateExample>
          <StateExample label="Disabled"><TextArea label="Label" message="Unavailable" value="" onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'searchbox':
      return (
        <StateGrid>
          <StateExample label="Default"><Searchbox ariaLabel="Default search" placeholder="Search..." value="" onChange={() => {}} /></StateExample>
          <StateExample label="Filled"><Searchbox ariaLabel="Filled search" value="supplier" onChange={() => {}} /></StateExample>
          <StateExample label="Focused"><Searchbox ariaLabel="Focused search" value="" onChange={() => {}} previewState="focus" /></StateExample>
          <StateExample label="Invalid"><Searchbox ariaLabel="Invalid search" value="" onChange={() => {}} invalid /></StateExample>
          <StateExample label="Disabled"><Searchbox ariaLabel="Disabled search" value="" onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'dropzone':
      return (
        <StateGrid>
          <StateExample label="Default"><Dropzone ariaLabel="Upload file" onFileSelected={() => {}} acceptedFileTypesLabel="File types supported: PDF" maxFileSizeLabel="Maximum upload file size: 100 MB" /></StateExample>
          <StateExample label="Error"><Dropzone ariaLabel="Upload file with error" onFileSelected={() => {}} error="Upload failed. Try a PDF under 100 MB." acceptedFileTypesLabel="File types supported: PDF" /></StateExample>
          <StateExample label="Disabled"><Dropzone ariaLabel="Disabled upload" onFileSelected={() => {}} disabled acceptedFileTypesLabel="File types supported: PDF" /></StateExample>
        </StateGrid>
      );
    case 'date-input':
      return (
        <StateGrid>
          <StateExample label="Default"><DateInput ariaLabel="Default date" value="" onChange={() => {}} /></StateExample>
          <StateExample label="Filled"><DateInput ariaLabel="Filled date" value="26-06-04" onChange={() => {}} /></StateExample>
          <StateExample label="Focused"><DateInput ariaLabel="Focused date" value="" onChange={() => {}} previewState="focus" /></StateExample>
          <StateExample label="Invalid"><DateInput ariaLabel="Invalid date" value="" onChange={() => {}} invalid /></StateExample>
          <StateExample label="Disabled"><DateInput ariaLabel="Disabled date" value="" onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'currency-input':
      return (
        <StateGrid>
          <StateExample label="Default"><CurrencyInput label="Label" message="Helper text" value="" onChange={() => {}} currency="GBP" /></StateExample>
          <StateExample label="Filled"><CurrencyInput label="Label" message="Helper text" value="125000" onChange={() => {}} currency="GBP" /></StateExample>
          <StateExample label="Invalid"><CurrencyInput label="Label" message="Error message" value="Invalid" onChange={() => {}} currency="GBP" invalid /></StateExample>
          <StateExample label="Disabled"><CurrencyInput label="Label" message="Unavailable" value="" onChange={() => {}} currency="GBP" disabled /></StateExample>
        </StateGrid>
      );
    case 'dropdown':
      return (
        <StateGrid>
          <StateExample label="Default"><Dropdown label="Label" message="Helper text" options={OPTIONS} value="" onChange={() => {}} /></StateExample>
          <StateExample label="Filled"><Dropdown label="Label" message="Helper text" options={OPTIONS} value="cloud" onChange={() => {}} /></StateExample>
          <StateExample label="Focused"><Dropdown label="Label" message="Helper text" options={OPTIONS} value="" onChange={() => {}} previewState="focus" /></StateExample>
          <StateExample label="Invalid"><Dropdown label="Label" message="Error message" options={OPTIONS} value="" onChange={() => {}} invalid required /></StateExample>
          <StateExample label="Disabled"><Dropdown label="Label" message="Unavailable" options={OPTIONS} value="" onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'multi-select-dropdown':
      return (
        <StateGrid>
          <StateExample label="Default"><MultiSelectDropdown label="Label" options={OPTIONS} value={[]} onChange={() => {}} /></StateExample>
          <StateExample label="Selected"><MultiSelectDropdown label="Label" options={OPTIONS} value={['legal-tech', 'cloud']} onChange={() => {}} /></StateExample>
          <StateExample label="Invalid"><MultiSelectDropdown label="Label" options={OPTIONS} value={[]} onChange={() => {}} invalid required /></StateExample>
          <StateExample label="Disabled"><MultiSelectDropdown label="Label" options={OPTIONS} value={[]} onChange={() => {}} disabled /></StateExample>
        </StateGrid>
      );
    case 'checkbox':
      return (
        <StateGrid>
          <StateExample label="Unchecked"><Checkbox checked={false} onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Checked"><Checkbox checked={true} onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Hover"><Checkbox checked={false} state="Hover" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Disabled"><Checkbox checked={false} state="Disabled" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Right aligned"><Checkbox checked={true} alignment="Right" onChange={() => {}} label="Label" /></StateExample>
        </StateGrid>
      );
    case 'radio':
      return (
        <StateGrid>
          <StateExample label="Group"><RadioGroup value="two" name="docs-radio-group" ariaLabel="Radio examples" onChange={() => {}}><Radio value="one" checked={false} onChange={() => {}} label="One" /><Radio value="two" checked={false} onChange={() => {}} label="Two" /></RadioGroup></StateExample>
          <StateExample label="Hover"><Radio value="one" checked={false} state="Hover" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Error"><Radio value="one" checked={false} state="Error" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Disabled"><Radio value="one" checked={false} state="Disabled" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Right aligned"><Radio value="one" checked={true} alignment="Right" onChange={() => {}} label="Label" /></StateExample>
        </StateGrid>
      );
    case 'toggle':
      return (
        <StateGrid>
          <StateExample label="On"><Toggle checked={true} onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Off"><Toggle checked={false} onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Disabled on"><Toggle checked={true} state="Disabled" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Disabled off"><Toggle checked={false} state="Disabled" onChange={() => {}} label="Label" /></StateExample>
          <StateExample label="Right aligned"><Toggle checked={true} alignment="Right" onChange={() => {}} label="Label" /></StateExample>
        </StateGrid>
      );
  }
}

export function InputComponentDocs({ doc }: { doc: ComponentDoc }) {
  const id = doc.id as InputComponentId;
  const content = INPUT_DOC_CONTENT[id];
  const [activeSection, setActiveSection] = useState(SECTION_NAV[0].id);
  const isProgrammaticScrollRef = useRef(false);

  const navItems = useMemo(() => SECTION_NAV, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        visible.sort((a, b) => {
          const ai = navItems.findIndex((item) => item.id === a.target.id);
          const bi = navItems.findIndex((item) => item.id === b.target.id);
          return ai - bi;
        });

        setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: 0 },
    );

    navItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navItems]);

  return (
    <div>
      <style>{`
        @media (max-width: 1120px) {
          .input-docs-layout { grid-template-columns: minmax(0, 1fr) !important; }
          .input-docs-toc { display: none !important; }
        }
      `}</style>

      <div
        className="input-docs-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 220px',
          gap: 'var(--orbit-space-mega)',
          alignItems: 'start',
        }}
      >
        <main style={{ minWidth: 0 }}>
          <section style={{ marginBottom: 40 }}>
            <Text variant="Secondary" size="Small">{doc.group}</Text>
            <div style={{ marginTop: 8 }}>
              <Headings size="Heading 1">{doc.title}</Headings>
            </div>
            <p style={{ margin: 'var(--orbit-space-base) 0 0', maxWidth: 720, color: 'var(--orbit-color-text-secondary)', fontSize: 'var(--orbit-text-base)', lineHeight: 1.65 }}>
              {content.lead}
            </p>
          </section>

          <DocsSection id="preview" title="Preview">
            <PreviewFrame>
              <PrimaryPreview id={id} />
            </PreviewFrame>
          </DocsSection>

          <DocsSection id="overview" title="Overview">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
              {content.overview.map((paragraph) => (
                <p key={paragraph} style={{ margin: 0, color: 'var(--orbit-color-text-secondary)', fontSize: 'var(--orbit-text-sm)', lineHeight: 1.7 }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </DocsSection>

          <DocsSection id="anatomy" title="Anatomy">
            <AnatomyList items={content.anatomy} />
          </DocsSection>

          <DocsSection id="variants" title="Variants & States">
            <VariantExamples id={id} />
          </DocsSection>

          <DocsSection id="guidance" title="Usage Guidance">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--orbit-space-l)',
              }}
            >
              <div>
                <Headings size="Heading 5">Use It Well</Headings>
                <div style={{ marginTop: 'var(--orbit-space-s)' }}>
                  <BulletList items={content.guidance} />
                </div>
              </div>
              <div>
                <Headings size="Heading 5">Accessibility</Headings>
                <div style={{ marginTop: 'var(--orbit-space-s)' }}>
                  <BulletList items={content.accessibility} />
                </div>
              </div>
            </div>
          </DocsSection>

          <DocsSection id="tokens" title="Tokens">
            <TokenList tokens={doc.tokens} />
          </DocsSection>

          <DocsSection id="related" title="Related Components">
            <RelatedComponents ids={content.related} />
          </DocsSection>
        </main>

        <aside
          className="input-docs-toc"
          style={{
            position: 'sticky',
            top: 88,
            borderLeft: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
            paddingLeft: 'var(--orbit-space-base)',
          }}
        >
          <Text variant="Bold" size="Small">On This Page</Text>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xs)', marginTop: 'var(--orbit-space-s)' }}>
            {navItems.map((item) => {
              const active = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    isProgrammaticScrollRef.current = true;
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    window.history.replaceState(null, '', `#${item.id}`);
                    window.setTimeout(() => {
                      isProgrammaticScrollRef.current = false;
                    }, 600);
                  }}
                  style={{
                    color: active ? 'var(--orbit-color-text-primary)' : 'var(--orbit-color-text-secondary)',
                    textDecoration: 'none',
                    fontSize: 'var(--orbit-text-xs)',
                    lineHeight: 1.5,
                    fontWeight: active ? 'var(--orbit-font-weight-semibold)' : 'var(--orbit-font-weight-regular)',
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
}
