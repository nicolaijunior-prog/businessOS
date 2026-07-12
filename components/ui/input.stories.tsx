import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "./input"

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    placeholder: "Type something…",
  },
  render: (args) => (
    <div className="w-72">
      <Input {...args} />
    </div>
  ),
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: "text",
  },
}

export const Disabled: Story = {
  args: {
    type: "text",
    disabled: true,
    defaultValue: "Can't touch this",
  },
}

export const Invalid: Story = {
  args: {
    type: "email",
    "aria-invalid": true,
    defaultValue: "not-an-email",
  },
}
