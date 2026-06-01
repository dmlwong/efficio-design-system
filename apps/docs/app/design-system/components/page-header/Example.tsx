'use client';

import { PageHeader, HeaderPresets } from '@efficio/orbit';

// Font Awesome private-use glyph codepoints (kept as numeric to stay encoding-safe).
const fa = (code: number) => String.fromCharCode(code);

export default function PageHeaderExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader type="main" title="Good afternoon, Chris" subtitle="Here's your overview for today" />

      <PageHeader
        type="main"
        title="Good afternoon, Chris"
        subtitle="Here's your overview for today"
        actions={[
          { label: 'Efficio support', icon: fa(0xf07c), variant: 'Secondary' },
          { label: 'Upload data', icon: fa(0xf07c), variant: 'Secondary' },
          { label: '+ Add Initiative', variant: 'Primary' },
        ]}
      />

      <PageHeader
        title="ContractLens"
        subtitle="AI-powered contract intelligence and insights"
        icon={fa(0xf013)}
        {...HeaderPresets.identify}
        actions={[{ label: '+ Upload Contracts', variant: 'Primary' }]}
        tabs={[{ label: 'Contract Pipeline', badge: 3 }, { label: 'Contract Coverage' }, { label: 'All Documents' }]}
        defaultActiveTab={0}
      />

      <PageHeader
        title="ClauseIQ"
        subtitle="Accelerates contract analysis, flagging risks and deviations to best practice"
        icon={fa(0xf468)}
        {...HeaderPresets.identify}
        pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
      />

      <PageHeader title="Project Management" subtitle="Comprehensive project planning and delivery tools" icon={fa(0xf135)} {...HeaderPresets.deliver} />

      <PageHeader
        title="Delivery Engine"
        subtitle="E-Hub delivery management system for tracking project execution"
        icon={fa(0xf013)}
        {...HeaderPresets.deliver}
        actions={[
          { label: 'View documents', icon: fa(0xf07c), variant: 'Secondary' },
          { label: '+ Add Initiative', variant: 'Primary' },
        ]}
      />

      <PageHeader
        title="Delivery Engine"
        subtitle="E-Hub delivery management system for tracking project execution"
        icon={fa(0xf013)}
        {...HeaderPresets.deliver}
        actions={[
          { label: 'View documents', icon: fa(0xf07c), variant: 'IconOnly' },
          { label: '+ Add Initiative', variant: 'Primary' },
        ]}
      />

      <PageHeader title="Compliance Monitoring" subtitle="Real-time contract and supplier compliance tracking" icon={fa(0xf46c)} {...HeaderPresets.deliver} />

      <PageHeader
        title="MarketIQ"
        subtitle="Research and market insights powered by industry reports and trusted sources"
        icon={fa(0xf1ea)}
        {...HeaderPresets.sustain}
        pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
      />

      <PageHeader
        title="RFP Analytics"
        subtitle="Select the right tool for the right job"
        icon={fa(0xf201)}
        {...HeaderPresets.rfp}
        pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
        tabs={[{ label: 'Consolidate' }, { label: 'Negotiate' }, { label: 'Award' }]}
        showTabUnderline={false}
      />

      <PageHeader
        title="RFP Analytics"
        subtitle="Select the right tool for the right job"
        icon={fa(0xf201)}
        {...HeaderPresets.rfp}
        pill={{ code: 'YRK22-1183', label: 'Legal Tech Platform...' }}
        tabs={[{ label: 'Consolidate' }, { label: 'Negotiate' }, { label: 'Award' }]}
        showTabUnderline={true}
      />

      <PageHeader title="RFP Analytics" subtitle="Advanced sourcing insights and scenario modelling" icon={fa(0xf201)} {...HeaderPresets.rfp} />

      <PageHeader title="RFP Builder" subtitle="AI grounded in Efficio's content" icon={fa(0xf201)} {...HeaderPresets.rfp} />
    </div>
  );
}
