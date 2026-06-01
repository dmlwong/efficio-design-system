<!-- Usage guidance for Overlay. Editable — author freely, then run `npm run build:docs-data`. -->

Use Overlay for modal dialogs and side panels that need the user's full attention. It traps focus while open, restores focus to the trigger on close, and requires an accessible name (`aria-label` or `aria-labelledby`).

- Do give every overlay a title that names its purpose.
- Do return focus to the control that opened it.
- Don't stack overlays — resolve one before opening another.
- Don't use an overlay for non-blocking feedback; use Toast or InlineBanner.
