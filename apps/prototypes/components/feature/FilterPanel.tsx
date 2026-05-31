'use client';

import React from 'react';
import { Checkbox, Separator, Headings } from '@efficio/orbit';
import {
  categories,
  regions,
  classificationOptions,
  certificationOptions,
  companySizeOptions,
  type Category,
  type Region,
  type Classification,
  type Certification,
  type CompanySize,
} from '@/data/mock-data';

export interface FilterState {
  categories: Category[];
  regions: Region[];
  classifications: Classification[];
  certifications: Certification[];
  companySizes: CompanySize[];
  diversityOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  visible: boolean;
  resultCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  visible,
  resultCount,
}) => {
  if (!visible) return null;

  const panelStyles: React.CSSProperties = {
    width: '260px',
    minWidth: '260px',
    borderRight: `var(--orbit-space-micro) solid var(--orbit-color-border-default)`,
    padding: 'var(--orbit-space-base)',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 280px)',
    backgroundColor: 'var(--orbit-color-bg-default)',
  };

  const sectionStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--orbit-space-s)',
    marginBottom: 'var(--orbit-space-base)',
  };

  const toggleArray = <T extends string>(arr: T[], value: T): T[] =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  return (
    <aside style={panelStyles}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--orbit-space-base)',
        }}
      >
        <Headings size="Heading 5">Filters</Headings>
        <span
          style={{
            fontSize: 'var(--orbit-text-small-size)',
            fontFamily: 'var(--orbit-font-family-sans)',
            color: 'var(--orbit-color-text-secondary)',
            lineHeight: 'var(--orbit-leading-tight)',
          }}
        >
          {resultCount} results
        </span>
      </div>

      <Separator />

      <div style={{ ...sectionStyles, marginTop: 'var(--orbit-space-base)' }}>
        <span
          style={{
            fontSize: 'var(--orbit-text-strong-size)',
            fontWeight: 'var(--orbit-text-strong-weight)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-strong-leading)',
            color: 'var(--orbit-color-text-heading)',
          }}
        >
          Category
        </span>
        {categories.map((cat) => (
          <Checkbox
            key={cat}
            checked={filters.categories.includes(cat)}
            label={cat}
            onChange={() =>
              onFiltersChange({
                ...filters,
                categories: toggleArray(filters.categories, cat),
              })
            }
          />
        ))}
      </div>

      <Separator />

      <div style={{ ...sectionStyles, marginTop: 'var(--orbit-space-base)' }}>
        <span
          style={{
            fontSize: 'var(--orbit-text-strong-size)',
            fontWeight: 'var(--orbit-text-strong-weight)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-strong-leading)',
            color: 'var(--orbit-color-text-heading)',
          }}
        >
          Geography / Region
        </span>
        {regions.map((region) => (
          <Checkbox
            key={region}
            checked={filters.regions.includes(region)}
            label={region}
            onChange={() =>
              onFiltersChange({
                ...filters,
                regions: toggleArray(filters.regions, region),
              })
            }
          />
        ))}
      </div>

      <Separator />

      <div style={{ ...sectionStyles, marginTop: 'var(--orbit-space-base)' }}>
        <span
          style={{
            fontSize: 'var(--orbit-text-strong-size)',
            fontWeight: 'var(--orbit-text-strong-weight)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-strong-leading)',
            color: 'var(--orbit-color-text-heading)',
          }}
        >
          Classification
        </span>
        {classificationOptions.map((cls) => (
          <Checkbox
            key={cls}
            checked={filters.classifications.includes(cls)}
            label={cls}
            onChange={() =>
              onFiltersChange({
                ...filters,
                classifications: toggleArray(filters.classifications, cls),
              })
            }
          />
        ))}
      </div>

      <Separator />

      <div style={{ ...sectionStyles, marginTop: 'var(--orbit-space-base)' }}>
        <span
          style={{
            fontSize: 'var(--orbit-text-strong-size)',
            fontWeight: 'var(--orbit-text-strong-weight)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-strong-leading)',
            color: 'var(--orbit-color-text-heading)',
          }}
        >
          Certifications
        </span>
        {certificationOptions.map((cert) => (
          <Checkbox
            key={cert}
            checked={filters.certifications.includes(cert)}
            label={cert}
            onChange={() =>
              onFiltersChange({
                ...filters,
                certifications: toggleArray(filters.certifications, cert),
              })
            }
          />
        ))}
      </div>

      <Separator />

      <div style={{ ...sectionStyles, marginTop: 'var(--orbit-space-base)' }}>
        <span
          style={{
            fontSize: 'var(--orbit-text-strong-size)',
            fontWeight: 'var(--orbit-text-strong-weight)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-strong-leading)',
            color: 'var(--orbit-color-text-heading)',
          }}
        >
          Company Size
        </span>
        {companySizeOptions.map((size) => (
          <Checkbox
            key={size}
            checked={filters.companySizes.includes(size)}
            label={
              size === 'Small'
                ? 'Small (1-50)'
                : size === 'Medium'
                ? 'Medium (51-500)'
                : 'Large (500+)'
            }
            onChange={() =>
              onFiltersChange({
                ...filters,
                companySizes: toggleArray(filters.companySizes, size),
              })
            }
          />
        ))}
      </div>

      <Separator />

      <div style={{ ...sectionStyles, marginTop: 'var(--orbit-space-base)' }}>
        <span
          style={{
            fontSize: 'var(--orbit-text-strong-size)',
            fontWeight: 'var(--orbit-text-strong-weight)',
            fontFamily: 'var(--orbit-font-family-sans)',
            lineHeight: 'var(--orbit-text-strong-leading)',
            color: 'var(--orbit-color-text-heading)',
          }}
        >
          Diversity Flags
        </span>
        <Checkbox
          checked={filters.diversityOnly}
          label="Diversity certified only"
          onChange={(checked) =>
            onFiltersChange({ ...filters, diversityOnly: checked })
          }
        />
      </div>
    </aside>
  );
};
