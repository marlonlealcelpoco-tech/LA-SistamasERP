# LA Sistemas ERP — Progresso do Frontend

## Objetivo
Registrar permanentemente o estado da construção do frontend para permitir retomada segura do projeto sem perder contexto.

## Estado atual
- Branch oficial de desenvolvimento: `feature/financeiro-completo`
- `main`: não utilizar para desenvolvimento desta etapa.
- Backend: existente e validado pelo CI informado pelo projeto.
- Banco de dados: schema existente e utilizado pelo backend.
- Frontend: fundação visual será construída sobre as APIs reais do backend.

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
- [ ] Criar App Shell
- [ ] Integrar login real
- [ ] Criar menu lateral dinâmico
- [ ] Criar Dashboard
- [ ] Criar PDV
- [ ] Criar Caixa
- [ ] Criar Estoque
- [ ] Criar Cadastros
- [ ] Criar Financeiro
- [ ] Criar Relatórios

## Regra de arquitetura
O backend é a autoridade final para autenticação, autorização, regras de negócio e persistência. O frontend não deve duplicar essas regras.

## Regra de continuidade
Após cada etapa importante, atualizar este arquivo, o mapa de telas e a documentação de integração antes do próximo passo.
