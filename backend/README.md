# API — LA-Sistemas ERP

## Pré-requisitos

- Node.js 22 ou superior
- Docker Desktop (opcional, para iniciar o PostgreSQL local)

## Início rápido

1. Na raiz do projeto, inicie o banco:

   ```bash
   docker compose up -d
   ```

2. Entre na pasta `backend`, crie o arquivo de ambiente a partir de `.env.example` e defina valores secretos para `JWT_SECRET` e `BOOTSTRAP_TOKEN`.

3. Instale as dependências e inicie a API:

   ```bash
   npm install
   npm run dev
   ```

A API estará em `http://localhost:3000`.

## Endpoints iniciais

| Método | Rota | Uso |
| --- | --- | --- |
| GET | `/health` | Verifica API e banco de dados |
| POST | `/auth/setup` | Cria o primeiro administrador, uma única vez |
| POST | `/auth/login` | Autentica um usuário |
| GET | `/auth/me` | Retorna o usuário do token JWT |

### Criar o primeiro administrador

A rota só funciona quando ainda não existe usuário e exige o `BOOTSTRAP_TOKEN`. Guarde esse token fora do código-fonte.

```json
{
  "name": "Administrador",
  "email": "admin@empresa.com",
  "password": "uma-senha-forte",
  "bootstrapToken": "o-mesmo-valor-de-BOOTSTRAP_TOKEN"
}
```

Após o login, envie o token recebido no cabeçalho:

```text
Authorization: Bearer <token>
```

## Segurança e decisões

- Senhas nunca são salvas em texto: são processadas com bcrypt.
- O segredo JWT e o token de inicialização são variáveis de ambiente; não devem ser enviados ao GitHub.
- O CORS fica restrito à origem configurada em `CORS_ORIGIN`; antes da interface existir, ele pode ficar vazio.
- A criação de usuários adicionais e permissões será entregue junto do módulo de usuários, depois da definição das regras de acesso.
