<!-- Usage guidance for Dropdown. Editable — author freely, then run `npm run build:docs-data`. -->

Use Dropdown to choose one value from a known set. Give it a `label` (or a standalone `ariaLabel`/`ariaLabelledBy`) so the trigger is programmatically named. Keep option labels short and scannable; for many options or multi-value selection, use MultiSelectDropdown.

- Do provide a sensible placeholder that reads as a prompt ("Please select…").
- Do show validation with `invalid` and a helper message.
- Don't use a Dropdown for two mutually exclusive options — use Radio or a Toggle.
- Don't nest long free text inside options.
