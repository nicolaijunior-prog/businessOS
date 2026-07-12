import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ContentCard } from "./ContentCard";
import { CardList } from "./CardList";

const SAMPLE_ITEMS = [
  {
    title: "Primeiros Passos",
    body: "Checklist das primeiras ações para validar a oferta com os primeiros clientes.",
  },
  {
    title: "Oferta",
    body: "Pacote de entrega, preço e condições comerciais atuais.",
  },
  {
    title: "Fluxo de Caixa",
    body: "Entradas e saídas previstas para os próximos 30 dias.",
  },
];

const meta = {
  title: "Content/CardList",
  component: CardList,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    children: null,
  },
} satisfies Meta<typeof CardList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <CardList {...args}>
      {SAMPLE_ITEMS.map((item) => (
        <ContentCard key={item.title} title={item.title}>
          <p className="text-sm text-muted-foreground">{item.body}</p>
        </ContentCard>
      ))}
    </CardList>
  ),
};

export const SingleItem: Story = {
  render: (args) => (
    <CardList {...args}>
      <ContentCard title={SAMPLE_ITEMS[0].title}>
        <p className="text-sm text-muted-foreground">{SAMPLE_ITEMS[0].body}</p>
      </ContentCard>
    </CardList>
  ),
};

export const Empty: Story = {};
