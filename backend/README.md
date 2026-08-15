# API — LA-Sistemas ERP

## Início rápido

1. Na raiz do projeto, inicie o banco com `docker compose up -d`.
2. Na pasta `backend`, crie `.env` a partir de `.env.example` e defina `JWT_SECRET` e `BOOTSTRAP_TOKEN`.
3. Execute `npm install` e `npm run dev`.

A API estará em `http://localhost:3000`. Todas as rotas autenticadas usam `Authorization: Bearer <token>`.

## Módulos disponíveis

| Recurso | Rotas | Acesso |
| --- | --- | --- |
| Saúde | `GET /health` | Público |
| Sessão | `POST /auth/setup`, `POST /auth/login`, `GET /auth/me` | Conforme rota |
| Usuários | `GET/POST /users`, `PUT /users/:id/roles`, `PATCH /users/:id/status` | ADMIN |
| Clientes | `GET/POST /customers`, `PUT /customers/:id`, `PATCH /customers/:id/status` | ADMIN, VENDAS, FINANCEIRO |
| Fornecedores | `GET/POST /suppliers`, `PUT /suppliers/:id`, `PATCH /suppliers/:id/status` | ADMIN, FINANCEIRO |
| Produtos | `GET/POST /products`, `PUT /products/:id`, status e estoque mínimo | Conforme rota |
| Estoque | `GET /products/:productId/movements`, `POST /inventory/movements` | Conforme rota |
| Compras | Rotas abaixo | ADMIN, ESTOQUE |

## Produtos e margem

Cada produto possui `profitMarginPct`, a margem percentual usada para sugerir o preço de venda quando o custo muda. Ao cadastrar ou editar um produto, informe o campo:

```json
{
  "code": "PROD-001",
  "name": "Produto Exemplo",
  "unit": "UN",
  "cost": 25.50,
  "salePrice": 49.90,
  "profitMarginPct": 60
}
```

## Compras manuais

1. Crie a compra em rascunho:

```json
POST /purchases

{
  "supplierId": 1,
  "items": [
    { "productId": 1, "quantity": 10, "unitCost": 25.50 }
  ]
}
```

2. Confirme a compra. Somente neste momento o saldo é somado e o custo dos produtos é atualizado:

```json
POST /purchases/1/confirm

{
  "salePriceUpdates": [
    { "itemId": 1, "applySuggestedSalePrice": true }
  ]
}
```

`applySuggestedSalePrice` é opcional e padrão `false`: o sistema sempre corrige o custo da compra confirmada, mas só altera a venda quando houver confirmação explícita.

## Importação de XML de NF-e

O fluxo foi criado para que a interface futura possa orientar o usuário antes de alterar o catálogo ou o estoque.

1. Envie o conteúdo XML como texto para a prévia:

```json
POST /purchases/xml/preview

{ "xml": "<?xml version=\"1.0\" ...>" }
```

A resposta mostra fornecedor da nota, itens e, para produtos encontrados pelo `cProd` do XML:

- custo antigo e venda antiga;
- custo novo;
- margem cadastrada;
- venda sugerida pela margem.

Para item não localizado, a resposta informa `UNRESOLVED`. A tela deve oferecer:

- **Vincular**: escolher e confirmar um produto já cadastrado.
- **Cadastrar**: criar um produto com código, nome e custo preenchidos a partir do XML; nome, código, margem e venda podem ser ajustados antes do envio.

2. Crie o rascunho importado, enviando uma decisão para cada item:

```json
POST /purchases/import-xml

{
  "supplierId": 1,
  "xml": "<?xml version=\"1.0\" ...>",
  "items": [
    { "itemNumber": 1, "action": "LINK", "productId": 15 },
    {
      "itemNumber": 2,
      "action": "CREATE",
      "product": {
        "profitMarginPct": 50,
        "salePrice": 89.90
      }
    }
  ]
}
```

No caso `CREATE`, campos não informados são preenchidos pelo XML. Caso a venda não seja enviada, ela é sugerida a partir do custo e da margem.

3. A resposta do rascunho inclui `priceReview`, com `costBefore`, `salePriceBefore`, `costAfter` e `suggestedSalePrice` por item. Confirme a compra com `POST /purchases/:id/confirm`; então o estoque é somado, o custo é corrigido e a venda é atualizada apenas nos itens aprovados.

## Regras de estoque

- `ENTRY` soma uma quantidade positiva.
- `EXIT` subtrai uma quantidade positiva; a API recusa saldo negativo.
- `ADJUSTMENT` aceita valor positivo ou negativo.
- A confirmação de compra registra uma entrada identificada pela compra e impede confirmação duplicada.

## Segurança e decisões

- Senhas nunca são salvas em texto: são processadas com bcrypt.
- Segredos ficam em variáveis de ambiente e não devem ser enviados ao GitHub.
- Compras ficam em rascunho até a confirmação; nenhuma alteração de estoque ou custo ocorre durante a prévia do XML.
- O XML original é preservado no rascunho importado para auditoria.
