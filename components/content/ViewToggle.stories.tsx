import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ViewModeProvider } from "./ViewModeProvider";
import { ViewToggle } from "./ViewToggle";

const meta = {
  title: "Content/ViewToggle",
  component: ViewToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ViewModeProvider>
        <Story />
      </ViewModeProvider>
    ),
  ],
} satisfies Meta<typeof ViewToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
