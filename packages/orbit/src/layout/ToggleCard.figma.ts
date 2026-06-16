// url=https://www.figma.com/design/5RUsy0uKtFarK7nO8Y3nLL/Main-Component-Library?node-id=9924-3809
// source=packages/orbit/src/layout/ToggleCard.tsx
// component=ToggleCard
import figma from 'figma'
const instance = figma.selectedInstance

const content = instance.getSlot('Content')
const status = instance.getEnum('Status', {
  'Default': 'Default',
  'Hover': 'Hover',
  'Selected': 'Selected',
  'Disabled': 'Disabled',
})

export default {
  example: figma.code`<ToggleCard status="${status}">${content}</ToggleCard>`,
  imports: ['import { ToggleCard } from "@efficio/orbit"'],
  id: 'toggle-card',
  metadata: { nestable: false },
}
