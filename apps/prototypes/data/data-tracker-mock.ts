export type PlaybookStatus = 'Pending' | 'Awaiting Review' | 'Published';
export type InputType = 'template' | 'guidance';

export interface Playbook {
  id: string;
  name: string;
  company: string;
  category: string;
  status: PlaybookStatus;
  dateCreated: string;
  lastUpdated: string;
  lastUpdatedBy: { name: string; initials: string };
  inputType: 'Template' | 'Playbook';
}

export interface Clause {
  id: string;
  clauseName: string;
  subClauseDescription: string;
  bestPractice: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  timeAgo: string;
  unread: boolean;
}

export interface ContractLink {
  id: string;
  url: string;
}

export interface RawDataRow {
  id: string;
  clmSystem: string;
  comments: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  description: string;
  comments: string;
  lastUpdated: string;
  uploadedBy: string;
}

export const CATEGORY_OPTIONS = [
  { label: 'Financial Service', value: 'financial-service' },
  { label: 'Technology', value: 'technology' },
  { label: 'Operations', value: 'operations' },
  { label: 'Legal', value: 'legal' },
  { label: 'Procurement', value: 'procurement' },
];

export const ENTITY_OPTIONS = [
  { label: 'Yorkshire Water', value: 'yorkshire-water' },
  { label: 'Severn Trent', value: 'severn-trent' },
  { label: 'Anglian Water', value: 'anglian-water' },
];

export const GOVERNING_LAW_OPTIONS = [
  { label: 'England & Wales', value: 'england-wales' },
  { label: 'Scotland', value: 'scotland' },
  { label: 'Northern Ireland', value: 'northern-ireland' },
  { label: 'United States', value: 'us' },
];

export const AGREEMENT_TYPE_OPTIONS = [
  { label: 'MSA', value: 'msa' },
  { label: 'NDA', value: 'nda' },
  { label: 'Statement of Work', value: 'sow' },
  { label: 'License Agreement', value: 'license' },
];

export const CLM_SYSTEM_OPTIONS = [
  { label: 'ICertis', value: 'icertis' },
  { label: 'Ironclad', value: 'ironclad' },
  { label: 'DocuSign CLM', value: 'docusign' },
  { label: 'ContractWorks', value: 'contractworks' },
  { label: 'Agiloft', value: 'agiloft' },
  { label: 'SharePoint Manual', value: 'sharepoint' },
];

export const CONTRACT_LENS_OPTIONS = [
  { label: 'Used', value: 'used' },
  { label: 'Not Used', value: 'not-used' },
];

const JL = { name: 'Joe Lawrence', initials: 'JL' };

export const INITIAL_PLAYBOOKS: Playbook[] = [
  { id: 'pb-001', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Pending', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Template' },
  { id: 'pb-002', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Pending', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Template' },
  { id: 'pb-003', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Awaiting Review', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Template' },
  { id: 'pb-004', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Playbook' },
  { id: 'pb-005', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Template' },
  { id: 'pb-006', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Template' },
  { id: 'pb-007', name: 'Joe Thomas', company: 'Initech', category: 'Finance', status: 'Published', dateCreated: '15/12/2024', lastUpdated: '15/12/2024', lastUpdatedBy: JL, inputType: 'Playbook' },
];

const buildClauses = (count: number): Clause[] => {
  const samples = [
    { clauseName: 'Confidentiality', subClauseDescription: 'Non-Disclosure Obligations — protect disclosed information from unauthorised use.', bestPractice: 'Mutual obligations covering all confidential information for at least 5 years.' },
    { clauseName: 'Payment Terms', subClauseDescription: 'Defines the number of days within which an invoice must be settled.', bestPractice: 'Net 30 days from valid invoice; late payment interest at 4% above base rate.' },
    { clauseName: 'Service Levels', subClauseDescription: 'Minimum uptime commitment expressed as a percentage of monthly availability.', bestPractice: '99.9% monthly availability; service credits scaling with breach severity.' },
    { clauseName: 'Termination', subClauseDescription: 'Either party may terminate without cause subject to notice.', bestPractice: 'Minimum 90 days written notice; pro-rata refund of pre-paid fees.' },
    { clauseName: 'Liability', subClauseDescription: 'Caps the maximum aggregate liability of either party under the agreement.', bestPractice: 'Capped at 12 months fees; carve-outs for IP, confidentiality, gross negligence.' },
    { clauseName: 'Intellectual Property', subClauseDescription: 'Allocation of pre-existing intellectual property rights.', bestPractice: 'Each party retains background IP; perpetual licence for project use.' },
    { clauseName: 'Data Protection', subClauseDescription: 'Obligations imposed on the data processor under applicable laws.', bestPractice: 'Full Article 28 GDPR processor terms; ISO 27001 certification required.' },
  ];
  return Array.from({ length: count }, (_, i) => ({ id: `cl-${String(i + 1).padStart(3, '0')}`, ...samples[i % samples.length] }));
};

export const INITIAL_CLAUSES: Record<string, Clause[]> = {
  'pb-003': buildClauses(37),
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'n-001', message: 'Playbook is ready and awaiting for review.', timeAgo: '2 Days ago', unread: true },
];

export const INITIAL_CONTRACT_LINKS: ContractLink[] = [
  { id: 'link-1', url: 'https://sharepoint.com...../.../.../' },
];

export const INITIAL_RAW_DATA: RawDataRow[] = [
  { id: 'rd-1', clmSystem: 'icertis', comments: 'Contract lifecycle management system currently in use by the client.' },
];

export const INITIAL_UPLOADED_FILES: UploadedFile[] = [
  { id: 'uf-1', name: 'Indexing File', description: 'The indexing file is the main output from the Contract Extraction tool.', comments: 'Generated automatically.', lastUpdated: '15/12/2024 14:32', uploadedBy: 'Joe Lawrence' },
  { id: 'uf-2', name: 'Summary File', description: 'A presentation summarising the key findings from the Excel indexing.', comments: 'Reviewed by legal.', lastUpdated: '15/12/2024 14:32', uploadedBy: 'Joe Lawrence' },
];

export const CONTRACT_SUMMARY = {
  numberOfContracts: 487,
  contractsExtracted: 312,
  suppliersCovered: 178,
  totalContractValue: 12_400_000,
  totalAnnualised: 3_509_000,
};

export const NOTIFICATIONS_BADGE_COUNT = 1;
