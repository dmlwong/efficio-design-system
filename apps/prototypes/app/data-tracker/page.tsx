'use client';

import React, { useReducer, useMemo } from 'react';
import { SideNav } from '@efficio/orbit';
import {
  DataTrackerHeader,
  type DataTrackerTab,
  ContractsPanel,
  ContractUploader,
  RawDataTable,
  BestPracticeLibrary,
  NewPlaybookWizard,
  type WizardDraft,
  PlaybookDetailModal,
  HomeView,
  ToastHost,
  type ToastSpec,
} from '@/components/feature/data-tracker';
import {
  INITIAL_CLAUSES,
  INITIAL_CONTRACT_LINKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PLAYBOOKS,
  INITIAL_RAW_DATA,
  INITIAL_UPLOADED_FILES,
  NOTIFICATIONS_BADGE_COUNT,
  type Clause,
  type ContractLink,
  type NotificationItem,
  type Playbook,
  type PlaybookStatus,
  type RawDataRow,
  type UploadedFile,
} from '@/data/data-tracker-mock';

type Theme = 'orbit' | 'efficio';
type View = 'home' | 'data-tracker';
type DataMode = 'overview' | 'playbooks';

interface State {
  theme: Theme;
  view: View;
  tab: DataTrackerTab;
  dataMode: DataMode;
  playbooks: Playbook[];
  clauses: Record<string, Clause[]>;
  contractLinks: ContractLink[];
  rawData: RawDataRow[];
  uploadedFiles: UploadedFile[];
  contractLens: string;
  notifications: NotificationItem[];
  wizardOpen: boolean;
  detailPlaybookId: string | null;
  addClauseOpen: boolean;
  toast: ToastSpec | null;
  newPlaybookCount: number;
}

type Action =
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'SET_TAB'; tab: DataTrackerTab }
  | { type: 'SET_DATA_MODE'; mode: DataMode }
  | { type: 'OPEN_WIZARD' }
  | { type: 'CLOSE_WIZARD' }
  | { type: 'SUBMIT_WIZARD'; draft: WizardDraft }
  | { type: 'OPEN_DETAIL'; id: string }
  | { type: 'CLOSE_DETAIL' }
  | { type: 'OPEN_ADD_CLAUSE' }
  | { type: 'CLOSE_ADD_CLAUSE' }
  | { type: 'ADD_CLAUSE'; playbookId: string; clause: Omit<Clause, 'id'> }
  | { type: 'DELETE_CLAUSE'; playbookId: string; clauseId: string }
  | { type: 'DELETE_PLAYBOOK'; id: string }
  | { type: 'EDIT_PLAYBOOK'; id: string }
  | { type: 'MARK_ALL_READ' }
  | { type: 'DISMISS_NOTIFICATION'; id: string }
  | { type: 'ADD_CONTRACT_LINK'; url: string }
  | { type: 'REMOVE_CONTRACT_LINK'; id: string }
  | { type: 'CHANGE_RAW_DATA_SYSTEM'; id: string; value: string }
  | { type: 'CHANGE_RAW_DATA_COMMENT'; id: string; value: string }
  | { type: 'SET_CONTRACT_LENS'; value: string }
  | { type: 'DISMISS_TOAST' };

