export type Classification = 'Incumbent' | 'Recently Awarded' | 'Efficio Engaged' | 'COP Approved';

export type Certification = 'ISO 9001' | 'ISO 14001' | 'ISO 27001' | 'B-Corp' | 'Cyber Essentials';

export type CompanySize = 'Small' | 'Medium' | 'Large';

export type Category =
  | 'IT Services'
  | 'Logistics & Transportation'
  | 'Renewable Energy'
  | 'Marketing & Communications'
  | 'Cybersecurity Services'
  | 'Data Analytics & BI'
  | 'Management Consulting'
  | 'Manufacturing Services'
  | 'Sustainability Consulting'
  | 'Professional Services';

export type Region = 'Europe' | 'North America' | 'Asia Pacific';

export type Country = 'UK' | 'Germany' | 'France' | 'USA' | 'Netherlands' | 'Singapore' | 'Australia';

export interface Supplier {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  category: Category;
  region: Region;
  country: Country;
  classifications: Classification[];
  certifications: Certification[];
  companySize: CompanySize;
  description: string;
}

export interface SimilarProject {
  supplierName: string;
  projectName: string;
  category: string;
}

export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'TechCorp Solutions',
    initials: 'TC',
    avatarColor: 'var(--orbit-color-efficio-blue)',
    category: 'IT Services',
    region: 'Europe',
    country: 'UK',
    classifications: ['Incumbent', 'COP Approved'],
    certifications: ['ISO 9001', 'ISO 27001', 'Cyber Essentials'],
    companySize: 'Large',
    description: 'Leading IT services provider specialising in enterprise software solutions and digital transformation for public sector organisations across the UK.',
  },
  {
    id: 'sup-002',
    name: 'Global Logistics Partners',
    initials: 'GL',
    avatarColor: 'var(--orbit-color-bright-green)',
    category: 'Logistics & Transportation',
    region: 'Europe',
    country: 'Netherlands',
    classifications: ['Recently Awarded', 'Efficio Engaged'],
    certifications: ['ISO 9001', 'ISO 14001'],
    companySize: 'Large',
    description: 'Pan-European logistics provider with expertise in cold chain, last-mile delivery, and sustainable transport solutions.',
  },
  {
    id: 'sup-003',
    name: 'Maersk Supply Chain',
    initials: 'MS',
    avatarColor: 'var(--orbit-color-science-blue)',
    category: 'Logistics & Transportation',
    region: 'Europe',
    country: 'Germany',
    classifications: ['Incumbent', 'COP Approved'],
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 27001'],
    companySize: 'Large',
    description: 'World-class integrated logistics with end-to-end supply chain management and warehousing services.',
  },
  {
    id: 'sup-004',
    name: 'Bureau Veritas',
    initials: 'BV',
    avatarColor: 'var(--orbit-color-web-orange)',
    category: 'Professional Services',
    region: 'Europe',
    country: 'France',
    classifications: ['Efficio Engaged', 'COP Approved'],
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 27001', 'B-Corp'],
    companySize: 'Large',
    description: 'Global leader in testing, inspection and certification services supporting organisations across multiple industries.',
  },
  {
    id: 'sup-005',
    name: 'GreenWave Energy',
    initials: 'GW',
    avatarColor: 'var(--orbit-color-jade)',
    category: 'Renewable Energy',
    region: 'Europe',
    country: 'UK',
    classifications: ['Recently Awarded'],
    certifications: ['ISO 14001', 'B-Corp'],
    companySize: 'Medium',
    description: 'Innovative renewable energy consultancy focused on wind and solar solutions for water utilities and infrastructure projects.',
  },
  {
    id: 'sup-006',
    name: 'CyberShield Ltd',
    initials: 'CS',
    avatarColor: 'var(--orbit-color-red-ribbon)',
    category: 'Cybersecurity Services',
    region: 'Europe',
    country: 'UK',
    classifications: ['Incumbent', 'Efficio Engaged'],
    certifications: ['ISO 27001', 'Cyber Essentials'],
    companySize: 'Medium',
    description: 'Specialist cybersecurity firm providing penetration testing, SOC services, and compliance consultancy for critical national infrastructure.',
  },
  {
    id: 'sup-007',
    name: 'DataPulse Analytics',
    initials: 'DP',
    avatarColor: 'var(--orbit-color-hollywood-cerise)',
    category: 'Data Analytics & BI',
    region: 'North America',
    country: 'USA',
    classifications: ['Recently Awarded', 'COP Approved'],
    certifications: ['ISO 9001', 'ISO 27001'],
    companySize: 'Medium',
    description: 'Advanced data analytics and business intelligence platform serving procurement and supply chain professionals globally.',
  },
  {
    id: 'sup-008',
    name: 'Stratton Consulting',
    initials: 'SC',
    avatarColor: 'var(--orbit-color-chambray)',
    category: 'Management Consulting',
    region: 'Europe',
    country: 'UK',
    classifications: ['Incumbent', 'Efficio Engaged', 'COP Approved'],
    certifications: ['ISO 9001'],
    companySize: 'Large',
    description: 'Top-tier management consultancy with deep expertise in procurement transformation, category management, and operational excellence.',
  },
  {
    id: 'sup-009',
    name: 'Apex Manufacturing',
    initials: 'AM',
    avatarColor: 'var(--orbit-color-dark-green)',
    category: 'Manufacturing Services',
    region: 'Europe',
    country: 'Germany',
    classifications: ['Recently Awarded'],
    certifications: ['ISO 9001', 'ISO 14001'],
    companySize: 'Large',
    description: 'Precision manufacturing partner for industrial equipment, water treatment components, and infrastructure parts.',
  },
  {
    id: 'sup-010',
    name: 'EcoVantage Consulting',
    initials: 'EV',
    avatarColor: 'var(--orbit-color-bright-green)',
    category: 'Sustainability Consulting',
    region: 'Europe',
    country: 'Netherlands',
    classifications: ['Efficio Engaged', 'COP Approved'],
    certifications: ['ISO 14001', 'B-Corp'],
    companySize: 'Small',
    description: 'Boutique sustainability consultancy specialising in carbon reduction strategies, ESG reporting, and circular economy frameworks.',
  },
  {
    id: 'sup-011',
    name: 'MediaForge Agency',
    initials: 'MF',
    avatarColor: 'var(--orbit-color-bright-orange)',
    category: 'Marketing & Communications',
    region: 'Europe',
    country: 'UK',
    classifications: ['Recently Awarded'],
    certifications: [],
    companySize: 'Small',
    description: 'Creative marketing agency specialising in B2B communications, employer branding, and digital campaigns for utilities sector.',
  },
  {
    id: 'sup-012',
    name: 'Zenith IT Group',
    initials: 'ZI',
    avatarColor: 'var(--orbit-color-cerulean)',
    category: 'IT Services',
    region: 'Asia Pacific',
    country: 'Singapore',
    classifications: ['Efficio Engaged'],
    certifications: ['ISO 9001', 'ISO 27001', 'Cyber Essentials'],
    companySize: 'Medium',
    description: 'Cloud-native IT services company providing managed services, DevOps consulting, and enterprise architecture for APAC markets.',
  },
  {
    id: 'sup-013',
    name: 'Southern Cross Analytics',
    initials: 'SA',
    avatarColor: 'var(--orbit-color-william)',
    category: 'Data Analytics & BI',
    region: 'Asia Pacific',
    country: 'Australia',
    classifications: ['Recently Awarded', 'COP Approved'],
    certifications: ['ISO 9001'],
    companySize: 'Small',
    description: 'Australian data analytics firm focused on water industry benchmarking, predictive maintenance, and asset management intelligence.',
  },
  {
    id: 'sup-014',
    name: 'NordSecure Systems',
    initials: 'NS',
    avatarColor: 'var(--orbit-color-efficio-blue)',
    category: 'Cybersecurity Services',
    region: 'Europe',
    country: 'Germany',
    classifications: ['Incumbent', 'COP Approved'],
    certifications: ['ISO 27001', 'Cyber Essentials'],
    companySize: 'Medium',
    description: 'Enterprise cybersecurity provider specialising in OT security, network monitoring, and incident response for critical infrastructure.',
  },
  {
    id: 'sup-015',
    name: 'Pinnacle Professional',
    initials: 'PP',
    avatarColor: 'var(--orbit-color-granny-smith)',
    category: 'Professional Services',
    region: 'North America',
    country: 'USA',
    classifications: ['Recently Awarded', 'Efficio Engaged'],
    certifications: ['ISO 9001', 'B-Corp'],
    companySize: 'Large',
    description: 'Full-service professional services firm offering advisory, audit, and compliance support to water and energy utilities.',
  },
];

