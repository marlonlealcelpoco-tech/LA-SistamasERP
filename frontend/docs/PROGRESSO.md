# LA Sistemas ERP — Progresso do Frontend

## Objetivo
Registrar permanentemente o estado da construção do frontend para permitir retomada segura do projeto sem perder contexto.

## Estado atual
- Branch oficial de desenvolvimento: `feature/financeiro-completo`
- `main`: não utilizar para desenvolvimento desta etapa.
- Backend: existente e validado pelo CI informado pelo projeto.
- Banco de dados: schema existente e utilizado pelo backend.
- Frontend: App Shell inicial criado sobre a arquitetura real do backend.

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
- [ ] Integrar login real à API
- [ ] Validar menu com roles reais retornados pelo backend
- [ ] Criar Dashboard real
- [ ] Criar PDV
- [ ] Criar Caixa
- [ ] Criar Estoque
- [ ] Criar Cadastros
- [ ] Criar Financeiro
- [ ] Criar Relatórios

## Registro da etapa — App Shell
**Data:** 2026-08-15

**Desenvolvido:** shell principal, sidebar, topbar, breadcrumb, identificação do usuário, status do sistema, logout, navegação visual e responsividade inicial.

**Arquivos criados:**
- `frontend/app-shell.html`
- `frontend/styles/app-shell.css`
- `frontend/js/app-shell.js`
- `frontend/docs/REGRAS-DESENVOLVIMENTO.md`

**Integração:** preparado para receber sessão/permissões e APIs oficiais; a autenticação real ainda será conectada no próximo passo.

**Testes:** validação estrutural dos arquivos e navegação básica; testes de integração com backend ainda pendentes.

**Commits da etapa:** `ae4dbdacbdc430988c6b3b806fdf84b317f4269c`, `69d8373114882e5ab3366af5f4a60e9c42ebe2b7`, `1955e07be0b91c239d695d76ff45d6ebbbb56d8d`, `42df30a7e41b27b695c426e5b4f5b3a807e2d9b7`.

**Próximo passo:** integrar `POST /auth/login` e `GET /auth/me`, substituir a sessão de demonstração pela sessão real e validar as permissões fornecidas pelo backend.

## Regra de arquitetura
O backend é a autoridade final para autenticação, autorização, regras de negócio e persistência. O frontend não deve duplicar essas regras.

## Regra de continuidade
Após cada etapa importante, atualizar este arquivo, o mapa de telas e a documentação de integração antes do próximo passo.
