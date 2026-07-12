import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SidebarItem } from "./SidebarItem";

const meta = {
  title: "Layout/SidebarItem",
  component: SidebarItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ul className="w-56">
        <Story />
      </ul>
    ),
  ],
  args: {
    label: "Objetivo",
    href: "/founder/objetivo",
  },
} satisfies Meta<typeof SidebarItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/founder/estilo-de-vida",
      },
    },
  },
};

export const Active: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/founder/objetivo",
      },
    },
  },
};
