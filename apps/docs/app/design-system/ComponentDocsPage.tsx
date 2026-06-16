'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Avatar,
  AvatarStack,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardContent,
  Carat,
  Checkbox,
  Chip,
  CountryFlag,
  CpBreadcrumbHeader,
  CpMilestoneTimelineNav,
  CpPrimaryNav,
  CpSecondaryNav,
  CpSideRail,
  CpWorkspaceHeader,
  CpWorkspaceShell,
  CurrencyInput,
  DateInput,
  DocumentGlyph,
  Dropzone,
  Dropdown,
  FA,
  FaIcon,
  FileItem,
  Filter,
  HeaderPresets,
  Headings,
  IconButton,
  InlineBanner,
  Input,
  LegendLabel,
  LinkText,
  MultiSelectDropdown,
  MultiStateButton,
  MultiStateGroup,
  PageHeader,
  PriceIndicator,
  QuickFilterGroup,
  QuickFilterItem,
  RadialIndicator,
  Radio,
  RadioGroup,
  Required,
  RiskIndicator,
  Searchbox,
  Separator,
  SideNav,
  Spinner,
  StatusIndicator,
  StepCircle,
  TabButton,
  Table,
  Text,
  TextArea,
  Textbox,
  Toast,
  Toggle,
  Tooltip,
  ToggleCard,
  ToolNextStepsCard,
  type TableColumn,
} from '@efficio/orbit';
import {
  type ComponentDoc,
  type ComponentId,
  getComponentDoc,
} from './componentDocs';

interface AnatomyItem {
  label: string;
  description: string;
}

interface SupplementalSection {
  id: string;
  title: string;
  items: string[];
}

interface ComponentPageContent {
  lead: string;
  overview: string[];
  anatomy: AnatomyItem[];
  guidance: string[];
  accessibility: string[];
  related: ComponentId[];
  supplemental?: SupplementalSection[];
  previewSize?: 'normal' | 'wide' | 'tall';
}

interface ShowcaseTableRow {
  id: string;
  initiative: string;
  sector: string;
  owner: string;
}

