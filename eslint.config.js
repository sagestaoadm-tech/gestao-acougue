# GESTÃO Açougue

Sistema ERP profissional para gestão de açougue, com foco em operação comercial, estoque, PDV, caixa, funcionários e relatórios.

## Visão geral

- React + Vite no frontend
- Node.js + Express + PostgreSQL no backend
- Login com autenticação por JWT
- Arquitetura preparada para multi-empresa
- Interface responsiva para desktop e celular
- Módulos de PDV, caixa, clientes, entregas e financeiro

## Estrutura inicial do projeto

- `src/` — frontend React
- `server/` — backend API em Node.js
- `server/src/db/schema.sql` — banco PostgreSQL
- `server/.env.example` — variáveis de ambiente

## Instalação

### Frontend

```bash
npm install
```

### Backend

```bash
cd server
npm install
```

## Configuração do banco PostgreSQL

1. Crie um banco PostgreSQL chamado `gestao_acougue`
2. Ajuste as informações em `server/.env` com base no arquivo `server/.env.example`
3. Execute o schema:

```bash
cd server
psql -U postgres -d gestao_acougue -f src/db/schema.sql
```

## Executar a aplicação

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
npm run dev
```

## Etapa 2 concluída

- Estrutura de banco PostgreSQL
- Registro de empresa e usuário administrador
- Login com autenticação JWT
- Proteção de rotas por middleware
- Históricos de auditoria
- Separação preparada por empresa

## Observações importantes

- As senhas não ficam expostas no código.
- O arquivo `.env` deve ser mantido fora do controle de versão.
- O projeto está preparado para uso real com PostgreSQL, mas o servidor local precisa de um banco PostgreSQL instalado e acessível.

## Próxima etapa

- Cadastro completo de produtos e estoque
- controles de movimentação, custo e margem
- suporte a venda por peso e unidade
- integração de balança digital documentada
