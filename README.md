# 📦 Teste Técnico Natura&Co (Desenvolvedor Sênior)

Este projeto é uma plataforma de e-commerce. O sistema é composto por um backend robusto, desenvolvido com Node.js e Fastify. A aplicação permite a gestão completa de produtos, categorias, departamentos, usuários, carrinhos de compras, pedidos, e oferece funcionalidades adicionais como busca. O objetivo deste projeto é demonstrar habilidades em desenvolvimento web, seguindo as melhores práticas de arquitetura, design e implementação de software.

## 🚀 Tecnologias Utilizadas

- **Node.js** com **Fastify** para o servidor
- **TypeScript** como linguagem principal
- **Prisma** para ORM e manipulação de banco de dados
- **PostgreSQL** como banco de dados relacional
- **Vitest** para testes unitários
- **Zod** para validação de dados
- **Swagger** para documentação da API

## 📁 Estrutura de Pastas

A estrutura de pastas do projeto segue os princípios da Clean Architecture para garantir modularidade, escalabilidade e fácil manutenção.

```plaintext
src/
├── @types                   # Definição de tipos
├── application/
│   ├── services/            # Serviços da aplicação que contêm lógica de negócio adicional
│   └── use-cases/           # Casos de uso que representam as funcionalidades principais
├── docs/                    # Objetos de schema do swagger
├── domain/
│   ├── entities/            # Entidades que representam os objetos do domínio
│   ├── enums/               # Enums usados para definir constantes e tipos
│   ├── interfaces/          # Interfaces que definem contratos e abstrações do domínio
│   └── repositories/        # Interfaces para os repositórios de dados
├── infrastructure/
│   ├── database/            # Configurações do banco de dados, incluindo migrations e seeds
│   ├── di/                  # Injeção de dependências para casos de uso, serviços e repositórios
│   └── repositories/        # Implementações dos repositórios de dados
│       ├── in-memory/       # Repositórios em memória para testes
│       └── prisma/          # Repositórios usando Prisma ORM
├── presentation/
│   ├── controllers/         # Controladores que lidam com as requisições HTTP
│   ├── middlwares/          # Middlewares para validações do fluxo de autenticação e autorização
│   └── routes/              # Definições das rotas da API
├── shared/
│   ├── mappers/             # Mapeadores para converter entidades em DTOs e vice-versa
├── app.ts                   # Inicialização da aplicação
├── env.ts                   # Configurações de ambiente
└── server.ts                # Configuração do servidor Fastify
```

### 📄 Explicação dos Diretórios

- **application/**: Contém serviços e casos de uso que encapsulam a lógica de aplicação.
- **domain/**: Abriga as entidades, enums, interfaces e repositórios que representam o modelo de negócio do projeto.
- **infrastructure/**: Inclui a configuração de banco de dados, implementação dos repositórios e injeção de dependências.
- **presentation/**: Define os controladores e as rotas que expõem a API.
- **shared/**: Contém código reutilizável, como mapeadores e funções utilitárias.

## 📚 Casos de Uso

### Departamentos

- **Criar um novo departamento**: Permite adicionar um novo departamento ao sistema.
- **Obter uma lista de todos os departamentos**: Recupera todos os departamentos cadastrados paginados.
- **Obter os dados de um departamento**: Recupera os dados de um departamento cadastrado.
- **Atualizar informações de um departamento existente**: Atualiza dados de um departamento específico.

### Categorias

- **Criar uma nova categoria dentro de um departamento**: Adiciona uma nova categoria a um departamento existente.
- **Obter uma lista de todas as categorias**: Lista todas as categorias disponíveis.
- **Obter os dados de uma categoria**: Recupera os dados de uma categoria cadastrada.
- **Atualizar informações de uma categoria existente**: Modifica dados de uma categoria.

### Produtos

- **Adicionar um novo produto ao banco de dados**: Cadastra um novo produto.
- **Obter uma lista de todos os produtos**: Lista todos os produtos disponíveis.
- **Obter produtos de uma categoria específica**: Filtra produtos por categoria.
- **Obter produtos de um departamento específico**: Filtra produtos por departamento.
- **Obter detalhes de um produto específico**: Retorna detalhes de um produto.
- **Obter os dados de um produto**: Recupera os dados de um produto cadastrado.
- **Atualizar informações de um produto existente**: Modifica dados de um produto.

### Usuários

- **Criar uma nova conta de usuário**: Registra um novo usuário no sistema.
- **Autenticar um usuário e fornecer um token de acesso**: Permite login e retorna um token de acesso.
- **Atualizar detalhes da conta do usuário**: Modifica dados da conta do usuário.
- **Obter informações da conta do usuário logado**: Recupera dados do usuário autenticado.

### Carrinho de Compras

- **Criar um novo carrinho de compras para o usuário**: Cria um carrinho na criação do usuário.
- **Adicionar um produto ao carrinho de compras do usuário**: Adiciona itens ao carrinho.
- **Remover um produto do carrinho de compras do usuário**: Remove itens do carrinho.
- **Atualizar a quantidade de um produto no carrinho de compras**: Modifica a quantidade de um produto.
- **Obter todos os itens atualmente no carrinho de compras do usuário**: Lista os itens no carrinho.
- **Remover todos os itens do carrinho de compras**: Limpa o carrinho.

### Pedidos

- **Criar um novo pedido a partir dos itens no carrinho de compras do usuário**: Gera um pedido com base no carrinho.
- **Obter uma lista de todos os pedidos realizados por um usuário específico**: Lista os pedidos de um usuário.
- **Obter detalhes de um pedido específico**: Exibe detalhes de um pedido.
- **Cancelar um pedido**: Cancela um pedido realizado.

### Funcionalidades Adicionais

- **Permitir a busca de produtos por nome ou palavras-chave**: Busca produtos de forma eficiente.
- **Filtrar produtos por preço, categoria, departamento, etc.**: Filtra produtos de acordo com critérios.
- **Obter produtos em destaque ou com desconto**: Lista produtos promocionais.
- **Atualizar automaticamente a quantidade em estoque dos produtos**: Gerencia o estoque ao criar ou cancelar pedidos.
- **Obter o histórico de compras do usuário**: Recupera o histórico de compras de um usuário.

## 🛠️ Como Executar o Projeto

### Pré-requisitos

- Node.js v16.x ou superior
- PostgreSQL

### Instalação

1. Clone o repositório:

  ```bash
  git clone https://github.com/mateus-in/natura-challenge-api.git as mateus-in-natura-challenge-api
  cd mateus-in-natura-challenge-api
  ```

2. Instale as dependências:

  ```bash
  npm i
  ```

3.	Configure o arquivo .env:

  ```bash
  cp .env.example .env
  ```

4.  Inicie os serviços da aplicação:

  ```bash
  docker-compose up -d
  ```

5.  Execute as migrações do banco de dados:

  ```bash
  npm run prisma:migrate:dev
  ```

6.  Execute as seeds:

  ```bash
  npm run seed
  ```

7.  Inicie o servidor da aplicação

  ```bash
  npm run start:dev
  ```

8.	Acesse a documentação da API em:

  ```bash
  http://localhost:3333/docs
  ```

## 🧪 Testes

Para executar os testes, utilize o comando:

  ```bash
  npm run test
  ```