import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button";
import { PageHeader } from "./PageHeader";

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    title: "Objetivo",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    title: "Mapa do Mercado",
    description: "Entenda o tamanho e a dinâmica do mercado em que sua empresa compete.",
  },
};

export const WithActions: Story = {
  args: {
    title: "Fluxo de Caixa",
    description: "Acompanhe entradas e saídas do mês.",
    children: (
      <div className="pt-2">
        <Button size="sm">Novo lançamento</Button>
      </div>
    ),
  },
};
