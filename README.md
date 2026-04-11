# Agentic Team

[![Build Status](https://github.com/edgarberlinck/agentic-team/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/edgarberlinck/agentic-team/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/edgarberlinck/agentic-team/branch/main/graph/badge.svg)](https://codecov.io/gh/edgarberlinck/agentic-team)
![No Vibe Code](https://img.shields.io/badge/no--vibe--code-true-black)

Projeto para explorar o CopilotSDK e construir um time de agentes especializados para resolver problemas técnicos reais.

## Manifesto

Este projeto está sendo construído no modo vintage:

- sem vibe-coding
- sem piloto automático
- sem abstrair o entendimento do código

A ideia aqui é simples: restaurar a alegria de escrever código com intenção, contexto e critério técnico.

## Sobre contribuições

Quer contribuir? Será muito bem-vindo.

A única regra inegociável:

- não trazer vibe-coding para este repositório

Contribuição boa aqui:

- problema bem definido
- decisão técnica explícita
- mudança pequena, verificável e testável
- clareza de trade-offs

## Objetivo do projeto

Construir, iterar e validar uma arquitetura de agentes especializados, com foco em:

- decompor problemas técnicos complexos
- delegar tarefas por especialidade
- consolidar respostas com rastreabilidade
- manter controle humano das decisões

## Stack e filosofia de runtime

Queremos usar Bun o máximo possível, evitando instalar ferramentas extras sem necessidade.

Princípios práticos:

- runtime: Bun
- servidor HTTP: Bun.serve
- testes: bun test
- gerenciamento de scripts: bun run
- hot reload no desenvolvimento: bun --hot

Dependências externas só entram quando houver ganho técnico claro.

## Arquitetura atual

Hoje o núcleo implementado está no backend em [api/server.ts](api/server.ts), com separação de responsabilidades por camadas.

### Visão de pastas

- [api/lib/use-cases](api/lib/use-cases): regras de negócio (casos de uso)
- [api/lib/use-cases/ports](api/lib/use-cases/ports): contratos/ports para infraestrutura
- [api/lib/database](api/lib/database): implementações concretas de repositórios
- [api/lib/http](api/lib/http): composição HTTP e geração de rotas
- [api/lib/validator](api/lib/validator): validação de entrada
- [api/lib/shared/types](api/lib/shared/types): tipos de dominio compartilhados

### HTTP com decorators

As rotas são declaradas com decorators em controllers e convertidas para o formato esperado pelo Bun:

- [api/lib/http/decorators.ts](api/lib/http/decorators.ts)
- [api/lib/http/routes/auth.routes.ts](api/lib/http/routes/auth.routes.ts)
- [api/lib/http/routes/agent.routes.ts](api/lib/http/routes/agent.routes.ts)

Convenção de paths:

- `@Server({ path: "/api" })` define prefixo base
- `@Route({ public: true })` gera rota em `/api/public/...`
- `@Route({ public: false })` gera rota em `/api/v1/...`

### Banco e repositórios

O projeto usa Postgres com Prisma, e o ponto de entrada dos módulos de dados está em [api/lib/database/index.ts](api/lib/database/index.ts).

Hoje existem módulos para:

- usuários
- agentes

## Decisões técnicas

1. Bun-first
   Usar o ecossistema nativo do Bun sempre que possível para reduzir atrito de setup e manter velocidade no ciclo de desenvolvimento.

2. Separação por caso de uso
   A regra de negócio não depende diretamente da camada HTTP nem de detalhes do ORM.

3. Ports and adapters (estilo pragmatico)
   As interfaces em [api/lib/use-cases/ports](api/lib/use-cases/ports) permitem trocar implementações sem reescrever regra de negócio.

4. Rotas declarativas via metadata
   Decorators tornam as rotas mais legíveis e facilitam evolução para múltiplos módulos sem inflar o [api/server.ts](api/server.ts).

5. Validação explícita
   Entradas são validadas antes de chegar no núcleo de negócio, reduzindo acoplamento e erro silencioso.

## Como rodar (Bun + mínimo de extras)

### 1. Subir banco local

Na raiz do projeto:

```bash
docker compose up -d
```

Arquivo de referência: [docker-compose.yaml](docker-compose.yaml)

### 2. Instalar dependências da API

```bash
cd api
bun install
```

### 3. Rodar servidor em desenvolvimento

```bash
bun run dev
```

Script definido em [api/package.json](api/package.json).

## Estado atual

Este repositório está em construção ativa. A direção é intencional:

- fortalecer o backend e os contratos de agentes
- evoluir o uso do CopilotSDK sem abrir mão de controle técnico
- manter o projeto artesanal, legível e divertido de desenvolver

---

Se você também sente falta da alegria de abrir o editor e realmente escrever código, este projeto é para você.
