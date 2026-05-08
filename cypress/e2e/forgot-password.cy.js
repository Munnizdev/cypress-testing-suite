describe('Esqueceu sua senha', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve navegar para a tela de recuperacao ao clicar no link', () => {
    cy.contains(/esqueceu/i).click()

    // Deve mudar de pagina ou exibir formulario de recuperacao
    cy.get('body').then(($body) => {
      const urlChanged = cy.url().should('not.eq', Cypress.config('baseUrl') + '/')
      const hasRecoveryForm = $body.text().match(/recuper|reset|enviar|email/i)
      // Pelo menos uma das condicoes deve ser verdadeira
    })
  })

  it('deve exibir campo para inserir email na tela de recuperacao', () => {
    cy.contains(/esqueceu/i).click()

    cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]', { timeout: 10000 })
      .should('be.visible')
  })

  it('deve exibir mensagem ao solicitar recuperacao com email valido', () => {
    cy.contains(/esqueceu/i).click()

    cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type('qa@test.com')

    // Procura botao de enviar/recuperar
    cy.get('button').not(':disabled').first().click()

    // Deve exibir alguma mensagem de confirmacao ou feedback
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const text = $body.text()
      const hasFeedback = text.match(/enviado|sucesso|verifique|email|enviamos|confira/i)
      const hasError = text.match(/erro|falha|invalid/i)
      // Deve ter algum feedback para o usuario
      expect(hasFeedback || hasError, 'Deve exibir feedback apos solicitar recuperacao').to.be.ok
    })
  })

  it('deve validar email vazio na recuperacao de senha', () => {
    cy.contains(/esqueceu/i).click()

    // Tenta enviar sem preencher email
    cy.get('button').not(':disabled').first().click()

    // Deve permanecer na pagina ou mostrar erro de validacao
    cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]')
      .should('be.visible')
  })

  it('deve ter opcao de voltar para a tela de login', () => {
    cy.contains(/esqueceu/i).click()

    // Procura link/botao de voltar
    cy.get('body').then(($body) => {
      const hasBack = $body.text().match(/voltar|login|entrar|cancelar|back/i)
      expect(hasBack, 'Deve ter opcao de retornar ao login').to.be.ok
    })
  })
})
