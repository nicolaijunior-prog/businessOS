import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Separator } from "./separator"

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64">
      <div className="text-sm font-medium">BusinessOS</div>
      <div className="text-sm text-muted-foreground">Workspace settings</div>
      <Separator {...args} className="my-4" />
      <div className="text-sm">Members</div>
    </div>
  ),
  args: {
    orientation: "horizontal",
  },
}

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Docs</span>
      <Separator {...args} />
      <span className="text-sm">Settings</span>
      <Separator {...args} />
      <span className="text-sm">Billing</span>
    </div>
  ),
  args: {
    orientation: "vertical",
  },
}
