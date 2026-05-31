# Orbit Component Manifest



Source scanned: `packages/orbit/src`.



## Alert
- **File:** `packages/orbit/src/feedback/Alert.tsx`
- **Description:** Renders a multiline status alert with icon, title, optional description, and dismiss action.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `description` | `string` | No | — | — |
| `onDismiss` | `() => void` | No | — | — |
| `title` | `string` | Yes | — | — |
| `type` | `'Information' \| 'Success' \| 'Error' \| 'Warning' \| 'No Status'` | Yes | — | — |
- **Variants:**
- `type`: `Information`, `Success`, `Error`, `Warning`, `No Status`
- **Tokens consumed:**
  - colour: `--orbit-color-dark-grey`, `--orbit-color-focus-ring`, `--orbit-color-status-low-bg-error`, `--orbit-color-status-low-bg-information`, `--orbit-color-status-low-bg-no-status`, `--orbit-color-status-low-bg-success`, `--orbit-color-status-low-bg-warning`, `--orbit-color-status-low-fg-error`, `--orbit-color-status-low-fg-information`, `--orbit-color-status-low-fg-no-status`, `--orbit-color-status-low-fg-success`, `--orbit-color-status-low-fg-warning`, `--orbit-color-status-low-icon-error`, `--orbit-color-status-low-icon-information`, `--orbit-color-status-low-icon-no-status`, `--orbit-color-status-low-icon-success`, `--orbit-color-status-low-icon-warning`
  - spacing: `--orbit-space-base`, `--orbit-space-m`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-brand`, `--orbit-font-weight-bold`, `--orbit-font-weight-regular`, `--orbit-leading-normal`, `--orbit-text-body-size`
  - radius: `--orbit-radius-md`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`

## Avatar
- **File:** `packages/orbit/src/layout/Avatar.tsx`
- **Description:** Displays user initials in a styled circular avatar, with optional status and custom color.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `alt` | `string` | No | — | — |
| `color` | `string` | No | — | — |
| `initials` | `string` | No | — | — |
| `name` | `string` | Yes | — | — |
| `size` | `'Extra Small' \| 'Small' \| 'Medium' \| 'Large'` | No | `'Medium'` | — |
| `src` | `string` | No | — | — |
| `style` | `'Text' \| 'Image' \| 'Icon' \| 'Square'` | No | `'Text'` | — |
- **Variants:**
- `size`: `Extra Small`, `Small`, `Medium`, `Large`
- `style`: `Text`, `Image`, `Icon`, `Square`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-efficio-blue`, `--orbit-color-text-inverse`
  - spacing: `--orbit-space-l`, `--orbit-space-m`, `--orbit-space-mega`, `--orbit-space-px`, `--orbit-space-s`, `--orbit-space-xxl`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-semibold`, `--orbit-leading-tight`, `--orbit-text-lg`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-pill`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`

## AvatarStack
- **File:** `packages/orbit/src/layout/Avatar.tsx`
- **Description:** Displays a compact row of avatars with optional overflow count.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `avatars` | `AvatarProps[]` | Yes | — | — |
| `max` | `number` | No | `3` | — |
| `size` | `'Extra Small' \| 'Small' \| 'Medium' \| 'Large'` | No | — | — |
- **Variants:**
- `size`: `Extra Small`, `Small`, `Medium`, `Large`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-efficio-blue`, `--orbit-color-text-inverse`
  - spacing: `--orbit-space-l`, `--orbit-space-m`, `--orbit-space-mega`, `--orbit-space-px`, `--orbit-space-s`, `--orbit-space-xxl`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-semibold`, `--orbit-leading-tight`, `--orbit-text-lg`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-pill`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** `Avatar`

## Badge
- **File:** `packages/orbit/src/indicators/Badge.tsx`
- **Description:** Displays a compact count or status badge in a semantic color.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `label` | `string` | Yes | — | — |
| `status` | `'Information' \| 'Success' \| 'Error' \| 'Warning' \| 'No Status' \| 'Green' \| 'Red' \| 'Gray'` | No | `'Green'` | — |
- **Variants:**
- `status`: `Information`, `Success`, `Error`, `Warning`, `No Status`, `Green`, `Red`, `Gray`
- **Tokens consumed:**
  - colour: `--orbit-color-bright-green`, `--orbit-color-bright-orange`, `--orbit-color-mid-gray`, `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-information`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-status-high-bg-success`, `--orbit-color-status-high-bg-warning`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-space-s`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-xs`
  - radius: `--orbit-badge-radius`
  - shadow: none
- **Composes:** none

## Banner
- **File:** `packages/orbit/src/feedback/Banner.tsx`
- **Description:** Back-compatible alias for Alert; use InlineBanner for Figma feedback strips.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `description` | `string` | No | — | — |
| `onDismiss` | `() => void` | No | — | — |
| `title` | `string` | Yes | — | — |
| `type` | `'Information' \| 'Success' \| 'Error' \| 'Warning' \| 'No Status'` | Yes | — | — |
- **Variants:**
- `type`: `Information`, `Success`, `Error`, `Warning`, `No Status`
- **Tokens consumed:**
  - colour: `--orbit-color-dark-grey`, `--orbit-color-focus-ring`, `--orbit-color-status-low-bg-error`, `--orbit-color-status-low-bg-information`, `--orbit-color-status-low-bg-no-status`, `--orbit-color-status-low-bg-success`, `--orbit-color-status-low-bg-warning`, `--orbit-color-status-low-fg-error`, `--orbit-color-status-low-fg-information`, `--orbit-color-status-low-fg-no-status`, `--orbit-color-status-low-fg-success`, `--orbit-color-status-low-fg-warning`, `--orbit-color-status-low-icon-error`, `--orbit-color-status-low-icon-information`, `--orbit-color-status-low-icon-no-status`, `--orbit-color-status-low-icon-success`, `--orbit-color-status-low-icon-warning`
  - spacing: `--orbit-space-base`, `--orbit-space-m`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-brand`, `--orbit-font-weight-bold`, `--orbit-font-weight-regular`, `--orbit-leading-normal`, `--orbit-text-body-size`
  - radius: `--orbit-radius-md`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** `Alert`

## Breadcrumb
- **File:** `packages/orbit/src/navigation/Breadcrumb.tsx`
- **Description:** Renders a breadcrumb trail of links and the current page.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | Yes | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-medium`, `--orbit-text-small-leading`, `--orbit-text-small-size`, `--orbit-text-small-weight`
  - radius: none
  - shadow: none
- **Composes:** `FaIcon`

