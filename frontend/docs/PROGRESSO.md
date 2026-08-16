# LA Sistemas ERP — Progresso do Frontend

## Objetivo
Registrar permanentemente o estado da construção do frontend para permitir retomada segura do projeto sem perder contexto.

## Estado atual
- Branch oficial de desenvolvimento: `feature/financeiro-completo`
- `main`: não utilizar para desenvolvimento desta etapa.
- Backend: existente e validado pelo CI informado pelo projeto.
- Banco de dados: schema existente e utilizado pelo backend.
- Frontend: App Shell inicial criado sobre a arquitetura real do backend e ajustado ao padrão visual de referência.

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
- [x] Ajustar identidade visual do App Shell à referência fornecida
- [ ] Integrar login real à API
- [ ] Validar menu com roles reais retornados pelo backend
- [ ] Criar Dashboard real
- [ ] Criar PDV
- [ ] Criar Caixa
- [ ] Criar Estoque
- [ ] Criar Cadastros
- [ ] Criar Financeiro
- [ ] Criar Relatórios

## Registro da etapa — Ajuste visual do App Shell
**Data:** 2026-08-15

**Desenvolvido:** ajuste da aparência do App Shell para seguir o padrão visual de referência fornecido pelo projeto, sem copiar a funcionalidade dos botões do material de referência.

**Identidade visual:** logo superior com tratamento colorido e marca d'água LA em azul na área principal, mantendo a estrutura limpa, corporativa e clara do layout de referência.

**Arquivos alterados:**
- `frontend/app-shell.html`
- `frontend/styles/app-shell.css`

**Integração:** nenhuma regra de negócio foi alterada. O ajuste é exclusivamente visual e continua preparado para a integração com as APIs oficiais.

**Testes:** revisão estrutural dos arquivos e responsividade CSS; validação funcional completa será feita junto da integração do frontend.

**Commits:** `0b55a3a6d57ca7677d72ab36e7039aea69686f33` e `4dad6cfadb83cdaed7ecfe4ed8d54e16f5e78175`.

**Próximo passo:** integrar `POST /auth/login` e `GET /auth/me`, substituir a sessão de demonstração pela sessão real e validar as permissões fornecidas pelo backend.

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
