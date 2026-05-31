import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Alert,
  Avatar,
  AvatarStack,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Carat,
  Checkbox,
  Chip,
  CountryFlag,
  CurrencyInput,
  DateInput,
  DocumentGlyph,
  Dropdown,
  Dropzone,
  FA,
  FaIcon,
  FileItem,
  Filter,
  Headings,
  IconButton,
  InlineBanner,
  Input,
  LegendLabel,
  LinkText,
  MultiStateButton,
  MultiStateGroup,
  MultiSelectDropdown,
  Overlay,
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
  ToolNextStepsCard,
  Tooltip,
  type TableColumn,
} from './index';

interface Row {
  id: string;
  name: string;
}

const columns: TableColumn<Row>[] = [
  { id: 'name', header: 'Name', render: (row) => row.name },
];

function InputsSmoke() {
  const [value, setValue] = useState('');
  const [radioValue, setRadioValue] = useState('a');
  const [multiValue, setMultiValue] = useState<string[]>([]);

  return (
    <>
      <Input ariaLabel="Input smoke" value={value} onChange={setValue} />
      <Textbox label="Textbox smoke" value={value} onChange={setValue} />
      <TextArea label="Textarea smoke" value={value} onChange={setValue} />
      <Searchbox ariaLabel="Search smoke" value={value} onChange={setValue} />
      <DateInput ariaLabel="Date smoke" value={value} onChange={setValue} />
      <CurrencyInput label="Currency smoke" value={value} onChange={setValue} />
      <Dropdown
        label="Dropdown smoke"
        value={value}
        onChange={setValue}
        options={[{ label: 'Option A', value: 'a' }]}
      />
      <MultiSelectDropdown
        label="Multi select smoke"
        value={multiValue}
        onChange={setMultiValue}
        options={[{ label: 'Option A', value: 'a' }]}
      />
      <Checkbox checked={false} label="Checkbox smoke" onChange={() => {}} />
      <RadioGroup value={radioValue} name="radio-smoke" onChange={setRadioValue} ariaLabel="Radio smoke group">
        <Radio value="a" checked={false} onChange={() => {}} label="Radio smoke" />
      </RadioGroup>
      <Toggle checked={false} label="Toggle smoke" onChange={() => {}} />
      <Dropzone ariaLabel="Dropzone smoke" onFileSelected={() => {}} />
    </>
  );
}

describe('Orbit public component smoke coverage', () => {
  it('renders every public component at least once', () => {
    render(
      <div>
        <Headings size="Heading 4">Heading smoke</Headings>
        <Text as="p">Text smoke</Text>
        <FaIcon icon={FA.check} />
        <Carat />
        <Required />
        <LegendLabel value="Legend smoke" />
        <Separator />

        <Button>Button smoke</Button>
        <IconButton ariaLabel="Icon smoke" icon={<span aria-hidden="true">I</span>} />
        <LinkText label="Link smoke" href="#link-smoke" />
        <MultiStateGroup value="one">
          <MultiStateButton value="one" label="Multi smoke" />
        </MultiStateGroup>

        <Card>
          <Text>Card smoke</Text>
        </Card>
        <Avatar name="Ada Lovelace" />
        <AvatarStack avatars={[{ name: 'Ada Lovelace', initials: 'AL' }, { name: 'Grace Hopper', initials: 'GH' }]} />
        <FileItem filename="file.pdf" documentType="PDF" />
        <CountryFlag country="GB" countryName="United Kingdom" />
        <Table columns={columns} rows={[{ id: '1', name: 'Row smoke' }]} getRowKey={(row) => row.id} />

        <Badge label="Badge smoke" />
        <Chip label="Chip smoke" />
        <Filter label="Filter smoke" />
        <StatusIndicator status="Success" label="Status smoke" />
        <StepCircle status="Checked" size="Large" ariaLabel="Step smoke" />
        <RadialIndicator ariaLabel="Radial smoke" />
        <RiskIndicator level="High" />
        <PriceIndicator value="Price smoke" />
        <DocumentGlyph documentType="PDF" ariaLabel="Document smoke" />
        <Spinner label="Spinner smoke" />

        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Current' }]} />
        <TabButton active>Tab smoke</TabButton>
        <QuickFilterGroup>
          <QuickFilterItem label="Filter smoke" />
        </QuickFilterGroup>
        <SideNav
          appName="Orbit"
          clientName="Efficio"
          userName="Ada Lovelace"
          userInitials="AL"
          navItems={[{ id: 'home', icon: FA.user, label: 'Nav smoke' }]}
        />
        <PageHeader title="Page header smoke" />

        <Alert type="Information" title="Alert smoke" />
        <InlineBanner variant="Information" label="Inline smoke" />
        <Toast type="Info" message="Toast smoke" visible />
        <Overlay visible={false} onClose={() => {}}>
          Hidden overlay
        </Overlay>
        <Tooltip content="Tooltip smoke">
          <Button>Tooltip trigger smoke</Button>
        </Tooltip>

        <ToolNextStepsCard title="Tool card smoke" actions={[]} />
        <InputsSmoke />
      </div>,
    );

    expect(screen.getByText('Heading smoke')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Button smoke' })).toBeInTheDocument();
    expect(screen.getByText('Tool card smoke')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Input smoke' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
});