const BASE_SECTION_NAV = [
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

const CARD_STATES = [
  'Default',
  'Hover',
  'Accent',
  'Highlight',
  'Feature',
  'Information',
  'Success',
  'Warning',
  'Error',
  'Disabled',
] as const;

const CARD_SHADOW_MODES = [
  { label: 'HasShadow=False', value: false },
  { label: 'HasShadow=True', value: true },
] as const;

interface CardFigmaVariant {
  state: (typeof CARD_STATES)[number];
  hasShadow: boolean;
  label: (typeof CARD_SHADOW_MODES)[number]['label'];
}

const CARD_FIGMA_VARIANTS: CardFigmaVariant[] = CARD_STATES.flatMap((state): CardFigmaVariant[] => (
  state === 'Hover'
    ? [{ state, hasShadow: true, label: 'HasShadow=True' }]
    : CARD_SHADOW_MODES.map((shadowMode): CardFigmaVariant => ({
      state,
      hasShadow: shadowMode.value,
      label: shadowMode.label,
    }))
));

const TABLE_ROWS: ShowcaseTableRow[] = [
  { id: '1', initiative: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Chris Hurley' },
  { id: '2', initiative: 'Fleet Cost Optimisation', sector: 'Operations', owner: 'Maya Patel' },
  { id: '3', initiative: 'Cloud Contract Consolidation', sector: 'Technology', owner: 'Daniel Green' },
];

const TABLE_COLUMNS: TableColumn<ShowcaseTableRow>[] = [
  { id: 'initiative', header: 'Initiative name', render: (row) => row.initiative },
  { id: 'sector', header: 'Sector', render: (row) => row.sector },
  { id: 'owner', header: 'Owner', render: (row) => row.owner },
];

const SIDENAV_SAMPLE = {
  navItems: [
    { id: 'notifications', icon: '\uf0f3', label: 'Notifications', previewState: 'hover' as const },
    { id: 'home', icon: '\uf015', label: 'Home', active: true },
    { id: 'data-tracker-insights', icon: '\uf1c0', label: 'Data Tracker & Insights' },
    { id: 'content-search', icon: '\uf15b', label: 'Content Search' },
  ],
  sections: [
    {
      id: 'identify',
      label: 'Identify',
      color: 'var(--orbit-color-header-identify-from)',
      expanded: true,
      items: [{ id: 'procurement-planning', icon: '\uf135', label: 'Procurement Planning', previewState: 'hover' as const }],
    },
    {
      id: 'deliver',
      label: 'Deliver',
      color: 'var(--orbit-color-header-deliver-from)',
      expanded: true,
      previewState: 'hover' as const,
      items: [
        { id: 'project-management', icon: '\uf135', label: 'Project Management' },
        { id: 'sourcing-execution', icon: '\uf643', label: 'Sourcing Execution' },
      ],
    },
    {
      id: 'sustain',
      label: 'Sustain',
      color: 'var(--orbit-color-header-sustain-from)',
      expanded: true,
      items: [{ id: 'compliance-monitoring', icon: '\uf7d9', label: 'Compliance Monitoring' }],
    },
  ],
  workItems: [
    { id: 'initi-to-check', title: 'ClauseIQ', subtitle: '1w ago | InitiToCheckClauseIQ', previewState: 'hover' as const },
    { id: 'test-init-part-05', title: 'ClauseIQ', subtitle: '2mo ago | TestInitPart05' },
    { id: 'created-in-cp', title: 'ClauseIQ', subtitle: '3mo ago | created in cp' },
    { id: 'initiative-from-cp-part-12', title: 'MarketIQ', subtitle: '3mo ago | InitiativeFromCPPart12' },
    { id: 'new-init-1612', title: 'ClauseIQ', subtitle: '3mo ago | NewInit1612' },
  ],
};

const CP_RAIL_ITEMS = [
  { id: 'home', icon: FA.grip, label: 'Home', active: true },
  { id: 'workspaces', icon: FA.file, label: 'Workspaces' },
  { id: 'team', icon: FA.user, label: 'Team' },
  { id: 'benefits', icon: FA.circleCheck, label: 'Benefits' },
];

const CP_BREADCRUMB_ITEMS = [
  { id: 'projects', label: 'Projects & Initiatives', href: '#' },
  { id: 'connected-platform', label: 'Connected Platform - Development Workstreams', href: '#' },
  { id: 'initiative', label: 'CP001-1014 | sdasd', current: true },
];

const CP_PRIMARY_NAV_ITEMS = [
  { id: 'gantt', label: 'Gantt Chart' },
  { id: 'initiatives', label: 'Initiatives', active: true },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'team', label: 'Team' },
  { id: 'my-qc-tasks', label: 'My QC Tasks' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'settings', label: 'Settings' },
];

const CP_SECONDARY_NAV_ITEMS = [
  { id: 'workspace', label: 'Workspace', active: true },
  { id: 'methodology', label: 'Methodology' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'initiative-milestones', label: 'Initiative Milestones' },
  { id: 'initiative-benefits', label: 'Initiative Benefits' },
];

const CP_TIMELINE_STEPS = [
  { id: 'start', label: 'Start milestone', date: '2026-01-07', status: 'complete' as const },
  { id: 'target', label: 'Target milestone', date: '2026-01-29', active: true },
];

const CP_RIGHT_ACTIONS = [
  { id: 'hands-raised', label: 'Hands Raised in Initiative (0)' },
  { id: 'raise-hand', label: 'Raise Hand' },
];

const CHIP_HIGH_VARIANTS = [
  'Information',
  'Success',
  'Warning',
  'Error',
  'Style 1',
  'No Status',
  'None',
  'Disabled',
] as const;

const CHIP_LOW_VARIANTS = [
  'Information',
  'Success',
  'Warning',
  'Error',
  'Style 1',
  'Style 2',
  'Style 3',
  'Style 4',
  'Additional',
  'No Status',
  'None',
  'Outline',
  'Disabled',
] as const;

const COMPONENT_PAGE_CONTENT: Record<ComponentId, ComponentPageContent> = {
  typography: {
    lead: 'Heading, body, and supporting text styles for product UI copy.',
    overview: [
      'Typography keeps hierarchy, density, and tone consistent across Orbit screens.',
      'Use the text primitives before introducing one-off font sizes or weights.',
    ],
    anatomy: [
      { label: 'Heading scale', description: 'Five heading levels for page, section, and compact panel hierarchy.' },
      { label: 'Body variants', description: 'Primary, secondary, emphasis, status, and disabled text treatments.' },
      { label: 'Small text', description: 'Compact supporting labels for dense surfaces and metadata.' },
    ],
    guidance: [
      'Choose heading level by document hierarchy, not only by visual size.',
      'Use secondary text for explanation and metadata, not primary decisions.',
      'Keep compact UI labels short so dense screens remain scannable.',
    ],
    accessibility: [
      'Maintain semantic heading order in page content.',
      'Do not use color alone to communicate status text.',
      'Keep body copy readable at the tokenized base size.',
    ],
    related: ['links', 'form-elements'],
  },
  links: {
    lead: 'Inline link styles for navigation and lower-emphasis text actions.',
    overview: [
      'Links are for navigation or contextual actions embedded in content.',
      'Use buttons for primary workflow commands and links for destinations or secondary affordances.',
    ],
    anatomy: [
      { label: 'Label', description: 'The visible text describing the destination or action.' },
      { label: 'Variant', description: 'Primary, secondary, or heading styling based on surrounding text.' },
      { label: 'Interaction state', description: 'Hover and disabled treatments inherited from link tokens.' },
    ],
    guidance: [
      'Use specific labels that make sense out of context.',
      'Avoid vague labels such as "click here".',
      'Do not use links for destructive or form submission actions.',
    ],
    accessibility: [
      'Ensure link text describes the destination.',
      'Use a real href for navigation where possible.',
      'Keep focus visibility intact in surrounding layouts.',
    ],
    related: ['buttons', 'typography'],
  },
  'form-elements': {
    lead: 'Small form primitives for required markers and inline separators.',
    overview: [
      'Form elements provide shared visual pieces used by higher-level fields.',
      'They keep required and inline separator treatments consistent without duplicating markup.',
    ],
    anatomy: [
      { label: 'Required marker', description: 'A compact visual marker paired with a visible field label.' },
      { label: 'Carat', description: 'A small separator for compact inline labels or metadata.' },
      { label: 'Text pairing', description: 'The surrounding label or text supplies meaning.' },
    ],
    guidance: [
      'Pair Required with an explicit label.',
      'Use Carat only when the relationship between inline items is clear.',
      'Prefer complete field components when collecting input.',
    ],
    accessibility: [
      'Required fields should also expose required state to the control.',
      'Do not rely on the marker alone to explain validation.',
      'Keep separators decorative for assistive technology.',
    ],
    related: ['textbox', 'dropdown', 'typography'],
  },
  buttons: {
    lead: 'Command buttons for primary actions, secondary options, and destructive operations.',
    overview: [
      'Buttons trigger an immediate command or workflow step.',
      'The variant communicates emphasis, risk, and relationship to surrounding actions.',
    ],
    anatomy: [
      { label: 'Label', description: 'Action-oriented text that describes the command.' },
      { label: 'Variant', description: 'Primary, secondary, tertiary, positive, or destructive emphasis.' },
      { label: 'Optional icon', description: 'A leading or trailing icon when recognition improves scan speed.' },
      { label: 'State', description: 'Default, hover, and disabled states for interaction feedback.' },
    ],
    guidance: [
      'Use one primary button per decision area.',
      'Reserve destructive styling for risky or irreversible actions.',
      'Use icons to clarify common actions, not as decoration.',
    ],
    accessibility: [
      'Button labels should describe the result of pressing them.',
      'Disabled buttons should have adjacent context when the reason is not obvious.',
      'Icon buttons need an accessible label through the Icon Button component.',
    ],
    related: ['icon-buttons', 'multistate-buttons', 'links'],
  },
  'icon-buttons': {
    lead: 'Compact icon-only buttons for toolbars, repeated controls, and familiar commands.',
    overview: [
      'Icon Buttons reduce visual weight where space is constrained or commands repeat often.',
      'Use them only when the icon is recognizable or the surrounding UI provides clear context.',
    ],
    anatomy: [
      { label: 'Icon', description: 'The visible command symbol.' },
      { label: 'Accessible name', description: 'The hidden label that names the action for assistive technology.' },
      { label: 'Container', description: 'Sizing, variant, and state treatment for the button target.' },
    ],
    guidance: [
      'Always provide an aria label.',
      'Prefer familiar icons for common actions.',
      'Use text buttons when the action is uncommon or ambiguous.',
    ],
    accessibility: [
      'The aria label must be specific and action-oriented.',
      'Keep target size consistent with the surrounding toolbar.',
      'Disabled icon buttons should not be focusable.',
    ],
    related: ['buttons', 'tooltip', 'page-header'],
  },
  'tab-buttons': {
    lead: 'Underline tab buttons for switching between sibling views.',
    overview: [
      'Tab Buttons switch content within the same page or task context.',
      'They are best when each tab is a peer view, not a separate destination.',
    ],
    anatomy: [
      { label: 'Label', description: 'Short view name shown in the tab.' },
      { label: 'Active indicator', description: 'Underline treatment showing the selected view.' },
      { label: 'State', description: 'Rest, hover, active, and disabled states.' },
    ],
    guidance: [
      'Keep labels short enough to scan in a row.',
      'Use tabs for sibling content, not unrelated navigation.',
      'Avoid too many tabs in narrow layouts.',
    ],
    accessibility: [
      'Use tab semantics when the row controls panels.',
      'Expose disabled tabs where unavailable.',
      'Keep keyboard focus visible on each tab.',
    ],
    related: ['page-header', 'multistate-buttons', 'quick-filters'],
  },
  'quick-filters': {
    lead: 'Toggle-style filter chips for narrowing list, table, and data views.',
    overview: [
      'Quick Filters make common filters visible and fast to toggle.',
      'Use them close to the data they affect so the filtering relationship is clear.',
    ],
    anatomy: [
      { label: 'Filter item', description: 'A selectable label representing one filter.' },
      { label: 'Selected state', description: 'The visual state for active filters.' },
      { label: 'Group', description: 'A row that keeps related filters together.' },
    ],
    guidance: [
      'Use for frequent filters with short labels.',
      'Keep filter rows close to the relevant data.',
      'Use applied Filter pills when selected criteria need explicit removal.',
    ],
    accessibility: [
      'Expose each filter as an interactive control.',
      'Selected state should be available programmatically.',
      'Avoid color-only selected indicators.',
    ],
    related: ['filter', 'table', 'multistate-buttons'],
  },
  'multistate-buttons': {
    lead: 'Segmented buttons for switching between mutually exclusive states or views.',
    overview: [
      'Grouped Buttons give a compact choice between a small set of related states.',
      'Use them when switching changes the same data view rather than navigating to a new page.',
    ],
    anatomy: [
      { label: 'Group', description: 'Container that manages selection and keyboard movement.' },
      { label: 'Button', description: 'One selectable state with optional count or icon.' },
      { label: 'Selected state', description: 'Visual emphasis for the active state.' },
    ],
    guidance: [
      'Keep groups to a small number of choices.',
      'Use counts only when they help comparison.',
      'Prefer tabs when each option reveals substantial page content.',
    ],
    accessibility: [
      'Use a clear group aria label.',
      'Only enabled choices should be keyboard reachable.',
      'Selected state should remain visible without relying on color alone.',
    ],
    related: ['tab-buttons', 'quick-filters', 'buttons'],
  },
  'text-input': {
    lead: 'A compact single-line field for free text when surrounding UI supplies the label or context.',
    overview: [
      'Text Input is the lightweight standalone input primitive.',
      'For normal labelled form fields with helper text and validation, prefer Textbox.',
    ],
    anatomy: [
      { label: 'Container', description: 'Applies border, background, focus, hover, disabled, and invalid states.' },
      { label: 'Input value', description: 'The editable text value controlled by the consuming view.' },
      { label: 'Optional icon', description: 'A leading visual cue for compact controls that need recognition.' },
    ],
    guidance: [
      'Provide an accessible name whenever there is no visible label.',
      'Keep placeholders short and descriptive.',
      'Use invalid state only with adjacent validation feedback.',
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
      'Textbox is the default choice for text entry inside forms.',
      'Use it when the user needs a clear field name and supporting message.',
    ],
    anatomy: [
      { label: 'Label', description: 'Names the field and anchors the input.' },
      { label: 'Required marker', description: 'Shows that the field must be completed before submission.' },
      { label: 'Input container', description: 'Communicates hover, focus, invalid, disabled, and locked states.' },
      { label: 'Message', description: 'Provides helper text or validation feedback below the field.' },
    ],
    guidance: [
      'Use helper text to clarify format, not repeat the label.',
      'Use locked for read-only values that are intentionally visible.',
      'Use disabled for unavailable fields that are not currently actionable.',
    ],
    accessibility: [
      'The visible label is associated with the input.',
      'Helper and error messages are exposed through aria-describedby.',
      'Invalid and required states are passed to native input semantics.',
    ],
    related: ['text-input', 'text-area', 'currency-input', 'dropdown'],
  },
  'text-area': {
    lead: 'A labelled multiline field for longer notes, descriptions, and instructions.',
    overview: [
      'Text Area supports longer free-text entry with helper text, validation, and character count.',
      'Use Textbox instead when the expected value is short or structured.',
    ],
    anatomy: [
      { label: 'Label', description: 'Identifies the content users should enter.' },
      { label: 'Text area', description: 'The multiline input surface and state container.' },
      { label: 'Footer', description: 'Contains helper or error text and character count.' },
    ],
    guidance: [
      'Set a max length when the workflow or downstream system has a limit.',
      'Keep rows proportional to the expected content length.',
      'Use validation messages for actionable corrections.',
    ],
    accessibility: [
      'Expose a label or aria label for every text area.',
      'Use aria-invalid when validation fails.',
      'Keep character limits visible when they constrain submission.',
    ],
    related: ['textbox', 'text-input'],
  },
  searchbox: {
    lead: 'A compact search field with icon treatment for filtering or querying collections.',
    overview: [
      'Searchbox is for search terms that affect a list, table, or result set.',
      'Place it near the content being searched so the relationship is obvious.',
    ],
    anatomy: [
      { label: 'Search field', description: 'The controlled text value used to filter or query content.' },
      { label: 'Search icon', description: 'A persistent cue that identifies the field as search.' },
      { label: 'State container', description: 'Shows hover, focus, invalid, disabled, and filled states.' },
    ],
    guidance: [
      'Use placeholder text to describe the searchable object.',
      'Keep search close to the list, table, or collection it affects.',
      'Do not use Searchbox for arbitrary text entry inside forms.',
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
      'Dropzone gives users a clear upload surface with accepted file type and size guidance.',
      'It supports click, drag, disabled, and error states while keeping file handling controlled by the parent view.',
    ],
    anatomy: [
      { label: 'Error message', description: 'Optional feedback displayed before the upload surface.' },
      { label: 'Hidden file input', description: 'Native upload control triggered by the visual dropzone.' },
      { label: 'Upload surface', description: 'The visible drag-and-drop and file picker target.' },
      { label: 'Guidance text', description: 'Accepted file type and maximum size information.' },
    ],
    guidance: [
      'State accepted file types and size limits before upload.',
      'Show validation errors near the upload target.',
      'Keep selected file feedback close to the Dropzone.',
    ],
    accessibility: [
      'Provide a clear ariaLabel describing the upload purpose.',
      'Use role alert for upload validation errors.',
      'Ensure disabled upload flows explain why upload is unavailable.',
    ],
    related: ['file-item', 'document-glyph'],
    previewSize: 'wide',
  },
  'date-input': {
    lead: 'A compact date field for consistent date entry in product workflows.',
    overview: [
      'Date Input is a date-formatted standalone input with an icon affordance.',
      'It is best for compact filters, table controls, and simple date fields.',
    ],
    anatomy: [
      { label: 'Date value', description: 'The controlled date string shown in the input.' },
      { label: 'Calendar affordance', description: 'A bordered icon area that identifies date entry.' },
      { label: 'State container', description: 'Shows hover, focus, invalid, disabled, and filled states.' },
    ],
    guidance: [
      'Use clear date formatting guidance in the surrounding label or placeholder.',
      'Use invalid state for impossible, malformed, or disallowed dates.',
      'Disable the field when dates cannot be edited.',
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
      'Currency Input is for monetary values where the unit must be visible and consistent.',
      'Use it for savings, prices, budgets, commercial values, and other financial inputs.',
    ],
    anatomy: [
      { label: 'Label', description: 'Names the monetary value being collected.' },
      { label: 'Value field', description: 'The controlled input value entered by the user.' },
      { label: 'Currency marker', description: 'Displays the configured currency code.' },
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
      'Dropdown is used when users need to select exactly one option.',
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
      'Keyboard users can open and navigate the list.',
      'Use invalid state with clear validation messaging.',
    ],
    related: ['multi-select-dropdown', 'radio', 'searchbox'],
  },
  'multi-select-dropdown': {
    lead: 'A labelled multi-select control with removable selected-value chips.',
    overview: [
      'Multi-select Dropdown supports choosing multiple options from a defined set.',
      'Use it for filters, categorisation, tags, and forms where multiple values are valid.',
    ],
    anatomy: [
      { label: 'Label row', description: 'Names the multi-select field and can show required state.' },
      { label: 'Trigger', description: 'Displays selected chips or placeholder text.' },
      { label: 'Selected chips', description: 'Show chosen values with individual remove controls.' },
      { label: 'Listbox', description: 'Displays selectable options with selected and active states.' },
    ],
    guidance: [
      'Use for finite option sets where multiple choices are expected.',
      'Avoid using it for very large lists unless search or filtering is added.',
      'Keep selected-value labels short enough to scan.',
    ],
    accessibility: [
      'The trigger uses combobox semantics and exposes multiselect state.',
      'Selected chips include remove button labels.',
      'Keyboard users can open and move through options.',
    ],
    related: ['dropdown', 'chip', 'filter'],
  },
  checkbox: {
    lead: 'A binary control for independent choices and multi-select lists.',
    overview: [
      'Checkbox is used for on/off choices confirmed as part of a form or selection flow.',
      'Use it when more than one option can be selected.',
    ],
    anatomy: [
      { label: 'Input box', description: 'Shows checked, unchecked, hover, and disabled states.' },
      { label: 'Label', description: 'Explains the choice controlled by the checkbox.' },
      { label: 'Alignment', description: 'Supports left and right label alignment.' },
    ],
    guidance: [
      'Use Checkbox for independent choices, not mutually exclusive groups.',
      'Write labels as clear statements or selectable objects.',
      'Use disabled only when the choice is unavailable.',
    ],
    accessibility: [
      'Provide a label or ariaLabel for every checkbox.',
      'Native checked and disabled semantics are preserved.',
      'Enter toggles the checkbox for keyboard users.',
    ],
    related: ['radio', 'toggle', 'multi-select-dropdown'],
  },
  radio: {
    lead: 'A grouped single-choice control for mutually exclusive options.',
    overview: [
      'Radio is used when users must choose one value from a small, visible set.',
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
      'Toggle represents a setting that can be switched on or off.',
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
  card: {
    lead: 'A content container for grouping related information or repeated objects.',
    overview: [
      'Card is the universal Figma surface container for grouping related content.',
      'The coded component follows the Figma Card contract: explicit shadow, explicit indicator rail, and swappable slot content.',
    ],
    anatomy: [
      { label: 'Card', description: 'Outer rounded surface with state background and optional shadow.' },
      { label: 'ContentPlaceHolder', description: 'Optional helper for Figma slot padding and orientation.' },
      { label: 'Slot', description: 'The supplied child content.' },
      { label: 'Card Indicator', description: 'Optional 4px Has Highlight rail.' },
    ],
    guidance: [
      'Avoid placing cards inside cards.',
      'Use state variants to communicate meaningful content status.',
      'Use hasShadow for the Figma shadow variant; type is retained only as a legacy alias.',
      'Do not use cards as generic page section backgrounds.',
    ],
    accessibility: [
      'Use semantic headings inside cards where they represent repeated objects.',
      'Ensure interactive card content has clear focus targets.',
      'Do not rely on color-only state indicators.',
    ],
    related: ['toggle-card', 'table', 'tool-next-steps-card', 'chip'],
    previewSize: 'wide',
  },
  'toggle-card': {
    lead: 'An interactive card that functions as a selection control.',
    overview: [
      'ToggleCard wraps a content slot in a bordered container that responds to user interaction through four states.',
      'Unlike Card (a passive display surface), ToggleCard is always actionable — it renders as a <button> element.',
      'Use it when selection benefits from a rich, card-sized presentation rather than a checkbox or radio input.',
    ],
    anatomy: [
      { label: 'Container', description: 'Bordered, rounded button element that responds to hover, selection, and disabled states.' },
      { label: 'Content slot', description: 'Freeform slot for placing icons, labels, descriptions, or pricing details.' },
      { label: 'Status', description: 'Default, Hover, Selected, or Disabled — managed externally by the consuming view.' },
    ],
    guidance: [
      'Manage selected state externally — ToggleCard reflects the status prop, it does not track its own selection.',
      'Do not use for read-only content — use Card instead.',
      'Do not use for navigation — use Card with an anchor wrapper.',
      'Use for plan selection, configuration options, or content type choosing.',
    ],
    accessibility: [
      'Renders as a <button> element — keyboard and pointer interactivity are built in.',
      'Disabled state uses the disabled attribute, not just visual styling.',
      'Ensure slot content provides enough context for screen readers.',
    ],
    related: ['card', 'radio', 'checkbox'],
    previewSize: 'wide',
  },
  table: {
    lead: 'A tokenized data table for scanning structured records.',
    overview: [
      'Table is for structured data that benefits from rows, columns, sorting, selection, and pagination.',
      'Use it when comparison across records is more important than visual storytelling.',
    ],
    anatomy: [
      { label: 'Columns', description: 'Headers and render functions that define each data field.' },
      { label: 'Rows', description: 'The records shown in the table body.' },
      { label: 'Selection', description: 'Optional row-level checkbox selection.' },
      { label: 'Pagination', description: 'Controls for moving through larger data sets.' },
    ],
    guidance: [
      'Use clear, concise column headers.',
      'Keep row actions predictable and accessible.',
      'Use pagination when row counts exceed the visible working set.',
    ],
    accessibility: [
      'Provide an aria label for the table.',
      'Expose row selection labels that identify the row.',
      'Use sortable header state when sorting is available.',
    ],
    related: ['quick-filters', 'filter', 'status-indicator'],
    supplemental: [
      {
        id: 'behavior',
        title: 'Behavior',
        items: [
          'Sorting should update only the sorted column state.',
          'Pagination should preserve table context and selection expectations.',
          'Selection labels should include the row name, not only "select row".',
        ],
      },
    ],
    previewSize: 'wide',
  },
  avatar: {
    lead: 'A compact identity indicator for people, owners, and collaborators.',
    overview: [
      'Avatar shows a person or user-like entity through initials, icon, or square treatment.',
      'AvatarStack groups multiple people while preserving a compact footprint.',
    ],
    anatomy: [
      { label: 'Initials or icon', description: 'The visible identity mark.' },
      { label: 'Size', description: 'Extra small through large sizing for different densities.' },
      { label: 'Stack', description: 'Grouped avatars with overflow handling.' },
    ],
    guidance: [
      'Use real initials when available.',
      'Use stacks when multiple people share ownership.',
      'Keep avatar size consistent within a list or table.',
    ],
    accessibility: [
      'Provide a name for each avatar.',
      'Avoid using initials as the only identity in critical workflows.',
      'Ensure overflow counts remain understandable in stacks.',
    ],
    related: ['table', 'status-indicator', 'chip'],
  },
  'status-indicator': {
    lead: 'A colored dot with optional label for compact status communication.',
    overview: [
      'Status Indicator helps users scan record state in lists, tables, and metadata rows.',
      'Use it for simple status labels that do not need a full banner or alert.',
    ],
    anatomy: [
      { label: 'Dot', description: 'Color-coded status marker.' },
      { label: 'Label', description: 'Text label that clarifies the status.' },
      { label: 'Size', description: 'Default or small treatment for density.' },
    ],
    guidance: [
      'Pair color with text whenever possible.',
      'Use no-status when the state is intentionally absent.',
      'Keep labels consistent across data views.',
    ],
    accessibility: [
      'Do not rely on color alone.',
      'Use text labels in critical contexts.',
      'Keep status wording stable across components.',
    ],
    related: ['chip', 'indicators', 'table'],
  },
  chip: {
    lead: 'A compact label for categorisation, metadata, or lightweight status.',
    overview: [
      'Chip condenses supporting metadata into a scan-friendly label.',
      'Use high contrast for stronger status signals and low contrast for dense metadata.',
    ],
    anatomy: [
      { label: 'Label', description: 'Short text value shown in the chip.' },
      { label: 'Variant', description: 'Status or style variant that sets color treatment.' },
      { label: 'Contrast', description: 'High or low emphasis based on importance.' },
      { label: 'Size', description: 'Default or mini treatment for density.' },
    ],
    guidance: [
      'Keep labels brief.',
      'Use high contrast only when the status needs emphasis.',
      'Avoid using chips as primary action controls.',
    ],
    accessibility: [
      'Status chips should be understandable from their label.',
      'Do not rely on color alone for important state.',
      'Use consistent labels across related screens.',
    ],
    related: ['status-indicator', 'filter', 'multi-select-dropdown'],
  },
  filter: {
    lead: 'An applied-filter pill with optional remove action.',
    overview: [
      'Filter shows active criteria that users can remove.',
      'Use it after filters have been applied, especially when the criteria are not otherwise visible.',
    ],
    anatomy: [
      { label: 'Label', description: 'The applied filter name and value.' },
      { label: 'Remove control', description: 'Optional action to clear the filter.' },
      { label: 'State', description: 'Default and hover treatment.' },
    ],
    guidance: [
      'Include both filter name and value in the label.',
      'Keep filters near the data they affect.',
      'Use Quick Filters for selecting filters before they are applied.',
    ],
    accessibility: [
      'Remove controls need clear labels.',
      'Filter text should be readable without color context.',
      'Announce changed result counts in the consuming view when appropriate.',
    ],
    related: ['quick-filters', 'table', 'chip'],
  },
  indicators: {
    lead: 'Compact visual signals for counts, price movement, risk, progress, and loading.',
    overview: [
      'Indicators help users scan status, progress, and value changes in dense UI.',
      'Use them as supporting signals alongside text or structured data.',
    ],
    anatomy: [
      { label: 'Signal', description: 'The compact visual mark, such as a badge, dot, radial, or spinner.' },
      { label: 'Value', description: 'A number, label, risk level, or loading text.' },
      { label: 'Status color', description: 'Semantic color treatment aligned to meaning.' },
    ],
    guidance: [
      'Use labels for ambiguous indicators.',
      'Avoid relying on color alone.',
      'Keep indicator meaning consistent across product areas.',
    ],
    accessibility: [
      'Provide labels for loading indicators.',
      'Use visible text for risk and price changes.',
      'Ensure progress and status are available to assistive technology where needed.',
    ],
    related: ['status-indicator', 'chip', 'toast'],
    previewSize: 'wide',
  },
  'document-glyph': {
    lead: 'File-type glyphs for document references and attachment lists.',
    overview: [
      'Document Glyph identifies common file types with consistent icon sizing.',
      'Use it next to filenames, upload summaries, and document rows.',
    ],
    anatomy: [
      { label: 'File type', description: 'XLS, DOC, PDF, ZIP, IMG, or unknown visual treatment.' },
      { label: 'Size', description: 'Large through micro sizing tiers.' },
      { label: 'Shape', description: 'Consistent document silhouette for recognition.' },
    ],
    guidance: [
      'Pair glyphs with filenames when space allows.',
      'Use consistent size tiers within a list.',
      'Use unknown when the file type cannot be determined.',
    ],
    accessibility: [
      'Do not rely on glyph alone for critical file type communication.',
      'Include filename or file type text in the surrounding row.',
      'Keep decorative glyphs hidden when duplicate text is present.',
    ],
    related: ['file-item', 'dropzone'],
  },
  'file-item': {
    lead: 'A compact selected-file row with document type and truncating filename.',
    overview: [
      'File Item represents an attached or selected file in forms and document flows.',
      'Use it near upload controls or document summaries where the filename matters.',
    ],
    anatomy: [
      { label: 'Document glyph', description: 'File type indicator for quick recognition.' },
      { label: 'Filename', description: 'Truncated filename text.' },
      { label: 'Container', description: 'Optional fixed width and clickable row treatment.' },
    ],
    guidance: [
      'Keep filenames visible enough to distinguish similar files.',
      'Use document type when known.',
      'Use clickable treatment only when selecting or opening the file is supported.',
    ],
    accessibility: [
      'Clickable file items should have a clear action label.',
      'Do not depend on file extension color alone.',
      'Preserve the full filename in accessible text where possible.',
    ],
    related: ['document-glyph', 'dropzone'],
  },
  'country-flag': {
    lead: 'An ISO country code rendered as a compact flag icon.',
    overview: [
      'Country Flag provides quick country recognition in tables, metadata, and compact summaries.',
      'Use it as a visual supplement to country names when the country identity matters.',
    ],
    anatomy: [
      { label: 'Country code', description: 'The ISO-style country value passed to the component.' },
      { label: 'Flag mark', description: 'The rendered visual flag.' },
      { label: 'Fallback', description: 'The surrounding UI should still identify the country when the flag is ambiguous.' },
    ],
    guidance: [
      'Pair with country names in critical contexts.',
      'Pass country codes consistently.',
      'Avoid using flags for language selection without text labels.',
    ],
    accessibility: [
      'Do not rely on the flag alone for critical identification.',
      'Use nearby country text when users must act on the value.',
      'Keep decorative flags hidden from assistive technology if text duplicates them.',
    ],
    related: ['table', 'avatar', 'chip'],
  },
  tooltip: {
    lead: 'A short contextual popover shown on hover or focus.',
    overview: [
      'Tooltip provides supplemental context without changing layout.',
      'Use it for brief clarifications, especially around compact controls.',
    ],
    anatomy: [
      { label: 'Trigger', description: 'The element that receives hover or focus.' },
      { label: 'Content', description: 'Short explanatory text.' },
      { label: 'Placement', description: 'Direction and alignment around the trigger.' },
    ],
    guidance: [
      'Keep tooltip copy brief.',
      'Do not put essential workflow content only in a tooltip.',
      'Use tooltips to clarify controls, not to replace labels.',
    ],
    accessibility: [
      'Tooltip content should be available on focus, not only hover.',
      'Keep triggers keyboard accessible.',
      'Avoid interactive content inside simple tooltips.',
    ],
    related: ['icon-buttons', 'buttons'],
  },
  'tool-next-steps-card': {
    lead: 'A compound card for suggested next actions in guided AI tool flows.',
    overview: [
      'Tool Next Steps Card presents a recommended path after a tool produces output.',
      'Use it when the next action should feel contextual and workflow-specific.',
    ],
    anatomy: [
      { label: 'Card shell', description: 'Frames the next-step recommendation.' },
      { label: 'Message', description: 'Explains what the user can do next.' },
      { label: 'Actions', description: 'Commands that continue the guided flow.' },
    ],
    guidance: [
      'Keep actions relevant to the current tool result.',
      'Avoid using it as a generic marketing card.',
      'Use concise copy that points to the next useful action.',
    ],
    accessibility: [
      'Action labels should describe their result.',
      'Use headings if the card appears in a larger sequence.',
      'Ensure card actions remain keyboard reachable.',
    ],
    related: ['card', 'buttons', 'inline-banner'],
    supplemental: [
      {
        id: 'composition',
        title: 'Composition',
        items: [
          'Use the card as a complete recommendation unit.',
          'Keep the supporting copy tied to the current tool output.',
          'Avoid adding unrelated controls inside the same card.',
        ],
      },
    ],
    previewSize: 'wide',
  },
  'cp-workspace-shell': {
    lead: 'A Connected Platform workspace shell with Live-matched rail, headers, navigation, and milestone timeline.',
    overview: [
      'CP Workspace Shell composes the Connected Platform rail, breadcrumb header, workspace header, secondary navigation, timeline, and content area.',
      'Use it for CP workspace pages that need Live parity while still using Orbit tokens and component structure.',
    ],
    anatomy: [
      { label: 'Side rail', description: 'Persistent compact rail with workspace destinations and user identity.' },
      { label: 'Breadcrumb header', description: 'Contextual hierarchy above the workspace title.' },
      { label: 'Workspace header', description: 'Workspace title and primary navigation.' },
      { label: 'Secondary nav', description: 'Initiative-level navigation and right-side actions.' },
      { label: 'Milestone timeline', description: 'Horizontal progress navigation for key dates or gates.' },
      { label: 'Content region', description: 'The page content rendered inside the shell.' },
    ],
    guidance: [
      'Keep CP workspace navigation separate from the Orbit dark SideNav.',
      'Use token overrides for Live parity rather than one-off color or spacing values.',
      'Use the full shell for workspace pages and subcomponents only for isolated shell slots.',
    ],
    accessibility: [
      'Give rail, primary, secondary, and timeline navigation clear labels.',
      'Expose active navigation items with current state.',
      'Disabled timeline or navigation actions should not be keyboard actionable.',
    ],
    related: ['side-nav', 'breadcrumb', 'page-header', 'table'],
    supplemental: [
      {
        id: 'composition',
        title: 'Composition',
        items: [
          'Use CpWorkspaceShell when the page needs the complete CP workspace frame.',
          'Use CpSideRail, CpBreadcrumbHeader, CpWorkspaceHeader, CpPrimaryNav, CpSecondaryNav, and CpMilestoneTimelineNav only when documenting or composing shell slots directly.',
          'Keep the content region focused on the workspace task and avoid duplicating shell navigation inside it.',
        ],
      },
    ],
    previewSize: 'wide',
  },
  'page-header': {
    lead: 'Top-level page headers with titles, actions, tabs, pills, and module presets.',
    overview: [
      'Page Header gives product surfaces a consistent page identity and action area.',
      'Use presets to keep Identify, Deliver, Sustain, and RFP modules visually aligned.',
    ],
    anatomy: [
      { label: 'Title and subtitle', description: 'Primary page identity and supporting context.' },
      { label: 'Icon preset', description: 'Module icon, gradient, and border treatment.' },
      { label: 'Actions', description: 'Primary and secondary commands aligned to the page purpose.' },
      { label: 'Tabs or pill', description: 'Optional navigation or initiative metadata.' },
    ],
    guidance: [
      'Use at the top of product pages and module surfaces.',
      'Keep actions aligned with the page primary workflow.',
      'Use presets instead of one-off color treatments.',
    ],
    accessibility: [
      'Keep the title meaningful as the page heading.',
      'Icon-only header actions need accessible names.',
      'Tabs should expose selected state and keyboard behavior.',
    ],
    related: ['tab-buttons', 'buttons', 'icon-buttons', 'breadcrumb'],
    supplemental: [
      {
        id: 'behavior',
        title: 'Behavior',
        items: [
          'Header examples should render in relative positioning inside docs previews.',
          'Actions collapse to icon-only only when labels would crowd the header.',
          'Tab underline visibility should match the product surface pattern.',
        ],
      },
    ],
    previewSize: 'wide',
  },
  'side-nav': {
    lead: 'Application-level sidebar navigation with sections, items, work history, and profile row.',
    overview: [
      'Side Nav gives users persistent access to application destinations and recent work.',
      'Use it for stable app navigation rather than transient page-level controls.',
    ],
    anatomy: [
      { label: 'Brand area', description: 'Application name and client identity.' },
      { label: 'Primary items', description: 'Top-level destinations such as notifications and home.' },
      { label: 'Sections', description: 'Module groups with nested destinations.' },
      { label: 'My Work', description: 'Recent or user-specific work items.' },
      { label: 'Profile row', description: 'Current user identity and profile menu affordance.' },
    ],
    guidance: [
      'Keep top-level destinations stable.',
      'Use work items for recent or user-specific entities.',
      'Make hover states consistent across primary items, sections, and work rows.',
    ],
    accessibility: [
      'Use clear aria labels for icon-only actions.',
      'Expose active rows with aria-current where appropriate.',
      'Keep collapsible sections keyboard operable.',
    ],
    related: ['page-header', 'breadcrumb'],
    supplemental: [
      {
        id: 'behavior',
        title: 'Behavior',
        items: [
          'Primary nav rows, section headers, subitems, and work items share the same hover surface.',
          'Active row state is distinct from hover state.',
          'Long work lists should scroll inside the sidebar without covering the profile row.',
        ],
      },
    ],
    previewSize: 'tall',
  },
  breadcrumb: {
    lead: 'A hierarchical path indicator for nested page navigation.',
    overview: [
      'Breadcrumb helps users understand where they are inside nested objects or drill-down pages.',
      'Use it as supporting navigation, not as a replacement for primary navigation.',
    ],
    anatomy: [
      { label: 'Ancestor links', description: 'Clickable parent destinations.' },
      { label: 'Current item', description: 'The current page or object.' },
      { label: 'Separators', description: 'Visual dividers between path levels.' },
    ],
    guidance: [
      'Keep labels short.',
      'Use when users are inside nested objects.',
      'Avoid breadcrumbs on flat pages with no hierarchy.',
    ],
    accessibility: [
      'Wrap breadcrumbs in navigation semantics in consuming layouts.',
      'Identify the current page item.',
      'Use link text that describes each destination.',
    ],
    related: ['page-header', 'side-nav', 'links'],
  },
  separator: {
    lead: 'A simple divider for separating related content groups.',
    overview: [
      'Separator creates a visual boundary without adding a container.',
      'Use it when whitespace alone is not enough to show grouping.',
    ],
    anatomy: [
      { label: 'Line', description: 'Horizontal or vertical divider.' },
      { label: 'Orientation', description: 'Direction based on surrounding layout.' },
      { label: 'Spacing', description: 'Provided by the consuming layout.' },
    ],
    guidance: [
      'Prefer whitespace first.',
      'Use separators when a boundary needs to be explicit.',
      'Avoid over-dividing dense layouts.',
    ],
    accessibility: [
      'Treat visual separators as decorative unless they convey meaningful structure.',
      'Use semantic grouping for content relationships.',
      'Keep contrast subtle but visible.',
    ],
    related: ['card', 'breadcrumb', 'form-elements'],
  },
  'inline-banner': {
    lead: 'Contextual message bars in high and low contrast styles.',
    overview: [
      'Inline Banner presents status or guidance inside the page layout.',
      'Use it for contextual information that should stay near the affected content.',
    ],
    anatomy: [
      { label: 'Status icon', description: 'Visual status marker.' },
      { label: 'Label', description: 'Primary message text.' },
      { label: 'Status text', description: 'Optional supporting status label.' },
      { label: 'Contrast', description: 'High or low emphasis treatment.' },
    ],
    guidance: [
      'Use high contrast for important status messages.',
      'Use low contrast for persistent lower-urgency context.',
      'Keep labels short and specific.',
    ],
    accessibility: [
      'Do not rely on color alone for status.',
      'Use persistent inline messaging for information users must act on.',
      'Avoid interruptive live announcements for static banners.',
    ],
    related: ['alert', 'toast', 'chip'],
    previewSize: 'wide',
  },
  alert: {
    lead: 'Dismissable multiline notifications with title and description.',
    overview: [
      'Alert is for larger feedback messages that need title, description, and dismissal.',
      'Use Inline Banner for compact contextual strips.',
    ],
    anatomy: [
      { label: 'Status icon', description: 'Severity marker for the alert type.' },
      { label: 'Title', description: 'Short summary of the message.' },
      { label: 'Description', description: 'Supporting explanation or next step.' },
      { label: 'Dismiss', description: 'Optional close action.' },
    ],
    guidance: [
      'Keep descriptions concise.',
      'Use the type that matches severity and user action needed.',
      'Avoid stacking many alerts in one surface.',
    ],
    accessibility: [
      'Use status text that is understandable without color.',
      'Dismiss controls need clear accessible names.',
      'Critical alerts should be announced by the consuming page if needed.',
    ],
    related: ['inline-banner', 'toast'],
    previewSize: 'wide',
  },
  toast: {
    lead: 'Ephemeral notification messages triggered by user actions.',
    overview: [
      'Toast gives temporary confirmation or feedback after an action.',
      'Do not use toasts for critical information that must persist.',
    ],
    anatomy: [
      { label: 'Status icon', description: 'Visual marker for the toast type.' },
      { label: 'Message', description: 'Short feedback text.' },
      { label: 'Actions', description: 'Optional immediate next-step buttons.' },
      { label: 'Dismiss', description: 'Close affordance for the notification.' },
    ],
    guidance: [
      'Keep messages short.',
      'Provide actions only when the next step is immediate and obvious.',
      'Use persistent feedback for information users must keep referencing.',
    ],
    accessibility: [
      'Toast containers should be announced appropriately in the app shell.',
      'Dismiss controls need accessible names.',
      'Avoid auto-dismiss timing that prevents users from reading critical content.',
    ],
    related: ['alert', 'inline-banner', 'buttons'],
    previewSize: 'wide',
  },
};

function getSectionNav(content: ComponentPageContent) {
  const supplemental = content.supplemental?.map((section) => ({ id: section.id, label: section.title })) ?? [];
  return [
    BASE_SECTION_NAV[0],
    BASE_SECTION_NAV[1],
    BASE_SECTION_NAV[2],
    ...supplemental,
    ...BASE_SECTION_NAV.slice(3),
  ];
}

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

function PreviewFrame({
  size = 'normal',
  children,
}: {
  size?: ComponentPageContent['previewSize'];
  children: React.ReactNode;
}) {
  const innerWidth = size === 'wide' ? '760px' : size === 'tall' ? '360px' : '460px';
  const minHeight = size === 'tall' ? 620 : 220;

  return (
    <div
      style={{
        border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
        borderRadius: 'var(--orbit-radius-md)',
        background: 'var(--orbit-color-bg-default)',
        minHeight,
        padding: 'var(--orbit-space-l)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ width: `min(100%, ${innerWidth})` }}>{children}</div>
    </div>
  );
}

function StateGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--orbit-space-base)',
      }}
    >
      {children}
    </div>
  );
}

