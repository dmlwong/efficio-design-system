'use client';

import React, { useState } from 'react';
import {
  SideNav,
  PageHeader,
  HeaderPresets,
  Card,
  Headings,
  Text,
  Separator,
  Button,
  IconButton,
  Textbox,
  TextArea,
  Dropdown,
  Toggle,
  Avatar,
  Chip,
  Badge,
  StatusIndicator,
  FaIcon,
  InlineBanner,
} from '@efficio/orbit';

/* ─── Settings categories ─── */

type SettingsKey =
  | 'profile'
  | 'notifications'
  | 'security'
  | 'team'
  | 'integrations'
  | 'preferences';

interface SettingsCategory {
  key: SettingsKey;
  label: string;
  icon: string;
  description: string;
}

const categories: SettingsCategory[] = [
  { key: 'profile',       label: 'Profile',          icon: '', description: 'Your name, avatar, and personal details' },
  { key: 'notifications', label: 'Notifications',    icon: '', description: 'Email, push, and in-app alerts' },
  { key: 'security',      label: 'Security',         icon: '', description: 'Password, two-factor, and active sessions' },
  { key: 'team',          label: 'Team & Permissions', icon: '', description: 'Manage workspace members and roles' },
  { key: 'integrations',  label: 'Integrations',     icon: '', description: 'Connect Slack, Teams, SAP, Coupa' },
  { key: 'preferences',   label: 'Preferences',      icon: '', description: 'Theme, language, timezone, currency' },
];

/* ─── Shared row ─── */

function SettingRow({
  title,
  description,
  control,
}: {
  title: string;
  description?: string;
  control: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--orbit-space-base)',
        padding: 'var(--orbit-space-base) 0',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, minWidth: 0 }}>
        <Text variant="Bold" size="Paragraph">{title}</Text>
        {description && <Text variant="Secondary" size="Small">{description}</Text>}
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--orbit-space-base)' }}>
      {children}
    </div>
  );
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card padding="Base">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--orbit-space-base)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Headings size="Heading 4">{title}</Headings>
            {description && <Text variant="Secondary" size="Paragraph">{description}</Text>}
          </div>
          {action}
        </div>
        <Separator />
        {children}
      </div>
    </Card>
  );
}

/* ─── Page ─── */

