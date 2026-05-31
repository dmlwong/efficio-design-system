'use client';

import React, { useState, useId } from 'react';
import clsx from 'clsx';
import styles from './Tooltip.module.css';

type TooltipChildProps = {
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  'aria-describedby'?: string;
};

export interface TooltipProps {
  direction?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
  content: string;
}

const alignClassMap: Record<NonNullable<TooltipProps['align']>, string> = {
  start: styles.alignStart,
  center: styles.alignCenter,
  end: styles.alignEnd,
};

export const Tooltip: React.FC<TooltipProps> = ({
  direction = 'top',
  align = 'center',
  children,
  content,
}) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const triggerProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    'aria-describedby': visible ? tooltipId : undefined,
  };

  const trigger = React.isValidElement<TooltipChildProps>(children)
    ? React.cloneElement(children, {
        onMouseEnter: (event: React.MouseEvent) => {
          children.props.onMouseEnter?.(event);
          show();
        },
        onMouseLeave: (event: React.MouseEvent) => {
          children.props.onMouseLeave?.(event);
          hide();
        },
        onFocus: (event: React.FocusEvent) => {
          children.props.onFocus?.(event);
          show();
        },
        onBlur: (event: React.FocusEvent) => {
          children.props.onBlur?.(event);
          hide();
        },
        'aria-describedby': visible
          ? [children.props['aria-describedby'], tooltipId].filter(Boolean).join(' ')
          : children.props['aria-describedby'],
      })
    : (
      <span tabIndex={0} {...triggerProps}>
        {children}
      </span>
    );

  return (
    <div className={styles.trigger}>
      {trigger}
      {visible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={clsx(styles.tooltip, styles[direction], alignClassMap[align])}
        >
          {content}
        </div>
      )}
    </div>
  );
};
