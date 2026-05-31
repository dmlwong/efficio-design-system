export interface ClauseIQInitiative {
  id: string;
  name: string;
  sector: string;
  owner: string;
  scope: 'mine' | 'team';
}

export interface ClauseIQUploadedFile {
  name: string;
  size: number;
  type: string;
}

export interface ClauseIQSeverity {
  label: string;
  count: number;
  tone: 'Information' | 'Success' | 'Error' | 'Warning' | 'Outline';
}

export interface ClauseIQNextAction {
  title: string;
  description: string;
}

export interface ClauseIQAnalysisResult {
  timestamp: string;
  reviewedClauses: number;
  severities: ClauseIQSeverity[];
  nextActions: ClauseIQNextAction[];
}

export interface ClauseIQParameterOption {
  kind: 'Playbook' | 'Category' | 'Country';
  label: string;
  icon: string;
  iconBg: string;
  iconFg: string;
  options: string[];
}

export const CLAUSEIQ_INITIATIVES: ClauseIQInitiative[] = [
  { id: 'ci-001', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-002', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-003', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-004', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-005', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-006', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-007', name: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Sarah Chen', scope: 'mine' },
  { id: 'ci-008', name: 'Telemetry Supplier Review', sector: 'Engineering', owner: 'Amelia Brown', scope: 'team' },
];

export const CLAUSEIQ_RESULT: ClauseIQAnalysisResult = {
  timestamp: 'Jan 3, 2026, 16:32',
  reviewedClauses: 47,
  severities: [
    { label: 'Missing clauses', count: 13, tone: 'Outline' },
    { label: 'High deviation', count: 12, tone: 'Error' },
    { label: 'Medium deviation', count: 5, tone: 'Warning' },
    { label: 'Low deviation', count: 12, tone: 'Success' },
  ],
  nextActions: [
    { title: 'Update milestone', description: 'Track your initiative progress' },
    { title: 'Analyse a contract for a different initiative', description: 'Start fresh with a new initiative' },
  ],
};

export const CLAUSEIQ_DEFAULT_PLAYBOOK = 'Procurement_Playbook_Yorkshire_Water .pdf';

export const CLAUSEIQ_PARAMETER_OPTIONS: ClauseIQParameterOption[] = [
  {
    kind: 'Playbook',
    label: 'Playbook',
    icon: '\uf02d',
    iconBg: 'var(--orbit-color-swatch-hollywood-cerise-300)',
    iconFg: 'var(--orbit-color-btn-primary-bg)',
    options: [
      CLAUSEIQ_DEFAULT_PLAYBOOK,
      'Procurement_Playbook_Standard_v3.pdf',
      'IT_Services_Playbook_2025.pdf',
      'Construction_Contracts_Playbook.pdf',
      'Professional_Services_Playbook.pdf',
    ],
  },
  {
    kind: 'Category',
    label: 'Category',
    icon: '\uf02b',
    iconBg: 'var(--orbit-color-swatch-hollywood-cerise-300)',
    iconFg: 'var(--orbit-color-btn-primary-bg)',
    options: [
      'Goods',
      'Services',
      'Construction',
      'Professional Services',
      'IT & Technology',
    ],
  },
  {
    kind: 'Country',
    label: 'Country',
    icon: '\uf3c5',
    iconBg: 'var(--orbit-color-swatch-hollywood-cerise-300)',
    iconFg: 'var(--orbit-color-btn-primary-bg)',
    options: [
      'United Kingdom',
      'United States',
      'Germany',
      'France',
      'Singapore',
    ],
  },
];

export const CLAUSEIQ_FILE_LIMIT_MB = 100;
