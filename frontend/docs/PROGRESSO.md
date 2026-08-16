# LA Sistemas ERP — Progresso do Frontend

## Objetivo
Registrar permanentemente o estado da construção do frontend para permitir retomada segura do projeto sem perder contexto.

## Estado atual
- Branch oficial de desenvolvimento: `feature/financeiro-completo`
- `main`: não utilizar para desenvolvimento desta etapa.
- Backend: existente e validado pelo CI informado pelo projeto.
- Banco de dados: schema existente e utilizado pelo backend.
- Frontend: App Shell em reconstrução visual, com identidade visual baseada na referência oficial `frontend/docs/sistemaerp.pdf` e funcionalidade preservada para integração com o backend.

## Referência visual oficial
- **Arquivo:** `frontend/docs/sistemaerp.pdf`
- **Regra:** consultar este PDF sempre que houver uma decisão visual relevante no frontend.
- **Uso:** exclusivamente identidade visual; não define funcionalidades.
- **Fonte funcional:** backend e contratos reais da API no branch `feature/financeiro-completo`.
- **Regra resumida:** **PDF = aparência. Backend = comportamento.**

## Etapas
- [x] Mapear arquitetura do backend
- [x] Mapear entidades e relacionamentos principais do banco
- [x] Mapear autenticação
- [x] Mapear usuários/roles
- [x] Mapear clientes e fornecedores
- [x] Mapear produtos e estoque
- [x] Mapear compras
- [x] Mapear caixa
- [x] Mapear vendas/PDV
- [x] Mapear financeiro
- [x] Registrar regra permanente de continuidade
- [x] Criar App Shell inicial
- [x] Criar estrutura do menu lateral
- [x] Criar área de usuário/sessão
- [x] Criar logout da sessão
- [x] Criar responsividade inicial
- [x] Registrar diretriz de identidade visual
- [🚧] Reconstruir identidade visual do App Shell
- [ ] Validar visual final do App Shell contra `frontend/docs/sistemaerp.pdf`
- [ ] Integrar login real à API
- [ ] Validar menu com roles reais retornados pelo backend
- [ ] Criar Dashboard real
- [ ] Criar PDV
- [ ] Criar Caixa
- [ ] Criar Estoque
- [ ] Criar Cadastros
- [ ] Criar Financeiro
- [ ] Criar Relatórios

## Registro da etapa — Referência visual oficial
**Data:** 2026-08-15

O arquivo `frontend/docs/sistemaerp.pdf` foi confirmado dentro do projeto e passa a ser a referência visual oficial e permanente do frontend.

A documentação `frontend/docs/IDENTIDADE-VISUAL.md` foi atualizada para determinar que o PDF deve ser consultado em futuras decisões visuais e que ele não deve ser interpretado como especificação funcional.

**Regra permanente:**
- PDF/PowerPoint → identidade visual, composição, logos, cores, proporções e linguagem visual.
- Backend → funcionalidades, menus, ações, permissões, validações, fluxos e regras de negócio.

**Status:** referência visual registrada e disponível no repositório.

## Registro da etapa — Reconstrução visual do App Shell
**Data:** 2026-08-15

**Objetivo:** reconstruir visualmente o App Shell com base na identidade visual do PDF/PowerPoint fornecido, sem transformar os botões ou funcionalidades da referência em especificação funcional.

**Desenvolvido:** refinamento da estrutura HTML e do CSS do App Shell, mantendo a navegação modular e a preparação para sessão/permissões do backend. Foram reforçados o tratamento visual do logo LA-SISTEMAS, a hierarquia do menu, a linguagem corporativa, o cabeçalho, os cards, a área principal, a marca d'água LA e o comportamento responsivo.

**Arquivos alterados:**
- `frontend/app-shell.html`
- `frontend/styles/app-shell.css`

**Documentação relacionada:**
- `frontend/docs/IDENTIDADE-VISUAL.md`
- `frontend/docs/APP-SHELL-VISUAL.md`
- `frontend/docs/sistemaerp.pdf`

**Regras respeitadas:**
- Backend continua sendo a fonte oficial das funcionalidades, permissões, validações e regras de negócio.
- Nenhuma regra de negócio do backend foi alterada.
- Nenhuma funcionalidade foi criada apenas por existir no PowerPoint.
- O desenvolvimento permanece no branch `feature/financeiro-completo`.

**Integração:** nenhuma API nova foi conectada nesta etapa.

**Testes:** revisão estrutural do HTML/CSS e preservação da navegação existente; validação visual final e testes de integração permanecem pendentes.

**Commits desta continuação:**
- `5fbeba6be7d2ce2029e23b7ebceb18bf20d3cf63` — refinamento da composição visual do App Shell.
- `8c909777d0208748aa4422a5197118dc0138553c` — consolidação do acabamento responsivo do App Shell.
- `40d7b6c2405180ad1a6d76e0f65cb9aae635bcce` — definição do PDF como referência visual oficial.

**Status:** 🚧 Em desenvolvimento.

**Próximo passo:** validar visualmente o App Shell contra `frontend/docs/sistemaerp.pdf`. Somente após a aprovação visual o projeto avançará para `POST /auth/login` e `GET /auth/me`.

## Registro da etapa — Diretriz visual
**Data:** 2026-08-15

Foi criada a documentação `frontend/docs/IDENTIDADE-VISUAL.md`, estabelecendo que o PDF/PowerPoint orienta exclusivamente a identidade visual e que as funcionalidades continuam determinadas pelo backend.

## Registro da etapa — App Shell inicial
**Data:** 2026-08-15

**Desenvolvido:** shell principal, sidebar, topbar, breadcrumb, identificação do usuário, status do sistema, logout, navegação visual e responsividade inicial.

**Arquivos criados:**
- `frontend/app-shell.html`
- `frontend/styles/app-shell.css`
- `frontend/js/app-shell.js`
- `frontend/docs/REGRAS-DESENVOLVIMENTO.md`

**Integração:** preparado para receber sessão/permissões e APIs oficiais; a autenticação real ainda será conectada no próximo passo.

**Testes:** validação estrutural dos arquivos e navegação básica; testes de integração com backend ainda pendentes.

## Regra de arquitetura
O backend é a autoridade final para autenticação, autorização, regras de negócio e persistência. O frontend não deve duplicar essas regras.

## Regra de continuidade
Após cada etapa importante, atualizar este arquivo, o mapa de telas e a documentação de integração antes do próximo passo.