const initialState: State = {
  theme: 'orbit',
  view: 'data-tracker',
  tab: 'data-overview',
  dataMode: 'overview',
  playbooks: [],
  clauses: { ...INITIAL_CLAUSES },
  contractLinks: INITIAL_CONTRACT_LINKS,
  rawData: INITIAL_RAW_DATA,
  uploadedFiles: INITIAL_UPLOADED_FILES,
  contractLens: 'used',
  notifications: INITIAL_NOTIFICATIONS,
  wizardOpen: false,
  detailPlaybookId: null,
  addClauseOpen: false,
  toast: null,
  newPlaybookCount: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_THEME': return { ...state, theme: action.theme };
    case 'SET_VIEW': return { ...state, view: action.view };
    case 'SET_TAB': return { ...state, tab: action.tab };
    case 'SET_DATA_MODE': return { ...state, dataMode: action.mode };
    case 'OPEN_WIZARD': return { ...state, wizardOpen: true };
    case 'CLOSE_WIZARD': return { ...state, wizardOpen: false };
    case 'SUBMIT_WIZARD': {
      const newId = `pb-new-${state.newPlaybookCount + 1}`;
      const next: Playbook = {
        id: newId,
        name: 'Joe Thomas',
        company: 'Initech',
        category: 'Finance',
        status: 'Pending',
        dateCreated: new Date().toLocaleDateString('en-GB'),
        lastUpdated: new Date().toLocaleDateString('en-GB'),
        lastUpdatedBy: { name: 'Joe Lawrence', initials: 'JL' },
        inputType: action.draft.inputType === 'template' ? 'Template' : 'Playbook',
      };
      const seed = state.playbooks.length === 0 ? INITIAL_PLAYBOOKS : [];
      return {
        ...state,
        playbooks: [next, ...seed, ...state.playbooks],
        wizardOpen: false,
        toast: { variant: 'Success', message: 'You have successfully submitted a playbook for review' },
        newPlaybookCount: state.newPlaybookCount + 1,
      };
    }
    case 'OPEN_DETAIL': return { ...state, detailPlaybookId: action.id };
    case 'CLOSE_DETAIL': return { ...state, detailPlaybookId: null, addClauseOpen: false };
    case 'OPEN_ADD_CLAUSE': return { ...state, addClauseOpen: true };
    case 'CLOSE_ADD_CLAUSE': return { ...state, addClauseOpen: false };
    case 'ADD_CLAUSE': {
      const existing = state.clauses[action.playbookId] ?? [];
      const id = `cl-new-${existing.length + 1}`;
      const updated = [...existing, { id, ...action.clause }];
      const playbooks = state.playbooks.map<Playbook>((p) =>
        p.id === action.playbookId && p.status === 'Awaiting Review'
          ? { ...p, status: 'Published' as PlaybookStatus }
          : p,
      );
      return {
        ...state,
        clauses: { ...state.clauses, [action.playbookId]: updated },
        playbooks,
        addClauseOpen: false,
        toast: { variant: 'Success', message: 'You have successfully added a clause' },
      };
    }
    case 'DELETE_CLAUSE': {
      const existing = state.clauses[action.playbookId] ?? [];
      return { ...state, clauses: { ...state.clauses, [action.playbookId]: existing.filter((c) => c.id !== action.clauseId) } };
    }
    case 'DELETE_PLAYBOOK': return { ...state, playbooks: state.playbooks.filter((p) => p.id !== action.id) };
    case 'EDIT_PLAYBOOK': return { ...state, detailPlaybookId: action.id };
    case 'MARK_ALL_READ': return { ...state, notifications: state.notifications.map((n) => ({ ...n, unread: false })) };
    case 'DISMISS_NOTIFICATION': return { ...state, notifications: state.notifications.filter((n) => n.id !== action.id) };
    case 'ADD_CONTRACT_LINK': return { ...state, contractLinks: [...state.contractLinks, { id: `link-${state.contractLinks.length + 1}`, url: action.url }] };
    case 'REMOVE_CONTRACT_LINK': return { ...state, contractLinks: state.contractLinks.filter((l) => l.id !== action.id) };
    case 'CHANGE_RAW_DATA_SYSTEM': return { ...state, rawData: state.rawData.map((r) => (r.id === action.id ? { ...r, clmSystem: action.value } : r)) };
    case 'CHANGE_RAW_DATA_COMMENT': return { ...state, rawData: state.rawData.map((r) => (r.id === action.id ? { ...r, comments: action.value } : r)) };
    case 'SET_CONTRACT_LENS': return { ...state, contractLens: action.value };
    case 'DISMISS_TOAST': return { ...state, toast: null };
    default: return state;
  }
}