## Button
- **File:** `packages/orbit/src/actions/Button.tsx`
- **Description:** Renders an Orbit button with variant, size, state, and optional icons.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `icon` | `ReactNode` | No | — | — |
| `iconRight` | `ReactNode` | No | — | — |
| `size` | `'Small' \| 'Medium'` | No | `'Medium'` | — |
| `state` | `'Default' \| 'Hover' \| 'Disabled'` | No | `'Default'` | — |
| `variant` | `'Primary' \| 'Secondary' \| 'Tertiary' \| 'Positive' \| 'Destructive'` | No | `'Primary'` | — |
- **Variants:**
- `size`: `Small`, `Medium`
- `state`: `Default`, `Hover`, `Disabled`
- `variant`: `Primary`, `Secondary`, `Tertiary`, `Positive`, `Destructive`
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-btn-primary-bg`, `--orbit-color-btn-primary-bg-destructive`, `--orbit-color-btn-primary-bg-disabled`, `--orbit-color-btn-primary-bg-hover`, `--orbit-color-btn-primary-bg-positive`, `--orbit-color-btn-primary-fg`, `--orbit-color-btn-primary-fg-disabled`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-bg-hover`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-fg`, `--orbit-color-btn-secondary-fg-disabled`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-tertiary-bg-disabled`, `--orbit-color-btn-tertiary-bg-hover`, `--orbit-color-btn-tertiary-fg`, `--orbit-color-btn-tertiary-fg-disabled`
  - spacing: `--orbit-btn-height-medium`, `--orbit-btn-height-small`, `--orbit-btn-icon-size`, `--orbit-space-base`, `--orbit-space-micro`, `--orbit-space-s`
  - typography: `--orbit-font-family-sans`, `--orbit-text-button-leading`, `--orbit-text-button-size`, `--orbit-text-button-weight`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## Carat
- **File:** `packages/orbit/src/primitives/Carat.tsx`
- **Description:** Displays a small decorative caret indicator when visible.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `visible` | `boolean` | No | `true` | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-text-primary`
  - spacing: none
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-body-leading`, `--orbit-text-sm`
  - radius: none
  - shadow: none
- **Composes:** none

## Card
- **File:** `packages/orbit/src/layout/Card.tsx`
- **Description:** Wraps content in a non-interactive Orbit card surface with configurable border and background treatment.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | — | — |
| `padding` | `'Small' \| 'Medium' \| 'Base'` | No | `'Base'` | — |
| `state` | `'Success' \| 'Warning' \| 'Default' \| 'Hover' \| 'Disabled' \| 'Highlight' \| 'Accent'` | No | `'Default'` | — |
| `style` | `React.CSSProperties` | No | — | — |
| `type` | `'Static' \| 'Dynamic'` | No | `'Dynamic'` | — |
- **Variants:**
- `padding`: `Small`, `Medium`, `Base`
- `state`: `Success`, `Warning`, `Default`, `Hover`, `Disabled`, `Highlight`, `Accent`
- `type`: `Static`, `Dynamic`
- **Tokens consumed:**
  - colour: `--orbit-color-card-bg-accent`, `--orbit-color-card-bg-default`, `--orbit-color-card-bg-disabled`, `--orbit-color-card-bg-selected`, `--orbit-color-card-bg-style1`, `--orbit-color-card-border-accent`, `--orbit-color-card-border-default`, `--orbit-color-card-border-highlight`, `--orbit-color-card-border-selected`, `--orbit-color-card-border-style1`
  - spacing: `--orbit-space-base`, `--orbit-space-m`, `--orbit-space-s`
  - typography: none
  - radius: `--orbit-radius-md`
  - shadow: `--orbit-shadow-md`, `--orbit-shadow-none`, `--orbit-shadow-sm`
- **Composes:** none

## Checkbox
- **File:** `packages/orbit/src/inputs/Checkbox.tsx`
- **Description:** Renders a labelled native checkbox with checked, disabled, and accessible-name support.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `'Left' \| 'Right'` | No | `'Left'` | — |
| `ariaLabel` | `string` | No | `'Checkbox'` | — |
| `checked` | `boolean` | Yes | — | — |
| `label` | `string` | No | — | — |
| `onChange` | `(checked: boolean) => void` | Yes | — | — |
| `state` | `'Hover' \| 'Disabled' \| 'Active'` | No | `'Active'` | — |
- **Variants:**
- `alignment`: `Left`, `Right`
- `state`: `Hover`, `Disabled`, `Active`
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-border-hover`, `--orbit-color-checkbox-checked-bg`, `--orbit-color-checkbox-checked-border`, `--orbit-color-checkbox-disabled-bg`, `--orbit-color-checkbox-disabled-fg`, `--orbit-color-checkbox-unchecked-bg`, `--orbit-color-checkbox-unchecked-border`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-text-body-leading`, `--orbit-text-body-size`, `--orbit-text-body-weight`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`

## Chip
- **File:** `packages/orbit/src/indicators/Chip.tsx`
- **Description:** Displays a static, toggleable, or removable compact chip with semantic styling.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | No | — | — |
| `label` | `string` | Yes | — | — |
| `onClick` | `never` | Conditional | — | — |
| `onRemove` | `never` | No | — | — |
| `removable` | `false` | Conditional | — | — |
| `selected` | `boolean` | No | `false` | — |
| `size` | `ChipSize` | No | `'Default'` | — |
| `variant` | `ChipVariant` | No | `'Outline'` | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-border-selected`, `--orbit-color-chip-additional-bg`, `--orbit-color-chip-additional-border`, `--orbit-color-chip-additional-fg`, `--orbit-color-chip-default-border`, `--orbit-color-chip-disabled-bg`, `--orbit-color-chip-disabled-fg`, `--orbit-color-chip-no-status-bg`, `--orbit-color-status-low-bg-error`, `--orbit-color-status-low-bg-information`, `--orbit-color-status-low-bg-success`, `--orbit-color-status-low-bg-warning`, `--orbit-color-status-low-border-error`, `--orbit-color-status-low-border-information`, `--orbit-color-status-low-border-success`, `--orbit-color-status-low-border-warning`, `--orbit-color-text-error`, `--orbit-color-text-info`, `--orbit-color-text-primary`, `--orbit-color-text-success`, `--orbit-color-text-warning`, `--orbit-color-white`
  - spacing: `--orbit-chip-close-size`, `--orbit-chip-height-mini`, `--orbit-space-0`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-xs`
  - radius: `--orbit-chip-radius-default`, `--orbit-chip-radius-mini`
  - shadow: none
- **Composes:** `FaIcon`

## CountryFlag
- **File:** `packages/orbit/src/layout/CountryFlag.tsx`
- **Description:** Renders a country flag glyph for supported country codes.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `country` | `string` | Yes | — | — |
| `countryName` | `string` | No | — | — |
| `flag` | `string` | No | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-text-primary`
  - spacing: `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-text-base`, `--orbit-text-body-size`
  - radius: none
  - shadow: none
- **Composes:** none

