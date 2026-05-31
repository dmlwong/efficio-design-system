'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Chip,
  DocumentGlyph,
  Headings,
  IconButton,
  InlineBanner,
  Input,
  Text,
  PriceIndicator,
  RadialIndicator,
  Separator,
  StatusIndicator,
  TabButton,
  Toggle,
  FaIcon,
  FA,
} from '@efficio/orbit';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [bannerVisible, setBannerVisible] = useState(true);

  const tabs = ['Overview', 'Suppliers', 'Documents', 'Activity'];

  const metrics = [
    { label: 'Total Suppliers', value: '1,247', change: 'Positive' as const, changeVal: '+12%', status: 'Success' as const, progress: 85 },
    { label: 'Active RFPs', value: '34', change: 'Negative' as const, changeVal: '-3%', status: 'Warning' as const, progress: 62 },
    { label: 'Pending Reviews', value: '18', change: 'None' as const, changeVal: '0%', status: 'Information' as const, progress: 45 },
    { label: 'Risk Alerts', value: '7', change: 'Negative' as const, changeVal: '+2', status: 'Error' as const, progress: 28 },
  ];

  const suppliers = [
    { name: 'Acme Industries', contact: 'John Smith', status: 'Success' as const, category: 'Manufacturing', risk: 'Low' as const, spend: '$2.4M', docs: ['PDF', 'XLS'] as const },
    { name: 'GlobalTech Solutions', contact: 'Sarah Chen', status: 'Warning' as const, category: 'Technology', risk: 'Medium' as const, spend: '$1.8M', docs: ['DOC', 'PDF'] as const },
    { name: 'EcoSource Ltd', contact: 'Maria Garcia', status: 'Information' as const, category: 'Sustainability', risk: 'Very Low' as const, spend: '$950K', docs: ['XLS'] as const },
    { name: 'FastLogistics Co', contact: 'David Lee', status: 'Error' as const, category: 'Logistics', risk: 'High' as const, spend: '$3.1M', docs: ['PDF', 'DOC', 'XLS'] as const },
    { name: 'PrimeParts Inc', contact: 'Emma Wilson', status: 'Success' as const, category: 'Manufacturing', risk: 'Low' as const, spend: '$1.2M', docs: ['ZIP', 'PDF'] as const },
  ];

  const activities = [
    { user: 'JS', name: 'John Smith', action: 'submitted a new RFP response', time: '2 hours ago', type: 'Information' as const },
    { user: 'SC', name: 'Sarah Chen', action: 'flagged a compliance issue', time: '4 hours ago', type: 'Warning' as const },
    { user: 'MG', name: 'Maria Garcia', action: 'completed supplier onboarding', time: '6 hours ago', type: 'Success' as const },
    { user: 'DL', name: 'David Lee', action: 'missed delivery deadline', time: '1 day ago', type: 'Error' as const },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f6', fontFamily: 'var(--orbit-font-family-sans)' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--orbit-color-bg-default)',
        borderBottom: '1px solid var(--orbit-color-border-default)',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Headings size="Heading 4">Orbit</Headings>
          <Separator orientation="Vertical" />
          <Breadcrumb items={[
            { label: 'Home', href: '#' },
            { label: 'Procurement', href: '#' },
            { label: 'Dashboard' },
          ]} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <IconButton variant="Secondary" ariaLabel="Notifications" icon={<FaIcon icon={'\uf0f3'} size={14} />} />
          <Avatar name="Derek Wong" initials="DW" size="Small" />
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
        {/* Page Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Headings size="Heading 2">Procurement Dashboard</Headings>
            <Text size="Paragraph" variant="Secondary">Monitor supplier performance, risks, and activity</Text>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant="Secondary" icon={<FaIcon icon={'\uf019'} size={12} />}>Export</Button>
            <Button variant="Primary" icon={<FaIcon icon={'\uf067'} size={12} />}>Add Supplier</Button>
          </div>
        </div>

        {/* Alert */}
        {bannerVisible && (
          <div style={{ marginBottom: 16 }}>
            <Alert
              type="Information"
              title="System Update Scheduled"
              description="A maintenance window is planned for April 5, 2026 from 02:00–04:00 UTC. Some features may be temporarily unavailable."
              onDismiss={() => setBannerVisible(false)}
            />
          </div>
        )}

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {metrics.map((m) => (
            <Card key={m.label} padding="Base">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text size="Small" variant="Secondary">{m.label}</Text>
                <RadialIndicator status={m.status} progress={m.progress} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <Headings size="Heading 2">{m.value}</Headings>
                <PriceIndicator movement={m.change} value={m.changeVal} />
              </div>
              <div style={{ marginTop: 8 }}>
                <StatusIndicator status={m.status} size="Small" label={m.status === 'Success' ? 'On Track' : m.status === 'Warning' ? 'Needs Attention' : m.status === 'Error' ? 'Critical' : 'In Progress'} />
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--orbit-color-border-default)' }}>
          {tabs.map((tab, i) => (
            <TabButton key={tab} active={activeTab === i} onClick={() => setActiveTab(i)}>
              {tab}
              {i === 1 && <Badge label="5" status="Green" />}
              {i === 3 && <Badge label="3" status="Red" />}
            </TabButton>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            {/* Supplier List */}
            <Card padding="Base">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Headings size="Heading 4">Top Suppliers</Headings>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Text size="Small" variant="Secondary">Show completed</Text>
                  <Toggle checked={showCompleted} onChange={setShowCompleted} />
                </div>
              </div>
              <div style={{ width: 300, marginBottom: 16 }}>
                <Input ariaLabel="Search suppliers" placeholder="Search suppliers..." value={search} onChange={setSearch} icon={<FaIcon icon={'\uf002'} size={12} color="var(--orbit-color-text-secondary)" />} />
              </div>

              <InlineBanner variant="Information" contrast="Low" label="5 suppliers require attention this week" status="View All" />

              <Separator />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {suppliers
                  .filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()))
                  .map((supplier) => (
                  <div key={supplier.name}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={supplier.contact} initials={supplier.contact.split(' ').map(n => n[0]).join('')} size="Small" />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Text variant="Bold">{supplier.name}</Text>
                            <StatusIndicator status={supplier.status} size="Small" />
                          </div>
                          <Text size="Small" variant="Secondary">{supplier.contact}</Text>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Chip variant={supplier.status === 'Success' ? 'Success' : supplier.status === 'Warning' ? 'Warning' : supplier.status === 'Error' ? 'Error' : 'Information'} size="Mini" label={supplier.category} />
                        <Text variant="Bold">{supplier.spend}</Text>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {supplier.docs.map((doc, i) => (
                            <DocumentGlyph key={i} documentType={doc} size="Extra Small" />
                          ))}
                        </div>
                        <IconButton variant="Tertiary" ariaLabel="More options" icon={<FaIcon icon={'\uf142'} size={14} />} size="Small" />
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Button variant="Tertiary">View All Suppliers</Button>
              </div>
            </Card>

            {/* Activity Feed */}
            <Card padding="Base">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Headings size="Heading 4">Recent Activity</Headings>
                <Badge label={String(activities.length)} status="Gray" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {activities.map((activity, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <Avatar name={activity.name} initials={activity.user} size="Small" />
                      <div style={{ flex: 1 }}>
                        <div>
                          <Text variant="Bold">{activity.name}</Text>
                          <span style={{ fontSize: 14, color: 'var(--orbit-color-text-secondary)', marginLeft: 4 }}>
                            {activity.action}
                          </span>
                        </div>
                        <Text size="Small" variant="Disabled">{activity.time}</Text>
                      </div>
                      <StatusIndicator status={activity.type} size="Small" />
                    </div>
                    {i < activities.length - 1 && <div style={{ marginTop: 12 }}><Separator /></div>}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Button variant="Tertiary">View All Activity</Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 1 && (
          <Card padding="Base">
            <Headings size="Heading 4">Suppliers</Headings>
            <Text size="Paragraph" variant="Secondary">Full supplier management view coming soon.</Text>
          </Card>
        )}

        {activeTab === 2 && (
          <Card padding="Base">
            <Headings size="Heading 4">Documents</Headings>
            <div style={{ display: 'flex', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
              {(['XLS', 'DOC', 'PDF', 'ZIP', 'IMG', 'Unknown'] as const).map((type) => (
                <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <DocumentGlyph documentType={type} size="Large" />
                  <Text size="Small" variant="Secondary">{`${type} File`}</Text>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 3 && (
          <Card padding="Base">
            <Headings size="Heading 4">Activity Log</Headings>
            <Text size="Paragraph" variant="Secondary">Full activity timeline coming soon.</Text>
          </Card>
        )}
      </main>
    </div>
  );
}
