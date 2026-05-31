'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  AvatarStack,
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Chip,
  CountryFlag,
  DocumentGlyph,
  Headings,
  IconButton,
  InlineBanner,
  CurrencyInput,
  DateInput,
  Dropzone,
  Dropdown,
  FileItem,
  Filter,
  Input,
  Searchbox,
  TextArea,
  Textbox,
  Text,
  LinkText,
  Carat,
  Required,
  LegendLabel,
  MultiStateButton,
  MultiStateGroup,
  MultiSelectDropdown,
  PriceIndicator,
  QuickFilterItem,
  QuickFilterGroup,
  RadialIndicator,
  Radio,
  RadioGroup,
  RiskIndicator,
  Separator,
  StatusIndicator,
  StepCircle,
  TabButton,
  Toast,
  Toggle,
  Tooltip,
  SideNav,
  Spinner,
  Table,
  PageHeader,
  HeaderPresets,
  FaIcon,
  ToolNextStepsCard,
  type TableColumn,
} from '@efficio/orbit';
import { DesignSystemShell } from './DesignSystemShell';

/* ------------------------------------------------------------------ */
/*  Sidebar navigation data                                            */
/* ------------------------------------------------------------------ */

const NAV_GROUPS: { group: string; items: { label: string; id: string }[] }[] = [
  {
    group: 'Foundations',
    items: [
      { label: 'Typography', id: 'typography' },
      { label: 'Links', id: 'links' },
      { label: 'Form Elements', id: 'form-elements' },
    ],
  },
  {
    group: 'Actions',
    items: [
      { label: 'Buttons', id: 'buttons' },
      { label: 'Icon Buttons', id: 'icon-buttons' },
      { label: 'Tab Buttons', id: 'tab-buttons' },
      { label: 'Quick Filters', id: 'quick-filters' },
      { label: 'MultiState Buttons', id: 'multistate-buttons' },
    ],
  },
  {
    group: 'Inputs',
    items: [
      { label: 'Text Input', id: 'text-input' },
      { label: 'Textbox', id: 'textbox' },
      { label: 'Text Area', id: 'text-area' },
      { label: 'Searchbox', id: 'searchbox' },
      { label: 'Dropzone', id: 'dropzone' },
      { label: 'Date Input', id: 'date-input' },
      { label: 'Currency Input', id: 'currency-input' },
      { label: 'Dropdown', id: 'dropdown' },
      { label: 'Multi-select Dropdown', id: 'multi-select-dropdown' },
      { label: 'Checkbox', id: 'checkbox' },
      { label: 'Radio', id: 'radio' },
      { label: 'Toggle', id: 'toggle' },
    ],
  },
  {
    group: 'Data Display',
    items: [
      { label: 'Card', id: 'card' },
      { label: 'Table', id: 'table' },
      { label: 'Avatar', id: 'avatar' },
      { label: 'Status Indicator', id: 'status-indicator' },
      { label: 'Chip', id: 'chip' },
      { label: 'Filter', id: 'filter' },
      { label: 'Indicators', id: 'indicators' },
      { label: 'Document Glyph', id: 'document-glyph' },
      { label: 'File Item', id: 'file-item' },
      { label: 'Country Flag', id: 'country-flag' },
      { label: 'Tooltip', id: 'tooltip' },
    ],
  },
  {
    group: 'Tool Mode',
    items: [
      { label: 'Next Steps Card', id: 'tool-next-steps-card' },
    ],
  },
  {
    group: 'Navigation',
    items: [
      { label: 'Page Header', id: 'page-header' },
      { label: 'Side Nav', id: 'side-nav' },
      { label: 'Breadcrumb', id: 'breadcrumb' },
      { label: 'Separator', id: 'separator' },
    ],
  },
  {
    group: 'Feedback',
    items: [
      { label: 'Inline Banner', id: 'inline-banner' },
      { label: 'Alert Block', id: 'alert' },
      { label: 'Toast', id: 'toast' },
    ],
  },
];

const ALL_IDS = NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id));

interface ShowcaseTableRow {
  id: string;
  initiative: string;
  sector: string;
  owner: string;
}

