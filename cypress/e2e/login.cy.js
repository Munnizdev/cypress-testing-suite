describe('Tela de Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Elementos visuais', () => {
    it('deve exibir o logo da Colmeia', () => {
      cy.get('img[alt*="logo" i], img[src*="logo"]')
        .should('be.visible')
    })

    it('deve exibir os campos de email e senha', () => {
      cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]')
        .should('be.visible')
      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .should('be.visible')
    })

    it('deve exibir o botao Entrar', () => {
      cy.contains('button', /entrar/i).should('be.visible')
    })

    it('deve exibir o link "Esqueceu sua senha?"', () => {
      cy.contains(/esqueceu/i).should('be.visible')
    })
  })

  describe('Login com credenciais validas', () => {
    it('deve fazer login com sucesso e redirecionar para area logada', () => {
      cy.fixture('users').then((users) => {
        cy.login(users.validUser.email, users.validUser.password)
      })

      // Apos login, nao deve mais estar na pagina de login
      cy.url({ timeout: 15000 }).should('not.eq', Cypress.config('baseUrl') + '/')
      // Verifica que nao ha mensagem de erro visivel
      cy.contains(/erro|invalid|incorret/i).should('not.exist')
    })
  })

  describe('Login com credenciais invalidas', () => {
    it('deve exibir erro ao usar email invalido', () => {
      cy.login('emailinvalido@teste.com', '123456')

      // Deve permanecer na pagina de login ou exibir mensagem de erro
      cy.get('body').then(($body) => {
        const hasError = $body.text().match(/erro|invalid|incorret|falha|tente novamente/i)
        const stillOnLogin = $body.find('input[type="password"]').length > 0
        expect(hasError || stillOnLogin, 'Deve mostrar erro ou permanecer no login').to.be.ok
      })
    })

    it('deve exibir erro ao usar senha incorreta', () => {
      cy.login('qa@test.com', 'senhaerrada')

      cy.get('body').then(($body) => {
        const hasError = $body.text().match(/erro|invalid|incorret|falha|tente novamente/i)
        const stillOnLogin = $body.find('input[type="password"]').length > 0
        expect(hasError || stillOnLogin, 'Deve mostrar erro ou permanecer no login').to.be.ok
      })
    })

    it('deve exibir erro ao usar email e senha vazios', () => {
      cy.contains('button', /entrar/i).click()

      // Deve mostrar validacao ou permanecer na pagina
      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .should('be.visible')
    })

    it('deve exibir erro ao usar apenas o email sem senha', () => {
      cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]')
        .type('qa@test.com')
      cy.contains('button', /entrar/i).click()

      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .should('be.visible')
    })

    it('deve exibir erro ao usar apenas a senha sem email', () => {
      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .type('123456')
      cy.contains('button', /entrar/i).click()

      cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]')
        .should('be.visible')
    })
  })

  describe('Validacoes de campo', () => {
    it('deve rejeitar email em formato invalido', () => {
      cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]')
        .type('email-sem-arroba')
      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .type('123456')
      cy.contains('button', /entrar/i).click()

      // O campo type="email" do HTML5 deve bloquear ou o app deve mostrar erro
      cy.get('body').then(($body) => {
        const stillOnLogin = $body.find('input[type="password"]').length > 0
        expect(stillOnLogin, 'Deve permanecer na pagina de login com email invalido').to.be.true
      })
    })

    it('campo de senha deve mascarar os caracteres digitados', () => {
      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .should('have.attr', 'type', 'password')
    })
  })

  describe('Seguranca basica', () => {
    it('nao deve permitir SQL injection no campo de email', () => {
      cy.login("' OR 1=1 --", '123456')

      // Nao deve conseguir logar
      cy.get('body').then(($body) => {
        const hasError = $body.text().match(/erro|invalid|incorret|falha/i)
        const stillOnLogin = $body.find('input[type="password"]').length > 0
        expect(hasError || stillOnLogin, 'SQL injection nao deve permitir acesso').to.be.ok
      })
    })

    it('nao deve executar script XSS no campo de email', () => {
      cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]')
        .type('<script>alert("xss")</script>')
      cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
        .type('123456')
      cy.contains('button', /entrar/i).click()

      // Nao deve haver alerta JS
      cy.on('window:alert', () => {
        throw new Error('XSS detectado! Alerta JS foi executado.')
      })
    })
  })
})
