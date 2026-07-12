import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContentCard } from "./ContentCard";

const meta = {
  title: "Content/ContentCard",
  component: ContentCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-80">
      <ContentCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ContentCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Objetivo",
    children: (
      <p className="text-sm text-muted-foreground">
        Tornar a BusinessOS a ferramenta padrão de fundadores early-stage para organizar sua
        operação.
      </p>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: "Perfil Ideal de Cliente",
    actions: <Badge variant="secondary">Validado</Badge>,
    children: (
      <p className="text-sm text-muted-foreground">
        Fundadores técnicos de startups B2B em estágio pré-seed que ainda não têm um processo
        comercial estruturado.
      </p>
    ),
  },
};

export const WithButtonAction: Story = {
  args: {
    title: "Tese de Valor",
    actions: (
      <Button variant="ghost" size="icon-sm">
        ⋮
      </Button>
    ),
    children: (
      <p className="text-sm text-muted-foreground">
        Ajudamos fundadores a transformar operação dispersa em planejamento claro, sem trocar de
        ferramenta a cada etapa.
      </p>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    children: (
      <p className="text-sm text-muted-foreground">
        Card sem cabeçalho — usado quando o título já é dado pelo contexto ao redor (ex.: um item
        dentro de uma CardList).
      </p>
    ),
  },
};