export const similarProjectSuppliers: SimilarProject[] = [
  { supplierName: 'TechCorp Solutions', projectName: 'SWW21 - South West Water IT Refresh', category: 'IT Services' },
  { supplierName: 'Zenith IT Group', projectName: 'SWW21 - South West Water IT Refresh', category: 'IT Services' },
  { supplierName: 'Global Logistics Partners', projectName: 'NWG20 - Northumbrian Water Logistics', category: 'Logistics & Transportation' },
  { supplierName: 'Maersk Supply Chain', projectName: 'NWG20 - Northumbrian Water Logistics', category: 'Logistics & Transportation' },
  { supplierName: 'CyberShield Ltd', projectName: 'ANH23 - Anglian Water Cyber', category: 'Cybersecurity Services' },
  { supplierName: 'NordSecure Systems', projectName: 'ANH23 - Anglian Water Cyber', category: 'Cybersecurity Services' },
  { supplierName: 'EcoVantage Consulting', projectName: 'SVT22 - Severn Trent Sustainability', category: 'Sustainability Consulting' },
  { supplierName: 'Bureau Veritas', projectName: 'TMS21 - Thames Water Compliance', category: 'Professional Services' },
  { supplierName: 'Stratton Consulting', projectName: 'UUW23 - United Utilities Transformation', category: 'Management Consulting' },
  { supplierName: 'DataPulse Analytics', projectName: 'WSH22 - Welsh Water Analytics', category: 'Data Analytics & BI' },
];

