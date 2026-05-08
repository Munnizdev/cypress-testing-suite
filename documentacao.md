# Automação de Testes — Colmeia QA

## 1. Introdução

Este documento descreve a suíte de testes automatizados desenvolvida com **Cypress** para a aplicação **Colmeia**, acessível em `https://teste-colmeia-qa.colmeia-corp.com/`.

O objetivo é validar funcionalidades da aplicação, identificar comportamentos inesperados e evidenciar possíveis falhas, seguindo boas práticas de automação de testes.

---

## 2. Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | 18+ | Ambiente de execução |
| Cypress | 15.x | Framework de testes E2E |

---

## 3. Estrutura do Projeto

```
teste-cypres/
├── cypress.config.js              → Configurações do Cypress
├── package.json                   → Dependências e scripts
├── cypress/
│   ├── fixtures/
│   │   └── users.json             → Dados de teste centralizados
│   ├── support/
│   │   ├── commands.js            → Comandos customizados reutilizáveis
│   │   └── e2e.js                 → Carregamento dos comandos
│   └── e2e/
│       ├── login.cy.js            → Testes da tela de login
│       ├── forgot-password.cy.js  → Testes de recuperação de senha
│       ├── post-login.cy.js       → Testes da área logada
│       └── session.cy.js          → Testes de controle de sessão
```

### Boas práticas aplicadas na estrutura

- **Fixtures**: Dados de teste (credenciais) separados do código em `users.json`, facilitando manutenção e evitando hardcode.
- **Custom Commands**: O comando `cy.login()` foi criado em `commands.js` para evitar duplicação. Todos os testes reutilizam esse comando.
- **Organização por funcionalidade**: Cada arquivo de teste cobre uma área específica da aplicação, facilitando a identificação de falhas.
- **Describe/It agrupados**: Os cenários são organizados com `describe` (grupo) e `it` (cenário individual), criando uma hierarquia legível.

---

## 4. Cenários de Teste

### 4.1 Tela de Login (`login.cy.js`) — 10 cenários

| # | Cenário | O que valida | Resultado esperado |
|---|---|---|---|
| 1 | Exibição do logo | Elemento visual de branding | Logo da Colmeia visível na tela |
| 2 | Exibição dos campos | Campos do formulário | Campos de email e senha visíveis |
| 3 | Exibição do botão Entrar | Botão de submissão | Botão "Entrar" visível e clicável |
| 4 | Link "Esqueceu sua senha?" | Link de recuperação | Link visível na tela de login |
| 5 | Login com credenciais válidas | Fluxo principal (happy path) | Redireciona para área logada |
| 6 | Login com email inválido | Tratamento de erro | Exibe mensagem de erro ou permanece no login |
| 7 | Login com senha incorreta | Tratamento de erro | Exibe mensagem de erro ou permanece no login |
| 8 | Login com campos vazios | Validação de campos obrigatórios | Não permite submissão |
| 9 | Login apenas com email | Validação de campo obrigatório | Permanece no login |
| 10 | Login apenas com senha | Validação de campo obrigatório | Permanece no login |

**Validações adicionais de segurança:**

| # | Cenário | O que valida | Resultado esperado |
|---|---|---|---|
| 11 | Email em formato inválido | Validação de formato | Rejeita "email-sem-arroba" |
| 12 | Máscara de senha | Campo type="password" | Caracteres são mascarados |
| 13 | SQL Injection | Segurança contra injeção SQL | Input `' OR 1=1 --` não concede acesso |
| 14 | XSS no campo de email | Segurança contra Cross-Site Scripting | Script não é executado |

### 4.2 Recuperação de Senha (`forgot-password.cy.js`) — 5 cenários

| # | Cenário | O que valida | Resultado esperado |
|---|---|---|---|
| 1 | Navegação para recuperação | Clique no link "Esqueceu sua senha?" | Abre tela/formulário de recuperação |
| 2 | Campo de email na recuperação | Presença do campo | Campo de email visível |
| 3 | Envio com email válido | Fluxo de recuperação | Exibe mensagem de feedback |
| 4 | Envio com email vazio | Validação de campo | Não permite envio sem email |
| 5 | Opção de voltar ao login | Navegação | Existe botão/link para retornar |

