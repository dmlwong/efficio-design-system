import type { ComponentType } from 'react';

import ButtonExample from './button/Example';
import IconButtonExample from './icon-button/Example';
import TabButtonExample from './tab-button/Example';
import QuickFilterGroupExample from './quick-filter-group/Example';
import MultiStateGroupExample from './multi-state-group/Example';
import InputExample from './input/Example';
import TextboxExample from './textbox/Example';
import TextAreaExample from './text-area/Example';
import SearchboxExample from './searchbox/Example';
import DropzoneExample from './dropzone/Example';
import DateInputExample from './date-input/Example';
import CurrencyInputExample from './currency-input/Example';
import DropdownExample from './dropdown/Example';
import MultiSelectDropdownExample from './multi-select-dropdown/Example';
import CheckboxExample from './checkbox/Example';
import RadioGroupExample from './radio-group/Example';
import ToggleExample from './toggle/Example';
import CardExample from './card/Example';
import TableExample from './table/Example';
import AvatarExample from './avatar/Example';
import StatusIndicatorExample from './status-indicator/Example';
import ChipExample from './chip/Example';
import FilterExample from './filter/Example';
import BadgeExample from './badge/Example';
import PriceIndicatorExample from './price-indicator/Example';
import RiskIndicatorExample from './risk-indicator/Example';
import LegendLabelExample from './legend-label/Example';
import RadialIndicatorExample from './radial-indicator/Example';
import StepCircleExample from './step-circle/Example';
import SpinnerExample from './spinner/Example';
import DocumentGlyphExample from './document-glyph/Example';
import FileItemExample from './file-item/Example';
import CountryFlagExample from './country-flag/Example';
import TooltipExample from './tooltip/Example';
import PageHeaderExample from './page-header/Example';
import SideNavExample from './side-nav/Example';
import BreadcrumbExample from './breadcrumb/Example';
import SeparatorExample from './separator/Example';
import ToolNextStepsCardExample from './tool-next-steps-card/Example';
import InlineBannerExample from './inline-banner/Example';
import AlertExample from './alert/Example';
import ToastExample from './toast/Example';

/**
 * Maps a component slug to its interactive example (a `'use client'` component).
 * A slug absent here renders as a reference-only page.
 */
export const EXAMPLES: Record<string, ComponentType> = {
  button: ButtonExample,
  'icon-button': IconButtonExample,
  'tab-button': TabButtonExample,
  'quick-filter-group': QuickFilterGroupExample,
  'multi-state-group': MultiStateGroupExample,
  input: InputExample,
  textbox: TextboxExample,
  'text-area': TextAreaExample,
  searchbox: SearchboxExample,
  dropzone: DropzoneExample,
  'date-input': DateInputExample,
  'currency-input': CurrencyInputExample,
  dropdown: DropdownExample,
  'multi-select-dropdown': MultiSelectDropdownExample,
  checkbox: CheckboxExample,
  'radio-group': RadioGroupExample,
  toggle: ToggleExample,
  card: CardExample,
  table: TableExample,
  avatar: AvatarExample,
  'status-indicator': StatusIndicatorExample,
  chip: ChipExample,
  filter: FilterExample,
  badge: BadgeExample,
  'price-indicator': PriceIndicatorExample,
  'risk-indicator': RiskIndicatorExample,
  'legend-label': LegendLabelExample,
  'radial-indicator': RadialIndicatorExample,
  'step-circle': StepCircleExample,
  spinner: SpinnerExample,
  'document-glyph': DocumentGlyphExample,
  'file-item': FileItemExample,
  'country-flag': CountryFlagExample,
  tooltip: TooltipExample,
  'page-header': PageHeaderExample,
  'side-nav': SideNavExample,
  breadcrumb: BreadcrumbExample,
  separator: SeparatorExample,
  'tool-next-steps-card': ToolNextStepsCardExample,
  'inline-banner': InlineBannerExample,
  alert: AlertExample,
  toast: ToastExample,
};
