import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "./input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field"

const meta = {
  title: "UI/Field",
  component: Field,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <FieldSet className="w-80">
      <FieldLegend>Profile</FieldLegend>
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <FieldContent>
            <Input id="name" placeholder="Jane Doe" />
            <FieldDescription>Your full name.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  render: (args) => (
    <FieldGroup className="w-96">
      <Field {...args}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldContent>
          <Input id="email" type="email" placeholder="jane@example.com" />
        </FieldContent>
      </Field>
      <FieldSeparator>or</FieldSeparator>
    </FieldGroup>
  ),
}

export const WithError: Story = {
  render: () => (
    <FieldGroup className="w-80">
      <Field data-invalid="true">
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <FieldContent>
          <Input id="username" aria-invalid defaultValue="!!invalid!!" />
          <FieldError errors={[{ message: "Username is already taken." }]} />
        </FieldContent>
      </Field>
    </FieldGroup>
  ),
}