### 4.3 Área Logada (`post-login.cy.js`) — 7 cenários

| # | Cenário | O que valida | Resultado esperado |
|---|---|---|---|
| 1 | Carregamento da página | Página não fica em branco | Conteúdo é renderizado |
| 2 | Menu de navegação | Estrutura de navegação | Menu ou barra de navegação presente |
| 3 | Links de navegação | Mapeamento da aplicação | Links internos são identificados |
| 4 | Informações do usuário | Identificação do usuário logado | Nome, email ou avatar visível |
| 5 | Opção de logout | Funcionalidade de saída | Botão "Sair" ou "Logout" existe |
| 6 | Erros de console | Qualidade da aplicação | Nenhum erro no console do navegador |
| 7 | Responsividade (3 viewports) | Layout adaptativo | Sem overflow horizontal em Mobile (375px), Tablet (768px) e Desktop (1280px) |

### 4.4 Controle de Sessão (`session.cy.js`) — 4 cenários

| # | Cenário | O que valida | Resultado esperado |
|---|---|---|---|
| 1 | Acesso sem autenticação | Proteção de rotas | Redireciona para login |
| 2 | Sessão após reload | Persistência de sessão | Continua logado após F5 |
| 3 | Logout | Encerramento de sessão | Volta para tela de login |
| 4 | Voltar após logout | Segurança pós-logout | Não acessa área logada pelo botão voltar |

---

## 5. Como Executar

### Pré-requisitos

- Node.js 18 ou superior instalado
- npm (gerenciador de pacotes do Node)

### Instalação

```bash
# Acessar a pasta do projeto
cd teste-cypres

# Instalar as dependências
npm install
```

### Execução

```bash
# Abrir a interface visual do Cypress (recomendado para primeira execução)
npm run cy:open

# Executar todos os testes no terminal (modo headless)
npm run cy:run

# Executar apenas um grupo de testes
npm run cy:run:login
npm run cy:run:session
npm run cy:run:post-login
npm run cy:run:forgot
```

### Evidências

O Cypress gera automaticamente:

- **Screenshots** em caso de falha (pasta `cypress/screenshots/`)
- **Vídeos** de cada execução (pasta `cypress/videos/`)

---

## 6. Boas Práticas Aplicadas

| Prática | Como foi aplicada |
|---|---|
| **DRY (Don't Repeat Yourself)** | Comando `cy.login()` reutilizado em todos os testes |
| **Dados externalizados** | Credenciais em `fixtures/users.json`, não hardcoded |
| **Independência de testes** | Cada `it()` funciona de forma isolada com seu próprio `beforeEach` |
| **Seletores resilientes** | Uso de múltiplos seletores (`type`, `name`, `placeholder`) para maior robustez |
| **Organização semântica** | Testes agrupados por funcionalidade com `describe` aninhado |
| **Timeouts explícitos** | Timeouts configurados para lidar com carregamento de SPA |
| **Validações de segurança** | Testes contra SQL Injection e XSS |
| **Evidências automáticas** | Vídeos e screenshots gerados pelo Cypress |

---

## 7. Possíveis Falhas Identificáveis

Os testes foram desenhados para evidenciar falhas como:

- Ausência de mensagens de erro em login inválido
- Falta de validação de campos obrigatórios
- Acesso a rotas protegidas sem autenticação
- Sessão não expirada após logout (botão voltar do navegador)
- Erros de JavaScript no console da aplicação
- Problemas de responsividade (overflow horizontal)
- Vulnerabilidades básicas de segurança (SQL Injection, XSS)

---

## 8. Conclusão

A suíte contém **26 cenários de teste** cobrindo as principais funcionalidades da aplicação: login, recuperação de senha, navegação na área logada, controle de sessão, segurança básica e responsividade.

Os testes seguem uma abordagem exploratória automatizada — além de validar o comportamento esperado, eles buscam ativamente comportamentos inesperados que possam indicar bugs ou vulnerabilidades.