const SHOWCASE_TABLE_ROWS: ShowcaseTableRow[] = [
  { id: '1', initiative: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Chris Hurley' },
  { id: '2', initiative: 'Fleet Cost Optimisation', sector: 'Operations', owner: 'Maya Patel' },
  { id: '3', initiative: 'Cloud Contract Consolidation', sector: 'Technology', owner: 'Daniel Green' },
];

const SHOWCASE_TABLE_COLUMNS: TableColumn<ShowcaseTableRow>[] = [
  { id: 'initiative', header: 'Initiative name', render: (row) => row.initiative },
  { id: 'sector', header: 'Sector', render: (row) => row.sector },
  { id: 'owner', header: 'Owner', render: (row) => row.owner },
];

/* ------------------------------------------------------------------ */
/*  Helper components                                                   */
/* ------------------------------------------------------------------ */

function DocSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      style={{
        marginBottom: 64,
        paddingBottom: 48,
        borderBottom: '1px solid var(--orbit-color-border-default)',
        scrollMarginTop: 24,
      }}
    >
      <Headings size="Heading 3">{title}</Headings>
      <p style={{ fontSize: 14, color: 'var(--orbit-color-text-secondary)', marginTop: 4, marginBottom: 20 }}>
        {description}
      </p>
      {children}
    </div>
  );
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--orbit-color-text-secondary)',
            marginBottom: 8,
            fontWeight: 600,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function DesignSystemPage() {
  /* --- state (unchanged) --- */
  const [inputValue, setInputValue] = useState('');
  const [filledInput, setFilledInput] = useState('Hello World');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [toastType, setToastType] = useState<'Success' | 'Error' | 'Info' | 'Warning' | 'Mute' | 'NoStatus' | null>(null);
  const [toggleOn, setToggleOn] = useState(true);
  const [toggleOff, setToggleOff] = useState(false);
  const [textboxVal, setTextboxVal] = useState('');
  const [textboxFilled, setTextboxFilled] = useState('Hello World');
  const [textareaVal, setTextareaVal] = useState('');
  const [textareaFilled, setTextareaFilled] = useState('Some filled content here');
  const [searchVal, setSearchVal] = useState('');
  const [searchFilled, setSearchFilled] = useState('Search...');
  const [dropzoneFile, setDropzoneFile] = useState('');
  const [dateVal, setDateVal] = useState('');
  const [currencyVal, setCurrencyVal] = useState('');
  const [currencyFilled, setCurrencyFilled] = useState('1,250.00');
  const [dropdownVal, setDropdownVal] = useState('');
  const [dropdownFilled, setDropdownFilled] = useState('opt2');
  const [multiSelectVal, setMultiSelectVal] = useState<string[]>(['opt2']);
  const [radioVal, setRadioVal] = useState('one');
  const [tablePage, setTablePage] = useState(1);
  const [tableSort, setTableSort] = useState<'asc' | 'desc'>('asc');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [multiStateActive, setMultiStateActive] = useState('overview');
  const [mode, setMode] = useState<'efficio' | 'orbit'>('efficio');

  /* --- active sidebar section tracking --- */
  const [activeSection, setActiveSection] = useState<string>(ALL_IDS[0]);
  const [isUserClicking, setIsUserClicking] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Scroll the active sidebar link into view when active section changes
  useEffect(() => {
    if (!sidebarRef.current) return;
    const activeLink = sidebarRef.current.querySelector(`[data-section-id="${activeSection}"]`) as HTMLElement;
    if (activeLink) {
      activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeSection]);

  // IntersectionObserver to track which section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't override active section while user is clicking (scrolling to target)
        if (isUserClicking) return;

        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const sorted = visible.sort((a, b) => {
            const ai = ALL_IDS.indexOf(a.target.id);
            const bi = ALL_IDS.indexOf(b.target.id);
            return ai - bi;
          });
          setActiveSection(sorted[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    ALL_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isUserClicking]);

  // Handle sidebar link click — disable observer briefly so it doesn't fight
  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsUserClicking(true);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Re-enable observer after scroll completes
    setTimeout(() => setIsUserClicking(false), 800);
  };

  return (
    <DesignSystemShell
      mode={mode}
      onModeChange={setMode}
      title="Orbit Design System"
      subtitle="Component library showcase"
      currentPage="components"
      navGroups={NAV_GROUPS}
      activeSection={activeSection}
      onNavItemClick={handleNavClick}
      sidebarRef={sidebarRef}
      contentPadding="calc(var(--orbit-space-l) + var(--orbit-space-s)) var(--orbit-space-mega)"
    >

        {/* ======================================================== */}
        {/*  FOUNDATIONS                                               */}
        {/* ======================================================== */}

        {/* Typography */}
        <DocSection id="typography" title="Typography" description="Heading, body, and small text styles used across the system.">
          <Row label="Headings">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', minWidth: 80 }}>Heading 1</span>
                <Headings size="Heading 1">Heading 1</Headings>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', minWidth: 80 }}>Heading 2</span>
                <Headings size="Heading 2">Heading 2</Headings>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', minWidth: 80 }}>Heading 3</span>
                <Headings size="Heading 3">Heading 3</Headings>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', minWidth: 80 }}>Heading 4</span>
                <Headings size="Heading 4">Heading 4</Headings>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', minWidth: 80 }}>Heading 5</span>
                <Headings size="Heading 5">Heading 5</Headings>
              </div>
            </div>
          </Row>
          <Row label="Body Text">
            <Text variant="Primary">Primary</Text>
            <Text variant="Secondary">Secondary</Text>
            <Text variant="Bold">Bold</Text>
            <Text variant="Error">Error</Text>
            <Text variant="Information">Information</Text>
            <Text variant="Warning">Warning</Text>
            <Text variant="Disabled">Disabled</Text>
          </Row>
          <Row label="Small Text">
            <Text size="Small" variant="Primary">Primary</Text>
            <Text size="Small" variant="Bold">Bold</Text>
            <Text size="Small" variant="Secondary">Secondary</Text>
            <Text size="Small" variant="Disabled">Disabled</Text>
          </Row>
        </DocSection>

        {/* Links */}
        <DocSection id="links" title="Links" description="Inline link styles for primary, secondary, and heading contexts.">
          <Row label="Styles">
            <LinkText label="Primary link" variant="Primary" />
            <LinkText label="Secondary link" variant="Secondary" />
            <LinkText label="Heading link" variant="Heading" />
          </Row>
        </DocSection>

        {/* Form Elements */}
        <DocSection id="form-elements" title="Form Elements" description="Shared form primitives: required indicators and carat separators.">
          <Row>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text variant="Primary">Text</Text>
              <Carat />
              <Text variant="Primary">Text</Text>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Text variant="Primary">Field label</Text>
              <Required />
            </span>
          </Row>
        </DocSection>

        {/* ======================================================== */}
        {/*  ACTIONS                                                   */}
        {/* ======================================================== */}

        {/* Buttons */}
        <DocSection id="buttons" title="Buttons" description="Primary actions, secondary options, and destructive operations.">
          <Row label="Variants">
            <Button variant="Primary">Primary</Button>
            <Button variant="Secondary">Secondary</Button>
            <Button variant="Tertiary">Tertiary</Button>
            <Button variant="Positive">Positive</Button>
            <Button variant="Destructive">Destructive</Button>
          </Row>
          <Row label="Sizes">
            <Button variant="Primary" size="Medium">Medium</Button>
            <Button variant="Primary" size="Small">Small</Button>
          </Row>
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 12,
                color: 'var(--orbit-color-text-secondary)',
                marginBottom: 8,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}
            >
              States
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr 1fr 1fr',
                gap: '12px 24px',
                alignItems: 'center',
              }}
            >
              {/* header row */}
              <div />
              <div style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontWeight: 600 }}>Default</div>
              <div style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontWeight: 600 }}>Hover</div>
              <div style={{ fontSize: 11, color: 'var(--orbit-color-text-secondary)', fontWeight: 600 }}>Disabled</div>
              {/* Primary */}
              <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)' }}>Primary</div>
              <div><Button variant="Primary" state="Default">Default</Button></div>
              <div><Button variant="Primary" state="Hover">Hover</Button></div>
              <div><Button variant="Primary" state="Disabled">Disabled</Button></div>
              {/* Secondary */}
              <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)' }}>Secondary</div>
              <div><Button variant="Secondary" state="Default">Default</Button></div>
              <div><Button variant="Secondary" state="Hover">Hover</Button></div>
              <div><Button variant="Secondary" state="Disabled">Disabled</Button></div>
              {/* Tertiary */}
              <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)' }}>Tertiary</div>
              <div><Button variant="Tertiary" state="Default">Default</Button></div>
              <div><Button variant="Tertiary" state="Hover">Hover</Button></div>
              <div><Button variant="Tertiary" state="Disabled">Disabled</Button></div>
            </div>
          </div>
          <Row label="With Icons">
            <Button variant="Primary" icon={<FaIcon icon={'\uf118'} size={16} color="var(--orbit-color-white)" />}>Left icon</Button>
            <Button variant="Primary" iconRight={<FaIcon icon={'\uf118'} size={16} color="var(--orbit-color-white)" />}>Right Icon</Button>
          </Row>
          <Row label="Secondary with Icons">
            <Button variant="Secondary" icon={<FaIcon icon={'\uf118'} size={16} />}>Left icon</Button>
            <Button variant="Secondary" iconRight={<FaIcon icon={'\uf118'} size={16} />}>Right Icon</Button>
          </Row>
        </DocSection>

        {/* Icon Buttons */}
        <DocSection id="icon-buttons" title="Icon Buttons" description="Compact icon-only action buttons in multiple sizes and variants.">
          <Row label="Variants">
            <IconButton variant="Primary" ariaLabel="Primary" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Secondary" ariaLabel="Secondary" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Tertiary" ariaLabel="Tertiary" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Positive" ariaLabel="Positive" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Destructive" ariaLabel="Destructive" icon={<FaIcon icon={'\uf118'} size={16} />} />
          </Row>
          <Row label="Sizes">
            <IconButton variant="Primary" size="Small" ariaLabel="Small" icon={<FaIcon icon={'\uf118'} size={12} />} />
            <IconButton variant="Primary" size="Medium" ariaLabel="Medium" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Primary" size="Large" ariaLabel="Large" icon={<FaIcon icon={'\uf118'} size={16} />} />
          </Row>
          <Row label="Primary States">
            <IconButton variant="Primary" state="Default" ariaLabel="Default" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Primary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Primary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={'\uf118'} size={16} />} />
          </Row>
          <Row label="Secondary States">
            <IconButton variant="Secondary" state="Default" ariaLabel="Default" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Secondary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Secondary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={'\uf118'} size={16} />} />
          </Row>
          <Row label="Tertiary States">
            <IconButton variant="Tertiary" state="Default" ariaLabel="Default" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Tertiary" state="Hover" ariaLabel="Hover" icon={<FaIcon icon={'\uf118'} size={16} />} />
            <IconButton variant="Tertiary" state="Disabled" ariaLabel="Disabled" icon={<FaIcon icon={'\uf118'} size={16} />} />
          </Row>
        </DocSection>

        {/* Tab Buttons */}
        <DocSection id="tab-buttons" title="Tab Buttons" description="Segmented navigation tabs with active, hover, and disabled states.">
          <Row>
            {['Overview', 'Details', 'History'].map((tab, i) => (
              <TabButton key={tab} active={activeTab === i} onClick={() => setActiveTab(i)}>
                {tab}
              </TabButton>
            ))}
          </Row>
          <Row label="All Variants">
            <TabButton active={false} status="Rest">Label</TabButton>
            <TabButton active={false} status="Hover">Label</TabButton>
            <TabButton active={true} status="Hover">Label</TabButton>
            <TabButton active={true}>Label</TabButton>
            <TabButton active={false} status="Disabled">Label</TabButton>
            <TabButton active={true} status="Disabled">Label</TabButton>
          </Row>
        </DocSection>

        {/* Quick Filters */}
        <DocSection id="quick-filters" title="Quick Filters" description="Toggle-style filter chips for narrowing data views.">
          <Row label="Default Group">
            <QuickFilterGroup>
              <QuickFilterItem label="One" />
              <QuickFilterItem label="Two" />
              <QuickFilterItem label="Three" />
            </QuickFilterGroup>
          </Row>
          <Row label="Interactive (click to toggle)">
            <QuickFilterGroup>
              {['Category', 'Region', 'Status', 'Risk Level'].map((f) => (
                <QuickFilterItem
                  key={f}
                  label={f}
                  selected={selectedFilters.includes(f)}
                  onClick={() =>
                    setSelectedFilters((prev) =>
                      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
                    )
                  }
                />
              ))}
            </QuickFilterGroup>
          </Row>
          <Row label="States">
            <QuickFilterItem label="Default" />
            <QuickFilterItem label="Selected" selected />
          </Row>
        </DocSection>

        {/* MultiState Buttons */}
        <DocSection id="multistate-buttons" title="MultiState Buttons" description="Grouped toggle buttons for switching between related views.">
          <Row label="Individual States">
            <MultiStateButton value="selected" label="MultiState Button" selected />
            <MultiStateButton value="default" label="MultiState Button" />
            <MultiStateButton value="disabled" label="MultiState Button" disabled />
          </Row>
          <Row label="MultiState Group (interactive)">
            <MultiStateGroup value={multiStateActive} onValueChange={setMultiStateActive}>
              {['Overview', 'Details', 'Analytics', 'Settings', 'Export'].map((item) => (
                <MultiStateButton
                  key={item}
                  value={item.toLowerCase()}
                  label={item}
                />
              ))}
            </MultiStateGroup>
          </Row>
          <Row label="With Count">
            <MultiStateGroup defaultValue="all">
              <MultiStateButton value="all" label="All" count={42} />
              <MultiStateButton value="active" label="Active" count={18} />
              <MultiStateButton value="pending" label="Pending" count={7} />
            </MultiStateGroup>
          </Row>
        </DocSection>

        {/* ======================================================== */}
        {/*  INPUTS                                                    */}
        {/* ======================================================== */}

        {/* Text Input */}
        <DocSection id="text-input" title="Text Input" description="Single-line text input with default, filled, error, and disabled states.">
          <Row label="States">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ width: 240 }}>
                <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginBottom: 4 }}>Default</div>
                <Input ariaLabel="Default text input" placeholder="Placeholder text" value={inputValue} onChange={setInputValue} />
              </div>
              <div style={{ width: 240 }}>
                <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginBottom: 4 }}>Filled</div>
                <Input ariaLabel="Filled text input" placeholder="Placeholder" value={filledInput} onChange={setFilledInput} />
              </div>
              <div style={{ width: 240 }}>
                <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginBottom: 4 }}>Error</div>
                <Input ariaLabel="Error text input" invalid placeholder="Error state" value="Invalid input" onChange={() => {}} />
              </div>
              <div style={{ width: 240 }}>
                <div style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginBottom: 4 }}>Disabled</div>
                <Input ariaLabel="Disabled text input" disabled placeholder="Disabled" value="" onChange={() => {}} />
              </div>
            </div>
          </Row>
        </DocSection>

        {/* Textbox */}
        <DocSection id="textbox" title="Textbox" description="Labelled text input with helper text, validation, and multiple states.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Textbox label="Label" message="Helper text" placeholder="Enter text" value={textboxVal} onChange={setTextboxVal} />
            <Textbox label="Label" message="Helper text" placeholder="Enter text" value={textboxFilled} onChange={setTextboxFilled} />
            <Textbox label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} disabled />
            <Textbox label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} locked />
            <Textbox label="Label" message="Error message" placeholder="Enter text" value="Invalid" onChange={() => {}} invalid />
            <Textbox label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} required />
          </div>
        </DocSection>

        {/* Text Area */}
        <DocSection id="text-area" title="Text Area" description="Multi-line text input with character count and validation.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <TextArea label="Label" message="Helper text" placeholder="Enter text" value={textareaVal} onChange={setTextareaVal} maxLength={250} />
            <TextArea label="Label" message="Helper text" value={textareaFilled} onChange={setTextareaFilled} maxLength={250} />
            <TextArea label="Label" message="Helper text" placeholder="Enter text" value="" onChange={() => {}} disabled maxLength={250} />
            <TextArea label="Label" message="Error message" value="Invalid content" onChange={() => {}} invalid maxLength={250} />
          </div>
        </DocSection>

        {/* Searchbox */}
        <DocSection id="searchbox" title="Searchbox" description="Search-specific input with icon and clearable state.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Searchbox ariaLabel="Default search input" placeholder="Search..." value={searchVal} onChange={setSearchVal} />
            <Searchbox ariaLabel="Filled search input" placeholder="Search..." value={searchFilled} onChange={setSearchFilled} />
            <Searchbox ariaLabel="Disabled search input" placeholder="Search..." value="" onChange={() => {}} disabled />
            <Searchbox ariaLabel="Error search input" placeholder="Search..." value="" onChange={() => {}} invalid />
          </div>
        </DocSection>

        {/* Dropzone */}
        <DocSection id="dropzone" title="Dropzone" description="File upload drop area with click and drag/drop support.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Dropzone
              ariaLabel="Upload contract file"
              accept=".pdf"
              onFileSelected={(file) => setDropzoneFile(file.name)}
              promptPrefix="Drag & drop or choose file"
              chooseButtonLabel="choose files"
              promptSuffix="to upload"
              acceptedFileTypesLabel="File types supported: PDF"
              maxFileSizeLabel="Maximum upload file size: 100 MB"
            />
            <Dropzone
              ariaLabel="Upload disabled file"
              accept=".pdf"
              disabled
              onFileSelected={() => {}}
              promptPrefix="Drag & drop or choose file"
              chooseButtonLabel="choose files"
              promptSuffix="to upload"
              acceptedFileTypesLabel="File types supported: PDF"
              maxFileSizeLabel="Maximum upload file size: 100 MB"
              error="Upload is disabled in this state."
            />
          </div>
          {dropzoneFile && (
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--orbit-color-text-secondary)' }}>
              Selected file: {dropzoneFile}
            </p>
          )}
        </DocSection>

        {/* Date Input */}
        <DocSection id="date-input" title="Date Input" description="Date picker input with multiple interaction states.">
          <Row label="States">
            <DateInput ariaLabel="Default date input" value={dateVal} onChange={setDateVal} />
            <DateInput ariaLabel="Hover date input" value="" onChange={() => {}} previewState="hover" />
            <DateInput ariaLabel="Focused date input" value="" onChange={() => {}} previewState="focus" />
            <DateInput ariaLabel="Filled date input" value="24-03-30" onChange={() => {}} />
            <DateInput ariaLabel="Disabled date input" value="" onChange={() => {}} disabled />
            <DateInput ariaLabel="Error date input" value="" onChange={() => {}} invalid />
          </Row>
        </DocSection>

        {/* Currency Input */}
        <DocSection id="currency-input" title="Currency Input" description="Numeric input formatted for currency values with locale support.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <CurrencyInput label="Label" message="Helper text" value={currencyVal} onChange={setCurrencyVal} currency="GBP" />
            <CurrencyInput label="Label" message="Helper text" value={currencyFilled} onChange={setCurrencyFilled} currency="GBP" />
            <CurrencyInput label="Label" message="Helper text" value="" onChange={() => {}} currency="GBP" disabled />
            <CurrencyInput label="Label" message="Error message" value="Invalid" onChange={() => {}} currency="GBP" invalid />
          </div>
        </DocSection>

        {/* Dropdown */}
        <DocSection id="dropdown" title="Dropdown" description="Select input with searchable options and validation.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Dropdown
              label="Label"
              message="Helper text"
              options={[{ label: 'Option 1', value: 'opt1' }, { label: 'Option 2', value: 'opt2' }, { label: 'Option 3', value: 'opt3' }]}
              value={dropdownVal}
              onChange={setDropdownVal}
              required
            />
            <Dropdown
              label="Label"
              message="Helper text"
              options={[{ label: 'Option 1', value: 'opt1' }, { label: 'Option 2', value: 'opt2' }, { label: 'Option 3', value: 'opt3' }]}
              value={dropdownFilled}
              onChange={setDropdownFilled}
            />
            <Dropdown
              label="Label"
              message="Helper text"
              options={[]}
              value=""
              onChange={() => {}}
              disabled
            />
            <Dropdown
              label="Label"
              message="Error message"
              options={[{ label: 'Option 1', value: 'opt1' }]}
              value=""
              onChange={() => {}}
              invalid
              required
            />
          </div>
        </DocSection>

        {/* Multi-select Dropdown */}
        <DocSection id="multi-select-dropdown" title="Multi-select Dropdown" description="Multi-value select input with removable selected-value chips.">
          <div style={{ maxWidth: 520 }}>
            <MultiSelectDropdown
              label="Label"
              options={[{ label: 'Option 1', value: 'opt1' }, { label: 'Option 2', value: 'opt2' }, { label: 'Option 3', value: 'opt3' }]}
              value={multiSelectVal}
              onChange={setMultiSelectVal}
              required
            />
          </div>
        </DocSection>

        {/* Checkbox */}
        <DocSection id="checkbox" title="Checkbox" description="Binary selection control with label alignment options.">
          <Row>
            <Checkbox checked={checkboxChecked} onChange={setCheckboxChecked} label="Interactive checkbox" />
            <Checkbox checked={true} onChange={() => {}} label="Checked" />
            <Checkbox checked={false} onChange={() => {}} label="Unchecked" />
            <Checkbox checked={false} state="Disabled" onChange={() => {}} label="Disabled" />
          </Row>
          <Row label="Alignment">
            <Checkbox checked={true} alignment="Left" onChange={() => {}} label="Left aligned" />
            <Checkbox checked={true} alignment="Right" onChange={() => {}} label="Right aligned" />
          </Row>
        </DocSection>

        {/* Radio */}
        <DocSection id="radio" title="Radio" description="Single-choice selection control with grouped keyboard navigation.">
          <RadioGroup value={radioVal} name="docs-radio" ariaLabel="Radio examples" onChange={setRadioVal}>
            <Radio value="one" checked={false} onChange={() => {}} label="Option one" />
            <Radio value="two" checked={false} onChange={() => {}} label="Option two" />
            <Radio value="three" checked={false} onChange={() => {}} label="Option three" state="Disabled" />
          </RadioGroup>
        </DocSection>

        {/* Toggle */}
        <DocSection id="toggle" title="Toggle" description="On/off switch for binary settings.">
          <Row label="Active">
            <Toggle checked={toggleOn} onChange={setToggleOn} label="Label" />
            <Toggle checked={toggleOff} onChange={setToggleOff} label="Label" />
          </Row>
          <Row label="Alignment">
            <Toggle checked={true} onChange={() => {}} label="Label" alignment="Left" />
            <Toggle checked={true} onChange={() => {}} label="Label" alignment="Right" />
          </Row>
          <Row label="Disabled">
            <Toggle checked={true} state="Disabled" onChange={() => {}} label="Label" />
            <Toggle checked={false} state="Disabled" onChange={() => {}} label="Label" />
          </Row>
        </DocSection>

        {/* ======================================================== */}
        {/*  DATA DISPLAY                                              */}
        {/* ======================================================== */}

        {/* Card */}
        <DocSection id="card" title="Card" description="Content container with multiple padding levels and state variants.">
          <Row label="Static Card">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {(['Base', 'Medium', 'Small'] as const).map((pad) => (
                <Card key={pad} type="Static" padding={pad} style={{ width: 200 }}>
                  <Headings size="Heading 5">Padding: {pad}</Headings>
                  <p style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginTop: 4 }}>Static card</p>
                </Card>
              ))}
            </div>
          </Row>
          <Row label="Dynamic Card -- Default">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {(['Base', 'Medium', 'Small'] as const).map((pad) => (
                <Card key={pad} padding={pad} style={{ width: 200 }}>
                  <Headings size="Heading 5">Padding: {pad}</Headings>
                  <p style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginTop: 4 }}>Dynamic card</p>
                </Card>
              ))}
            </div>
          </Row>
          <Row label="Dynamic Card -- All States">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {(['Default', 'Highlight', 'Accent', 'Disabled', 'Success', 'Warning'] as const).map((st) => (
                <Card key={st} state={st} style={{ width: 180 }}>
                  <Headings size="Heading 5">{st}</Headings>
                  <p style={{ fontSize: 12, color: 'var(--orbit-color-text-secondary)', marginTop: 4 }}>
                    {st} state
                  </p>
                </Card>
              ))}
            </div>
          </Row>
        </DocSection>

        <DocSection id="tool-next-steps-card" title="Tool Next Steps Card" description="Compound card for suggested next actions in guided AI tool flows.">
          <ToolNextStepsCard />
        </DocSection>

        {/* Table */}
        <DocSection id="table" title="Table" description="Tokenised data table with selectable row support.">
          <Table
            ariaLabel="Initiative examples"
            columns={[
              {
                id: 'initiative',
                header: 'Initiative name',
                render: (row: ShowcaseTableRow) => row.initiative,
                sortable: true,
                sortDirection: tableSort,
                onSortChange: setTableSort,
                info: 'Sort by initiative name',
              },
              ...SHOWCASE_TABLE_COLUMNS.slice(1),
            ]}
            rows={SHOWCASE_TABLE_ROWS}
            getRowKey={(row) => row.id}
            onRowSelect={() => {}}
            getRowSelectionLabel={(row) => `Select initiative ${row.initiative}`}
            pagination={{ page: tablePage, pageSize: 10, totalRows: 37, onPageChange: setTablePage }}
          />
        </DocSection>

        {/* Avatar */}
        <DocSection id="avatar" title="Avatar" description="User identity indicator with initials or icon, in multiple sizes.">
          <Row label="Sizes">
            <Avatar name="John Doe" size="Extra Small" initials="JD" />
            <Avatar name="John Doe" size="Small" initials="JD" />
            <Avatar name="John Doe" size="Medium" initials="JD" />
            <Avatar name="John Doe" size="Large" initials="JD" />
          </Row>
          <Row label="Styles">
            <Avatar name="Alice" style="Text" initials="AB" />
            <Avatar name="Bob" style="Icon" initials="BC" />
            <Avatar name="Square Avatar" style="Square" initials="SA" />
          </Row>
          <Row label="Stack">
            <AvatarStack
              max={3}
              avatars={[
                { name: 'Alice Brown', initials: 'AB' },
                { name: 'Bob Chen', initials: 'BC' },
                { name: 'Derek Wong', initials: 'DW' },
                { name: 'Maya Patel', initials: 'MP' },
              ]}
            />
          </Row>
        </DocSection>

        {/* Status Indicator */}
        <DocSection id="status-indicator" title="Status Indicator" description="Coloured dot with label to convey item status at a glance.">
          <Row>
            <StatusIndicator status="Success" label="Success" />
            <StatusIndicator status="Warning" label="Warning" />
            <StatusIndicator status="Information" label="Information" />
            <StatusIndicator status="Error" label="Error" />
            <StatusIndicator status="No Status" label="No Status" />
          </Row>
        </DocSection>

        {/* Chip */}
        <DocSection id="chip" title="Chip" description="Compact label for categorisation, status, or metadata.">
          <Row label="Default Chips">
            <Chip variant="Information" label="Label" />
            <Chip variant="Success" label="Label" />
            <Chip variant="Warning" label="Label" />
            <Chip variant="Error" label="Label" />
            <Chip variant="Additional" label="Label" />
            <Chip variant="No Status" label="Label" />
            <Chip variant="Outline" label="Label" />
            <Chip variant="Disabled" label="Label" />
          </Row>
          <Row label="Mini Chips">
            <Chip size="Mini" variant="Information" label="Label" />
            <Chip size="Mini" variant="Success" label="Label" />
            <Chip size="Mini" variant="Warning" label="Label" />
            <Chip size="Mini" variant="Error" label="Label" />
            <Chip size="Mini" variant="Additional" label="Label" />
            <Chip size="Mini" variant="No Status" label="Label" />
            <Chip size="Mini" variant="Outline" label="Label" />
            <Chip size="Mini" variant="Disabled" label="Label" />
          </Row>
        </DocSection>

        {/* Filter */}
        <DocSection id="filter" title="Filter" description="Applied-filter pill with optional remove action.">
          <Row>
            <Filter label="Category: Legal" onRemove={() => {}} />
            <Filter label="Region: Europe" state="Hover" onRemove={() => {}} />
          </Row>
        </DocSection>

        {/* Indicators */}
        <DocSection id="indicators" title="Indicators" description="Badges, price movement, risk levels, legends, status dots, and radial indicators.">
          <Row label="Number Badges">
            <Badge label="99" status="Green" />
            <Badge label="99" status="Red" />
            <Badge label="99" status="Gray" />
            <Badge label="Info" status="Information" />
            <Badge label="Warn" status="Warning" />
          </Row>
          <Row label="Price Indicators">
            <PriceIndicator movement="Positive" value="Value" />
            <PriceIndicator movement="Negative" value="Value" />
            <PriceIndicator movement="None" value="Value" />
          </Row>
          <Row label="Risk & Priority Indicators">
            <RiskIndicator level="Very High" />
            <RiskIndicator level="High" />
            <RiskIndicator level="None" />
            <RiskIndicator level="Medium" />
            <RiskIndicator level="Low" />
            <RiskIndicator level="Very Low" />
          </Row>
          <Row label="Legend Labels">
            <LegendLabel value="Value" color="var(--orbit-color-bright-green)" />
            <LegendLabel value="Value" color="var(--orbit-color-efficio-blue)" />
            <LegendLabel value="Value" color="var(--orbit-color-silver)" />
          </Row>
          <Row label="Status Indicators -- Default">
            <StatusIndicator status="Success" />
            <StatusIndicator status="Information" />
            <StatusIndicator status="Error" />
            <StatusIndicator status="Warning" />
            <StatusIndicator status="No Status" />
          </Row>
          <Row label="Status Indicators -- Small">
            <StatusIndicator status="Success" size="Small" />
            <StatusIndicator status="Information" size="Small" />
            <StatusIndicator status="Error" size="Small" />
            <StatusIndicator status="Warning" size="Small" />
            <StatusIndicator status="No Status" size="Small" />
          </Row>
          <Row label="Radial Indicators">
            <RadialIndicator status="Success" />
            <RadialIndicator status="Information" />
            <RadialIndicator status="Error" />
            <RadialIndicator status="Warning" />
            <RadialIndicator status="No Status" />
          </Row>
          <Row label="Step Circles">
            <StepCircle status="Checked" ariaLabel="Completed step" />
            <StepCircle status="Active" ariaLabel="Active step" />
            <StepCircle status="To Do" ariaLabel="To do step" />
            <StepCircle status="Numbered" label={2} />
            <StepCircle status="Disabled" label={3} />
          </Row>
          <Row label="Spinners">
            <Spinner size="Inline" label="Loading inline" />
            <Spinner size="Medium" label="Loading medium" />
            <Spinner size="Large" label="Loading large" />
          </Row>
        </DocSection>

        {/* Document Glyph */}
        <DocSection id="document-glyph" title="Document Glyph" description="File-type icons at five size tiers for document references.">
          <Row label="Large (64px)">
            <DocumentGlyph documentType="XLS" size="Large" />
            <DocumentGlyph documentType="DOC" size="Large" />
            <DocumentGlyph documentType="PDF" size="Large" />
            <DocumentGlyph documentType="ZIP" size="Large" />
            <DocumentGlyph documentType="IMG" size="Large" />
            <DocumentGlyph documentType="Unknown" size="Large" />
          </Row>
          <Row label="Medium (32px)">
            <DocumentGlyph documentType="XLS" size="Medium" />
            <DocumentGlyph documentType="DOC" size="Medium" />
            <DocumentGlyph documentType="PDF" size="Medium" />
            <DocumentGlyph documentType="ZIP" size="Medium" />
            <DocumentGlyph documentType="IMG" size="Medium" />
            <DocumentGlyph documentType="Unknown" size="Medium" />
          </Row>
          <Row label="Small (24px)">
            <DocumentGlyph documentType="XLS" size="Small" />
            <DocumentGlyph documentType="DOC" size="Small" />
            <DocumentGlyph documentType="PDF" size="Small" />
            <DocumentGlyph documentType="ZIP" size="Small" />
            <DocumentGlyph documentType="IMG" size="Small" />
            <DocumentGlyph documentType="Unknown" size="Small" />
          </Row>
          <Row label="Extra Small (16px)">
            <DocumentGlyph documentType="XLS" size="Extra Small" />
            <DocumentGlyph documentType="DOC" size="Extra Small" />
            <DocumentGlyph documentType="PDF" size="Extra Small" />
            <DocumentGlyph documentType="ZIP" size="Extra Small" />
            <DocumentGlyph documentType="IMG" size="Extra Small" />
            <DocumentGlyph documentType="Unknown" size="Extra Small" />
          </Row>
          <Row label="Micro (8px)">
            <DocumentGlyph documentType="XLS" size="Micro" />
            <DocumentGlyph documentType="DOC" size="Micro" />
            <DocumentGlyph documentType="PDF" size="Micro" />
            <DocumentGlyph documentType="ZIP" size="Micro" />
            <DocumentGlyph documentType="IMG" size="Micro" />
            <DocumentGlyph documentType="Unknown" size="Micro" />
          </Row>
        </DocSection>

        {/* File Item */}
        <DocSection id="file-item" title="File Item" description="Compact selected-file row with document type and truncating filename.">
          <Row>
            <FileItem filename="contract-analysis.pdf" documentType="PDF" fixedWidth={380} />
            <FileItem filename="supplier-data.xlsx" documentType="XLS" />
            <FileItem filename="source-brief.docx" documentType="DOC" onClick={() => {}} />
          </Row>
        </DocSection>

        {/* Country Flag */}
        <DocSection id="country-flag" title="Country Flag" description="ISO country code rendered as a flag icon.">
          <Row>
            <CountryFlag country="US" />
            <CountryFlag country="GB" />
            <CountryFlag country="DE" />
            <CountryFlag country="FR" />
            <CountryFlag country="JP" />
            <CountryFlag country="AU" />
          </Row>
        </DocSection>

        {/* Tooltip */}
        <DocSection id="tooltip" title="Tooltip" description="Contextual hover popover with directional and aligned placements.">
          <Row>
            <Tooltip content="Tooltip on top" direction="top">
              <Button variant="Secondary">Hover me (top)</Button>
            </Tooltip>
            <Tooltip content="Tooltip on bottom" direction="bottom">
              <Button variant="Secondary">Hover me (bottom)</Button>
            </Tooltip>
            <Tooltip content="Tooltip on left" direction="left">
              <Button variant="Secondary">Hover me (left)</Button>
            </Tooltip>
            <Tooltip content="Tooltip on right" direction="right">
              <Button variant="Secondary">Hover me (right)</Button>
            </Tooltip>
            <Tooltip content="Aligned to start" direction="bottom" align="start">
              <Button variant="Secondary">Start aligned</Button>
            </Tooltip>
            <Tooltip content="Aligned to end" direction="bottom" align="end">
              <Button variant="Secondary">End aligned</Button>
            </Tooltip>
          </Row>
        </DocSection>

        {/* ======================================================== */}
        {/*  NAVIGATION                                                */}
        {/* ======================================================== */}

        {/* Page Header */}
        <DocSection id="page-header" title="Page Header" description="Top-level page headers with titles, actions, tabs, and module presets.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 1. Main Header */}
            <PageHeader
              type="main"
              title="Good afternoon, Chris"
              subtitle="Here's your overview for today"
            />

            {/* 2. Main Header with CTAs */}
            <PageHeader
              type="main"
              title="Good afternoon, Chris"
              subtitle="Here's your overview for today"
              actions={[
                { label: 'Efficio support', icon: '\uf07c', variant: 'Secondary' },
                { label: 'Upload data', icon: '\uf07c', variant: 'Secondary' },
                { label: '+ Add Initiative', variant: 'Primary' },
              ]}
            />

            {/* 3. Identify -- ContractLens with tabs */}
            <PageHeader
              title="ContractLens"
              subtitle="AI-powered contract intelligence and insights"
              icon={'\uf013'}
              {...HeaderPresets.identify}
              actions={[{ label: '+ Upload Contracts', variant: 'Primary' }]}
              tabs={[
                { label: 'Contract Pipeline', badge: 3 },
                { label: 'Contract Coverage' },
                { label: 'All Documents' },
              ]}
              defaultActiveTab={0}
            />

            {/* 4. Identify -- ClauseIQ with pill */}
            <PageHeader
              title="ClauseIQ"
              subtitle="Accelerates contract analysis, flagging risks and deviations to best practice"
              icon={'\uf468'}
              {...HeaderPresets.identify}
              pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
            />

            {/* 5. Deliver -- Project Management */}
            <PageHeader
              title="Project Management"
              subtitle="Comprehensive project planning and delivery tools"
              icon={'\uf135'}
              {...HeaderPresets.deliver}
            />

            {/* 6. Deliver -- Delivery Engine with buttons */}
            <PageHeader
              title="Delivery Engine"
              subtitle="E-Hub delivery management system for tracking project execution"
              icon={'\uf013'}
              {...HeaderPresets.deliver}
              actions={[
                { label: 'View documents', icon: '\uf07c', variant: 'Secondary' },
                { label: '+ Add Initiative', variant: 'Primary' },
              ]}
            />

            {/* 7. Deliver -- Delivery Engine collapsed */}
            <PageHeader
              title="Delivery Engine"
              subtitle="E-Hub delivery management system for tracking project execution"
              icon={'\uf013'}
              {...HeaderPresets.deliver}
              actions={[
                { label: 'View documents', icon: '\uf07c', variant: 'IconOnly' },
                { label: '+ Add Initiative', variant: 'Primary' },
              ]}
            />

            {/* 8. Deliver -- Compliance Monitoring */}
            <PageHeader
              title="Compliance Monitoring"
              subtitle="Real-time contract and supplier compliance tracking"
              icon={'\uf46c'}
              {...HeaderPresets.deliver}
            />

            {/* 9. Sustain -- MarketIQ with pill */}
            <PageHeader
              title="MarketIQ"
              subtitle="Research and market insights powered by industry reports and trusted sources"
              icon={'\uf1ea'}
              {...HeaderPresets.sustain}
              pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
            />

            {/* 10. RFP Analytics -- Default with pill */}
            <PageHeader
              title="RFP Analytics"
              subtitle="Select the right tool for the right job"
              icon={'\uf201'}
              {...HeaderPresets.rfp}
              pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
              tabs={[
                { label: 'Consolidate' },
                { label: 'Negotiate' },
                { label: 'Award' },
              ]}
              showTabUnderline={false}
            />

            {/* 11. RFP Analytics -- with tab underline */}
            <PageHeader
              title="RFP Analytics"
              subtitle="Select the right tool for the right job"
              icon={'\uf201'}
              {...HeaderPresets.rfp}
              pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
              tabs={[
                { label: 'Consolidate' },
                { label: 'Negotiate' },
                { label: 'Award' },
              ]}
              showTabUnderline={true}
            />

            {/* 12. RFP Analytics -- no pill, no tabs */}
            <PageHeader
              title="RFP Analytics"
              subtitle="Advanced sourcing insights and scenario modelling"
              icon={'\uf201'}
              {...HeaderPresets.rfp}
            />

            {/* 13. RFP Builder */}
            <PageHeader
              title="RFP Builder"
              subtitle="AI grounded in Efficio's content"
              icon={'\uf201'}
              {...HeaderPresets.rfp}
            />
          </div>
        </DocSection>

        {/* Side Nav */}
        <DocSection id="side-nav" title="Side Nav" description="Application-level sidebar navigation with sections, items, and work history.">
          <div style={{ height: 700, border: '1px solid var(--orbit-color-border-default)', borderRadius: 'var(--orbit-radius-md)', overflow: 'hidden' }}>
            <SideNav
              appName="Efficio Orbit"
              clientName="Yorkshire Water"
              navItems={[
                { id: 'notifications', icon: '\uf0f3', label: 'Notifications', badge: 1 },
                { id: 'home', icon: '\uf015', label: 'Home', active: true },
                { id: 'data-tracker-insights', icon: '\uf1c0', label: 'Data Tracker & Insights' },
                { id: 'document-search', icon: '\uf15b', label: 'Document Search' },
              ]}
              sections={[
                { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)' },
                { id: 'deliver', label: 'Deliver', color: 'var(--orbit-color-header-deliver-from)', expanded: true, items: [
                  { id: 'project-management', icon: '\uf135', label: 'Project Management', active: true },
                  { id: 'route-to-market', icon: '\uf3c5', label: 'Route to Market', muted: true },
                  { id: 'sourcing-execution', icon: '\uf643', label: 'Sourcing Execution', muted: true },
                ]},
                { id: 'sustain', label: 'Sustain', color: 'var(--orbit-color-header-sustain-from)' },
              ]}
              workItems={[
                { id: 'research-agent', title: 'Research Agent (2)', subtitle: '1min ago' },
                { id: 'route-recommendation', title: 'Route Recommendation', subtitle: '2h ago | Legal Tech Platform Up...' },
                { id: 'spend-guard', title: 'Spend Guard', subtitle: '3h ago | Legal Tech Platform Up...' },
                { id: 'rfp-analytics', title: 'RFP Analytics', subtitle: '6h ago | Fleet Cost Optimitisatio...' },
                { id: 'clause-iq', title: 'Clause IQ', subtitle: '1d ago | Fleet Cost Optimitisatio...' },
              ]}
              userName="Chris Hurley"
              userInitials="CH"
            />
          </div>
        </DocSection>

        {/* Breadcrumb */}
        <DocSection id="breadcrumb" title="Breadcrumb" description="Hierarchical path indicator for nested page navigation.">
          <Breadcrumb items={[
            { label: 'Home', href: '#' },
            { label: 'Suppliers', href: '#' },
            { label: 'Acme Corp' },
          ]} />
        </DocSection>

        {/* Separator */}
        <DocSection id="separator" title="Separator" description="Visual divider in horizontal or vertical orientation.">
          <Row label="Horizontal">
            <div style={{ width: '100%' }}>
              <Separator orientation="Horizontal" />
            </div>
          </Row>
          <Row label="Vertical">
            <div style={{ height: 40, display: 'flex', alignItems: 'center' }}>
              <span>Left</span>
              <Separator orientation="Vertical" />
              <span>Right</span>
            </div>
          </Row>
        </DocSection>

        {/* ======================================================== */}
        {/*  FEEDBACK                                                  */}
        {/* ======================================================== */}

        {/* Inline Banner */}
        <DocSection id="inline-banner" title="Inline Banner" description="Contextual message bars in high and low contrast styles.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Headings size="Heading 5">High Contrast</Headings>
            <InlineBanner variant="Information" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="Success" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="Warning" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="Error" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="Style 1" contrast="High" label="Label" status="Status" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
            <Headings size="Heading 5">Low Contrast</Headings>
            <InlineBanner variant="Information" contrast="Low" label="Label" status="Status" />
            <InlineBanner variant="Success" contrast="Low" label="Label" status="Status" />
            <InlineBanner variant="Warning" contrast="Low" label="Label" status="Status" />
            <InlineBanner variant="Error" contrast="Low" label="Label" status="Status" />
            <InlineBanner variant="Style 1" contrast="Low" label="Label" status="Status" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
            <Headings size="Heading 5">Neutral and Disabled</Headings>
            <InlineBanner variant="None" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="No Status" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="Disabled" contrast="High" label="Label" status="Status" />
            <InlineBanner variant="Disabled" contrast="Low" label="Label" status="Status" />
          </div>
        </DocSection>

        {/* Alert */}
        <DocSection id="alert" title="Alert Block" description="Dismissable multiline title and description notifications. Use Inline Banner for the Figma feedback strip.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Alert
              type="Information"
              title="Title"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              onDismiss={() => {}}
            />
            <Alert
              type="Success"
              title="Title"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              onDismiss={() => {}}
            />
            <Alert
              type="Error"
              title="Title"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              onDismiss={() => {}}
            />
            <Alert
              type="Warning"
              title="Title"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              onDismiss={() => {}}
            />
            <Alert
              type="No Status"
              title="Title"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              onDismiss={() => {}}
            />
          </div>
        </DocSection>

        {/* Toast */}
        <DocSection id="toast" title="Toast" description="Ephemeral notification messages triggered by user actions.">
          <Row>
            <Button variant="Primary" onClick={() => setToastType('Success')}>Success Toast</Button>
            <Button variant="Destructive" onClick={() => setToastType('Error')}>Error Toast</Button>
            <Button variant="Secondary" onClick={() => setToastType('Info')}>Info Toast</Button>
            <Button variant="Secondary" onClick={() => setToastType('Warning')}>Warning Toast</Button>
            <Button variant="Secondary" onClick={() => setToastType('NoStatus')}>No Status Toast</Button>
          </Row>
          {toastType && (
            <Toast
              type={toastType}
              message={`This is a ${toastType.toLowerCase()} toast message.`}
              visible={true}
              onDismiss={() => setToastType(null)}
              actions={toastType === 'Success' ? [
                { label: 'Review', variant: 'Primary', onClick: () => setToastType(null) },
                { label: 'Dismiss', variant: 'Secondary', onClick: () => setToastType(null) },
              ] : undefined}
            />
          )}
        </DocSection>
    </DesignSystemShell>
  );
}
