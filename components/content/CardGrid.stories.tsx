import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContentCard } from "./ContentCard";
import { CardGrid } from "./CardGrid";

const SAMPLE_ITEMS = [
  {
    title: "Mapa do Mercado",
    body: "Tamanho estimado do mercado endereçável e principais concorrentes diretos.",
  },
  {
    title: "Mapa e Ímã de Problemas",
    body: "Principais dores relatadas pelos clientes entrevistados nas últimas semanas.",
  },
  {
    title: "Perfil Ideal de Cliente",
    body: "Fundadores técnicos em estágio pré-seed sem processo comercial estruturado.",
  },
  {
    title: "Tese de Valor",
    body: "Por que compramos, por que agora, por que de nós — em uma frase cada.",
  },
];

const meta = {
  title: "Content/CardGrid",
  component: CardGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    children: null,
  },
} satisfies Meta<typeof CardGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <CardGrid {...args}>
      {SAMPLE_ITEMS.map((item) => (
        <ContentCard key={item.title} title={item.title}>
          <p className="text-sm text-muted-foreground">{item.body}</p>
        </ContentCard>
      ))}
    </CardGrid>
  ),
};

export const TwoItems: Story = {
  render: (args) => (
    <CardGrid {...args}>
      {SAMPLE_ITEMS.slice(0, 2).map((item) => (
        <ContentCard key={item.title} title={item.title}>
          <p className="text-sm text-muted-foreground">{item.body}</p>
        </ContentCard>
      ))}
    </CardGrid>
  ),
};

export const Empty: Story = {};
