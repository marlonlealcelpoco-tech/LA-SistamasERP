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

## Autenticação e usuários

| Método | Rota | Acesso | Uso |
| --- | --- | --- | --- |
| GET | `/health` | Público | Verifica API e banco |
| POST | `/auth/setup` | Público com token | Cria o primeiro administrador uma única vez |
| POST | `/auth/login` | Público | Autentica um usuário |
| GET | `/auth/me` | Autenticado | Retorna usuário e perfis |
| GET | `/users` | ADMIN | Lista usuários |
| POST | `/users` | ADMIN | Cria usuário e define perfis |
| PUT | `/users/:id/roles` | ADMIN | Substitui os perfis de um usuário |
| PATCH | `/users/:id/status` | ADMIN | Ativa ou desativa um usuário |

Os perfis iniciais são:

- `ADMIN`: acesso completo e gestão de usuários.
- `VENDAS`: operações comerciais.
- `ESTOQUE`: produtos e estoque.
- `FINANCEIRO`: operações financeiras.

### Criar o primeiro administrador

A rota `/auth/setup` só funciona quando ainda não existe usuário e exige o `BOOTSTRAP_TOKEN`. O primeiro usuário recebe automaticamente o perfil `ADMIN`.

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

### Criar um usuário

Apenas um administrador autenticado pode criar usuários:

```json
{
  "name": "Usuário de Estoque",
  "email": "estoque@empresa.com",
  "password": "uma-senha-forte",
  "roles": ["ESTOQUE"]
}
```

## Segurança e decisões

- Senhas nunca são salvas em texto: são processadas com bcrypt.
- O segredo JWT e o token de inicialização são variáveis de ambiente; não devem ser enviados ao GitHub.
- O CORS fica restrito à origem configurada em `CORS_ORIGIN`; antes da interface existir, ele pode ficar vazio.
- O administrador não pode desativar o próprio acesso nem alterar seus próprios perfis pela API, evitando perda acidental de administração.
