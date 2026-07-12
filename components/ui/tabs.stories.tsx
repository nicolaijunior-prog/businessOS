import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Manage your account name and email address.
      </TabsContent>
      <TabsContent value="billing">
        Review invoices and update your payment method.
      </TabsContent>
    </Tabs>
  ),
}

export const LineVariant: Story = {
  render: (args) => (
    <Tabs {...args} defaultValue="overview" className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Snapshot of your workspace.</TabsContent>
      <TabsContent value="reports">Generated reports appear here.</TabsContent>
      <TabsContent value="settings">Workspace configuration.</TabsContent>
    </Tabs>
  ),
}
