# BusinessOS — Briefing

## 1. O problema

Um founder solo acumula, ao longo do tempo, um volume grande de informação crítica sobre o próprio negócio — quem ele é, qual é a proposta de valor, quem são os clientes, como está o caixa, o que está em andamento — mas essa informação fica espalhada (na cabeça, em notas soltas, em planilhas, em conversas antigas com IA) e raramente é mantida atualizada. Sem uma fonte central e confiável, cada decisão exige reconstruir contexto do zero, e ferramentas de IA que poderiam ajudar não têm de onde partir.

O BusinessOS resolve isso funcionando como o **sistema operacional do negócio**: um lugar único, sempre atualizado, onde vive tudo o que é essencial para operar e decidir — do "quem eu sou como founder" até o caixa. Não é um CRM nem um ERP completo; é uma ferramenta de **apoio à decisão** que mantém o estado real do negócio legível tanto para o founder quanto para agentes de IA que trabalham junto com ele.

## 2. Por que Markdown + frontmatter, não banco de dados

O conteúdo de negócio (perfil do founder, produto, clientes, finanças, etc.) vive em arquivos `.md` com frontmatter YAML, não em um banco de dados. Isso é uma decisão central de arquitetura, não um detalhe técnico:

- **Os agentes de IA são usuários de primeira classe.** Claude Code agents e skills precisam ler e escrever esse conteúdo diretamente, e arquivos em disco são a interface mais simples, transparente e auditável para isso — sem API intermediária, sem schema de banco para sincronizar.
- **Legibilidade humana.** O founder pode abrir, ler e editar os arquivos diretamente, fora da UI, sem perder nada.
- **Versionamento natural.** Texto plano se presta a diffs, histórico e revisão (inclusive via git, se desejado).
- **A UI web é só uma camada amigável** por cima desses arquivos — um editor com boa experiência, não a fonte da verdade. A fonte da verdade são os arquivos em `docs/`, `content/` (ou pasta equivalente) do projeto.

## 3. Quem usa o BusinessOS

- **O founder (usuário único)**, via interface web: registra e mantém atualizadas as informações centrais do negócio, navega o conteúdo em cards, edita o que muda.
- **Agentes de IA (Claude Code agents e skills)**, via arquivos: leem o mesmo conteúdo Markdown para ter contexto real e atualizado do negócio, e escrevem de volta — atualizando registros, sugerindo próximos passos, ajudando a desenvolver o negócio em conjunto com o founder.

Ambos os usuários operam sobre exatamente os mesmos arquivos — não há duas fontes de dados a manter sincronizadas.

## 4. Papel futuro do Supabase

Supabase é mencionado **apenas para constar** como uma futura camada de persistência — não está implementado nem é necessário agora. O projeto já tem um `.mcp.json` configurado com o servidor MCP do Supabase (`project_ref: fatkptoxeeegmobklahg`) para uso futuro, caso o BusinessOS precise evoluir para um backend com banco de dados (por exemplo, para features que exijam consultas estruturadas, multiusuário ou escala). Até lá, os arquivos Markdown continuam sendo a única fonte da verdade.

## 5. Princípios de design

- **Minimalista, preto e branco.** Sem cores decorativas; hierarquia visual vem de contraste, espaçamento e tipografia.
- **Tipografia:** fonte Inter.
- **Bordas arredondadas** em componentes e cards, consistente com o padrão shadcn/ui.
- **Sidebar** com hover de fundo nos itens, para navegação clara sem poluição visual.
- **Conteúdo em cards, não tabelas.** A informação é exibida em cards, com um select para alternar entre visualização em grid ou em lista — favorecendo leitura rápida e escaneável em vez de densidade tabular.
- **Stack:** Next.js (App Router) + TypeScript, shadcn/ui, Storybook para documentação de componentes.
