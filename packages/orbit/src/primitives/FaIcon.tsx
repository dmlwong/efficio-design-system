'use client';

import React from 'react';

/**
 * Font Awesome 6 Pro icon component.
 * Uses the locally installed OTF font files via @font-face.
 *
 * Unicode references: https://fontawesome.com/search
 */
export interface FaIconProps {
  icon: string; // Unicode character, e.g. '\uf00c' for check
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  ariaHidden?: boolean;
}

// Common Font Awesome 6 Pro unicode values. Icons render with Regular weight by default.
export const FA = {
  circleCheck: '\uf058',
  circleInfo: '\uf05a',
  circleExclamation: '\uf06a',
  triangleExclamation: '\uf071',
  xmark: '\uf00d',
  xmarkLarge: '\uf2d3',
  check: '\uf00c',
  file: '\uf15b',
  star: '\uf005',
  square: '\uf0c8',
  minus: '\uf068',
  chevronRight: '\uf054',
  user: '\uf007',
  smile: '\uf118',
  anglesUp: '\uf102',
  angleUp: '\uf106',
  angleDown: '\uf107',
  arrowUpDown: '\uf0dc',
  sortUp: '\uf0de',
  sortDown: '\uf0dd',
  circleQuestion: '\uf059',
  anglesDown: '\uf103',
  grip: '\uf58d',
} as const;

export const FaIcon: React.FC<FaIconProps> = ({
  icon,
  size = 12,
  color = 'currentColor',
  className,
  style: externalStyle,
  ariaHidden = true,
}) => {
  return (
    <span
      aria-hidden={ariaHidden}
      className={className}
      style={{
        fontFamily: "'Font Awesome 6 Pro'",
        fontWeight: 400,
        fontSize: size,
        color,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontStyle: 'normal',
        ...externalStyle,
      }}
    >
      {icon}
    </span>
  );
};
