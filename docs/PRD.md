# BusinessOS — PRD (Product Requirements Document)

> Este documento formaliza como requisitos de produto a arquitetura de páginas do BusinessOS. A arquitetura é considerada **fixa** — este PRD não a redesenha, apenas a especifica com precisão suficiente para orientar implementação e, na sequência, os schemas Zod de cada página. Para contexto de produto, princípios de design e a decisão de usar Markdown + frontmatter em vez de banco de dados, ver `docs/BRIEFING.md`, que este documento não repete e com o qual deve permanecer consistente.

## 1. Visão geral

O BusinessOS é o sistema operacional do negócio de um founder solo: um lugar único onde vive tudo o que é essencial para operar e decidir — do "quem eu sou como founder" até o caixa. A interface web é uma camada de leitura e edição amigável sobre arquivos Markdown com frontmatter, que são a fonte da verdade. Não há CRM, não há ERP completo, não há banco de dados nesta fase — o produto é uma ferramenta de apoio à decisão, não um sistema transacional.

O produto tem exatamente **10 páginas de conteúdo únicas**, organizadas em **4 seções de sidebar**. Uma dessas páginas (Oferta) é compartilhada entre duas seções via dois links de navegação apontando para o mesmo conteúdo — não há duplicação de arquivo nem de dado.

Cada página é: (a) legível por humano e por agente de IA como arquivo `.md` com frontmatter YAML; (b) editável via formulário na UI que salva de volta no mesmo arquivo; (c) exibida em cards — nunca em tabelas.

## 2. Personas

### 2.1 O founder
Usuário humano único do produto. Acessa via interface web. Usa o BusinessOS para registrar, consultar e manter atualizado o estado real do negócio: objetivos pessoais, direção estratégica, validação de oferta e situação de caixa. Edita conteúdo através de formulários; não precisa (mas pode) editar os arquivos `.md` diretamente.

### 2.2 Agentes de IA (Claude Code agents e skills)
Usuário de primeira classe, não humano. Lê os mesmos arquivos Markdown que o founder edita pela UI, para obter contexto real e atualizado do negócio antes de ajudar em qualquer tarefa (planejamento, copywriting, análise financeira, etc.). Escreve de volta nos mesmos arquivos — atualizando registros, propondo próximos passos, registrando aprendizados — usando a mesma estrutura de frontmatter que a UI usa. Não existe uma API intermediária ou schema de banco entre o agente e o dado: o arquivo é a interface.

Implicação de produto: qualquer campo exposto na UI precisa ter uma representação em frontmatter/corpo Markdown estável e previsível, para que um agente consiga editá-lo com segurança sem quebrar o parsing da UI.

## 3. Arquitetura de informação

### 3.1 Sidebar — 4 seções, 10 páginas únicas

| Seção | Página | Rota (proposta) | Arquivo fonte |
|---|---|---|---|
| Founder | Objetivo | `/founder/objetivo` | `content/founder/objetivo.md` |
| Founder | Estilo de Vida | `/founder/estilo-de-vida` | `content/founder/estilo-de-vida.md` |
| Direção | Mapa do Mercado | `/direcao/mapa-do-mercado` | `content/direcao/mapa-do-mercado.md` |
| Direção | Mapa e Ímã de Problemas | `/direcao/mapa-de-problemas` | `content/direcao/mapa-de-problemas.md` |
| Direção | Perfil Ideal de Cliente | `/direcao/perfil-ideal-de-cliente` | `content/direcao/perfil-ideal-de-cliente.md` |
| Direção | Tese de Valor | `/direcao/tese-de-valor` | `content/direcao/tese-de-valor.md` |
| Direção | Oferta | `/direcao/oferta` | `content/direcao/oferta.md` |
| Validação | Oferta *(mesmo conteúdo de Direção > Oferta)* | `/validacao/oferta` | `content/direcao/oferta.md` |
| Validação | Primeiros Passos | `/validacao/primeiros-passos` | `content/validacao/primeiros-passos.md` |
| Caixa | Fluxo de Caixa | `/caixa/fluxo-de-caixa` | `content/caixa/fluxo-de-caixa.md` |
| Caixa | ERP | `/caixa/erp` | `content/caixa/erp.md` |