export default function SettingsPage() {
  const [active, setActive] = useState<SettingsKey>('profile');

  // Profile state
  const [firstName, setFirstName] = useState('Derek');
  const [lastName, setLastName] = useState('Wong');
  const [email, setEmail] = useState('d.design.mlwong@outlook.com');
  const [jobTitle, setJobTitle] = useState('Senior Procurement Manager');
  const [bio, setBio] = useState('Leading global indirect procurement strategy across IT and professional services.');

  // Notifications state
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailMentions, setEmailMentions] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [pushApprovals, setPushApprovals] = useState(true);
  const [pushDeadlines, setPushDeadlines] = useState(true);
  const [pushNews, setPushNews] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState(true);

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // Preferences state
  const [language, setLanguage] = useState('en-GB');
  const [timezone, setTimezone] = useState('Europe/London');
  const [currency, setCurrency] = useState('GBP');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const team = [
    { name: 'Sarah Chen',     email: 'sarah.chen@efficio.com',     role: 'Owner',    status: 'Success' as const,    last: 'Active now' },
    { name: 'James Okafor',   email: 'james.okafor@efficio.com',   role: 'Admin',    status: 'Success' as const,    last: '12 min ago' },
    { name: 'Priya Sharma',   email: 'priya.sharma@efficio.com',   role: 'Editor',   status: 'Information' as const, last: '2 hours ago' },
    { name: 'Tom Wheeler',    email: 'tom.wheeler@efficio.com',    role: 'Viewer',   status: 'Warning' as const,    last: '3 days ago' },
    { name: 'Lisa Johansson', email: 'lisa.johansson@efficio.com', role: 'Editor',   status: 'Information' as const, last: '5 hours ago' },
  ];

  const integrations = [
    { name: 'Slack',             description: 'Send approvals and alerts to channels', icon: '', connected: true,  category: 'Messaging' },
    { name: 'Microsoft Teams',   description: 'Surface RFP activity in your team chat', icon: '', connected: true,  category: 'Messaging' },
    { name: 'SAP Ariba',         description: 'Sync supplier master data and POs',     icon: '', connected: true,  category: 'ERP' },
    { name: 'Coupa',             description: 'Pull spend data into Efficio analytics', icon: '', connected: false, category: 'Spend' },
    { name: 'DocuSign',          description: 'Send contracts for signature inline',   icon: '', connected: false, category: 'Contracts' },
    { name: 'Google Workspace',  description: 'Calendar and identity sync',            icon: '', connected: true,  category: 'Identity' },
  ];

  const sessions = [
    { device: 'MacBook Pro · Safari',     location: 'London, UK',   ip: '82.16.48.21',  last: 'Active now',   current: true  },
    { device: 'iPhone 15 · Mobile App',   location: 'London, UK',   ip: '82.16.48.21',  last: '2 hours ago',  current: false },
    { device: 'Windows · Chrome',         location: 'Manchester, UK', ip: '90.214.7.103', last: '3 days ago',   current: false },
  ];

  const renderProfile = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <SectionCard
        title="Personal information"
        description="This information will appear on your profile and in shared workspaces."
        action={
          <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)' }}>
            <Button variant="Tertiary">Cancel</Button>
            <Button variant="Primary">Save changes</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)', paddingBottom: 'var(--orbit-space-s)' }}>
          <Avatar name={`${firstName} ${lastName}`} initials={`${firstName[0] ?? ''}${lastName[0] ?? ''}`} size="Large" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Text variant="Bold">Profile photo</Text>
            <Text variant="Secondary" size="Small">PNG or JPG, up to 2 MB.</Text>
          </div>
          <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)', marginLeft: 'auto' }}>
            <Button variant="Secondary" icon={<FaIcon icon={''} size={12} />}>Upload new</Button>
            <Button variant="Tertiary">Remove</Button>
          </div>
        </div>
        <Separator />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)', paddingTop: 'var(--orbit-space-s)' }}>
          <FieldRow>
            <Textbox label="First name" value={firstName} onChange={setFirstName} required />
            <Textbox label="Last name"  value={lastName}  onChange={setLastName}  required />
          </FieldRow>
          <FieldRow>
            <Textbox label="Email" value={email} onChange={setEmail} required />
            <Textbox label="Job title" value={jobTitle} onChange={setJobTitle} />
          </FieldRow>
          <TextArea label="Bio" value={bio} onChange={setBio} placeholder="A short description that appears on your public profile" />
        </div>
      </SectionCard>

      <SectionCard
        title="Account"
        description="Workspace identity and access tier."
      >
        <SettingRow
          title="Workspace"
          description="Yorkshire Water · Production tenant"
          control={<Chip variant="Information" size="Small" label="Owner" />}
        />
        <Separator />
        <SettingRow
          title="Plan"
          description="Enterprise · renews 12 March 2027"
          control={<Button variant="Tertiary" icon={<FaIcon icon={''} size={12} />}>Manage plan</Button>}
        />
        <Separator />
        <SettingRow
          title="Delete account"
          description="Permanently remove your account and all associated data."
          control={<Button variant="Secondary">Delete</Button>}
        />
      </SectionCard>
    </div>
  );

  const renderNotifications = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <SectionCard
        title="Email"
        description="Choose what we send to your inbox."
      >
        <SettingRow
          title="Daily digest"
          description="A morning summary of pending approvals and overdue tasks."
          control={<Toggle ariaLabel="Daily digest" checked={emailDigest} onChange={setEmailDigest} />}
        />
        <Separator />
        <SettingRow
          title="Mentions and replies"
          description="When a teammate @mentions you in a contract or RFP."
          control={<Toggle ariaLabel="Mentions and replies" checked={emailMentions} onChange={setEmailMentions} />}
        />
        <Separator />
        <SettingRow
          title="System alerts"
          description="Maintenance windows and critical incidents."
          control={<Toggle ariaLabel="System alerts" checked={emailAlerts} onChange={setEmailAlerts} />}
        />
      </SectionCard>

      <SectionCard
        title="Push & in-app"
        description="Real-time alerts on web and mobile."
      >
        <SettingRow
          title="Approval requests"
          description="When you are listed as an approver on a workflow."
          control={<Toggle ariaLabel="Approval requests" checked={pushApprovals} onChange={setPushApprovals} />}
        />
        <Separator />
        <SettingRow
          title="Deadlines"
          description="Contract renewals, RFP close dates, and SLAs at risk."
          control={<Toggle ariaLabel="Deadlines" checked={pushDeadlines} onChange={setPushDeadlines} />}
        />
        <Separator />
        <SettingRow
          title="Product news"
          description="New features and best-practice playbooks."
          control={<Toggle ariaLabel="Product news" checked={pushNews} onChange={setPushNews} />}
        />
      </SectionCard>

      <SectionCard
        title="Reports"
        description="Recurring summaries delivered on a schedule."
      >
        <SettingRow
          title="Weekly summary"
          description="Sent Mondays at 08:00 in your timezone."
          control={<Toggle ariaLabel="Weekly summary" checked={weeklySummary} onChange={setWeeklySummary} />}
        />
      </SectionCard>
    </div>
  );

  const renderSecurity = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <InlineBanner
        variant="Information"
        contrast="Low"
        label="Last password change: 18 February 2026 — we recommend rotating every 90 days."
        status="Learn more"
      />

      <SectionCard
        title="Password"
        description="Use at least 12 characters, including a number and a symbol."
        action={<Button variant="Primary">Update password</Button>}
      >
        <FieldRow>
          <Textbox label="Current password" value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" required />
          <Textbox label="New password" value={newPassword} onChange={setNewPassword} placeholder="At least 12 characters" required />
        </FieldRow>
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Extra protection on top of your password."
      >
        <SettingRow
          title="Authenticator app"
          description="Use 1Password, Authy, or Google Authenticator to generate codes."
          control={<Toggle ariaLabel="Authenticator app" checked={twoFactor} onChange={setTwoFactor} />}
        />
        <Separator />
        <SettingRow
          title="Login alerts"
          description="Email me when a new device signs in."
          control={<Toggle ariaLabel="Login alerts" checked={loginAlerts} onChange={setLoginAlerts} />}
        />
        <Separator />
        <SettingRow
          title="Recovery codes"
          description="One-time codes for when you lose access to your authenticator."
          control={<Button variant="Tertiary" icon={<FaIcon icon={''} size={12} />}>Download codes</Button>}
        />
      </SectionCard>

      <SectionCard
        title="Active sessions"
        description="Devices currently signed in to your account."
        action={<Button variant="Secondary">Sign out everywhere</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sessions.map((s, i) => (
            <React.Fragment key={s.device}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--orbit-space-base) 0', gap: 'var(--orbit-space-base)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--orbit-radius-md)',
                    backgroundColor: 'var(--orbit-color-card-bg-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaIcon icon={s.device.includes('iPhone') ? '' : s.device.includes('Windows') ? '' : ''} size={16} color="var(--orbit-color-btn-primary-bg)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                      <Text variant="Bold">{s.device}</Text>
                      {s.current && <Chip variant="Success" size="Mini" label="Current" />}
                    </div>
                    <Text variant="Secondary" size="Small">{s.location} · {s.ip} · {s.last}</Text>
                  </div>
                </div>
                {!s.current && (
                  <Button variant="Tertiary">Revoke</Button>
                )}
              </div>
              {i < sessions.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderTeam = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <SectionCard
        title="Members"
        description={`${team.length} people have access to this workspace.`}
        action={
          <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)' }}>
            <Button variant="Secondary" icon={<FaIcon icon={''} size={12} />}>Export CSV</Button>
            <Button variant="Primary" icon={<FaIcon icon={''} size={12} />}>Invite member</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {team.map((member, i) => (
            <React.Fragment key={member.email}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--orbit-space-base) 0', gap: 'var(--orbit-space-base)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)' }}>
                  <Avatar name={member.name} initials={member.name.split(' ').map(n => n[0]).join('')} size="Medium" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                      <Text variant="Bold">{member.name}</Text>
                      <StatusIndicator status={member.status} size="Small" />
                    </div>
                    <Text variant="Secondary" size="Small">{member.email} · {member.last}</Text>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-base)' }}>
                  <Chip
                    variant={member.role === 'Owner' ? 'Information' : member.role === 'Admin' ? 'Success' : member.role === 'Editor' ? 'Outline' : 'Outline'}
                    size="Small"
                    label={member.role}
                  />
                  <IconButton variant="Tertiary" ariaLabel={`More options for ${member.name}`} icon={<FaIcon icon={''} size={14} />} size="Small" />
                </div>
              </div>
              {i < team.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Roles & permissions"
        description="What each role can do in this workspace."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--orbit-space-base)' }}>
          {[
            { role: 'Owner',  caps: ['Manage billing', 'Delete workspace', 'Invite & remove members', 'Full data access'] },
            { role: 'Admin',  caps: ['Invite & remove members', 'Manage integrations', 'Full data access', 'Cannot delete workspace'] },
            { role: 'Editor', caps: ['Create & edit RFPs and contracts', 'Comment on records', 'Cannot manage members'] },
            { role: 'Viewer', caps: ['Read-only access to records', 'Comment on records', 'Cannot edit data'] },
          ].map((r) => (
            <div key={r.role} style={{
              border: '1px solid var(--orbit-color-card-border-default)',
              borderRadius: 'var(--orbit-radius-md)',
              padding: 'var(--orbit-space-base)',
              display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-s)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text variant="Bold">{r.role}</Text>
                <Badge label={`${r.caps.length}`} status="Gray" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-xs)' }}>
                {r.caps.map((cap) => (
                  <div key={cap} style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                    <FaIcon icon={''} size={10} color="var(--orbit-color-text-secondary)" />
                    <Text variant="Secondary" size="Small">{cap}</Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );

  const renderIntegrations = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <SectionCard
        title="Connected apps"
        description="Wire Efficio into the tools your team already uses."
        action={<Button variant="Secondary" icon={<FaIcon icon={''} size={12} />}>Browse marketplace</Button>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--orbit-space-base)' }}>
          {integrations.map((it) => (
            <div key={it.name} style={{
              border: '1px solid var(--orbit-color-card-border-default)',
              borderRadius: 'var(--orbit-radius-md)',
              padding: 'var(--orbit-space-base)',
              display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-s)',
              backgroundColor: 'var(--orbit-color-bg-default)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--orbit-space-base)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 'var(--orbit-radius-md)',
                    backgroundColor: 'var(--orbit-color-card-bg-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <FaIcon icon={it.icon} size={18} color="var(--orbit-color-btn-primary-bg)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-xs)' }}>
                      <Text variant="Bold">{it.name}</Text>
                      {it.connected && <Chip variant="Success" size="Mini" label="Connected" />}
                    </div>
                    <Text variant="Secondary" size="Small">{it.category}</Text>
                  </div>
                </div>
                <Button variant={it.connected ? 'Tertiary' : 'Secondary'}>
                  {it.connected ? 'Manage' : 'Connect'}
                </Button>
              </div>
              <Text variant="Secondary" size="Small">{it.description}</Text>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="API & webhooks"
        description="Programmatic access for custom workflows."
      >
        <SettingRow
          title="Personal API token"
          description="Last used: 28 April 2026 from a server in eu-west-2"
          control={
            <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)' }}>
              <Button variant="Tertiary">Regenerate</Button>
              <Button variant="Secondary" icon={<FaIcon icon={''} size={12} />}>Copy</Button>
            </div>
          }
        />
        <Separator />
        <SettingRow
          title="Webhook endpoints"
          description="3 active endpoints receiving events"
          control={<Button variant="Tertiary">Manage</Button>}
        />
      </SectionCard>
    </div>
  );

  const renderPreferences = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
      <SectionCard
        title="Localization"
        description="Format dates, numbers, and currency to your region."
        action={
          <div style={{ display: 'flex', gap: 'var(--orbit-space-xs)' }}>
            <Button variant="Tertiary">Reset</Button>
            <Button variant="Primary">Save</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
          <FieldRow>
            <Dropdown
              label="Language"
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'en-GB', label: 'English (UK)' },
                { value: 'en-US', label: 'English (US)' },
                { value: 'fr-FR', label: 'Français' },
                { value: 'de-DE', label: 'Deutsch' },
                { value: 'es-ES', label: 'Español' },
                { value: 'ja-JP', label: '日本語' },
              ]}
            />
            <Dropdown
              label="Timezone"
              value={timezone}
              onChange={setTimezone}
              options={[
                { value: 'Europe/London',     label: 'Europe/London (GMT+0)' },
                { value: 'Europe/Paris',      label: 'Europe/Paris (GMT+1)' },
                { value: 'America/New_York',  label: 'America/New York (GMT-5)' },
                { value: 'America/Los_Angeles', label: 'America/Los Angeles (GMT-8)' },
                { value: 'Asia/Tokyo',        label: 'Asia/Tokyo (GMT+9)' },
              ]}
            />
          </FieldRow>
          <FieldRow>
            <Dropdown
              label="Currency"
              value={currency}
              onChange={setCurrency}
              options={[
                { value: 'GBP', label: '£ GBP — British Pound' },
                { value: 'USD', label: '$ USD — US Dollar' },
                { value: 'EUR', label: '€ EUR — Euro' },
                { value: 'JPY', label: '¥ JPY — Japanese Yen' },
              ]}
            />
            <Dropdown
              label="Date format"
              value={dateFormat}
              onChange={setDateFormat}
              options={[
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY — 30/04/2026' },
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY — 04/30/2026' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD — 2026-04-30' },
              ]}
            />
          </FieldRow>
        </div>
      </SectionCard>

      <SectionCard
        title="Appearance"
        description="How Efficio looks on your screen."
      >
        <SettingRow
          title="Compact mode"
          description="Tighter spacing across tables and lists."
          control={<Toggle ariaLabel="Compact mode" checked={compactMode} onChange={setCompactMode} />}
        />
        <Separator />
        <SettingRow
          title="Reduce motion"
          description="Minimise animations and transitions."
          control={<Toggle ariaLabel="Reduce motion" checked={reduceMotion} onChange={setReduceMotion} />}
        />
      </SectionCard>
    </div>
  );

  const renderActive = () => {
    switch (active) {
      case 'profile':       return renderProfile();
      case 'notifications': return renderNotifications();
      case 'security':      return renderSecurity();
      case 'team':          return renderTeam();
      case 'integrations':  return renderIntegrations();
      case 'preferences':   return renderPreferences();
    }
  };

  const activeCategory = categories.find((c) => c.key === active)!;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--orbit-font-family-sans)' }}>
      <SideNav
        appName="Efficio Orbit"
        clientName="Yorkshire Water"
        navItems={[
          { id: 'notifications', icon: '', label: 'Notifications', badge: 3 },
          { id: 'home', icon: '', label: 'Home' },
          { id: 'dashboard', icon: '', label: 'Dashboard' },
          { id: 'suppliers', icon: '', label: 'Suppliers' },
          { id: 'contracts', icon: '', label: 'Contracts' },
          { id: 'settings', icon: '', label: 'Settings', active: true },
        ]}
        sections={[
          { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)' },
          { id: 'deliver',  label: 'Deliver', color: 'var(--orbit-color-header-deliver-from)' },
          { id: 'sustain',  label: 'Sustain', color: 'var(--orbit-color-header-sustain-from)' },
        ]}
        workItems={[]}
        userName="Chris Hurley"
        userInitials="CH"
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--orbit-color-card-bg-accent)' }}>
        <PageHeader
          type="tool"
          title="Settings"
          subtitle="Manage your profile, security, team, and workspace preferences"
          icon={''}
          {...HeaderPresets.identify}
        />

        <main style={{ flex: 1, padding: 'var(--orbit-space-m)', overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 'var(--orbit-space-m)', alignItems: 'flex-start', maxWidth: 1280, margin: '0 auto' }}>

            {/* Settings sub-nav */}
            <Card padding="Small">
              <nav aria-label="Settings categories" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categories.map((cat) => {
                  const isActive = cat.key === active;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActive(cat.key)}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--orbit-space-s)',
                        padding: 'var(--orbit-space-s) var(--orbit-space-base)',
                        borderRadius: 'var(--orbit-radius-md)',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        backgroundColor: isActive ? 'var(--orbit-color-card-bg-accent)' : 'transparent',
                        color: isActive ? 'var(--orbit-color-btn-primary-bg)' : 'var(--orbit-color-text-primary)',
                        fontFamily: 'var(--orbit-font-family-sans)',
                        fontSize: 'var(--orbit-text-sm)',
                        fontWeight: isActive ? 600 : 400,
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--orbit-color-card-bg-accent)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaIcon
                        icon={cat.icon}
                        size={14}
                        color={isActive ? 'var(--orbit-color-btn-primary-bg)' : 'var(--orbit-color-text-secondary)'}
                      />
                      <span style={{ flex: 1 }}>{cat.label}</span>
                      {isActive && (
                        <FaIcon icon={''} size={10} color="var(--orbit-color-btn-primary-bg)" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </Card>

            {/* Active section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--orbit-space-base)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Headings size="Heading 3">{activeCategory.label}</Headings>
                <Text variant="Secondary" size="Paragraph">{activeCategory.description}</Text>
              </div>
              {renderActive()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
