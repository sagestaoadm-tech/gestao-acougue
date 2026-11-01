# GESTÃO Açougue

Sistema ERP para gestão de açougue com painel admin, PDV, estoque, financeiro e relatórios.

## Estrutura inicial

- Frontend em React + Vite
- Backend em Node.js com Express e PostgreSQL
- Design responsivo com painel administrativo
- Estrutura preparada para expansão por módulos

## Como iniciar

1. Instale as dependências do frontend:
   npm install
2. Instale as dependências do backend:
   cd server && npm install
3. Configure as variáveis de ambiente:
   - copie `server/.env.example` para `server/.env`
   - ajuste `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
4. Crie o banco PostgreSQL e execute o script `server/src/db/schema.sql`
5. Inicie o backend:
   cd server && npm run dev
6. Inicie o frontend:
   npm run dev

## Etapa 1 concluída

- painel administrativo profissional
- menu lateral com navegação
- módulos base da aplicação
- telas principais com estrutura pronta
- login demarcado
- PDV funcional em interface

## Próxima etapa

- autenticação e banco de dados em PostgreSQL
- cadastro de produtos e estoque
- fluxo de pedidos e integração com caixa