Total de entradas de navegação: 11. Total de páginas de conteúdo únicas: 10. Total de arquivos de conteúdo: 10.

### 3.2 Regra de compartilhamento Direção/Validação > Oferta

- Existe **um único arquivo**: `content/direcao/oferta.md`.
- Existem **duas rotas/links de navegação** (`/direcao/oferta` e `/validacao/oferta`) que renderizam o **mesmo componente de página**, apontando para o mesmo arquivo fonte.
- Qualquer edição feita a partir de qualquer uma das duas rotas persiste no mesmo arquivo e é imediatamente refletida na outra.
- É proibido criar um segundo arquivo (ex.: `content/validacao/oferta.md`) ou duplicar o conteúdo. Isso é um requisito funcional, não um detalhe de implementação — evita que founder ou agente editem uma cópia desatualizada.
- O item de sidebar em cada seção deve indicar visualmente (ex.: label idêntico "Oferta" em ambas) que se trata do mesmo conteúdo, sem exigir explicação adicional na UI além do nome.

### 3.3 Regra de exibição por tipo de página

- **Páginas com campo em lista** (uma ou mais propriedades do tipo "lista de objetos/strings" que fazem sentido navegar item a item): Mapa do Mercado (concorrentes), Mapa e Ímã de Problemas (problemas), Primeiros Passos (passos). Essas páginas renderizam a lista principal como **Cards em Grid ou Lista**, com o **ViewToggle** (select) disponível para alternar o modo de exibição.
- **Páginas só de campos únicos** (sem lista que justifique navegação item a item): Objetivo, Estilo de Vida, Perfil Ideal de Cliente, Tese de Valor, Oferta, Fluxo de Caixa, ERP. Essas páginas renderizam como **um único Card contendo o formulário completo** — sem grid, sem lista, sem ViewToggle.

## 4. Páginas — objetivo e campos

Para cada página abaixo: objetivo de produto, tipo de exibição (conforme §3.3) e tabela de campos (nome, tipo, obrigatoriedade sugerida, observação). "Corpo markdown" indica um campo de texto longo armazenado como o corpo do arquivo `.md` (abaixo do frontmatter) e editado em um textarea/editor rich-text simples; os demais campos vivem no frontmatter YAML.

### Founder

#### 4.1 Objetivo
Objetivo: capturar por que o founder está construindo este negócio e como ele mede sucesso, para dar contexto de propósito a qualquer decisão — humana ou de agente.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `objetivo_principal` | texto | sim | Frase-resumo do objetivo do negócio |
| `horizonte_tempo` | texto | não | Ex.: "12 meses", "5 anos" |
| `motivacao` | corpo markdown | não | Narrativa livre sobre o "porquê" |
| `metricas_sucesso` | texto | não | Como o founder saberá que está indo bem |

#### 4.2 Estilo de Vida
Objetivo: registrar o estilo de vida que o negócio deve viabilizar, para que decisões estratégicas (oferta, ritmo, precificação) sejam avaliadas também por esse critério, não só por crescimento.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `rotina_desejada` | texto | não | Como o founder quer que seu dia/semana seja |
| `renda_alvo` | texto | não | Renda pessoal/negócio desejada |
| `horas_por_semana` | texto | não | Carga horária alvo dedicada ao negócio |
| `flexibilidade_localizacao` | texto | não | Requisitos de mobilidade/remoto |

### Direção

#### 4.3 Mapa do Mercado
Objetivo: dar visão do tamanho e da estrutura do mercado em que o negócio compete — segmentos e concorrentes — como base para posicionamento.
Exibição: Cards em Grid/Lista (lista principal: `concorrentes`) com ViewToggle; demais campos aparecem em um card de contexto no topo da página.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `tamanho_mercado` | texto | não | Estimativa de TAM/SAM ou descrição qualitativa |
| `segmentos` | lista de strings | não | Segmentos de mercado identificados |
| `concorrentes` | lista de `{ nome, descricao }` | não | Um card por concorrente |
| `tendencias` | corpo markdown | não | Tendências relevantes observadas |

