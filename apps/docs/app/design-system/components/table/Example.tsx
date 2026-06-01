'use client';

import { useState } from 'react';
import { Table, type TableColumn } from '@efficio/orbit';

interface ShowcaseTableRow {
  id: string;
  initiative: string;
  sector: string;
  owner: string;
}

const ROWS: ShowcaseTableRow[] = [
  { id: '1', initiative: 'Legal Tech Platform Upgrade', sector: 'Technology', owner: 'Chris Hurley' },
  { id: '2', initiative: 'Fleet Cost Optimisation', sector: 'Operations', owner: 'Maya Patel' },
  { id: '3', initiative: 'Cloud Contract Consolidation', sector: 'Technology', owner: 'Daniel Green' },
];

const COLUMNS: TableColumn<ShowcaseTableRow>[] = [
  { id: 'initiative', header: 'Initiative name', render: (row) => row.initiative },
  { id: 'sector', header: 'Sector', render: (row) => row.sector },
  { id: 'owner', header: 'Owner', render: (row) => row.owner },
];

export default function TableExample() {
  const [tablePage, setTablePage] = useState(1);
  const [tableSort, setTableSort] = useState<'asc' | 'desc'>('asc');
  return (
    <Table
      ariaLabel="Initiative examples"
      columns={[
        {
          id: 'initiative',
          header: 'Initiative name',
          render: (row: ShowcaseTableRow) => row.initiative,
          sortable: true,
          sortDirection: tableSort,
          onSortChange: setTableSort,
          info: 'Sort by initiative name',
        },
        ...COLUMNS.slice(1),
      ]}
      rows={ROWS}
      getRowKey={(row) => row.id}
      onRowSelect={() => {}}
      getRowSelectionLabel={(row) => `Select initiative ${row.initiative}`}
      pagination={{ page: tablePage, pageSize: 10, totalRows: 37, onPageChange: setTablePage }}
    />
  );
}
