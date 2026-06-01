<!-- Usage guidance for Toast. Editable — author freely, then run `npm run build:docs-data`. -->

Use Toast for ephemeral, non-blocking feedback after an action — "Saved", "Upload failed". It should auto-dismiss and stay dismissible. For persistent or in-context messages use InlineBanner; for content that must be acknowledged use Overlay.

- Do keep the message to one line, with an optional action.
- Do match `type` to the outcome (Success/Error/Warning/Info).
- Don't use Toast for critical errors that block the task.
- Don't show several toasts at once — queue them.