#### 4.4 Mapa e Ímã de Problemas
Objetivo: mapear os problemas reais do cliente-alvo e identificar qual deles é o problema-core (o "ímã") ao redor do qual a oferta deve ser construída.
Exibição: Cards em Grid/Lista (lista principal: `problemas`) com ViewToggle.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `problemas` | lista de `{ id, titulo, descricao, evidencia }` | não | Um card por problema; `id` é slug/identificador estável |
| `problema_core_id` | texto (referência) | não | Deve corresponder a um `id` existente em `problemas[]`; a UI deve destacar o card correspondente como "core" |

Requisito de integridade: a UI deve validar, no formulário, que `problema_core_id` (quando preenchido) corresponde a um `id` presente em `problemas[]`; se o problema referenciado for removido, a UI deve sinalizar a referência quebrada em vez de falhar silenciosamente.

#### 4.5 Perfil Ideal de Cliente
Objetivo: descrever quem é o cliente ideal, suas dores e objetivos, e como qualificá-lo/encontrá-lo — insumo direto para Tese de Valor e Oferta.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `descricao` | corpo markdown | não | Retrato livre do cliente ideal |
| `dores` | lista de strings | não | Dores/dificuldades principais |
| `objetivos` | lista de strings | não | O que o cliente busca alcançar |
| `onde_encontrar` | texto | não | Canais/comunidades onde esse cliente está |
| `criterios_qualificacao` | texto | não | Como identificar se um lead se encaixa |

#### 4.6 Tese de Valor
Objetivo: articular a proposta de valor central e as hipóteses que sustentam por que ela deve funcionar, antes de comprometer recursos na Oferta.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `proposta_valor` | corpo markdown | não | Enunciado central da proposta de valor |
| `diferenciacao` | texto | não | O que torna essa proposta diferente das alternativas |
| `hipoteses_centrais` | lista de strings | não | Hipóteses que, se falsas, invalidam a tese |

#### 4.7 Oferta *(compartilhada com Validação)*
Objetivo: definir os termos concretos da oferta comercial e registrar seu status de validação e aprendizados — página única acessível tanto em Direção (onde a oferta é desenhada) quanto em Validação (onde ela é testada). Ver regra de compartilhamento em §3.2.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `nome_oferta` | texto | sim | Nome comercial da oferta |
| `formato` | texto | não | Ex.: consultoria, curso, SaaS, serviço recorrente |
| `preco` | texto | não | Texto para permitir faixas/condições, não só número |
| `promessa` | texto | não | O que o cliente recebe/alcança |
| `garantias` | texto | não | Garantias oferecidas, se houver |
| `status_validacao` | enum: `draft` \| `testing` \| `validated` | sim | Estado atual de validação da oferta |
| `aprendizados` | corpo markdown | não | Aprendizados acumulados ao longo da validação |

### Validação

#### 4.8 Oferta
Ver item 4.7 — mesmo arquivo (`content/direcao/oferta.md`), mesmo formulário, mesma exibição. Nenhum campo adicional é introduzido nesta rota.

#### 4.9 Primeiros Passos
Objetivo: manter uma lista de ação de curto prazo — o que precisa acontecer para validar a oferta e destravar o negócio — com dono e prazo, para que founder e agentes de IA saibam sempre "o que fazer a seguir".
Exibição: Cards em Grid/Lista (lista principal: `passos`) com ViewToggle.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `passos` | lista de `{ id, descricao, prazo, responsavel, status }` | não | Um card por passo |

Sugestão de valores para `status` de cada passo (não obrigatório fixar no PRD, mas recomendado para o schema Zod): `todo` \| `em-andamento` \| `concluido` \| `bloqueado`.

### Caixa

