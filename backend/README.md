# API — LA-Sistemas ERP

## Pré-requisitos

- Node.js 22 ou superior
- Docker Desktop (opcional, para iniciar o PostgreSQL local)

## Início rápido

1. Na raiz do projeto, inicie o banco com `docker compose up -d`.
2. Na pasta `backend`, crie `.env` a partir de `.env.example` e defina `JWT_SECRET` e `BOOTSTRAP_TOKEN`.
3. Execute `npm install` e `npm run dev`.

A API estará em `http://localhost:3000`. Todas as rotas autenticadas usam `Authorization: Bearer <token>`.

## Autenticação, usuários e cadastros

| Recurso | Rotas | Acesso |
| --- | --- | --- |
| Saúde | `GET /health` | Público |
| Sessão | `POST /auth/setup`, `POST /auth/login`, `GET /auth/me` | Conforme rota |
| Usuários | `GET/POST /users`, `PUT /users/:id/roles`, `PATCH /users/:id/status` | ADMIN |
| Clientes | `GET/POST /customers`, `PUT /customers/:id`, `PATCH /customers/:id/status` | ADMIN, VENDAS, FINANCEIRO |
| Fornecedores | `GET/POST /suppliers`, `PUT /suppliers/:id`, `PATCH /suppliers/:id/status` | ADMIN, FINANCEIRO |

Clientes e fornecedores aceitam o parâmetro opcional `?search=` para pesquisa por nome, documento ou e-mail.

## Produtos e estoque

| Método | Rota | Acesso | Uso |
| --- | --- | --- | --- |
| GET | `/products` | ADMIN, VENDAS, ESTOQUE, FINANCEIRO | Lista produtos; aceita `?search=` |
| POST | `/products` | ADMIN, ESTOQUE | Cria produto e saldo inicial zerado |
| PUT | `/products/:id` | ADMIN, ESTOQUE | Atualiza dados comerciais |
| PATCH | `/products/:id/status` | ADMIN, ESTOQUE | Ativa/desativa produto |
| PUT | `/products/:id/minimum-stock` | ADMIN, ESTOQUE | Define estoque mínimo |
| GET | `/products/:productId/movements` | ADMIN, ESTOQUE, FINANCEIRO | Histórico de movimentos |
| POST | `/inventory/movements` | ADMIN, ESTOQUE | Registra entrada, saída ou ajuste |

Exemplo de produto:

```json
{
  "code": "PROD-001",
  "name": "Produto Exemplo",
  "description": "Descrição opcional",
  "unit": "UN",
  "cost": 25.50,
  "salePrice": 49.90
}
```

Exemplo de movimentação:

```json
{
  "productId": 1,
  "type": "ENTRY",
  "quantity": 10,
  "reference": "NF-123",
  "notes": "Entrada de compra"
}
```

Tipos de movimento:

- `ENTRY`: soma uma quantidade positiva ao saldo.
- `EXIT`: subtrai uma quantidade positiva; a API recusa saldo negativo.
- `ADJUSTMENT`: aceita valor positivo ou negativo para correções inventariais.

## Segurança e decisões

- Senhas nunca são salvas em texto: são processadas com bcrypt.
- O segredo JWT e o token de inicialização são variáveis de ambiente; não devem ser enviados ao GitHub.
- O CORS fica restrito à origem configurada em `CORS_ORIGIN`.
- Produtos são criados junto com seu registro de estoque em uma única transação.
- Movimentações bloqueiam o saldo do produto durante a operação, preservando a consistência do estoque.
