'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '../layout';
import { FA, FaIcon, Headings, Text } from '../primitives';
import styles from './ToolNextStepsCard.module.css';

interface MilestoneRow {
  milestone: string;
  dueDate: string;
  status: string;
}

export interface ToolNextStepAction {
  id: string;
  icon: string;
  title: string;
  description: string;
  href?: string;
  disabled?: boolean;
  ariaLabel?: string;
  /** Render a horizontal divider line below this row. Used to visually group rows. */
  dividerAfter?: boolean;
  /** Hide the trailing chevron while preserving its layout space. */
  hideChevron?: boolean;
  /** Render the trailing chevron pointing up to indicate an expanded row. */
  expanded?: boolean;
  /** Optional expanded content rendered below the row header when expanded is true. */
  expandedContent?: React.ReactNode;
}

export interface ToolNextStepsCardProps {
  title?: string;
  actions?: ToolNextStepAction[];
  onActionSelect?: (id: string) => void;
}

const CHEVRON_UP_GLYPH = '\uf077';
const DEFAULT_MILESTONES: MilestoneRow[] = Array.from({ length: 5 }, (_, index) => ({
  milestone: `Gate ${index + 1}`,
  dueDate: '21/05/2026',
  status: 'Pending',
}));

function DefaultMilestoneTable() {
  return (
    <div className={styles.milestoneTableWrap}>
      <table className={styles.milestoneTable}>
        <thead>
          <tr>
            <th scope="col">Milestone</th>
            <th scope="col">Due Date</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {DEFAULT_MILESTONES.map((row) => (
            <tr key={row.milestone}>
              <td>{row.milestone}</td>
              <td>{row.dueDate}</td>
              <td>{row.status}</td>
              <td>
                <button type="button" className={styles.milestoneButton}>
                  Mark Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const DEFAULT_ACTIONS: ToolNextStepAction[] = [
  {
    id: 'analyse-another-initiative',
    icon: '\uf890',
    title: 'Analyse Contract on Another Initiative',
    description: 'Start fresh with a new initiative.',
    hideChevron: true,
    dividerAfter: true,
  },
  {
    id: 'update-milestone',
    icon: '\uf328',
    title: 'Update Milestone',
    description: 'Track your initiative progress.',
    expanded: true,
    expandedContent: <DefaultMilestoneTable />,
  },
  {
    id: 'complete-initiative',
    icon: '\uf336',
    title: 'Complete Initiative',
    description: 'Mark this initiative as complete.',
    hideChevron: true,
  },
];

function ActionContent({ action }: { action: ToolNextStepAction }) {
  const chevronGlyph = action.expanded ? CHEVRON_UP_GLYPH : FA.chevronRight;

  return (
    <>
      <span className={styles.actionContent}>
        <span className={styles.iconBox} aria-hidden="true">
          <FaIcon icon={action.icon} size={18} color="var(--orbit-color-card-border-highlight)" />
        </span>
        <span className={styles.copy}>
          <Text as="span" size="Paragraph" variant="Bold">
            {action.title}
          </Text>
          <Text as="span" size="Paragraph" variant="Secondary">
            {action.description}
          </Text>
        </span>
      </span>
      <span
        className={styles.chevron}
        style={action.hideChevron ? { visibility: 'hidden' } : undefined}
        aria-hidden="true"
      >
        <FaIcon icon={chevronGlyph} size={14} color="var(--orbit-color-text-secondary)" />
      </span>
    </>
  );
}

export function ToolNextStepsCard({
  title = 'Next, you can...',
  actions = DEFAULT_ACTIONS,
  onActionSelect,
}: ToolNextStepsCardProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(actions.filter((action) => action.expanded).map((action) => action.id)),
  );

  useEffect(() => {
    setExpandedIds(new Set(actions.filter((action) => action.expanded).map((action) => action.id)));
  }, [actions]);

  return (
    <Card state="Default" type="Static" padding="Base">
      <div className={styles.card}>
        <Headings size="Heading 5">{title}</Headings>
        <div className={styles.actions}>
          {actions.map((action) => {
            const isExpanded = expandedIds.has(action.id);
            const hasExpandedContent = Boolean(action.expandedContent);
            const expandedContent = isExpanded && action.expandedContent ? (
              <div className={styles.expandedContent}>{action.expandedContent}</div>
            ) : null;
            const handleAction = () => {
              if (action.disabled) return;

              if (hasExpandedContent) {
                setExpandedIds((prev) => {
                  const next = new Set(prev);
                  if (next.has(action.id)) next.delete(action.id);
                  else next.add(action.id);
                  return next;
                });
              }

              onActionSelect?.(action.id);
            };
            const header = action.href && !action.disabled ? (
              <a
                key={action.id}
                href={action.href}
                className={styles.action}
                aria-label={action.ariaLabel}
                onClick={() => onActionSelect?.(action.id)}
              >
                <ActionContent action={{ ...action, expanded: isExpanded }} />
              </a>
            ) : (
              <button
                key={action.id}
                type="button"
                className={styles.action}
                disabled={action.disabled}
                aria-label={action.ariaLabel}
                aria-expanded={hasExpandedContent ? isExpanded : undefined}
                onClick={handleAction}
              >
                <ActionContent action={{ ...action, expanded: isExpanded }} />
              </button>
            );
            const node = (
              <div key={action.id} className={styles.actionPanel}>
                {header}
                {expandedContent}
              </div>
            );

            return action.dividerAfter ? (
              <React.Fragment key={action.id}>
                {node}
                <hr aria-hidden="true" className={styles.divider} />
              </React.Fragment>
            ) : node;
          })}
        </div>
      </div>
    </Card>
  );
}