function StateExample({
  label,
  children,
  minHeight = 112,
}: {
  label: string;
  children: React.ReactNode;
  minHeight?: number;
}) {
  return (
    <div
      style={{
        border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
        borderRadius: 'var(--orbit-radius-sm)',
        background: 'var(--orbit-color-bg-default)',
        padding: 'var(--orbit-space-base)',
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: 'var(--orbit-space-base)',
        minWidth: 0,
      }}
    >
      <Text variant="Secondary" size="Small">{label}</Text>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  );
}

function InlineExamples({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--orbit-space-base)',
      }}
    >
      {children}
    </div>
  );
}

type ChipDocsVariant = typeof CHIP_HIGH_VARIANTS[number] | typeof CHIP_LOW_VARIANTS[number];

function ChipPaletteSection({
  title,
  description,
  variants,
  contrast,
  size,
}: {
  title: string;
  description: string;
  variants: readonly ChipDocsVariant[];
  contrast?: 'High';
  size?: 'Mini';
}) {
  return (
    <div
      style={{
        border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)',
        borderRadius: 'var(--orbit-radius-sm)',
        background: 'var(--orbit-color-bg-default)',
        padding: 'var(--orbit-space-base)',
      }}
    >
      <div style={{ marginBottom: 'var(--orbit-space-base)' }}>
        <Headings size="Heading 5">{title}</Headings>
        <p style={{ margin: 'var(--orbit-space-xs) 0 0', color: 'var(--orbit-color-text-secondary)', fontSize: 'var(--orbit-text-sm)', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--orbit-space-s)',
        }}
      >
        {variants.map((variant) => (
          <Chip
            key={variant}
            size={size}
            variant={variant}
            contrast={contrast}
            label={variant}
          />
        ))}
      </div>
    </div>
  );
}

