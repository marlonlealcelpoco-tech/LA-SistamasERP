# Arquitetura do Backend

## Stack adotada

- **Node.js 22 + TypeScript**: execução estável e tipagem para reduzir erros de manutenção.
- **Fastify**: API REST leve, rápida e preparada para crescer por módulos.
- **PostgreSQL**: banco relacional adequado aos vínculos e à consistência exigidos por um ERP.
- **SQL com `pg`**: acesso direto ao banco nesta primeira etapa, sem acoplamento desnecessário a ORM.
- **JWT + bcrypt**: sessão por token e senhas armazenadas apenas como hash seguro.
- **Zod**: validação de entradas e de variáveis de ambiente.

A interface continua fora do escopo desta etapa. Ela será implementada separadamente, usando o modelo PowerPoint como referência.

## Implementado

- Autenticação, primeiro administrador e sessão JWT
- Perfis e gestão administrativa de usuários
- Clientes e fornecedores, com pesquisa e controle de status
- Produtos, preços, estoque mínimo e status
- Movimentações de estoque transacionais, sem permitir saldo negativo
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
│   ├── products/   # catálogo e preços
│   ├── users/      # gestão de usuários e perfis
│   ├── app.ts      # composição da API e tratamento de erros
│   ├── config.ts   # validação da configuração de ambiente
│   └── server.ts   # inicialização HTTP
├── .env.example
├── package.json
└── tsconfig.json
```

Os próximos módulos (compras, vendas e financeiro) devem seguir a mesma divisão por domínio, usando movimentos de estoque vinculados aos respectivos documentos.
