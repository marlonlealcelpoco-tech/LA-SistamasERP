# LA-Sistemas ERP

Sistema de gestão empresarial modular, preparado para crescer com a operação da LA-Sistemas.

## Objetivo

Construir uma plataforma ERP com módulos integrados para cadastro, estoque, vendas, compras, financeiro, clientes, fornecedores, usuários e relatórios.

## Estado atual

O backend já possui PostgreSQL, autenticação por JWT, usuários com perfis de acesso e cadastros de clientes e fornecedores. A interface visual ainda não foi criada: ela será desenvolvida posteriormente com base no modelo PowerPoint do projeto.

Consulte [a documentação do backend](backend/README.md) para executar a API localmente e conhecer os endpoints.

## Estrutura

- `backend/` — API REST e regras de negócio
- `database/` — schema e migrations PostgreSQL
- `docker-compose.yml` — PostgreSQL local para desenvolvimento
- `docs/` — documentação futura
- `frontend/` — reservado para a interface futura

## Módulos previstos

1. Dashboard
2. Usuários e permissões — concluído na primeira versão
3. Clientes — concluído na primeira versão
4. Fornecedores — concluído na primeira versão
5. Produtos e serviços
6. Estoque
7. Compras
8. Vendas
9. Financeiro
10. Relatórios
11. Configurações

## Licença

Uso privado da LA-Sistemas.