## CurrencyInput
- **File:** `packages/orbit/src/inputs/CurrencyInput.tsx`
- **Description:** Renders a labelled currency input with prefix, validation states, and accessible naming.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `currency` | `string` | No | `'GBP'` | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `label` | `string` | Conditional | — | — |
| `message` | `string` | No | — | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `placeholder` | `string` | No | `'Enter text'` | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `required` | `boolean` | No | `false` | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-text-disabled`, `--orbit-color-text-error`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-dropdown-trigger-height`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## DateInput
- **File:** `packages/orbit/src/inputs/DateInput.tsx`
- **Description:** Renders a date input with an optional picker button and accessible naming.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `placeholder` | `string` | No | `'yy-mm-dd'` | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-border-hover`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-btn-secondary-border-error`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-secondary-icon-disabled`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-l`, `--orbit-space-m`, `--orbit-space-s`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`

## DocumentGlyph
- **File:** `packages/orbit/src/indicators/DocumentGlyph.tsx`
- **Description:** Displays a document-type glyph for files such as PDF, DOC, XLS, ZIP, and images.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `documentType` | `'XLS' \| 'DOC' \| 'PDF' \| 'ZIP' \| 'IMG' \| 'Unknown'` | No | `'XLS'` | — |
| `size` | `'Extra Small' \| 'Small' \| 'Medium' \| 'Large' \| 'Micro'` | No | `'Large'` | — |
- **Variants:**
- `documentType`: `XLS`, `DOC`, `PDF`, `ZIP`, `IMG`, `Unknown`
- `size`: `Extra Small`, `Small`, `Medium`, `Large`, `Micro`
- **Tokens consumed:**
  - colour: `--orbit-color-doc-fold-overlay`, `--orbit-color-doc-img`, `--orbit-color-doc-label`, `--orbit-color-doc-pdf`, `--orbit-color-doc-unknown`, `--orbit-color-doc-word`, `--orbit-color-doc-xls`, `--orbit-color-doc-zip`
  - spacing: `--orbit-document-glyph-icon-size-extra-small`, `--orbit-document-glyph-icon-size-large`, `--orbit-document-glyph-icon-size-medium`, `--orbit-document-glyph-icon-size-small`, `--orbit-document-glyph-label-size-extra-small`, `--orbit-document-glyph-label-size-large`, `--orbit-document-glyph-label-size-medium`, `--orbit-document-glyph-label-size-small`, `--orbit-document-glyph-overlay-padding-extra-small`, `--orbit-document-glyph-overlay-padding-large`, `--orbit-document-glyph-overlay-padding-medium`, `--orbit-document-glyph-overlay-padding-small`, `--orbit-document-glyph-size-extra-small`, `--orbit-document-glyph-size-large`, `--orbit-document-glyph-size-medium`, `--orbit-document-glyph-size-micro`, `--orbit-document-glyph-size-small`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-bold`, `--orbit-font-weight-regular`
  - radius: `--orbit-document-glyph-micro-radius`
  - shadow: none
- **Composes:** none

## Dropdown
- **File:** `packages/orbit/src/inputs/Dropdown.tsx`
- **Description:** Renders a labelled select control with helper, error, and accessible naming support.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `label` | `string` | Conditional | — | — |
| `message` | `string` | No | — | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `options` | `DropdownOption[]` | Yes | — | — |
| `placeholder` | `string` | No | `'Please Select...'` | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `required` | `boolean` | No | `false` | — |
| `value` | `string` | No | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-secondary-icon-disabled`, `--orbit-color-text-disabled`, `--orbit-color-text-error`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-dropdown-chevron-size`, `--orbit-dropdown-option-height`, `--orbit-dropdown-trigger-height`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-sm`
  - shadow: `--orbit-shadow-lg`
  - other: `--orbit-z-dropdown`
- **Composes:** `FaIcon`

## Dropzone
- **File:** `packages/orbit/src/inputs/Dropzone.tsx`
- **Description:** Renders an accessible file dropzone with drag, choose-file, validation, and disabled states.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `accept` | `string` | No | — | — |
| `acceptedFileTypesLabel` | `string` | No | — | — |
| `ariaLabel` | `string` | Yes | — | — |
| `chooseButtonLabel` | `string` | No | `'choose files'` | — |
| `disabled` | `boolean` | No | `false` | — |
| `error` | `ReactNode` | No | — | — |
| `icon` | `ReactNode` | No | — | — |
| `maxFileSizeLabel` | `string` | No | — | — |
| `onFileSelected` | `(file: File) => void` | Yes | — | — |
| `promptPrefix` | `ReactNode` | No | `'Drag & drop or'` | — |
| `promptSuffix` | `ReactNode` | No | `'to upload'` | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-btn-tertiary-fg`, `--orbit-color-btn-tertiary-fg-disabled`, `--orbit-color-card-bg-accent`, `--orbit-color-card-bg-default`, `--orbit-color-card-bg-style1`, `--orbit-color-card-border-accent`, `--orbit-color-card-border-highlight`, `--orbit-color-text-error`, `--orbit-color-text-secondary`
  - spacing: `--orbit-dropzone-min-height`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxl`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-medium`, `--orbit-text-sm`
  - radius: `--orbit-radius-md`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`, `Text`

## FaIcon
- **File:** `packages/orbit/src/primitives/FaIcon.tsx`
- **Description:** Font Awesome 6 Pro icon component.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaHidden` | `boolean` | No | `true` | — |
| `color` | `string` | No | `'currentColor'` | — |
| `icon` | `string` | Yes | — | — |
| `size` | `number` | No | `12` | — |
| `style` | `React.CSSProperties` | No | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: none
  - spacing: none
  - typography: none
  - radius: none
  - shadow: none
- **Composes:** none

## FileItem
- **File:** `packages/orbit/src/layout/FileItem.tsx`
- **Description:** Displays a file row with name, meta content, optional icon, and optional action.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `documentType` | `'XLS' \| 'DOC' \| 'PDF' \| 'ZIP' \| 'IMG' \| 'Unknown'` | No | `'Unknown'` | — |
| `filename` | `string` | Yes | — | — |
| `fixedWidth` | `number` | No | — | — |
| `onClick` | `() => void` | No | — | — |
| `trailing` | `ReactNode` | No | — | — |
- **Variants:**
- `documentType`: `XLS`, `DOC`, `PDF`, `ZIP`, `IMG`, `Unknown`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-bg-hover`, `--orbit-color-border-default`, `--orbit-color-border-focused`, `--orbit-color-text-heading`
  - spacing: `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** `DocumentGlyph`

## Filter
- **File:** `packages/orbit/src/indicators/Filter.tsx`
- **Description:** Displays a removable filter pill with text and close action.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | Yes | — | — |
| `onRemove` | `() => void` | No | — | — |
| `state` | `'Default' \| 'Hover'` | No | `'Default'` | — |
- **Variants:**
- `state`: `Default`, `Hover`
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg-hover`, `--orbit-color-card-bg-accent`, `--orbit-color-silver`, `--orbit-color-text-secondary`
  - spacing: `--orbit-chip-height-mini`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-leading-tight`, `--orbit-text-xs`
  - radius: `--orbit-radius-pill`
  - shadow: none
- **Composes:** `FaIcon`

## Headings
- **File:** `packages/orbit/src/primitives/Headings.tsx`
- **Description:** Renders semantic heading text with Orbit heading sizes.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | Yes | — | — |
| `size` | `'Heading 1' \| 'Heading 2' \| 'Heading 3' \| 'Heading 4' \| 'Heading 5'` | Yes | — | — |
| `style` | `React.CSSProperties` | No | — | — |
- **Variants:**
- `size`: `Heading 1`, `Heading 2`, `Heading 3`, `Heading 4`, `Heading 5`
- **Tokens consumed:**
  - colour: `--orbit-color-text-heading`
  - spacing: `--orbit-space-0`
  - typography: `--orbit-font-family-sans`, `--orbit-text-h1-family`, `--orbit-text-h1-leading`, `--orbit-text-h1-size`, `--orbit-text-h1-weight`, `--orbit-text-h2-leading`, `--orbit-text-h2-size`, `--orbit-text-h2-weight`, `--orbit-text-h3-leading`, `--orbit-text-h3-size`, `--orbit-text-h3-weight`, `--orbit-text-h4-leading`, `--orbit-text-h4-size`, `--orbit-text-h4-weight`, `--orbit-text-h5-leading`, `--orbit-text-h5-size`, `--orbit-text-h5-weight`
  - radius: none
  - shadow: none
- **Composes:** none

