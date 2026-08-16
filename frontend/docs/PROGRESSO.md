# LA Sistemas ERP — Progresso do Frontend

## Objetivo
Registrar permanentemente o estado da construção do frontend para permitir retomada segura do projeto sem perder contexto.

## Estado atual
- Branch oficial de desenvolvimento: `feature/financeiro-completo`
- `main`: não utilizar para desenvolvimento desta etapa.
- Backend: existente e validado pelo CI informado pelo projeto.
- Banco de dados: schema existente e utilizado pelo backend.
- Frontend: App Shell visual concluído; próximo passo é integração da autenticação real com o backend.

## Referência visual oficial
- **Arquivo:** `frontend/docs/sistemaerp.pdf`
- **Regra:** consultar este PDF sempre que houver uma decisão visual relevante no frontend.
- **Uso:** referência de identidade visual, principalmente paleta, logos, marca d'água e linguagem corporativa; não define funcionalidades nem exige reprodução literal do layout.
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
- [x] Reconstruir e finalizar identidade visual do App Shell
- [x] Validar direção visual final do App Shell com base na referência `frontend/docs/sistemaerp.pdf`
- [ ] Integrar login real à API
- [ ] Validar menu com roles reais retornados pelo backend
- [ ] Criar Dashboard real
- [ ] Criar PDV
- [ ] Criar Caixa
- [ ] Criar Estoque
- [ ] Criar Cadastros
- [ ] Criar Financeiro
- [ ] Criar Relatórios

## Registro da etapa — Finalização visual do App Shell
**Data:** 2026-08-15

A etapa de identidade visual do App Shell foi finalizada para permitir o avanço para a autenticação real e integração com o backend.

**Diretriz visual consolidada:** o `frontend/docs/sistemaerp.pdf` é a referência oficial de identidade visual, especialmente para paleta de cores, logos, marca d'água e linguagem corporativa. A referência não precisa ser reproduzida literalmente e não define os botões ou funcionalidades do ERP.

**Ajustes realizados:**
- refinamento da estrutura visual do App Shell;
- acabamento da sidebar e estados de navegação;
- acabamento do cabeçalho/topbar;
- reforço da identidade azul LA-SISTEMAS;
- tratamento do logo superior;
- marca d'água LA na área principal;
- cards e painéis com hierarquia visual consistente;
- detalhes de borda, sombra, espaçamento e tipografia;
- responsividade para desktop, tablet e celular;
- pequena barra de identidade visual na área de conteúdo;
- melhoria dos estados hover e foco visual.

**Arquivos alterados nesta etapa:**
- `frontend/app-shell.html`
- `frontend/styles/app-shell.css`

**Commits desta etapa:**
- `45b808559faa2eb7c1476374ad4a40bcc02111b0` — finalização da estrutura visual do App Shell.
- `df70ff49fd1deed42b212fe3aff12ff2aa631f46` — acabamento final da identidade visual do App Shell.

**Regras respeitadas:**
- backend permanece como fonte oficial das funcionalidades, permissões, validações e regras de negócio;
- nenhuma regra do backend foi alterada;
- nenhuma funcionalidade foi criada apenas por existir no PowerPoint/PDF;
- o desenvolvimento permanece no branch `feature/financeiro-completo`;
- o `main` permanece fora desta etapa.

**Status:** ✅ App Shell visual concluído.

**Próximo passo:** integrar `POST /auth/login` e `GET /auth/me`, utilizando a autenticação e os contratos reais já documentados, e depois validar a navegação conforme as roles retornadas pelo backend.

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