function ChipPaletteExamples() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <ChipPaletteSection
        title="High Contrast"
        description="Solid emphasis chips for stronger status signals."
        variants={CHIP_HIGH_VARIANTS}
        contrast="High"
      />
      <ChipPaletteSection
        title="Low Contrast"
        description="Tinted and outlined chips for dense metadata and secondary status."
        variants={CHIP_LOW_VARIANTS}
      />
      <ChipPaletteSection
        title="Mini High Contrast"
        description="Compact solid chips for dense rows and metadata clusters."
        variants={CHIP_HIGH_VARIANTS}
        contrast="High"
        size="Mini"
      />
      <ChipPaletteSection
        title="Mini Low Contrast"
        description="Compact tinted and outlined chips for the full low-contrast palette."
        variants={CHIP_LOW_VARIANTS}
        size="Mini"
      />
    </div>
  );
}

function StackExamples({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--orbit-space-s)',
      }}
    >
      {children}
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
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--orbit-space-xxs)',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        color: 'var(--orbit-color-text-secondary)',
        fontSize: 'var(--orbit-text-sm)',
        lineHeight: 1.7,
      }}
    >
      {items.map((item) => (
        <li
          key={item}
          style={{
            display: 'grid',
            gridTemplateColumns: 'var(--orbit-space-xs) 1fr',
            columnGap: 'var(--orbit-space-xs)',
            alignItems: 'start',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 'var(--orbit-space-xxs)',
              height: 'var(--orbit-space-xxs)',
              borderRadius: 'var(--orbit-radius-pill)',
              background: 'var(--orbit-color-text-secondary)',
              marginTop: '0.75em',
            }}
          />
          <span>{item}</span>
        </li>
      ))}
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