## IconButton
- **File:** `packages/orbit/src/actions/IconButton.tsx`
- **Description:** Renders an icon-only Orbit button with accessible label, variant, size, and state.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Yes | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `icon` | `ReactNode` | Yes | — | — |
| `size` | `'Small' \| 'Medium' \| 'Large'` | No | `'Medium'` | — |
| `state` | `'Default' \| 'Hover' \| 'Disabled'` | No | `'Default'` | — |
| `variant` | `'Primary' \| 'Secondary' \| 'Tertiary' \| 'Positive' \| 'Destructive'` | No | `'Secondary'` | — |
- **Variants:**
- `size`: `Small`, `Medium`, `Large`
- `state`: `Default`, `Hover`, `Disabled`
- `variant`: `Primary`, `Secondary`, `Tertiary`, `Positive`, `Destructive`
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-btn-primary-bg`, `--orbit-color-btn-primary-bg-destructive`, `--orbit-color-btn-primary-bg-disabled`, `--orbit-color-btn-primary-bg-hover`, `--orbit-color-btn-primary-bg-positive`, `--orbit-color-btn-primary-fg`, `--orbit-color-btn-primary-fg-disabled`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-bg-hover`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-secondary-icon-disabled`, `--orbit-color-btn-tertiary-bg-hover`, `--orbit-color-btn-tertiary-fg-disabled`
  - spacing: `--orbit-space-0`, `--orbit-space-micro`
  - typography: none
  - radius: `--orbit-radius-sm`
  - shadow: none
  - other: `--orbit-icon-btn-large`, `--orbit-icon-btn-medium`, `--orbit-icon-btn-small`
- **Composes:** none

## InlineBanner
- **File:** `packages/orbit/src/feedback/InlineBanner.tsx`
- **Description:** Renders a compact single-line feedback banner with semantic tone and optional dismiss action.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `contrast` | `'High' \| 'Low'` | No | `'High'` | — |
| `icon` | `string` | No | — | — |
| `label` | `string` | Yes | — | — |
| `status` | `string` | No | — | Optional by design: product flows may use the strip as label-only feedback. The Figma reference renders a status slot, and the showcase covers that path. |
| `variant` | `'Information' \| 'Success' \| 'Error' \| 'Warning' \| 'No Status' \| 'Disabled' \| 'Style 1' \| 'None'` | Yes | — | — |
- **Variants:**
- `contrast`: `High`, `Low`
- `variant`: `Information`, `Success`, `Error`, `Warning`, `No Status`, `Disabled`, `Style 1`, `None`
- **Tokens consumed:**
  - colour: `--orbit-color-border-default`, `--orbit-color-border-focused`, `--orbit-color-chip-additional-bg`, `--orbit-color-chip-additional-fg`, `--orbit-color-chip-disabled-bg`, `--orbit-color-chip-disabled-fg`, `--orbit-color-dove-gray`, `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-information`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-status-high-bg-style-1`, `--orbit-color-status-high-bg-success`, `--orbit-color-status-high-bg-warning`, `--orbit-color-status-low-bg-error`, `--orbit-color-status-low-bg-information`, `--orbit-color-status-low-bg-success`, `--orbit-color-status-low-bg-warning`, `--orbit-color-status-low-icon-error`, `--orbit-color-status-low-icon-information`, `--orbit-color-status-low-icon-success`, `--orbit-color-status-low-icon-warning`, `--orbit-color-text-error`, `--orbit-color-text-info`, `--orbit-color-text-primary`, `--orbit-color-text-success`, `--orbit-color-text-warning`, `--orbit-color-white`
  - spacing: `--orbit-inline-banner-height`, `--orbit-inline-banner-icon-box-size`, `--orbit-space-s`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-xs`
  - radius: none
  - shadow: none
- **Composes:** `FaIcon`

## Input
- **File:** `packages/orbit/src/inputs/Input.tsx`
- **Description:** Renders a labelled text input with optional icon, helper text, error text, and accessible naming.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `icon` | `ReactNode` | No | — | — |
| `id` | `string` | No | — | — |
| `invalid` | `boolean` | No | `false` | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `placeholder` | `string` | No | — | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `required` | `boolean` | No | `false` | — |
| `style` | `React.CSSProperties` | No | — | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-btn-secondary-border-error`, `--orbit-color-btn-secondary-border-focused`, `--orbit-color-btn-secondary-border-hover`, `--orbit-color-btn-secondary-fg`, `--orbit-color-btn-secondary-fg-disabled`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-secondary-icon-disabled`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-base`, `--orbit-space-micro`, `--orbit-space-s`
  - typography: `--orbit-font-family-sans`, `--orbit-text-body-leading`, `--orbit-text-body-size`, `--orbit-text-body-weight`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## LegendLabel
- **File:** `packages/orbit/src/primitives/LegendLabel.tsx`
- **Description:** Displays a color marker with label text for legends and chart keys.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `color` | `string` | No | `'var(--orbit-color-bright-green)'` | — |
| `position` | `'Left' \| 'Right'` | No | `'Right'` | — |
| `value` | `string` | No | `'Value'` | — |
- **Variants:**
- `position`: `Left`, `Right`
- **Tokens consumed:**
  - colour: `--orbit-color-bright-green`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-xs`
  - radius: none
  - shadow: none
- **Composes:** none

## LinkText
- **File:** `packages/orbit/src/actions/LinkText.tsx`
- **Description:** Renders an inline link styled with Orbit text and disabled states.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `current` | `boolean` | No | `false` | — |
| `disabled` | `boolean` | No | `false` | — |
| `external` | `boolean` | No | `false` | — |
| `href` | `string` | No | `'#'` | — |
| `label` | `string` | Yes | — | — |
| `onClick` | `() => void` | No | — | — |
| `variant` | `'Primary' \| 'Secondary' \| 'Heading'` | No | `'Primary'` | — |
- **Variants:**
- `variant`: `Primary`, `Secondary`, `Heading`
- **Tokens consumed:**
  - colour: `--orbit-color-btn-tertiary-fg`, `--orbit-color-btn-tertiary-fg-disabled`, `--orbit-color-focus-ring`, `--orbit-color-text-disabled`
  - spacing: `--orbit-space-m`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-text-base`, `--orbit-text-sm`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## MultiSelectDropdown
- **File:** `packages/orbit/src/inputs/MultiSelectDropdown.tsx`
- **Description:** Renders a labelled multi-select control with helper, error, and accessible naming support.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `label` | `string` | Conditional | — | — |
| `onChange` | `(values: string[]) => void` | Yes | — | — |
| `options` | `MultiSelectDropdownOption[]` | Yes | — | — |
| `placeholder` | `string` | No | `'Please Select...'` | — |
| `required` | `boolean` | No | `false` | — |
| `value` | `string[]` | Yes | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-disabled`, `--orbit-color-bg-hover`, `--orbit-color-border-disabled`, `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-secondary-icon-disabled`, `--orbit-color-text-disabled`, `--orbit-color-text-error`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-chip-height-mini`, `--orbit-dropdown-chevron-size`, `--orbit-dropdown-option-height`, `--orbit-dropdown-trigger-height`, `--orbit-space-base`, `--orbit-space-m`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-leading-tight`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-pill`, `--orbit-radius-sm`
  - shadow: `--orbit-shadow-lg`
  - other: `--orbit-z-dropdown`
- **Composes:** `FaIcon`

