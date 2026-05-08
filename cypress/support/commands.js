/**
 * Comando reutilizavel para fazer login na aplicacao
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/')
  cy.get('input[type="email"], input[name="email"], input[placeholder*="mail"]', { timeout: 15000 })
    .should('be.visible')
    .clear()
    .type(email)
  cy.get('input[type="password"], input[name="password"], input[placeholder*="enha"]')
    .should('be.visible')
    .clear()
    .type(password)
  cy.contains('button', /entrar/i).click()
})

/**
 * Comando para fazer login com usuario valido (atalho)
 */
Cypress.Commands.add('loginAsValidUser', () => {
  cy.fixture('users').then((users) => {
    cy.login(users.validUser.email, users.validUser.password)
  })
})
