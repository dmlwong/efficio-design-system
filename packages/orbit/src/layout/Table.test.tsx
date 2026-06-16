import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  owner: string;
}

const columns: TableColumn<Row>[] = [
  { id: 'name', header: 'Name', render: (row) => row.name },
  { id: 'owner', header: 'Owner', render: (row) => row.owner },
];

const rows: Row[] = [
  { id: '1', name: 'Legal Tech Platform Upgrade', owner: 'Chris Hurley' },
  { id: '2', name: 'Fleet Cost Optimisation', owner: 'Maya Patel' },
];

describe('Table', () => {
  it('renders headers and rows with an accessible table name', () => {
    render(<Table ariaLabel="Initiatives" columns={columns} rows={rows} getRowKey={(row) => row.id} />);

    expect(screen.getByRole('table', { name: 'Initiatives' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByText('Legal Tech Platform Upgrade')).toBeInTheDocument();
  });

  it('exposes selectable rows through row-contained buttons', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();

    render(
      <Table
        ariaLabel="Initiatives"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowSelect={onRowSelect}
        getRowSelectionLabel={(row) => `Select initiative ${row.name}`}
      />,
    );

    const rowAction = screen.getByRole('button', { name: 'Select initiative Legal Tech Platform Upgrade' });
    await user.click(rowAction);

    expect(onRowSelect).toHaveBeenCalledWith(rows[0]);
  });

  it('supports keyboard activation for selectable rows', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();

    render(
      <Table
        ariaLabel="Initiatives"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowSelect={onRowSelect}
        getRowSelectionLabel={(row) => `Select initiative ${row.name}`}
      />,
    );

    screen.getByRole('button', { name: 'Select initiative Fleet Cost Optimisation' }).focus();
    await user.keyboard('{Enter}');

    expect(onRowSelect).toHaveBeenCalledWith(rows[1]);
  });

  it('does not select a row when non-action cell content is clicked', async () => {
    const user = userEvent.setup();
    const onRowSelect = vi.fn();

    render(
      <Table
        ariaLabel="Initiatives"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        onRowSelect={onRowSelect}
        getRowSelectionLabel={(row) => `Select initiative ${row.name}`}
      />,
    );

    await user.click(screen.getByText('Chris Hurley'));

    expect(onRowSelect).not.toHaveBeenCalled();
  });

  it('renders sortable headers and pagination controls', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    const onPageChange = vi.fn();

    render(
      <Table
        ariaLabel="Initiatives"
        columns={[
          {
            id: 'name',
            header: 'Name',
            render: (row: Row) => row.name,
            sortable: true,
            sortDirection: 'asc',
            onSortChange,
            info: 'Sort by initiative name',
          },
        ]}
        rows={rows}
        getRowKey={(row) => row.id}
        pagination={{ page: 1, pageSize: 10, totalRows: 37, onPageChange }}
      />,
    );

    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: 'Sort Name descending' }));
    await user.click(screen.getByRole('button', { name: '2' }));

    expect(onSortChange).toHaveBeenCalledWith('desc');
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByText(/1 to 10/)).toBeInTheDocument();
    expect(screen.getByLabelText('Name information')).toBeInTheDocument();
  });

  it('guards invalid pagination page sizes', () => {
    render(
      <Table
        ariaLabel="Initiatives"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        pagination={{ page: 1, pageSize: 0, totalRows: 2, onPageChange: () => {} }}
      />,
    );

    expect(screen.getByText(/1 to 1/)).toBeInTheDocument();
  });
});