## MultiStateButton
- **File:** `packages/orbit/src/actions/MultiStateButton.tsx`
- **Description:** Renders one option inside a segmented multi-state button group.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `count` | `number` | No | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `label` | `string` | Yes | — | — |
| `leftIcon` | `string` | No | — | — |
| `onClick` | `() => void` | No | — | — |
| `rightIcon` | `string` | No | — | — |
| `selected` | `boolean` | No | `false` | — |
| `tabIndex` | `number` | No | — | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-dove-gray`, `--orbit-color-focus-ring`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-multistate-height`, `--orbit-multistate-icon-size`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-multistate-group-radius`, `--orbit-radius-sm`
  - shadow: `--orbit-shadow-md`
- **Composes:** `Badge`, `FaIcon`

## MultiStateGroup
- **File:** `packages/orbit/src/actions/MultiStateButton.tsx`
- **Description:** Groups multi-state buttons as a labelled segmented control.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | `'Options'` | — |
| `children` | `ReactNode` | Yes | — | — |
| `defaultValue` | `string` | No | — | — |
| `onValueChange` | `(value: string) => void` | No | — | — |
| `value` | `string` | No | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-dove-gray`, `--orbit-color-focus-ring`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-multistate-height`, `--orbit-multistate-icon-size`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-multistate-group-radius`, `--orbit-radius-sm`
  - shadow: `--orbit-shadow-md`
- **Composes:** none

## Overlay
- **File:** `packages/orbit/src/feedback/Overlay.tsx`
- **Description:** Renders an accessible modal overlay with focus management and configurable size.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | `'Dialog'` | — |
| `ariaLabelledBy` | `string` | No | — | — |
| `children` | `ReactNode` | Yes | — | — |
| `height` | `'Viewport' \| 'Content'` | No | `'Viewport'` | — |
| `onClose` | `() => void` | Yes | — | — |
| `size` | `'Large' \| 'Default'` | No | `'Default'` | — |
| `visible` | `boolean` | Yes | — | — |
- **Variants:**
- `height`: `Viewport`, `Content`
- `size`: `Large`, `Default`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-focus-ring`, `--orbit-color-overlay-backdrop`
  - spacing: `--orbit-overlay-height-default`, `--orbit-overlay-width-large`, `--orbit-overlay-width-medium`, `--orbit-space-0`, `--orbit-space-m`
  - typography: none
  - radius: `--orbit-radius-lg`
  - shadow: `--orbit-shadow-lg`
  - other: `--orbit-z-overlay`
- **Composes:** none

## PageHeader
- **File:** `packages/orbit/src/navigation/PageHeader.tsx`
- **Description:** Renders an application page header with icon, title, subtitle, tabs, pills, and actions.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `actions` | `PageHeaderAction[]` | No | — | Right-side action buttons |
| `activeTab` | `number` | No | — | Active tab index |
| `borderColor` | `string` | No | — | Bottom border color (2px). Omit for no colored border |
| `defaultActiveTab` | `number` | No | — | Initial tab index for uncontrolled headers |
| `icon` | `string` | No | — | FA icon unicode for tool headers |
| `iconGradient` | `[string, string]` | No | — | Gradient colors [from, to] for the icon button |
| `onTabChange` | `(index: number) => void` | No | — | Callback when tab is clicked |
| `pill` | `PageHeaderPill` | No | — | Initiative pill shown on the right |
| `showTabUnderline` | `boolean` | No | `true` | Whether active tab shows underline |
| `subtitle` | `string` | No | — | — |
| `tabs` | `PageHeaderTab[]` | No | — | Tab bar below the header |
| `title` | `string` | Yes | — | — |
| `type` | `'main' \| 'tool'` | No | `'tool'` | 'main' = greeting header, 'tool' = tool/app header with icon |
- **Variants:**
- `type`: `main`, `tool`
- **Tokens consumed:**
  - colour: `--orbit-color-btn-primary-fg`, `--orbit-color-card-border-default`, `--orbit-color-header-deliver-border`, `--orbit-color-header-deliver-from`, `--orbit-color-header-deliver-to`, `--orbit-color-header-identify-border`, `--orbit-color-header-identify-from`, `--orbit-color-header-identify-to`, `--orbit-color-header-rfp-border`, `--orbit-color-header-rfp-from`, `--orbit-color-header-rfp-to`, `--orbit-color-header-sustain-border`, `--orbit-color-header-sustain-from`, `--orbit-color-header-sustain-to`, `--orbit-color-text-heading`, `--orbit-color-text-secondary`, `--orbit-color-white`
  - spacing: `--orbit-page-header-padding-block`, `--orbit-page-header-padding-inline`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xl`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-leading-tight`, `--orbit-text-base`, `--orbit-text-lg`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-sm`
  - shadow: `--orbit-shadow-sm`
  - other: `--orbit-z-sticky`
- **Composes:** none

## PriceIndicator
- **File:** `packages/orbit/src/indicators/PriceIndicator.tsx`
- **Description:** Displays a directional price movement indicator with semantic icon and color.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `movement` | `'Positive' \| 'None' \| 'Negative'` | No | `'Positive'` | — |
| `position` | `'Left' \| 'Right'` | No | `'Right'` | — |
| `value` | `string` | No | `'Value'` | — |
- **Variants:**
- `movement`: `Positive`, `None`, `Negative`
- `position`: `Left`, `Right`
- **Tokens consumed:**
  - colour: `--orbit-color-silver`, `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-success`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-body-leading`, `--orbit-text-sm`
  - radius: none
  - shadow: none
- **Composes:** `FaIcon`

## QuickFilterGroup
- **File:** `packages/orbit/src/navigation/QuickFilter.tsx`
- **Description:** Groups quick filter items in a labelled navigation region.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | `'Quick filters'` | — |
| `children` | `ReactNode` | Yes | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-disabled`, `--orbit-color-bg-hover`, `--orbit-color-border-disabled`, `--orbit-color-border-focused`, `--orbit-color-dove-gray`, `--orbit-color-efficio-blue`, `--orbit-color-silver`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-quickfilter-height`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-quickfilter-radius`
  - shadow: none
- **Composes:** none

## QuickFilterItem
- **File:** `packages/orbit/src/navigation/QuickFilter.tsx`
- **Description:** Renders a compact quick filter button with active state and count.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | No | `false` | — |
| `label` | `string` | Yes | — | — |
| `leftIcon` | `string` | No | — | — |
| `onClick` | `() => void` | No | — | — |
| `rightIcon` | `string` | No | — | — |
| `selected` | `boolean` | No | `false` | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-disabled`, `--orbit-color-bg-hover`, `--orbit-color-border-disabled`, `--orbit-color-border-focused`, `--orbit-color-dove-gray`, `--orbit-color-efficio-blue`, `--orbit-color-silver`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-quickfilter-height`, `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-quickfilter-radius`
  - shadow: none
- **Composes:** `FaIcon`

