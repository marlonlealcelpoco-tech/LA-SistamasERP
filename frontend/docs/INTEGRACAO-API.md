# LA Sistemas ERP — Integração Frontend/API

## Princípios
1. O frontend consome as APIs oficiais do backend.
2. O frontend não implementa regras de negócio que pertençam ao backend.
3. O backend é a autoridade final para autenticação e autorização.
4. Dados do ERP não devem ser persistidos em `localStorage` como banco paralelo.
5. Antes de criar uma tela, conferir o contrato do endpoint correspondente.

## Autenticação
- `POST /auth/login` → autentica e retorna sessão/token.
- `GET /auth/me` → consulta o usuário autenticado.

## Usuários
- `GET /users`
- `POST /users`
- `PUT /users/:id/roles`
- `PATCH /users/:id/status`

## Cadastros
### Clientes
- `GET /customers`
- `POST /customers`
- `PUT /customers/:id`
- `PATCH /customers/:id/status`

### Fornecedores
- `GET /suppliers`
- `POST /suppliers`
- `PUT /suppliers/:id`
- `PATCH /suppliers/:id/status`

## Produtos e estoque
- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `PATCH /products/:id/status`
- `PUT /products/:id/minimum-stock`
- `GET /products/:productId/movements`
- `POST /inventory/movements`

## Vendas / PDV
- `POST /sales`
- `POST /sales/:id/cancel`
- `POST /sales/:id/items/:itemId/cancel`
- `POST /sales/:id/discount/authorize`
- `POST /sales/:id/exchange/authorize`

## Caixa
- `POST /cash-sessions`
- `POST /cash-sessions/:id/transactions`
- `GET /cash-sessions/:id/report`
- `POST /cash-sessions/:id/close`
- `GET /cash-reports/daily`

## Compras
- `POST /purchases`
- `POST /purchases/xml/preview`
- `POST /purchases/import-xml`
- `POST /purchases/:id/confirm`

## Financeiro
- `GET /finance/payables`
- `POST /finance/payables`
- `POST /finance/payables/import-xml`
- `POST /finance/payables/:id/pay`
- `GET /finance/receivables`
- `POST /finance/receivables`
- `POST /finance/receivables/:id/receive`

## Atualização
Este documento deve ser atualizado quando uma tela passar de planejada para implementada ou quando um contrato de API utilizado pelo frontend mudar.
