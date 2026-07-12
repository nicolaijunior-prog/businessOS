# BusinessOS

O sistema operacional do negócio de um founder solo: um lugar único, sempre atualizado, com tudo que é essencial para operar e decidir — do "quem eu sou como founder" até o caixa. Não é um CRM nem um ERP completo; é uma ferramenta de apoio à decisão que mantém o estado real do negócio legível tanto para o founder quanto para agentes de IA que trabalham junto com ele.

O conteúdo de negócio vive em arquivos Markdown com frontmatter (não em banco de dados) — a UI web é apenas uma camada amigável por cima desses arquivos, que continuam sendo a fonte da verdade e podem ser lidos/editados diretamente por agentes de IA ou pelo founder.

Para o racional completo do produto (problema, por que Markdown, quem usa, princípios de design), veja **[docs/BRIEFING.md](docs/BRIEFING.md)**. Também disponíveis: [docs/PRD.md](docs/PRD.md) e [docs/SPEC.md](docs/SPEC.md).

## Como rodar

```bash
npm install

# app Next.js em http://localhost:3000
npm run dev

# Storybook (documentação de componentes) em http://localhost:6006
npm run storybook
```

Outros comandos úteis:

```bash
npm run build             # build de produção do Next.js
npm run build-storybook   # build estático do Storybook
npm run lint               # ESLint
```

## Estrutura de pastas

```text
content/            Conteúdo de negócio em .md + frontmatter — a fonte da verdade.
  founder/           objetivo, estilo-de-vida
  direcao/            mapa-do-mercado, mapa-e-ima-de-problemas, perfil-ideal-de-cliente,
                       tese-de-valor, oferta
  validacao/          primeiros-passos  (Oferta é compartilhada com direcao/, não duplicada)
  caixa/              fluxo-de-caixa, erp

lib/content/         Camada de acesso ao conteúdo: registry (mapa slug -> arquivo/schema),
                      schemas (zod), read/write (frontmatter <-> disco), actions (server actions).

app/                 Rotas Next.js (App Router) — uma pasta por página, ex. app/direcao/oferta/.
                      app/direcao/oferta e app/validacao/oferta renderizam o mesmo componente
                      OfertaPage, pois Oferta é uma seção compartilhada entre Direção e Validação.

components/
  pages/              Um componente de página por seção de conteúdo (ex. OfertaPage.tsx).
  forms/               Formulários (react-hook-form + zod) por página, e primitivas de campo.
  content/            Cards, grid/list de conteúdo, toggle de modo de visualização.
  layout/             AppShell, Sidebar, PageHeader.
  ui/                 Componentes shadcn/ui (button, card, dialog, select, etc.).

docs/                BRIEFING.md, PRD.md, SPEC.md.
stories/             Stories padrão do Storybook (exemplo/onboarding).
```

## Supabase (uso futuro)

O arquivo `.mcp.json` na raiz já tem o servidor MCP do Supabase configurado (`project_ref: fatkptoxeeegmobklahg`), mas isso é **apenas para constar** — não há integração implementada hoje. Os arquivos Markdown em `content/` continuam sendo a única fonte de dados. Supabase entraria em cena apenas se o projeto precisar evoluir para um backend com banco de dados (consultas estruturadas, multiusuário, escala).