## RadialIndicator
- **File:** `packages/orbit/src/indicators/RadialIndicator.tsx`
- **Description:** Displays radial progress with label, value, status, and clamped progress.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `progress` | `number` | No | `75` | — |
| `size` | `number` | No | `24` | — |
| `status` | `'Information' \| 'Success' \| 'Error' \| 'Warning' \| 'No Status'` | No | `'Success'` | — |
- **Variants:**
- `status`: `Information`, `Success`, `Error`, `Warning`, `No Status`
- **Tokens consumed:**
  - colour: `--orbit-color-radial-track-error`, `--orbit-color-radial-track-information`, `--orbit-color-radial-track-no-status`, `--orbit-color-radial-track-success`, `--orbit-color-radial-track-warning`, `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-information`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-status-high-bg-success`, `--orbit-color-status-high-bg-warning`
  - spacing: none
  - typography: none
  - radius: none
  - shadow: none
- **Composes:** none

## Radio
- **File:** `packages/orbit/src/inputs/Radio.tsx`
- **Description:** Renders a labelled native radio input with disabled and accessible-name support.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `'Left' \| 'Right'` | No | `'Left'` | — |
| `ariaLabel` | `string` | No | `'Radio'` | — |
| `checked` | `boolean` | Yes | — | — |
| `label` | `string` | No | — | — |
| `name` | `string` | No | — | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `onKeyDown` | `KeyboardEventHandler<HTMLInputElement>` | No | — | — |
| `state` | `'Error' \| 'Hover' \| 'Disabled' \| 'Active'` | No | `'Active'` | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `alignment`: `Left`, `Right`
- `state`: `Error`, `Hover`, `Disabled`, `Active`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-border-disabled`, `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-checkbox-checked-bg`, `--orbit-color-checkbox-disabled-bg`, `--orbit-color-checkbox-unchecked-border`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-base`, `--orbit-space-px`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-text-body-leading`, `--orbit-text-body-size`, `--orbit-text-body-weight`
  - radius: `--orbit-radius-pill`
  - shadow: none
- **Composes:** none

## RadioGroup
- **File:** `packages/orbit/src/inputs/Radio.tsx`
- **Description:** Groups radio options in a labelled radiogroup container.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `children` | `ReactNode` | Yes | — | — |
| `name` | `string` | Yes | — | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-border-disabled`, `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-checkbox-checked-bg`, `--orbit-color-checkbox-disabled-bg`, `--orbit-color-checkbox-unchecked-border`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-base`, `--orbit-space-px`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-text-body-leading`, `--orbit-text-body-size`, `--orbit-text-body-weight`
  - radius: `--orbit-radius-pill`
  - shadow: none
- **Composes:** none

## Required
- **File:** `packages/orbit/src/primitives/Required.tsx`
- **Description:** Displays the required-field marker used beside form labels.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| — | — | — | — | No explicit props. |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-text-error`
  - spacing: `--orbit-required-width`, `--orbit-space-base`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-body-leading`, `--orbit-text-sm`
  - radius: none
  - shadow: none
- **Composes:** none

## RiskIndicator
- **File:** `packages/orbit/src/indicators/RiskIndicator.tsx`
- **Description:** Displays a risk level with directional icon and semantic color.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `level` | `'Medium' \| 'High' \| 'Low' \| 'None' \| 'Very High' \| 'Very Low'` | No | `'Very High'` | — |
| `position` | `'Left' \| 'Right'` | No | `'Right'` | — |
- **Variants:**
- `level`: `Medium`, `High`, `Low`, `None`, `Very High`, `Very Low`
- `position`: `Left`, `Right`
- **Tokens consumed:**
  - colour: `--orbit-color-silver`, `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-information`, `--orbit-color-status-high-bg-warning`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-text-body-leading`, `--orbit-text-sm`
  - radius: none
  - shadow: none
- **Composes:** `FaIcon`

## Searchbox
- **File:** `packages/orbit/src/inputs/Searchbox.tsx`
- **Description:** Renders a search input with submit button, disabled state, and accessible naming.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `placeholder` | `string` | No | `'Search...'` | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-border-hover`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-icon`, `--orbit-color-btn-secondary-icon-disabled`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-l`, `--orbit-space-m`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`

## Separator
- **File:** `packages/orbit/src/primitives/Separator.tsx`
- **Description:** Renders a horizontal or vertical visual separator.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `decorative` | `boolean` | No | `false` | — |
| `orientation` | `'Horizontal' \| 'Vertical'` | No | `'Horizontal'` | — |
- **Variants:**
- `orientation`: `Horizontal`, `Vertical`
- **Tokens consumed:**
  - colour: `--orbit-color-border-default`
  - spacing: `--orbit-space-micro`
  - typography: none
  - radius: none
  - shadow: none
- **Composes:** none

## SideNav
- **File:** `packages/orbit/src/navigation/SideNav.tsx`
- **Description:** Renders the Orbit application side navigation with brand, nav items, sections, work items, and profile area.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `appName` | `string` | Yes | — | — |
| `ariaLabel` | `string` | No | `'Main navigation'` | — |
| `clientChevronIcon` | `string` | No | `'\uf078'` | — |
| `clientName` | `string` | Yes | — | — |
| `logoIcon` | `string` | No | `'\uf890'` | — |
| `navItems` | `SideNavItem[]` | No | `EMPTY_NAV_ITEMS` | — |
| `onProfileMenu` | `() => void` | No | — | — |
| `onWorkSearch` | `() => void` | No | — | — |
| `profileMenuAriaLabel` | `string` | No | `'Open profile menu'` | — |
| `profileMenuIcon` | `string` | No | `'\uf141'` | — |
| `sections` | `SideNavSection[]` | No | `EMPTY_SECTIONS` | — |
| `userInitials` | `string` | Yes | — | — |
| `userName` | `string` | Yes | — | — |
| `width` | `number` | No | — | — |
| `workHeading` | `string` | No | `'My Work'` | — |
| `workItems` | `SideNavWorkItem[]` | No | `EMPTY_WORK_ITEMS` | — |
| `workSearchAriaLabel` | `string` | No | `'Search work'` | — |
| `workSearchIcon` | `string` | No | `'\uf002'` | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-btn-primary-bg`, `--orbit-color-focus-ring`, `--orbit-color-sidenav-active-bg`, `--orbit-color-sidenav-bg`, `--orbit-color-sidenav-divider`, `--orbit-color-sidenav-gradient-from`, `--orbit-color-sidenav-gradient-to`, `--orbit-color-sidenav-muted`, `--orbit-color-text-secondary`, `--orbit-color-white`, `--orbit-sidenav-badge-bg`, `--orbit-sidenav-badge-fg`, `--orbit-sidenav-work-heading-color`
  - spacing: `--orbit-sidenav-avatar-size`, `--orbit-sidenav-badge-size`, `--orbit-sidenav-header-padding-block-end`, `--orbit-sidenav-header-padding-inline`, `--orbit-sidenav-nav-row-gap`, `--orbit-sidenav-nav-row-padding-block`, `--orbit-sidenav-padding-top`, `--orbit-sidenav-profile-padding-bottom`, `--orbit-sidenav-profile-padding-inline`, `--orbit-sidenav-row-gap`, `--orbit-sidenav-section-gap`, `--orbit-sidenav-section-row-padding-inline`, `--orbit-sidenav-stack-gap`, `--orbit-sidenav-subitem-offset`, `--orbit-sidenav-subitem-padding-inline`, `--orbit-sidenav-width`, `--orbit-sidenav-work-item-padding-left`, `--orbit-space-base`, `--orbit-space-l`, `--orbit-space-none`, `--orbit-space-px`, `--orbit-space-s`, `--orbit-space-xl`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-leading-relaxed`, `--orbit-leading-tight`, `--orbit-sidenav-app-name-font-weight`, `--orbit-sidenav-avatar-font-size`, `--orbit-sidenav-badge-font-weight`, `--orbit-text-base`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-pill`, `--orbit-radius-sm`, `--orbit-sidenav-nav-row-active-radius`, `--orbit-sidenav-nav-row-radius`, `--orbit-sidenav-subitem-active-radius`, `--orbit-sidenav-subitem-radius`
  - shadow: none
- **Composes:** `FaIcon`

## Spinner
- **File:** `packages/orbit/src/indicators/Spinner.tsx`
- **Description:** Displays an animated loading spinner with optional accessible label.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `decorative` | `boolean` | No | `false` | — |
| `label` | `string` | No | `'Loading'` | — |
| `size` | `'Medium' \| 'Large' \| 'Inline'` | No | `'Inline'` | — |
- **Variants:**
- `size`: `Medium`, `Large`, `Inline`
- **Tokens consumed:**
  - colour: `--orbit-color-card-border-highlight`
  - spacing: `--orbit-space-base`, `--orbit-space-l`, `--orbit-space-xl`
  - typography: none
  - radius: none
  - shadow: none
- **Composes:** none

## StatusIndicator
- **File:** `packages/orbit/src/indicators/StatusIndicator.tsx`
- **Description:** Displays a small status dot with optional label text.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `label` | `string` | No | — | — |
| `size` | `'Small' \| 'Default'` | No | `'Default'` | — |
| `status` | `'Information' \| 'Success' \| 'Error' \| 'Warning' \| 'No Status'` | Yes | — | — |
- **Variants:**
- `size`: `Small`, `Default`
- `status`: `Information`, `Success`, `Error`, `Warning`, `No Status`
- **Tokens consumed:**
  - colour: `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-information`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-status-high-bg-success`, `--orbit-color-status-high-bg-warning`, `--orbit-color-text-primary`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-medium`, `--orbit-text-body-leading`, `--orbit-text-sm`
  - radius: none
  - shadow: none
- **Composes:** none

## StepCircle
- **File:** `packages/orbit/src/indicators/StepCircle.tsx`
- **Description:** Displays a workflow step marker in checked, numbered, active, or disabled states.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `label` | `string \| number` | No | — | — |
| `size` | `'Small' \| 'Medium' \| 'Large'` | No | `'Large'` | — |
| `status` | `'Disabled' \| 'Active' \| 'Checked' \| 'To Do' \| 'Numbered'` | Yes | — | — |
- **Variants:**
- `size`: `Small`, `Medium`, `Large`
- `status`: `Disabled`, `Active`, `Checked`, `To Do`, `Numbered`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-disabled`, `--orbit-color-btn-secondary-fg`, `--orbit-color-silver`, `--orbit-color-status-high-bg-success`, `--orbit-color-white`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xl`, `--orbit-space-xs`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-leading-tight`, `--orbit-text-base`
  - radius: `--orbit-radius-pill`
  - shadow: none
