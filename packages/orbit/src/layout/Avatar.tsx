'use client';

import React from 'react';
import clsx from 'clsx';
import { FaIcon, FA } from '../primitives/FaIcon';
import styles from './Avatar.module.css';

export interface AvatarProps {
  style?: 'Text' | 'Image' | 'Icon' | 'Square';
  size?: 'Extra Small' | 'Small' | 'Medium' | 'Large';
  initials?: string;
  name: string;
  color?: string;
  src?: string;
  alt?: string;
}

const sizeMap: Record<string, string> = {
  'Extra Small': 'var(--orbit-space-m)',
  Small: 'var(--orbit-space-l)',
  Medium: 'var(--orbit-space-xxl)',
  Large: 'var(--orbit-space-mega)',
};

const fontSizeMap: Record<string, string> = {
  'Extra Small': 'var(--orbit-text-xs)',
  Small: 'var(--orbit-text-xs)',
  Medium: 'var(--orbit-text-sm)',
  Large: 'var(--orbit-text-lg)',
};

export const Avatar: React.FC<AvatarProps> = ({
  style = 'Text',
  size = 'Medium',
  initials,
  name,
  color,
  src,
  alt,
}) => {
  const displayInitials = initials || name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const className = clsx(styles.avatar, style === 'Square' && styles.square);

  const cssVars = {
    '--_size': sizeMap[size],
    '--_fontSize': fontSizeMap[size],
    '--_bg': color || 'var(--orbit-color-efficio-blue)',
  } as React.CSSProperties;

  if (style === 'Image' && src) {
    return (
      <img
        className={className}
        style={cssVars}
        src={src}
        alt={alt || name}
      />
    );
  }

  if (style === 'Icon') {
    return (
      <div className={className} style={cssVars} title={name} role="img" aria-label={name}>
        <FaIcon icon={FA.user} size={{ 'Extra Small': 10, Small: 14, Medium: 20, Large: 28 }[size] || 20} color="currentColor" />
      </div>
    );
  }

  return (
    <div className={className} style={cssVars} title={name} role="img" aria-label={name}>
      {displayInitials}
    </div>
  );
};

export interface AvatarStackProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  avatars,
  max = 3,
  size,
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const hiddenCount = Math.max(avatars.length - visibleAvatars.length, 0);

  return (
    <div className={styles.stack} aria-label={`${avatars.length} avatars`}>
      {visibleAvatars.map((avatar) => (
        <span key={`${avatar.name}-${avatar.initials ?? ''}`} className={styles.stackItem}>
          <Avatar {...avatar} size={size ?? avatar.size} />
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className={styles.stackItem}>
          <Avatar name={`${hiddenCount} more`} initials={`+${hiddenCount}`} size={size ?? 'Medium'} />
        </span>
      )}
    </div>
  );
};
