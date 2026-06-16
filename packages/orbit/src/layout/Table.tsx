'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './Table.module.css';
import { Tooltip } from '../feedback/Tooltip';
import { FaIcon, FA } from '../primitives/FaIcon';

export interface TableColumn<T> {
  id: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc';
  info?: string;
  onSortChange?: (direction: 'asc' | 'desc') => void;
}

export interface TablePaginationProps {
  pageSize: number;
  page: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => React.Key;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  density?: 'Default' | 'Compact';
  variant?: 'Default' | 'SeparatedRows';
  emptyState?: React.ReactNode;
  onRowSelect?: (row: T) => void;
  getRowSelectionLabel?: (row: T, index: number) => string;
  pagination?: TablePaginationProps;
}

export function Table<T>({
  columns,
  rows,
  getRowKey,
  ariaLabel,
  ariaLabelledBy,
  density = 'Default',
  variant = 'Default',
  emptyState = 'No rows available.',
  onRowSelect,
  getRowSelectionLabel,
  pagination,
}: TableProps<T>) {
  const isSelectable = Boolean(onRowSelect);

  return (
    <div className={clsx(styles.tableWrap, variant === 'SeparatedRows' && styles.separatedWrap)}>
      <table
        className={clsx(
          styles.table,
          density === 'Compact' && styles.compact,
          variant === 'SeparatedRows' && styles.separatedTable,
        )}
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                aria-sort={column.sortDirection === 'asc' ? 'ascending' : column.sortDirection === 'desc' ? 'descending' : undefined}
                style={column.width ? { width: column.width } : undefined}
              >
                <TableHeader column={column} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={getRowKey(row)}
              className={isSelectable ? styles.selectableRow : undefined}
            >
              {columns.map((column, columnIndex) => (
                <td key={column.id}>
                  {isSelectable && columnIndex === 0 ? (
                    <button
                      type="button"
                      className={styles.rowAction}
                      aria-label={getRowSelectionLabel?.(row, rowIndex) ?? 'Select row'}
                      onClick={() => onRowSelect?.(row)}
                    >
                      {column.render(row)}
                    </button>
                  ) : (
                    column.render(row)
                  )}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className={styles.emptyCell} colSpan={columns.length}>
                {emptyState}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {pagination && <TablePagination pagination={pagination} />}
    </div>
  );
}

function TableHeader<T>({ column }: { column: TableColumn<T> }) {
  const sortIcon = column.sortDirection === 'asc'
    ? FA.sortUp
    : column.sortDirection === 'desc'
      ? FA.sortDown
      : FA.arrowUpDown;

  const headerLabel = typeof column.header === 'string' ? column.header : column.id;
  const nextDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
  const nextDirectionLabel = nextDirection === 'asc' ? 'ascending' : 'descending';

  return (
    <div className={styles.headerContent}>
      {column.sortable ? (
        <button
          type="button"
          className={styles.sortButton}
          onClick={() => column.onSortChange?.(nextDirection)}
          disabled={!column.onSortChange}
          aria-label={`Sort ${headerLabel} ${nextDirectionLabel}`}
        >
          <span>{column.header}</span>
          <FaIcon icon={sortIcon} size={12} color="currentColor" />
        </button>
      ) : (
        <span>{column.header}</span>
      )}
      {column.info && (
        <Tooltip content={column.info}>
          <span className={styles.infoIcon} tabIndex={0} aria-label={`${headerLabel} information`} role="img">
            <FaIcon icon={FA.circleQuestion} size={12} color="currentColor" />
          </span>
        </Tooltip>
      )}
    </div>
  );
}

function TablePagination({ pagination }: { pagination: TablePaginationProps }) {
  const pageSize = Math.max(pagination.pageSize, 1);
  const totalPages = Math.max(Math.ceil(pagination.totalRows / pageSize), 1);
  const currentPage = Math.min(Math.max(pagination.page, 1), totalPages);
  const start = pagination.totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, pagination.totalRows);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className={styles.pagination} aria-label="Table pagination">
      <span className={styles.pageRange}>
        <strong>{start} to {end}</strong> of {pagination.totalRows} items
      </span>
      <div className={styles.pageControls}>
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => pagination.onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <FaIcon icon={FA.angleUp} size={12} color="currentColor" style={{ transform: 'rotate(-90deg)' }} />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={clsx(styles.pageButton, page === currentPage && styles.pageButtonActive)}
            onClick={() => pagination.onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className={styles.pageButton}
          onClick={() => pagination.onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <FaIcon icon={FA.angleDown} size={12} color="currentColor" style={{ transform: 'rotate(-90deg)' }} />
        </button>
      </div>
    </nav>
  );
}