function RelatedComponents({ ids }: { ids: ComponentId[] }) {
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

function DocsSideNavPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div data-theme="orbit" style={{ height: compact ? 560 : 620, overflow: 'hidden', borderRadius: 'var(--orbit-radius-sm)' }}>
      <SideNav
        appName="Connected Platform"
        clientName="Aarke"
        navItems={SIDENAV_SAMPLE.navItems}
        sections={SIDENAV_SAMPLE.sections}
        workItems={compact ? SIDENAV_SAMPLE.workItems.slice(0, 3) : SIDENAV_SAMPLE.workItems}
        userName="Derek Wong"
        userInitials="DW"
      />
    </div>
  );
}

function HeaderPreviewWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        '--orbit-page-header-position': 'relative',
        '--orbit-page-header-top': 'auto',
        '--orbit-page-header-z-index': '0',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--orbit-space-base)',
        width: '100%',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

function CpShellPreview({ height = 620 }: { height?: number }) {
  return (
    <div
      style={{
        width: 'min(1180px, calc(100vw - var(--orbit-sidenav-width) - (var(--orbit-space-mega) * 2)))',
        maxWidth: 'none',
        height,
        overflow: 'hidden',
        background: 'var(--orbit-color-cp-surface-muted)',
        '--orbit-cp-shell-min-height': '100%',
      } as React.CSSProperties}
    >
      <CpWorkspaceShell
        railItems={CP_RAIL_ITEMS}
        breadcrumbItems={CP_BREADCRUMB_ITEMS}
        workspaceTitle="Connected Platform - Development Workstreams"
        primaryNavItems={CP_PRIMARY_NAV_ITEMS}
        secondaryLabel="CP001-1014 | sdasd"
        secondaryNavItems={CP_SECONDARY_NAV_ITEMS}
        timelineSteps={CP_TIMELINE_STEPS}
        rightActions={CP_RIGHT_ACTIONS}
        user={{ name: 'Derek Wong', initials: 'DW' }}
        logoLabel="DEV"
      >
        <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
          <Headings size="Heading 4">My Workspace</Headings>
          <Text as="p" variant="Secondary">
            Full shell composition using CP workspace tokens and Live navigation labels.
          </Text>
          <Table
            columns={TABLE_COLUMNS}
            rows={TABLE_ROWS}
            getRowKey={(row) => row.id}
          />
        </div>
      </CpWorkspaceShell>
    </div>
  );
}

