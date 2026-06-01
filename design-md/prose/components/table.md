<!-- Usage guidance for Table. Editable — author freely, then run `npm run build:docs-data`. -->

Use Table for dense, scannable records — supplier lists, initiatives, contract rows. Row height is tuned for procurement-grade density. Make selectable rows expose a named native button (`getRowSelectionLabel`) rather than a focusable `tr`, and drive sorting through `sortable` columns.

- Do paginate large datasets rather than rendering everything at once.
- Do keep column headers short; use `info` for the longer explanation.
- Don't put primary actions only on row hover — keep them reachable by keyboard.
- Don't use a Table for layout; it is for tabular data.