export default function DataTrackerPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const unreadCount = useMemo(() => {
    if (state.notifications.every((n) => !n.unread)) return 0;
    return Math.max(NOTIFICATIONS_BADGE_COUNT, state.notifications.filter((n) => n.unread).length);
  }, [state.notifications]);

  const detailPlaybook = state.playbooks.find((p) => p.id === state.detailPlaybookId);
  const detailClauses = state.detailPlaybookId ? (state.clauses[state.detailPlaybookId] ?? state.clauses['pb-003'] ?? []) : [];

  return (
    <div data-theme={state.theme === 'orbit' ? 'orbit' : undefined} style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--orbit-font-family-sans)', background: '#f8fafc' }}>
      <SideNav
        appName="Efficio Orbit"
        clientName="Yorkshire Water"
        width={365}
        navItems={[
          {
            id: 'notifications',
            icon: '',
            label: 'Notifications',
            badge: unreadCount > 0 ? unreadCount : undefined,
            active: false,
            onClick: () => dispatch({ type: 'SET_VIEW', view: 'home' }),
          },
          {
            id: 'home',
            icon: '',
            label: 'Home',
            active: true,
            onClick: () => dispatch({ type: 'SET_VIEW', view: 'home' }),
          },
          {
            id: 'data-tracker-insights',
            icon: '',
            label: 'Data Tracker & Insights',
            active: false,
            onClick: () => dispatch({ type: 'SET_VIEW', view: 'data-tracker' }),
          },
          { id: 'document-search', icon: '', label: 'Document Search' },
        ]}
        sections={[
          { id: 'identify', label: 'Identify', color: 'var(--orbit-color-header-identify-from)' },
          { id: 'deliver', label: 'Deliver', color: 'var(--orbit-color-header-deliver-from)' },
          { id: 'sustain', label: 'Sustain', color: 'var(--orbit-color-header-sustain-from)' },
        ]}
        workItems={[
          { id: 'research-agent', title: 'Research Agent (2)', subtitle: '1min ago' },
          { id: 'route-recommendation', title: 'Route Recommendation', subtitle: '2h ago | Legal Tech Platform Up...' },
          { id: 'spend-guard', title: 'Spend Guard', subtitle: '3h ago | Legal Tech Platform Up...' },
          { id: 'rfp-analytics', title: 'RFP Analytics', subtitle: '6h ago | Fleet Cost Optimisatio...' },
          { id: 'clause-iq', title: 'Clause IQ', subtitle: '1d ago | Fleet Cost Optimisatio...' },
        ]}
        userName="Chris Hurley"
        userInitials="CH"
      />

      {state.view === 'home' ? (
        <HomeView
          notifications={state.notifications}
          onMarkAllRead={() => dispatch({ type: 'MARK_ALL_READ' })}
          onDismissNotification={(id) => dispatch({ type: 'DISMISS_NOTIFICATION', id })}
          themeOrbit={state.theme === 'orbit'}
          onThemeChange={(orbit) => dispatch({ type: 'SET_THEME', theme: orbit ? 'orbit' : 'efficio' })}
        />
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: '#f8fafc' }}>
          <DataTrackerHeader
            activeTab={state.tab}
            onTabChange={(t) => dispatch({ type: 'SET_TAB', tab: t })}
          />

          <main style={{ flex: 1, overflow: 'auto', padding: '36px 38px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {state.tab === 'insights' && (
              <div
                style={{
                  padding: 40,
                  background: '#ffffff',
                  border: '1px solid #e6e6e6',
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#475569',
                  fontFamily: 'var(--orbit-font-family-sans)',
                  fontSize: 14,
                }}
              >
                Insights view coming soon. Switch to Data Overview to manage contracts and playbooks.
              </div>
            )}

            {state.tab === 'data-overview' && (
              <section
                aria-label={state.dataMode === 'overview' ? 'Data overview' : 'Best practice library'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 26,
                  padding: '26px 26px',
                  background: '#ffffff',
                  border: '1px solid #dfe6ef',
                  borderRadius: 12,
                  boxShadow: 'none',
                }}
              >
                {state.dataMode === 'overview' ? (
                  <>
                    <ContractsPanel
                      numberOfContracts={487}
                      contractLens={state.contractLens}
                      onContractLensChange={(v) => dispatch({ type: 'SET_CONTRACT_LENS', value: v })}
                      onViewPlaybooks={() => dispatch({ type: 'SET_DATA_MODE', mode: 'playbooks' })}
                    />
                    <ContractUploader
                      links={state.contractLinks}
                      onAdd={(url) => dispatch({ type: 'ADD_CONTRACT_LINK', url })}
                      onRemove={(id) => dispatch({ type: 'REMOVE_CONTRACT_LINK', id })}
                    />
                    <RawDataTable
                      rows={state.rawData}
                      onChangeSystem={(id, value) => dispatch({ type: 'CHANGE_RAW_DATA_SYSTEM', id, value })}
                      onChangeComment={(id, value) => dispatch({ type: 'CHANGE_RAW_DATA_COMMENT', id, value })}
                    />
                  </>
                ) : (
                  <BestPracticeLibrary
                    playbooks={state.playbooks}
                    onAddPlaybook={() => dispatch({ type: 'OPEN_WIZARD' })}
                    onReview={(id) => dispatch({ type: 'OPEN_DETAIL', id })}
                    onDelete={(id) => dispatch({ type: 'DELETE_PLAYBOOK', id })}
                    onEdit={(id) => dispatch({ type: 'EDIT_PLAYBOOK', id })}
                    onBack={() => dispatch({ type: 'SET_DATA_MODE', mode: 'overview' })}
                  />
                )}
              </section>
            )}
          </main>
        </div>
      )}

      <NewPlaybookWizard
        open={state.wizardOpen}
        onCancel={() => dispatch({ type: 'CLOSE_WIZARD' })}
        onSubmit={(draft) => dispatch({ type: 'SUBMIT_WIZARD', draft })}
      />

      <PlaybookDetailModal
        open={state.detailPlaybookId !== null}
        playbook={detailPlaybook}
        clauses={detailClauses}
        addClauseOpen={state.addClauseOpen}
        onClose={() => dispatch({ type: 'CLOSE_DETAIL' })}
        onOpenAddClause={() => dispatch({ type: 'OPEN_ADD_CLAUSE' })}
        onCloseAddClause={() => dispatch({ type: 'CLOSE_ADD_CLAUSE' })}
        onSaveClause={(clause) => state.detailPlaybookId && dispatch({ type: 'ADD_CLAUSE', playbookId: state.detailPlaybookId, clause })}
        onDeleteClause={(id) => state.detailPlaybookId && dispatch({ type: 'DELETE_CLAUSE', playbookId: state.detailPlaybookId, clauseId: id })}
      />

      <ToastHost toast={state.toast} onDismiss={() => dispatch({ type: 'DISMISS_TOAST' })} />
    </div>
  );
}
