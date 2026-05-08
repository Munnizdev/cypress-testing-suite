# Automação de Testes E2E

![Cypress](https://img.shields.io/badge/-cypress-%23E9E9E9?style=for-the-badge&logo=cypress&logoColor=17202C)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

Este repositório contém a suíte de testes automatizados End-to-End (E2E) desenvolvida com **Cypress** para a aplicação Colmeia. O projeto visa garantir a qualidade das funcionalidades críticas, validar a segurança de inputs e assegurar a estabilidade da experiência do utilizador.

---

## 🧪 Cobertura de Testes (26 Cenários)

A suíte abrange **26 cenários** detalhados, divididos por funcionalidades:

### 1. Autenticação e Login (14 cenários)
* **Happy Path:** Login com credenciais válidas.
* **Tratamento de Erros:** Campos vazios, emails inválidos e senhas incorretas.
* **Segurança:** Testes contra **SQL Injection** e **XSS** nos campos de input.
* **Interface:** Validação de visibilidade do logo, botões e máscara de password.

### 2. Recuperação de Senha (5 cenários)
* Validação de navegação para a tela de recuperação.
* Verificação de feedback de envio e obrigatoriedade do campo de email.

### 3. Área Logada e Interface (7 cenários)
* Renderização correta do conteúdo e menus de navegação.
* **Responsividade:** Validação do layout em 3 resoluções:
    * 📱 **Mobile:** 375x667
    * 📟 **Tablet:** 768x1024
    * 💻 **Desktop:** 1280x720

### 4. Controle de Sessão (4 cenários)
* **Proteção de Rotas:** Bloqueio de acesso ao Dashboard sem autenticação.
* **Persistência:** Manutenção da sessão após o recarregamento da página (F5).
* **Logout:** Encerramento seguro da sessão.

---

## 💎 Boas Práticas Aplicadas

* **DRY (Don't Repeat Yourself):** Utilização de `Custom Commands` para ações repetitivas (como login).
* **Dados Externalizados:** Uso de `fixtures` para evitar credenciais "hardcoded" no código.
* **Independência:** Cada teste é isolado e funciona de forma independente (`beforeEach`).
* **Resiliência:** Seletores baseados em atributos funcionais para evitar quebras por mudanças visuais simples.
* **Evidências:** Geração automática de screenshots em caso de falhas e vídeos de todas as execuções.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
* **Node.js** instalado (v18 ou superior).
* **npm** ou **yarn**.

---

# Abrir a interface visual (Modo Interativo)
npm run cy:open

# Executar no terminal (Modo Headless)
npm run cy:run

# Executar grupos específicos
npm run cy:run:login
npm run cy:run:session
npm run cy:run:post-login
npm run cy:run:forgot
### Instalação
```bash
# Aceder à pasta do projeto
cd teste-cypres

# Instalar as dependências
npm install
```
# 📄 Conclusão Técnica
Este projeto foi desenvolvido não apenas para validar fluxos, mas para atuar como uma ferramenta de auditoria, sendo capaz de identificar vulnerabilidades de segurança (SQLi/XSS) e falhas críticas de experiência do utilizador (UX) antes de qualquer promoção para ambiente de produção.
