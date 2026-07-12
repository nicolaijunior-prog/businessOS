import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { toast } from "sonner"

import { Button } from "./button"
import { Toaster } from "./sonner"

const meta = {
  title: "UI/Toaster (Sonner)",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div>
      <Button onClick={() => toast("Workspace saved.")}>Show toast</Button>
      <Toaster {...args} />
    </div>
  ),
}

export const StatusVariants: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => toast.success("Invoice #1042 paid.")}
      >
        Success
      </Button>
      <Button
        variant="destructive"
        onClick={() => toast.error("Failed to sync contacts.")}
      >
        Error
      </Button>
      <Toaster {...args} />
    </div>
  ),
}
