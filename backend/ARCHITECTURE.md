# Arquitetura do Backend

## Stack adotada

- **Node.js 22 + TypeScript**: execução estável e tipagem para reduzir erros de manutenção.
- **Fastify**: API REST leve, rápida e preparada para crescer por módulos.
- **PostgreSQL**: banco relacional adequado aos vínculos e à consistência exigidos por um ERP.
- **SQL com `pg`**: acesso direto ao banco nesta primeira etapa, sem acoplamento desnecessário a ORM.
- **JWT + bcrypt**: sessão por token e senhas armazenadas apenas como hash seguro.
- **Zod**: validação de entradas e de variáveis de ambiente.

A interface continua fora do escopo desta etapa. Ela será implementada separadamente, usando o modelo PowerPoint como referência.

## Implementado agora

- Endpoint de saúde: `GET /health`
- Criação controlada do primeiro administrador: `POST /auth/setup`
- Login: `POST /auth/login`
- Consulta do usuário autenticado: `GET /auth/me`
- Banco PostgreSQL local opcional via Docker Compose
- Migração que habilita IDs automáticos para usuários

## Organização

```text
backend/
├── src/
│   ├── auth/       # login, primeiro administrador e acesso a usuários
│   ├── db/         # conexão com PostgreSQL
│   ├── app.ts      # composição da API e tratamento de erros
│   ├── config.ts   # validação da configuração de ambiente
│   └── server.ts   # inicialização HTTP
├── .env.example
├── package.json
└── tsconfig.json
```

Os próximos módulos (clientes, produtos, estoque, vendas e financeiro) devem seguir a mesma divisão por domínio, sem misturar regras de negócio com as rotas HTTP.