#### 4.10 Fluxo de Caixa
Objetivo: dar visibilidade rápida e honesta da saúde financeira do negócio em um ponto no tempo. É um **snapshot mensal simples** — não um livro-razão, não um histórico de lançamentos, não um substituto de contabilidade.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `mes_referencia` | texto (ex.: `2026-07`) | sim | Mês a que o snapshot se refere |
| `entradas` | numérico | não | Total de entradas no mês |
| `saidas` | numérico | não | Total de saídas no mês |
| `saldo` | numérico | não | Saldo resultante (pode ser calculado ou informado) |
| `notas` | corpo markdown | não | Observações sobre o mês |

Nota de escopo: esta página representa o snapshot **atual/mais recente**; manter histórico de meses anteriores (série temporal, gráficos) é explicitamente fora de escopo nesta fase (ver §6, Fora de escopo).

#### 4.11 ERP
Objetivo: registrar qual ferramenta de ERP/gestão financeira o negócio usa hoje (se usa) e o estado de uma eventual integração com o BusinessOS, sem que o BusinessOS assuma o papel de ERP completo.
Exibição: Card único com formulário.

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `erp_atual` | texto | não | Nome da ferramenta usada hoje, se houver |
| `status_integracao` | enum: `nao-iniciado` \| `em-andamento` \| `concluido` | sim | Estado da integração com o ERP atual |
| `notas` | corpo markdown | não | Observações livres |

## 5. Requisitos funcionais

### RF1 — Navegação
- RF1.1 A sidebar exibe as 4 seções (Founder, Direção, Validação, Caixa) sempre visíveis, cada uma com seus itens de página.
- RF1.2 A sidebar tem 11 links de navegação mapeados para as 10 páginas de conteúdo, conforme tabela em §3.1 (o link "Oferta" aparece em Direção e em Validação, ambos levando ao mesmo conteúdo).
- RF1.3 Cada item da sidebar tem hover de fundo (ver princípios visuais no BRIEFING.md); o item correspondente à rota ativa é destacado visualmente.
- RF1.4 Navegar para qualquer uma das 10 páginas carrega o conteúdo do arquivo `.md` correspondente e o exibe em cards, nunca em tabela.

### RF2 — Leitura de conteúdo
- RF2.1 Cada página lê o(s) campo(s) de frontmatter e o corpo Markdown (quando aplicável) do arquivo correspondente listado em §3.1.
- RF2.2 Se o arquivo de uma página não existir ainda, a página deve renderizar um estado vazio com formulário pronto para a primeira criação (ver RF3.1), não um erro.
- RF2.3 Campos de corpo Markdown são renderizados como Markdown formatado em modo leitura.
- RF2.4 Páginas com campo em lista (Mapa do Mercado, Mapa e Ímã de Problemas, Primeiros Passos) exibem cada item da lista como um Card independente, respeitando o modo de exibição (grid ou lista) definido pelo ViewToggle (RF4).

### RF3 — Edição e escrita (CRUD de conteúdo)
- RF3.1 **Create**: se o arquivo da página não existir, salvar o formulário pela primeira vez cria o arquivo no caminho definido em §3.1, com frontmatter YAML + corpo Markdown gerados a partir dos campos preenchidos.
- RF3.2 **Read**: coberto por RF2.
- RF3.3 **Update**: cada página é editável via formulário; salvar sobrescreve o frontmatter e o corpo do arquivo correspondente, preservando campos não expostos na UI (se existirem) sempre que tecnicamente viável.
- RF3.4 **Delete**: para itens dentro de uma lista (ex.: um concorrente, um problema, um passo), o formulário permite remover o item individualmente, o que atualiza a lista no arquivo sem afetar os demais campos da página. Exclusão da página inteira (do arquivo) não é um requisito desta fase.
- RF3.5 A escrita é sempre direta no arquivo (ver RNF1) — não há rascunho intermediário em banco de dados nem fila de sincronização.
- RF3.6 Formulários validam os campos conforme os tipos definidos em §4 (texto, corpo markdown, lista de strings, lista de objetos, enum, numérico) antes de persistir.
- RF3.7 Para a página Oferta, salvar a partir de `/direcao/oferta` ou de `/validacao/oferta` grava no mesmo arquivo (`content/direcao/oferta.md`); não deve existir caminho de código que grave um segundo arquivo para essa página.
- RF3.8 O campo `problema_core_id` (Mapa e Ímã de Problemas) só pode ser definido/selecionado a partir dos `id`s existentes em `problemas[]` no momento da edição (ex.: um select populado dinamicamente), para reduzir a chance de referência quebrada.

