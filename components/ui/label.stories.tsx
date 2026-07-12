import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "./input"
import { Label } from "./label"

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Your email address",
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-64 gap-1.5">
      <Label {...args} htmlFor="story-email">
        Email
      </Label>
      <Input id="story-email" type="email" placeholder="you@example.com" />
    </div>
  ),
}
