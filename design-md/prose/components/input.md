<!-- Usage guidance for Input. Editable — author freely, then run `npm run build:docs-data`. -->

Use Input for single-line free text. Every input must carry an accessible name — a visible `label` (prefer Textbox), or an `ariaLabel`/`ariaLabelledBy` on a bare Input. Communicate validation with `invalid` plus a helper message; never rely on colour alone.

- Do write placeholders as examples, not as the label.
- Do mark required fields explicitly and show errors inline.
- Don't disable an input without explaining why nearby.
- Don't use Input for multi-line content — use TextArea.