function PrimaryPreview({ id }: { id: ComponentId }) {
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
  const [activeTab, setActiveTab] = useState(0);
  const [multiStateActive, setMultiStateActive] = useState('mine');
  const [quickFilters, setQuickFilters] = useState<string[]>(['Region']);
  const [tableSort, setTableSort] = useState<'asc' | 'desc'>('asc');
  const [tablePage, setTablePage] = useState(1);
  const [toastVisible, setToastVisible] = useState(true);

  switch (id) {
    case 'typography':
      return (
        <StackExamples>
          <Headings size="Heading 2">Initiative overview</Headings>
          <Text variant="Primary">Primary body copy for product content.</Text>
          <Text variant="Secondary" size="Small">Secondary metadata and helper text.</Text>
        </StackExamples>
      );
    case 'links':
      return <LinkText label="Open supplier profile" variant="Primary" />;
    case 'form-elements':
      return (
        <InlineExamples>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Text>Supplier</Text>
            <Carat />
            <Text>Contract</Text>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Text>Supplier name</Text>
            <Required />
          </span>
        </InlineExamples>
      );
    case 'buttons':
      return <Button variant="Primary">Add Initiative</Button>;
    case 'icon-buttons':
      return <IconButton variant="Secondary" ariaLabel="Open documents" icon={<FaIcon icon={'\uf07c'} size={16} />} />;
    case 'tab-buttons':
      return (
        <InlineExamples>
          {['Overview', 'Details', 'History'].map((tab, index) => (
            <TabButton key={tab} active={activeTab === index} onClick={() => setActiveTab(index)}>
              {tab}
            </TabButton>
          ))}
        </InlineExamples>
      );
    case 'quick-filters':
      return (
        <QuickFilterGroup>
          {['Category', 'Region', 'Status'].map((filter) => (
            <QuickFilterItem
              key={filter}
              label={filter}
              selected={quickFilters.includes(filter)}
              onClick={() => setQuickFilters((prev) => prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter])}
            />
          ))}
        </QuickFilterGroup>
      );
    case 'multistate-buttons':
      return (
        <MultiStateGroup value={multiStateActive} onValueChange={setMultiStateActive} ariaLabel="Initiative ownership">
          <MultiStateButton value="mine" label="Mine" />
          <MultiStateButton value="team" label="Team" />
          <MultiStateButton value="all" label="All" />
        </MultiStateGroup>
      );
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
        <StackExamples>
          <Dropzone
            ariaLabel="Upload contract"
            accept=".pdf"
            onFileSelected={(file) => setSelectedFile(file.name)}
            acceptedFileTypesLabel="File types supported: PDF"
            maxFileSizeLabel="Maximum upload file size: 100 MB"
          />
          {selectedFile && <Text variant="Secondary" size="Small">Selected file: {selectedFile}</Text>}
        </StackExamples>
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
    case 'card':
      return (
        <Card state="Highlight" indicator style={{ width: 280 }}>
          <CardContent>
            <Headings size="Heading 5">Legal Tech Platform</Headings>
            <p style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', margin: 'var(--orbit-space-xs) 0 0' }}>
              Contract review in progress
            </p>
          </CardContent>
        </Card>
      );
    case 'toggle-card':
      return (
        <ToggleCard status="Selected" style={{ width: 280 }}>
          <div style={{ padding: 'var(--orbit-space-base)' }}>
            <Headings size="Heading 5">Standard Plan</Headings>
            <p style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', margin: 'var(--orbit-space-xs) 0 0' }}>
              Selected state
            </p>
          </div>
        </ToggleCard>
      );
    case 'table':
      return (
        <Table
          ariaLabel="Initiative examples"
          columns={[{ ...TABLE_COLUMNS[0], sortable: true, sortDirection: tableSort, onSortChange: setTableSort }, ...TABLE_COLUMNS.slice(1)]}
          rows={TABLE_ROWS}
          getRowKey={(row) => row.id}
          onRowSelect={() => {}}
          getRowSelectionLabel={(row) => `Select initiative ${row.initiative}`}
          pagination={{ page: tablePage, pageSize: 10, totalRows: 37, onPageChange: setTablePage }}
        />
      );
    case 'avatar':
      return (
        <AvatarStack
          max={3}
          avatars={[
            { name: 'Alice Brown', initials: 'AB' },
            { name: 'Bob Chen', initials: 'BC' },
            { name: 'Derek Wong', initials: 'DW' },
            { name: 'Maya Patel', initials: 'MP' },
          ]}
        />
      );
    case 'status-indicator':
      return <StatusIndicator status="Success" label="On track" />;
    case 'chip':
      return <Chip variant="Information" contrast="High" label="In review" />;
    case 'filter':
      return <Filter label="Region: Europe" onRemove={() => {}} />;
    case 'indicators':
      return (
        <InlineExamples>
          <Badge label="18" status="Green" />
          <PriceIndicator movement="Positive" value="12%" />
          <RiskIndicator level="Medium" />
          <RadialIndicator status="Information" />
        </InlineExamples>
      );
    case 'document-glyph':
      return (
        <InlineExamples>
          <DocumentGlyph documentType="PDF" size="Large" />
          <DocumentGlyph documentType="DOC" size="Large" />
          <DocumentGlyph documentType="XLS" size="Large" />
        </InlineExamples>
      );
    case 'file-item':
      return <FileItem filename="contract-analysis.pdf" documentType="PDF" fixedWidth={320} />;
    case 'country-flag':
      return (
        <InlineExamples>
          <CountryFlag country="GB" />
          <Text>United Kingdom</Text>
        </InlineExamples>
      );
    case 'tooltip':
      return (
        <Tooltip content="View supporting documents" direction="top">
          <Button variant="Secondary">Hover me</Button>
        </Tooltip>
      );
    case 'tool-next-steps-card':
      return <ToolNextStepsCard />;
    case 'cp-workspace-shell':
      return <CpShellPreview height={720} />;
    case 'page-header':
      return (
        <HeaderPreviewWrapper>
          <PageHeader
            title="ContractLens"
            subtitle="AI-powered contract intelligence and insights"
            icon={'\uf013'}
            {...HeaderPresets.identify}
            actions={[{ label: '+ Upload Contracts', variant: 'Primary' }]}
            tabs={[{ label: 'Contract Pipeline', badge: 3 }, { label: 'Coverage' }, { label: 'Documents' }]}
            defaultActiveTab={0}
          />
        </HeaderPreviewWrapper>
      );
    case 'side-nav':
      return <DocsSideNavPreview compact />;
    case 'breadcrumb':
      return (
        <Breadcrumb items={[
          { label: 'Home', href: '#' },
          { label: 'Suppliers', href: '#' },
          { label: 'Acme Corp' },
        ]} />
      );
    case 'separator':
      return (
        <div style={{ width: '100%' }}>
          <Separator orientation="Horizontal" />
        </div>
      );
    case 'inline-banner':
      return <InlineBanner variant="Information" contrast="High" label="Contract review complete" status="Info" />;
    case 'alert':
      return (
        <Alert
          type="Information"
          title="Contract analysis is ready"
          description="Review the summary before sharing recommendations with the team."
          onDismiss={() => {}}
        />
      );
    case 'toast':
      return (
        <StackExamples>
          <Button variant="Primary" onClick={() => setToastVisible(true)}>Show toast</Button>
          <Toast type="Success" message="Changes saved." visible={toastVisible} onDismiss={() => setToastVisible(false)} />
        </StackExamples>
      );
  }
}

