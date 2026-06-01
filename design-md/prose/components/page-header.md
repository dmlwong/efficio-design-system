<!-- Usage guidance for PageHeader. Editable — author freely, then run `npm run build:docs-data`. -->

Use PageHeader as the top-level header of a page or module. The module presets (`HeaderPresets.identify`/`deliver`/`sustain`/`rfp`) carry the correct gradient and accent, so reach for a preset rather than styling by hand. Icon-only actions must still carry a meaningful `ariaLabel`.

- Do use one PageHeader per view, at the top.
- Do keep the subtitle to a single explanatory line.
- Don't invent new header colours — extend a preset.
- Don't ship an icon-only action without an accessible name.