export const categories: Category[] = [
  'IT Services',
  'Logistics & Transportation',
  'Renewable Energy',
  'Marketing & Communications',
  'Cybersecurity Services',
  'Data Analytics & BI',
  'Management Consulting',
  'Manufacturing Services',
  'Sustainability Consulting',
  'Professional Services',
];

export const regions: Region[] = ['Europe', 'North America', 'Asia Pacific'];

export const countries: Country[] = ['UK', 'Germany', 'France', 'USA', 'Netherlands', 'Singapore', 'Australia'];

export const classificationOptions: Classification[] = [
  'Incumbent',
  'Recently Awarded',
  'Efficio Engaged',
  'COP Approved',
];

export const certificationOptions: Certification[] = [
  'ISO 9001',
  'ISO 14001',
  'ISO 27001',
  'B-Corp',
  'Cyber Essentials',
];

export const companySizeOptions: CompanySize[] = ['Small', 'Medium', 'Large'];

export const countryFlags: Record<Country, string> = {
  UK: '\u{1F1EC}\u{1F1E7}',
  Germany: '\u{1F1E9}\u{1F1EA}',
  France: '\u{1F1EB}\u{1F1F7}',
  USA: '\u{1F1FA}\u{1F1F8}',
  Netherlands: '\u{1F1F3}\u{1F1F1}',
  Singapore: '\u{1F1F8}\u{1F1EC}',
  Australia: '\u{1F1E6}\u{1F1FA}',
};