function VariantExamples({ id }: { id: ComponentId }) {
  const [activeTab, setActiveTab] = useState(0);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [multiStateActive, setMultiStateActive] = useState('overview');
  const [radioValue, setRadioValue] = useState('two');
  const [tableSort, setTableSort] = useState<'asc' | 'desc'>('asc');
  const [tablePage, setTablePage] = useState(1);
  const [toastType, setToastType] = useState<'Success' | 'Error' | 'Info' | 'Warning' | 'NoStatus' | null>(null);

  switch (id) {
    case 'typography':
      return (
        <StateGrid>
          <StateExample label="Headings" minHeight={180}>
            <StackExamples>
              <Headings size="Heading 1">Heading 1</Headings>
              <Headings size="Heading 3">Heading 3</Headings>
              <Headings size="Heading 5">Heading 5</Headings>
            </StackExamples>
          </StateExample>
          <StateExample label="Body text" minHeight={180}>
            <StackExamples>
              <Text variant="Primary">Primary</Text>
              <Text variant="Secondary">Secondary</Text>
              <Text variant="Bold">Bold</Text>
              <Text variant="Warning">Warning</Text>
            </StackExamples>
          </StateExample>
          <StateExample label="Small text" minHeight={180}>
            <StackExamples>
              <Text size="Small" variant="Primary">Primary small</Text>
              <Text size="Small" variant="Secondary">Secondary small</Text>
              <Text size="Small" variant="Disabled">Disabled small</Text>
            </StackExamples>
          </StateExample>
        </StateGrid>
      );
    case 'links':
      return (
        <StateGrid>
          <StateExample label="Primary"><LinkText label="Primary link" variant="Primary" /></StateExample>
          <StateExample label="Secondary"><LinkText label="Secondary link" variant="Secondary" /></StateExample>
          <StateExample label="Heading"><LinkText label="Heading link" variant="Heading" /></StateExample>
        </StateGrid>
      );
    case 'form-elements':
      return (
        <StateGrid>
          <StateExample label="Required marker">
            <InlineExamples><Text>Field label</Text><Required /></InlineExamples>
          </StateExample>
          <StateExample label="Carat separator">
            <InlineExamples><Text>Text</Text><Carat /><Text>Text</Text></InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'buttons':
      return (
        <StateGrid>
          <StateExample label="Variants" minHeight={220}>
            <InlineExamples>
              <Button variant="Primary">Primary</Button>
              <Button variant="Secondary">Secondary</Button>
              <Button variant="Tertiary">Tertiary</Button>
              <Button variant="Positive">Positive</Button>
              <Button variant="Destructive">Destructive</Button>
            </InlineExamples>
          </StateExample>
          <StateExample label="States" minHeight={220}>
            <InlineExamples>
              <Button variant="Primary" state="Default">Default</Button>
              <Button variant="Primary" state="Hover">Hover</Button>
              <Button variant="Primary" state="Disabled">Disabled</Button>
            </InlineExamples>
          </StateExample>
          <StateExample label="With icons" minHeight={220}>
            <InlineExamples>
              <Button variant="Primary" icon={<FaIcon icon={'\uf118'} size={16} color="var(--orbit-color-white)" />}>Left icon</Button>
              <Button variant="Secondary" iconRight={<FaIcon icon={'\uf118'} size={16} />}>Right icon</Button>
            </InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'icon-buttons':
      return (
        <StateGrid>
          <StateExample label="Variants">
            <InlineExamples>
              <IconButton variant="Primary" ariaLabel="Primary" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Secondary" ariaLabel="Secondary" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Tertiary" ariaLabel="Tertiary" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Positive" ariaLabel="Positive" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Destructive" ariaLabel="Destructive" icon={<FaIcon icon={'\uf118'} size={16} />} />
            </InlineExamples>
          </StateExample>
          <StateExample label="Sizes">
            <InlineExamples>
              <IconButton variant="Primary" size="Small" ariaLabel="Small" icon={<FaIcon icon={'\uf118'} size={12} />} />
              <IconButton variant="Primary" size="Medium" ariaLabel="Medium" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Primary" size="Large" ariaLabel="Large" icon={<FaIcon icon={'\uf118'} size={16} />} />
            </InlineExamples>
          </StateExample>
          <StateExample label="States">
            <InlineExamples>
              <IconButton variant="Secondary" state="Default" ariaLabel="Default" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Secondary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={'\uf118'} size={16} />} />
              <IconButton variant="Secondary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={'\uf118'} size={16} />} />
            </InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'tab-buttons':
      return (
        <StateGrid>
          <StateExample label="Interactive">
            <InlineExamples>
              {['Overview', 'Details', 'History'].map((tab, index) => (
                <TabButton key={tab} active={activeTab === index} onClick={() => setActiveTab(index)}>
                  {tab}
                </TabButton>
              ))}
            </InlineExamples>
          </StateExample>
          <StateExample label="States">
            <InlineExamples>
              <TabButton active={false} status="Rest">Rest</TabButton>
              <TabButton active={false} status="Hover">Hover</TabButton>
              <TabButton active={true}>Active</TabButton>
              <TabButton active={false} status="Disabled">Disabled</TabButton>
            </InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'quick-filters':
      return (
        <StateGrid>
          <StateExample label="Interactive" minHeight={160}>
            <QuickFilterGroup>
              {['Category', 'Region', 'Status'].map((filter) => (
                <QuickFilterItem
                  key={filter}
                  label={filter}
                  selected={quickFilters.includes(filter)}
                  onClick={() => setQuickFilters((prev) => prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter])}
                />
              ))}
            </QuickFilterGroup>
          </StateExample>
          <StateExample label="States" minHeight={160}>
            <InlineExamples>
              <QuickFilterItem label="Default" />
              <QuickFilterItem label="Selected" selected />
            </InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'multistate-buttons':
      return (
        <StateGrid>
          <StateExample label="Interactive" minHeight={160}>
            <MultiStateGroup value={multiStateActive} onValueChange={setMultiStateActive} ariaLabel="View mode">
              <MultiStateButton value="overview" label="Overview" />
              <MultiStateButton value="details" label="Details" />
              <MultiStateButton value="analytics" label="Analytics" />
            </MultiStateGroup>
          </StateExample>
          <StateExample label="With counts" minHeight={160}>
            <MultiStateGroup defaultValue="all">
              <MultiStateButton value="all" label="All" count={42} />
              <MultiStateButton value="active" label="Active" count={18} />
              <MultiStateButton value="pending" label="Pending" count={7} />
            </MultiStateGroup>
          </StateExample>
          <StateExample label="Disabled" minHeight={160}>
            <MultiStateGroup defaultValue="selected">
              <MultiStateButton value="selected" label="Selected" />
              <MultiStateButton value="disabled" label="Disabled" disabled />
            </MultiStateGroup>
          </StateExample>
        </StateGrid>
      );
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
          <StateExample label="Default" minHeight={220}><Dropzone ariaLabel="Upload file" onFileSelected={() => {}} acceptedFileTypesLabel="File types supported: PDF" maxFileSizeLabel="Maximum upload file size: 100 MB" /></StateExample>
          <StateExample label="Error" minHeight={220}><Dropzone ariaLabel="Upload file with error" onFileSelected={() => {}} error="Upload failed. Try a PDF under 100 MB." acceptedFileTypesLabel="File types supported: PDF" /></StateExample>
          <StateExample label="Disabled" minHeight={220}><Dropzone ariaLabel="Disabled upload" onFileSelected={() => {}} disabled acceptedFileTypesLabel="File types supported: PDF" /></StateExample>
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
          <StateExample label="Group">
            <RadioGroup value={radioValue} name="docs-radio-group" ariaLabel="Radio examples" onChange={setRadioValue}>
              <Radio value="one" checked={false} onChange={() => {}} label="One" />
              <Radio value="two" checked={false} onChange={() => {}} label="Two" />
            </RadioGroup>
          </StateExample>
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
    case 'card':
      return (
        <StackExamples>
          <div>
            <Text variant="Bold">Current theme · Figma Card contract</Text>
            <StateGrid>
              {CARD_FIGMA_VARIANTS.map(({ state, hasShadow, label }) => (
                <StateExample key={`current-${state}-${label}`} label={`${state} · ${label}`}>
                  <Card state={state} hasShadow={hasShadow} indicator={false}>
                    <CardContent>
                      <Headings size="Heading 5">{state}</Headings>
                      <Text variant="Secondary" size="Small">{label}</Text>
                    </CardContent>
                  </Card>
                </StateExample>
              ))}
            </StateGrid>
          </div>

          <div>
            <Text variant="Bold">Current theme · HasIndicator rail colours</Text>
            <StateGrid>
              {CARD_STATES.map((state) => (
                <StateExample key={`current-indicator-${state}`} label={`${state} · indicator=true`}>
                  <Card state={state} hasShadow={state === 'Hover'} indicator>
                    <CardContent>
                      <Headings size="Heading 5">{state}</Headings>
                      <Text variant="Secondary" size="Small">HasIndicator=True</Text>
                    </CardContent>
                  </Card>
                </StateExample>
              ))}
            </StateGrid>
          </div>

          <div>
            <Text variant="Bold">Padding · ContentPlaceHolder</Text>
            <StateGrid>
              {(['Small', 'Base', 'Medium'] as const).map((padding) => (
                <StateExample key={padding} label={`${padding} padding`}>
                  <Card>
                    <CardContent padding={padding}>
                      <Headings size="Heading 5">{padding}</Headings>
                      <Text variant="Secondary" size="Small">ContentPlaceHolder</Text>
                    </CardContent>
                  </Card>
                </StateExample>
              ))}
              <StateExample label="Horizontal slot">
                <Card>
                  <CardContent padding="Small" orientation="Horizontal">
                    <Headings size="Heading 5">Horizontal</Headings>
                    <Text variant="Secondary" size="Small">Slot orientation</Text>
                  </CardContent>
                </Card>
              </StateExample>
            </StateGrid>
          </div>

          <div data-theme="efficio">
            <Text variant="Bold">CP / Efficio theme comparison</Text>
            <StateGrid>
              {CARD_FIGMA_VARIANTS.map(({ state, hasShadow, label }) => (
                <StateExample key={`efficio-${state}-${label}`} label={`${state} · ${label}`}>
                  <Card state={state} hasShadow={hasShadow} indicator={false}>
                    <CardContent>
                      <Headings size="Heading 5">{state}</Headings>
                      <Text variant="Secondary" size="Small">{label}</Text>
                    </CardContent>
                  </Card>
                </StateExample>
              ))}
            </StateGrid>
          </div>
        </StackExamples>
      );
    case 'toggle-card':
      return (
        <StateGrid>
          {(['Default', 'Hover', 'Selected', 'Disabled'] as const).map((status) => (
            <StateExample key={status} label={status}>
              <ToggleCard status={status}>
                <div style={{ padding: 'var(--orbit-space-base)' }}>
                  <Headings size="Heading 5">Standard Plan</Headings>
                  <Text variant="Secondary" size="Small">{status} state</Text>
                </div>
              </ToggleCard>
            </StateExample>
          ))}
        </StateGrid>
      );
    case 'table':
      return (
        <Table
          ariaLabel="Initiative examples"
          columns={[{ ...TABLE_COLUMNS[0], sortable: true, sortDirection: tableSort, onSortChange: setTableSort, info: 'Sort by initiative name' }, ...TABLE_COLUMNS.slice(1)]}
          rows={TABLE_ROWS}
          getRowKey={(row) => row.id}
          onRowSelect={() => {}}
          getRowSelectionLabel={(row) => `Select initiative ${row.initiative}`}
          pagination={{ page: tablePage, pageSize: 10, totalRows: 37, onPageChange: setTablePage }}
        />
      );
    case 'avatar':
      return (
        <StateGrid>
          <StateExample label="Sizes">
            <InlineExamples>
              <Avatar name="John Doe" size="Extra Small" initials="JD" />
              <Avatar name="John Doe" size="Small" initials="JD" />
              <Avatar name="John Doe" size="Medium" initials="JD" />
              <Avatar name="John Doe" size="Large" initials="JD" />
            </InlineExamples>
          </StateExample>
          <StateExample label="Styles">
            <InlineExamples>
              <Avatar name="Alice" style="Text" initials="AB" />
              <Avatar name="Bob" style="Icon" initials="BC" />
              <Avatar name="Square Avatar" style="Square" initials="SA" />
            </InlineExamples>
          </StateExample>
          <StateExample label="Stack">
            <AvatarStack max={3} avatars={[{ name: 'Alice Brown', initials: 'AB' }, { name: 'Bob Chen', initials: 'BC' }, { name: 'Derek Wong', initials: 'DW' }, { name: 'Maya Patel', initials: 'MP' }]} />
          </StateExample>
        </StateGrid>
      );
    case 'status-indicator':
      return (
        <StateGrid>
          <StateExample label="Labelled">
            <InlineExamples>
              <StatusIndicator status="Success" label="Success" />
              <StatusIndicator status="Warning" label="Warning" />
              <StatusIndicator status="Information" label="Information" />
              <StatusIndicator status="Error" label="Error" />
              <StatusIndicator status="No Status" label="No Status" />
            </InlineExamples>
          </StateExample>
          <StateExample label="Small">
            <InlineExamples>
              <StatusIndicator status="Success" size="Small" />
              <StatusIndicator status="Information" size="Small" />
              <StatusIndicator status="Warning" size="Small" />
            </InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'chip':
      return <ChipPaletteExamples />;
    case 'filter':
      return (
        <StateGrid>
          <StateExample label="Default"><Filter label="Category: Legal" onRemove={() => {}} /></StateExample>
          <StateExample label="Hover"><Filter label="Region: Europe" state="Hover" onRemove={() => {}} /></StateExample>
        </StateGrid>
      );
    case 'indicators':
      return (
        <StateGrid>
          <StateExample label="Badges"><InlineExamples><Badge label="99" status="Green" /><Badge label="99" status="Red" /><Badge label="Info" status="Information" /><Badge label="Warn" status="Warning" /></InlineExamples></StateExample>
          <StateExample label="Price and risk"><InlineExamples><PriceIndicator movement="Positive" value="Value" /><PriceIndicator movement="Negative" value="Value" /><RiskIndicator level="High" /><RiskIndicator level="Low" /></InlineExamples></StateExample>
          <StateExample label="Progress and loading"><InlineExamples><RadialIndicator status="Success" /><StepCircle status="Checked" ariaLabel="Completed step" /><StepCircle status="Numbered" label={2} /><Spinner size="Inline" label="Loading inline" /></InlineExamples></StateExample>
          <StateExample label="Legend"><InlineExamples><LegendLabel value="Value" color="var(--orbit-color-bright-green)" /><LegendLabel value="Value" color="var(--orbit-color-efficio-blue)" /></InlineExamples></StateExample>
        </StateGrid>
      );
    case 'document-glyph':
      return (
        <StateGrid>
          <StateExample label="Large"><InlineExamples><DocumentGlyph documentType="XLS" size="Large" /><DocumentGlyph documentType="DOC" size="Large" /><DocumentGlyph documentType="PDF" size="Large" /><DocumentGlyph documentType="ZIP" size="Large" /></InlineExamples></StateExample>
          <StateExample label="Medium"><InlineExamples><DocumentGlyph documentType="XLS" size="Medium" /><DocumentGlyph documentType="DOC" size="Medium" /><DocumentGlyph documentType="PDF" size="Medium" /><DocumentGlyph documentType="Unknown" size="Medium" /></InlineExamples></StateExample>
          <StateExample label="Micro"><InlineExamples><DocumentGlyph documentType="XLS" size="Micro" /><DocumentGlyph documentType="DOC" size="Micro" /><DocumentGlyph documentType="PDF" size="Micro" /><DocumentGlyph documentType="Unknown" size="Micro" /></InlineExamples></StateExample>
        </StateGrid>
      );
    case 'file-item':
      return (
        <StateGrid>
          <StateExample label="Fixed width"><FileItem filename="contract-analysis.pdf" documentType="PDF" fixedWidth={320} /></StateExample>
          <StateExample label="Compact"><FileItem filename="supplier-data.xlsx" documentType="XLS" /></StateExample>
          <StateExample label="Clickable"><FileItem filename="source-brief.docx" documentType="DOC" onClick={() => {}} /></StateExample>
        </StateGrid>
      );
    case 'country-flag':
      return (
        <StateGrid>
          <StateExample label="Common countries">
            <InlineExamples>
              <CountryFlag country="US" />
              <CountryFlag country="GB" />
              <CountryFlag country="DE" />
              <CountryFlag country="FR" />
              <CountryFlag country="JP" />
              <CountryFlag country="AU" />
            </InlineExamples>
          </StateExample>
          <StateExample label="With text">
            <StackExamples>
              <InlineExamples><CountryFlag country="GB" /><Text>United Kingdom</Text></InlineExamples>
              <InlineExamples><CountryFlag country="DE" /><Text>Germany</Text></InlineExamples>
            </StackExamples>
          </StateExample>
        </StateGrid>
      );
    case 'tooltip':
      return (
        <StateGrid>
          <StateExample label="Directions" minHeight={160}>
            <InlineExamples>
              <Tooltip content="Tooltip on top" direction="top"><Button variant="Secondary">Top</Button></Tooltip>
              <Tooltip content="Tooltip on bottom" direction="bottom"><Button variant="Secondary">Bottom</Button></Tooltip>
              <Tooltip content="Tooltip on left" direction="left"><Button variant="Secondary">Left</Button></Tooltip>
              <Tooltip content="Tooltip on right" direction="right"><Button variant="Secondary">Right</Button></Tooltip>
            </InlineExamples>
          </StateExample>
          <StateExample label="Alignment" minHeight={160}>
            <InlineExamples>
              <Tooltip content="Aligned to start" direction="bottom" align="start"><Button variant="Secondary">Start</Button></Tooltip>
              <Tooltip content="Aligned to end" direction="bottom" align="end"><Button variant="Secondary">End</Button></Tooltip>
            </InlineExamples>
          </StateExample>
        </StateGrid>
      );
    case 'tool-next-steps-card':
      return <ToolNextStepsCard />;
    case 'cp-workspace-shell':
      return (
        <StackExamples>
          <CpShellPreview height={620} />
          <StateGrid>
            <StateExample label="Rail" minHeight={360}>
              <div style={{ height: 320, overflow: 'hidden', border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)' }}>
                <CpSideRail items={CP_RAIL_ITEMS} user={{ name: 'Derek Wong', initials: 'DW' }} logoLabel="DEV" />
              </div>
            </StateExample>
            <StateExample label="Breadcrumb header" minHeight={160}>
              <div style={{ width: '100%', border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)' }}>
                <CpBreadcrumbHeader items={CP_BREADCRUMB_ITEMS} />
              </div>
            </StateExample>
            <StateExample label="Workspace header" minHeight={220}>
              <div style={{ width: '100%', border: 'var(--orbit-space-px) solid var(--orbit-color-border-default)' }}>
                <CpWorkspaceHeader
                  workspaceTitle="Connected Platform - Development Workstreams"
                  primaryNavItems={CP_PRIMARY_NAV_ITEMS}
                  rightActions={CP_RIGHT_ACTIONS}
                />
              </div>
            </StateExample>
            <StateExample label="Primary nav" minHeight={160}>
              <CpPrimaryNav items={CP_PRIMARY_NAV_ITEMS} />
            </StateExample>
            <StateExample label="Secondary nav" minHeight={180}>
              <CpSecondaryNav
                label="CP001-1014 | sdasd"
                items={CP_SECONDARY_NAV_ITEMS}
                rightActions={CP_RIGHT_ACTIONS}
              />
            </StateExample>
            <StateExample label="Milestone timeline" minHeight={180}>
              <CpMilestoneTimelineNav steps={CP_TIMELINE_STEPS} />
            </StateExample>
          </StateGrid>
        </StackExamples>
      );
    case 'page-header':
      return (
        <HeaderPreviewWrapper>
          <PageHeader type="main" title="Good afternoon, Chris" subtitle="Here's your overview for today" />
          <PageHeader
            title="Delivery Engine"
            subtitle="E-Hub delivery management system for tracking project execution"
            icon={'\uf013'}
            {...HeaderPresets.deliver}
            actions={[{ label: 'View documents', icon: '\uf07c', variant: 'Secondary' }, { label: '+ Add Initiative', variant: 'Primary' }]}
          />
          <PageHeader
            title="RFP Analytics"
            subtitle="Select the right tool for the right job"
            icon={'\uf201'}
            {...HeaderPresets.rfp}
            pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
            tabs={[{ label: 'Consolidate' }, { label: 'Negotiate' }, { label: 'Award' }]}
            showTabUnderline
          />
        </HeaderPreviewWrapper>
      );
    case 'side-nav':
      return <DocsSideNavPreview />;
    case 'breadcrumb':
      return (
        <StateGrid>
          <StateExample label="Nested path">
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Suppliers', href: '#' }, { label: 'Acme Corp' }]} />
          </StateExample>
        </StateGrid>
      );
    case 'separator':
      return (
        <StateGrid>
          <StateExample label="Horizontal">
            <div style={{ width: '100%' }}><Separator orientation="Horizontal" /></div>
          </StateExample>
          <StateExample label="Vertical">
            <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>Left</span>
              <Separator orientation="Vertical" />
              <span>Right</span>
            </div>
          </StateExample>
        </StateGrid>
      );
    case 'inline-banner':
      return (
        <StackExamples>
          <Headings size="Heading 5">High Contrast</Headings>
          <InlineBanner variant="Information" contrast="High" label="Label" status="Status" />
          <InlineBanner variant="Success" contrast="High" label="Label" status="Status" />
          <InlineBanner variant="Warning" contrast="High" label="Label" status="Status" />
          <InlineBanner variant="Error" contrast="High" label="Label" status="Status" />
          <Headings size="Heading 5">Low Contrast</Headings>
          <InlineBanner variant="Information" contrast="Low" label="Label" status="Status" />
          <InlineBanner variant="Success" contrast="Low" label="Label" status="Status" />
          <InlineBanner variant="Disabled" contrast="Low" label="Label" status="Status" />
        </StackExamples>
      );
    case 'alert':
      return (
        <StackExamples>
          {(['Information', 'Success', 'Error', 'Warning', 'No Status'] as const).map((type) => (
            <Alert
              key={type}
              type={type}
              title={`${type} alert`}
              description="Use concise supporting text that tells users what changed."
              onDismiss={() => {}}
            />
          ))}
        </StackExamples>
      );
    case 'toast':
      return (
        <StackExamples>
          <InlineExamples>
            <Button variant="Primary" onClick={() => setToastType('Success')}>Success Toast</Button>
            <Button variant="Destructive" onClick={() => setToastType('Error')}>Error Toast</Button>
            <Button variant="Secondary" onClick={() => setToastType('Info')}>Info Toast</Button>
            <Button variant="Secondary" onClick={() => setToastType('Warning')}>Warning Toast</Button>
            <Button variant="Secondary" onClick={() => setToastType('NoStatus')}>No Status Toast</Button>
          </InlineExamples>
          {toastType && (
            <Toast
              type={toastType}
              message={`This is a ${toastType.toLowerCase()} toast message.`}
              visible
              onDismiss={() => setToastType(null)}
              actions={toastType === 'Success' ? [
                { label: 'Review', variant: 'Primary', onClick: () => setToastType(null) },
                { label: 'Dismiss', variant: 'Secondary', onClick: () => setToastType(null) },
              ] : undefined}
            />
          )}
        </StackExamples>
      );
  }
}

export function ComponentDocsPage({ doc }: { doc: ComponentDoc }) {
  const content = COMPONENT_PAGE_CONTENT[doc.id];
  const [activeSection, setActiveSection] = useState('preview');
  const isProgrammaticScrollRef = useRef(false);
  const navItems = useMemo(() => getSectionNav(content), [content]);

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
          .component-docs-layout { grid-template-columns: minmax(0, 1fr) !important; }
          .component-docs-toc { display: none !important; }
        }
      `}</style>

      <div
        className="component-docs-layout"
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
            {doc.id === 'cp-workspace-shell' ? (
              <PrimaryPreview id={doc.id} />
            ) : (
              <PreviewFrame size={content.previewSize}>
                <PrimaryPreview id={doc.id} />
              </PreviewFrame>
            )}
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

          {content.supplemental?.map((section) => (
            <DocsSection key={section.id} id={section.id} title={section.title}>
              <BulletList items={section.items} />
            </DocsSection>
          ))}

          <DocsSection id="variants" title="Variants & States">
            <VariantExamples id={doc.id} />
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
          className="component-docs-toc"
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