- **Composes:** `FaIcon`

## TabButton
- **File:** `packages/orbit/src/navigation/TabButton.tsx`
- **Description:** Renders a tab-style button with selected, disabled, and focus states.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `active` | `boolean` | No | `false` | — |
| `ariaControls` | `string` | No | — | — |
| `children` | `ReactNode` | Yes | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `showUnderline` | `boolean` | No | `true` | — |
| `status` | `'Hover' \| 'Disabled' \| 'Rest'` | No | `'Rest'` | — |
- **Variants:**
- `status`: `Hover`, `Disabled`, `Rest`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg-accent`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-btn-secondary-fg`, `--orbit-color-btn-secondary-fg-disabled`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-tab-height`, `--orbit-tab-inner-height`, `--orbit-tab-underline-height`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-text-sm`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## Table
- **File:** `packages/orbit/src/layout/Table.tsx`
- **Description:** Renders a data table with sortable headers, selectable rows, empty state, and pagination.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | No | — | — |
| `ariaLabelledBy` | `string` | No | — | — |
| `columns` | `TableColumn<T>[]` | Yes | — | — |
| `density` | `'Default' \| 'Compact'` | No | `'Default'` | — |
| `emptyState` | `ReactNode` | No | `'No rows available.'` | — |
| `getRowKey` | `(row: T) => Key` | Yes | — | — |
| `getRowSelectionLabel` | `(row: T, index: number) => string` | No | — | — |
| `onRowSelect` | `(row: T) => void` | No | — | — |
| `pagination` | `TablePaginationProps` | No | — | — |
| `rows` | `T[]` | Yes | — | — |
| `variant` | `'Default' \| 'SeparatedRows'` | No | `'Default'` | — |
- **Variants:**
- `density`: `Default`, `Compact`
- `variant`: `Default`, `SeparatedRows`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-default`, `--orbit-color-bg-hover`, `--orbit-color-border-focused`, `--orbit-color-card-bg-accent`, `--orbit-color-card-bg-default`, `--orbit-color-card-border-default`, `--orbit-color-silver`, `--orbit-color-text-disabled`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xl`, `--orbit-space-xs`, `--orbit-space-xxl`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-medium`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-text-base`, `--orbit-text-sm`
  - radius: `--orbit-radius-md`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## Text
- **File:** `packages/orbit/src/primitives/Text.tsx`
- **Description:** Renders text using Orbit body, emphasis, link, and semantic color styles.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `as` | `'span' \| 'p' \| 'div' \| 'strong' \| 'em'` | No | `'span'` | — |
| `children` | `ReactNode` | Yes | — | — |
| `size` | `'Small' \| 'Paragraph'` | No | `'Paragraph'` | — |
| `variant` | `'Information' \| 'Error' \| 'Warning' \| 'Disabled' \| 'Primary' \| 'Secondary' \| 'Bold' \| 'Inverse'` | No | `'Primary'` | — |
- **Variants:**
- `as`: `span`, `p`, `div`, `strong`, `em`
- `size`: `Small`, `Paragraph`
- `variant`: `Information`, `Error`, `Warning`, `Disabled`, `Primary`, `Secondary`, `Bold`, `Inverse`
- **Tokens consumed:**
  - colour: `--orbit-color-text-disabled`, `--orbit-color-text-error`, `--orbit-color-text-info`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`, `--orbit-color-text-warning`, `--orbit-color-white`
  - spacing: none
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: none
  - shadow: none
- **Composes:** none

## TextArea
- **File:** `packages/orbit/src/inputs/TextArea.tsx`
- **Description:** Renders a labelled multiline text area with helper, error, and accessible naming support.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `label` | `string` | Conditional | — | — |
| `maxLength` | `number` | No | `250` | — |
| `message` | `string` | No | — | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `placeholder` | `string` | No | `'Enter text'` | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `required` | `boolean` | No | `false` | — |
| `rows` | `number` | No | `3` | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-border-hover`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-text-disabled`, `--orbit-color-text-error`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-text-sm`, `--orbit-text-xs`, `--orbit-textarea-min-height`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** none

## Textbox
- **File:** `packages/orbit/src/inputs/Textbox.tsx`
- **Description:** Renders a labelled text field with optional lock icon, helper text, and validation states.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | Conditional | — | — |
| `ariaLabelledBy` | `string` | Conditional | — | — |
| `disabled` | `boolean` | No | `false` | — |
| `invalid` | `boolean` | No | `false` | — |
| `label` | `string` | Conditional | — | — |
| `locked` | `boolean` | No | `false` | — |
| `message` | `string` | No | — | — |
| `onChange` | `(value: string) => void` | Yes | — | — |
| `placeholder` | `string` | No | `'Enter text'` | — |
| `previewState` | `'hover' \| 'focus'` | No | — | — |
| `required` | `boolean` | No | `false` | — |
| `value` | `string` | Yes | — | — |
- **Variants:**
- `previewState`: `hover`, `focus`
- **Tokens consumed:**
  - colour: `--orbit-color-border-error`, `--orbit-color-border-focused`, `--orbit-color-border-hover`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-disabled`, `--orbit-color-btn-secondary-border`, `--orbit-color-btn-secondary-border-disabled`, `--orbit-color-btn-secondary-icon`, `--orbit-color-text-disabled`, `--orbit-color-text-error`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-base`, `--orbit-space-l`, `--orbit-space-m`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-regular`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-leading-snug`, `--orbit-text-sm`, `--orbit-text-xs`
  - radius: `--orbit-radius-sm`
  - shadow: none
