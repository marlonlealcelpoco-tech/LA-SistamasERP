# LA Sistemas ERP — Progresso do Frontend

## Objetivo
Registrar permanentemente o estado da construção do frontend para permitir retomada segura do projeto sem perder contexto.

## Estado atual
- Branch oficial de desenvolvimento: `feature/financeiro-completo`
- `main`: não utilizar para desenvolvimento desta etapa.
- Backend: existente e validado pelo CI informado pelo projeto.
- Banco de dados: schema existente e utilizado pelo backend.
- Frontend: App Shell visual concluído e autenticação real integrada aos endpoints oficiais do backend.

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
- [x] Integrar `POST /auth/login`
- [x] Integrar `GET /auth/me`
- [x] Proteger App Shell por sessão JWT
- [x] Registrar autenticação real na documentação de integração
- [ ] Validar menu com roles reais retornados pelo backend
- [ ] Criar Dashboard real
- [ ] Criar PDV
- [ ] Criar Caixa
- [ ] Criar Estoque
- [ ] Criar Cadastros
- [ ] Criar Financeiro
- [ ] Criar Relatórios

## Registro da etapa — Autenticação real
**Data:** 2026-08-15

A etapa de integração do login real foi implementada no frontend com base direta nos contratos já existentes no backend.

### Implementado
- `frontend/login.html` — tela de acesso com identidade visual LA-SISTEMAS.
- `frontend/styles/login.css` — identidade visual da tela de login.
- `frontend/js/api.js` — cliente HTTP centralizado para a API oficial, com suporte a JWT.
- `frontend/js/login.js` — fluxo de `POST /auth/login`, armazenamento de sessão e confirmação via `GET /auth/me`.
- `frontend/js/app-shell.js` — proteção do App Shell por JWT, confirmação de sessão e tratamento de `401`.
- `frontend/app-shell.html` — carregamento do cliente oficial da API antes do Shell.

### Contratos utilizados
O backend existente define:
- `POST /auth/login` recebendo `email` e `password` e retornando `user` e `token`.
- `GET /auth/me` exigindo autenticação JWT e retornando o `user` autenticado.

### Sessão
O JWT e os dados da sessão são mantidos em `sessionStorage` apenas durante a sessão do navegador. O frontend não utiliza `localStorage` como banco paralelo.

### Regras respeitadas
- Nenhum endpoint novo foi criado.
- Nenhuma regra de autenticação foi duplicada no frontend.
- O backend continua sendo a autoridade final para autenticação e autorização.
- O App Shell não abre sem uma sessão JWT.
- Se `/auth/me` retornar `401`, a sessão é removida e o usuário retorna ao login.
- O logout remove o token e a sessão local e retorna ao login.

### Configuração da API
O cliente usa `http://localhost:3000` como base padrão de desenvolvimento. A aplicação pode sobrescrever essa URL por `window.LA_API_BASE_URL` antes do carregamento de `frontend/js/api.js`.

### Status
**Autenticação real:** ✅ implementada no frontend.

**Próximo passo:** validar a execução ponta a ponta contra uma instância real do backend e, em seguida, mapear os `roles` retornados pelo backend para a navegação real sem inventar permissões.

## Registro da etapa — Finalização visual do App Shell
**Data:** 2026-08-15

A etapa de identidade visual do App Shell foi finalizada para permitir o avanço para a autenticação real e integração com o backend.

**Diretriz visual consolidada:** o `frontend/docs/sistemaerp.pdf` é a referência oficial de identidade visual, especialmente para paleta de cores, logos, marca d'água e linguagem corporativa. A referência não precisa ser reproduzida literalmente e não define os botões ou funcionalidades do ERP.

**Status:** ✅ App Shell visual concluído.

## Registro da etapa — Referência visual oficial
**Data:** 2026-08-15

O arquivo `frontend/docs/sistemaerp.pdf` foi confirmado dentro do projeto e passa a ser a referência visual oficial e permanente do frontend.

**Regra permanente:**
- PDF/PowerPoint → identidade visual, composição, logos, cores, proporções e linguagem visual.
- Backend → funcionalidades, menus, ações, permissões, validações, fluxos e regras de negócio.

## Regra de arquitetura
O backend é a autoridade final para autenticação, autorização, regras de negócio e persistência. O frontend não deve duplicar essas regras.

## Regra de continuidade
Após cada etapa importante, atualizar este arquivo, o mapa de telas e a documentação de integração antes do próximo passo.
