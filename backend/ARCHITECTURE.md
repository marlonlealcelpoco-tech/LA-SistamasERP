# Arquitetura do Backend

## Stack adotada

- **Node.js 22 + TypeScript**: execução estável e tipagem para reduzir erros de manutenção.
- **Fastify**: API REST leve, rápida e preparada para crescer por módulos.
- **PostgreSQL**: banco relacional adequado aos vínculos e à consistência exigidos por um ERP.
- **SQL com `pg`**: acesso direto ao banco nesta primeira etapa, sem acoplamento desnecessário a ORM.
- **JWT + bcrypt**: sessão por token e senhas armazenadas apenas como hash seguro.
- **Zod**: validação de entradas e de variáveis de ambiente.
- **fast-xml-parser**: leitura de XML de NF-e sem dependência da interface.

A interface continua fora do escopo desta etapa. Ela será implementada separadamente, usando o modelo PowerPoint como referência.

## Implementado

- Autenticação, perfis e gestão de usuários
- Clientes, fornecedores, produtos e estoque
- Compras manuais em rascunho e confirmação transacional
- Prévia e importação de XML de NF-e
- Vínculo ou cadastro de produtos não encontrados no XML
- Revisão explícita de preço: custo anterior/novo e venda anterior/sugerida
- Entrada de estoque e atualização de custo somente na confirmação da compra
- Autorização por perfil aplicada nas rotas
- Banco PostgreSQL local opcional via Docker Compose

## Organização

```text
backend/
├── src/
│   ├── auth/       # login, senha, sessão e autorização
│   ├── db/         # conexão com PostgreSQL
│   ├── inventory/  # movimentos e saldo de estoque
│   ├── parties/    # clientes e fornecedores
│   ├── products/   # catálogo, preços e margem
│   ├── purchases/  # compra manual, XML e confirmação
│   ├── users/      # gestão de usuários e perfis
│   └── app.ts      # composição da API
```

Vendas e financeiro devem consumir compras confirmadas e movimentações já auditáveis, sem duplicar alterações de estoque.