- **Composes:** `FaIcon`

## Toast
- **File:** `packages/orbit/src/feedback/Toast.tsx`
- **Description:** Renders a transient notification with semantic tone, optional dismiss button, and actions.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `actions` | `ToastAction[]` | No | — | — |
| `message` | `string` | Yes | — | — |
| `onDismiss` | `() => void` | No | — | — |
| `type` | `'Success' \| 'Error' \| 'Warning' \| 'Info' \| 'Mute' \| 'NoStatus'` | Yes | — | — |
| `visible` | `boolean` | Yes | — | — |
- **Variants:**
- `type`: `Success`, `Error`, `Warning`, `Info`, `Mute`, `NoStatus`
- **Tokens consumed:**
  - colour: `--orbit-color-black`, `--orbit-color-btn-tertiary-fg`, `--orbit-color-focus-ring`, `--orbit-color-status-high-bg-error`, `--orbit-color-status-high-bg-information`, `--orbit-color-status-high-bg-no-status`, `--orbit-color-status-high-bg-success`, `--orbit-color-status-high-bg-warning`, `--orbit-color-text-primary`, `--orbit-color-white`
  - spacing: `--orbit-btn-height-small`, `--orbit-space-base`, `--orbit-space-m`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-toast-max-width`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-medium`, `--orbit-text-body-leading`, `--orbit-text-body-size`, `--orbit-text-body-weight`
  - radius: `--orbit-radius-sm`
  - shadow: `--orbit-shadow-lg`
  - other: `--orbit-z-toast`
- **Composes:** `FaIcon`

## Toggle
- **File:** `packages/orbit/src/inputs/Toggle.tsx`
- **Description:** Renders a labelled switch control with disabled and accessible-name support.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `alignment` | `'Left' \| 'Right'` | No | `'Left'` | — |
| `ariaLabel` | `string` | No | `'Toggle'` | — |
| `checked` | `boolean` | Yes | — | — |
| `label` | `string` | No | — | — |
| `onChange` | `(checked: boolean) => void` | Yes | — | — |
| `state` | `'Disabled' \| 'Active'` | No | `'Active'` | — |
- **Variants:**
- `alignment`: `Left`, `Right`
- `state`: `Disabled`, `Active`
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-border-focused`, `--orbit-color-text-primary`, `--orbit-color-toggle-active-bg`, `--orbit-color-toggle-disabled-bg`, `--orbit-color-toggle-handle`, `--orbit-color-toggle-handle-disabled`, `--orbit-color-toggle-inactive-bg`, `--orbit-color-toggle-label-disabled`
  - spacing: `--orbit-space-s`, `--orbit-space-xxs`, `--orbit-toggle-handle-size`, `--orbit-toggle-track-height`, `--orbit-toggle-track-width`
  - typography: `--orbit-font-family-sans`, `--orbit-text-body-leading`, `--orbit-text-body-size`, `--orbit-text-body-weight`
  - radius: `--orbit-toggle-track-radius`
  - shadow: `--orbit-toggle-handle-shadow`
- **Composes:** none

## ToolNextStepsCard
- **File:** `packages/orbit/src/tool/ToolNextStepsCard.tsx`
- **Description:** Renders a card of recommended next-step actions with optional expandable table content.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `actions` | `ToolNextStepAction[]` | No | `DEFAULT_ACTIONS` | — |
| `onActionSelect` | `(id: string) => void` | No | — | — |
| `title` | `string` | No | `'Next, you can...'` | — |
- **Variants:**
- none
- **Tokens consumed:**
  - colour: `--orbit-color-bg-hover`, `--orbit-color-border-focused`, `--orbit-color-btn-secondary-bg`, `--orbit-color-btn-secondary-bg-hover`, `--orbit-color-btn-secondary-border`, `--orbit-color-card-bg-default`, `--orbit-color-card-border-default`, `--orbit-color-card-border-highlight`, `--orbit-color-text-primary`, `--orbit-color-text-secondary`
  - spacing: `--orbit-space-0`, `--orbit-space-base`, `--orbit-space-l`, `--orbit-space-micro`, `--orbit-space-s`, `--orbit-space-xs`, `--orbit-space-xxl`, `--orbit-space-xxs`
  - typography: `--orbit-font-family-sans`, `--orbit-font-weight-semibold`, `--orbit-leading-relaxed`, `--orbit-text-sm`
  - radius: `--orbit-radius-md`, `--orbit-radius-sm`
  - shadow: none
- **Composes:** `Card`, `Headings`

## Tooltip
- **File:** `packages/orbit/src/feedback/Tooltip.tsx`
- **Description:** Wraps a trigger with hover/focus tooltip content and configurable placement.
- **Props:**
| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `align` | `'start' \| 'center' \| 'end'` | No | `'center'` | — |
| `children` | `ReactNode` | Yes | — | — |
| `content` | `string` | Yes | — | — |
| `direction` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | `'top'` | — |
- **Variants:**
- `align`: `start`, `center`, `end`
- `direction`: `top`, `bottom`, `left`, `right`
- **Tokens consumed:**
  - colour: `--orbit-color-black-pearl`, `--orbit-color-text-inverse`
  - spacing: `--orbit-space-base`, `--orbit-space-s`, `--orbit-space-xs`
  - typography: `--orbit-font-family-sans`, `--orbit-text-small-leading`, `--orbit-text-small-size`, `--orbit-text-small-weight`
  - radius: `--orbit-radius-sm`
  - shadow: none
  - other: `--orbit-z-tooltip`
- **Composes:** none

## Manifest Stats
- **Total component count:** 54
- **Components missing prop types:** none
- **Components missing JSDoc:** `Alert`, `Avatar`, `AvatarStack`, `Badge`, `Banner`, `Breadcrumb`, `Button`, `Carat`, `Card`, `Checkbox`, `Chip`, `CountryFlag`, `CurrencyInput`, `DateInput`, `DocumentGlyph`, `Dropdown`, `Dropzone`, `FileItem`, `Filter`, `Headings`, `IconButton`, `InlineBanner`, `Input`, `LegendLabel`, `LinkText`, `MultiSelectDropdown`, `MultiStateButton`, `MultiStateGroup`, `Overlay`, `PageHeader`, `PriceIndicator`, `QuickFilterGroup`, `QuickFilterItem`, `RadialIndicator`, `Radio`, `RadioGroup`, `Required`, `RiskIndicator`, `Searchbox`, `Separator`, `SideNav`, `Spinner`, `StatusIndicator`, `StepCircle`, `TabButton`, `Table`, `Text`, `TextArea`, `Textbox`, `Toast`, `Toggle`, `ToolNextStepsCard`, `Tooltip`
- **Components with no token references:** `FaIcon`