### RF4 — Grid/Lista (ViewToggle)
- RF4.1 Existe um controle único (select) de alternância entre modo Grid e modo Lista para exibição de cards.
- RF4.2 O ViewToggle é **global**: a preferência escolhida se aplica a todas as páginas com listas (§3.3), não é configurada por página individualmente.
- RF4.3 A preferência de modo (grid ou lista) é persistida no client (ex.: `localStorage`) e restaurada em sessões futuras, sem exigir conta ou backend.
- RF4.4 Páginas classificadas como "só de campos únicos" (§3.3) não exibem o ViewToggle, pois não há lista para alternar.

### RF5 — Conteúdo compartilhado Direção/Validação
- RF5.1 Ver RF3.7. Este requisito reforça que, do ponto de vista de produto, "Oferta" é uma única página de conteúdo com duas entradas de navegação — qualquer teste de aceitação deve verificar que uma edição feita em uma rota aparece imediatamente ao navegar para a outra.

## 6. Requisitos não-funcionais

- RNF1 — **Sem banco de dados nesta fase.** Toda leitura e escrita de conteúdo de negócio acontece diretamente em arquivos `.md` com frontmatter YAML, no sistema de arquivos do projeto (pasta `content/`, conforme §3.1). Não há camada de API/ORM/banco entre a UI e o arquivo além do necessário para parsear/serializar frontmatter.
- RNF2 — **Supabase é apenas referência futura.** O `.mcp.json` já configurado com o servidor MCP do Supabase não deve ser usado como dependência funcional desta fase; nenhum requisito deste PRD pressupõe sua existência.
- RNF3 — **Arquivos como interface para agentes de IA.** O formato de frontmatter de cada página (nomes de campo, tipos, estrutura de listas) deve ser estável e documentado (via schema Zod, ver §7) para que agentes de IA leiam e escrevam com segurança sem depender da UI.
- RNF4 — **Consistência visual.** Todas as páginas seguem os princípios definidos no BRIEFING.md: minimalismo preto e branco, tipografia Inter, bordas arredondadas, cards (nunca tabelas), sidebar com hover de fundo.
- RNF5 — **Usuário único.** Não há requisitos de multiusuário, permissões ou autenticação de terceiros nesta fase; o founder é o único usuário humano.
- RNF6 — **Resiliência a arquivo ausente ou malformado.** A UI não deve quebrar (tela em branco/erro fatal) se um arquivo de conteúdo estiver ausente (RF2.2) ou com frontmatter inválido; deve degradar para um estado tratável (vazio ou com aviso de erro de formato).
- RNF7 — **Performance.** Como o volume de conteúdo por founder é pequeno (10 arquivos, listas de dezenas de itens no máximo), não há requisito de paginação, cache complexo ou índice — leitura direta de arquivo a cada navegação é aceitável.
- RNF8 — **Stack.** Next.js (App Router) + TypeScript, shadcn/ui, Storybook para documentação de componentes, conforme BRIEFING.md.

## 7. Fora de escopo (nesta fase)

- Histórico/série temporal de Fluxo de Caixa (múltiplos snapshots mensais navegáveis, gráficos de evolução).
- Integração real com qualquer ERP (o campo `erp_atual`/`status_integracao` é apenas registro manual de estado).
- Múltiplos usuários, permissões, autenticação.
- Banco de dados / Supabase como fonte de dados.
- Exclusão de página inteira (arquivo) pela UI.
- Versionamento/histórico de edições dentro da própria UI (git, se usado, cobre isso externamente).

## 8. Próximos passos

Este PRD é a base direta para os **schemas Zod** de cada uma das 10 páginas (um schema por arquivo de `content/`, com o schema de Oferta compartilhado entre as duas rotas), e para a definição dos componentes de UI reutilizáveis: `Card`, `ViewToggle`, formulário genérico orientado a schema, e o layout de `Sidebar` com as 4 seções.
