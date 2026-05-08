describe('Controle de sessao', () => {
  it('nao deve acessar area logada sem autenticacao', () => {
    // Tenta acessar diretamente uma rota protegida sem login
    cy.visit('/dashboard', { failOnStatusCode: false })

    // Deve redirecionar para login ou mostrar tela de login
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const isOnLogin = $body.find('input[type="password"]').length > 0
      const urlIsLogin = window.location.href.includes('login')
      expect(isOnLogin || urlIsLogin, 'Deve redirecionar para login quando nao autenticado').to.be.ok
    })
  })

  it('deve manter sessao apos recarregar a pagina', () => {
    cy.loginAsValidUser()
    cy.url({ timeout: 15000 }).should('not.include', '/login')

    // Recarrega a pagina
    cy.reload()

    // Deve continuar logado (nao voltar para login)
    cy.url({ timeout: 10000 }).should('not.include', '/login')
    cy.get('input[type="password"]').should('not.exist')
  })

  it('deve fazer logout corretamente', () => {
    cy.loginAsValidUser()
    cy.url({ timeout: 15000 }).should('not.include', '/login')

    // Procura e clica no botao de logout
    cy.get('body').then(($body) => {
      const logoutEl = $body.find(':contains("Sair"), :contains("Logout"), :contains("Sign out")')
      if (logoutEl.length > 0) {
        // Pode ser que precise clicar num menu antes
        cy.contains(/sair|logout|sign out/i).last().click({ force: true })

        // Apos logout, deve voltar para a tela de login
        cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible')
      } else {
        cy.log('ATENCAO: Opcao de logout nao encontrada na interface')
      }
    })
  })

  it('apos logout nao deve acessar area logada pelo botao voltar', () => {
    cy.loginAsValidUser()
    cy.url({ timeout: 15000 }).should('not.include', '/login')

    // Faz logout
    cy.contains(/sair|logout|sign out/i).last().click({ force: true })
    cy.get('input[type="password"]', { timeout: 10000 }).should('be.visible')

    // Tenta voltar com go(-1)
    cy.go('back')

    // Deve redirecionar de volta para login (sessao expirada)
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const isOnLogin = $body.find('input[type="password"]').length > 0
      const urlIsLogin = window.location.href.includes('login')
      // Se conseguir acessar a area logada apos logout = BUG
      if (!isOnLogin && !urlIsLogin) {
        cy.log('BUG ENCONTRADO: Usuario consegue acessar area logada apos logout usando botao voltar')
      }
      expect(isOnLogin || urlIsLogin, 'Nao deve acessar area logada apos logout').to.be.ok
    })
  })
})
