import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Sidebar } from "./Sidebar";

const meta = {
  title: "Layout/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/founder/objetivo",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DireccaoActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/direcao/mapa-do-mercado",
      },
    },
  },
};

export const NoActiveItem: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/rota-inexistente",
      },
    },
  },
};
