describe('Area logada - Exploracao e validacoes', () => {
  beforeEach(() => {
    cy.loginAsValidUser()
    // Aguarda sair da tela de login
    cy.url({ timeout: 15000 }).should('not.include', '/login')
  })

  describe('Navegacao principal', () => {
    it('deve carregar a pagina principal apos login', () => {
      // Verifica que a pagina carregou (sem tela em branco)
      cy.get('body').should('not.be.empty')
      cy.get('body').invoke('text').should('have.length.greaterThan', 10)
    })

    it('deve exibir algum menu ou barra de navegacao', () => {
      cy.get('nav, [role="navigation"], header, .sidebar, .menu, .navbar', { timeout: 10000 })
        .should('exist')
    })

    it('deve identificar e listar todos os links de navegacao', () => {
      // Captura todos os links visiveis para mapeamento
      cy.get('a:visible, button:visible').then(($elements) => {
        const items = []
        $elements.each((i, el) => {
          const text = el.innerText?.trim()
          const href = el.getAttribute('href')
          if (text) items.push({ text, href })
        })
        cy.log(`Encontrados ${items.length} elementos de navegacao`)
        items.forEach((item) => {
          cy.log(`- ${item.text} ${item.href ? '(' + item.href + ')' : ''}`)
        })
        expect(items.length).to.be.greaterThan(0)
      })
    })
  })

  describe('Funcionalidades da area logada', () => {
    it('deve exibir informacoes do usuario logado', () => {
      // Procura indicadores de usuario logado (nome, email, avatar, etc)
      cy.get('body').then(($body) => {
        const text = $body.text()
        const hasUserInfo = text.match(/qa@test\.com|qa|perfil|profile|usuario|user/i)
        const hasAvatar = $body.find('img[alt*="avatar" i], img[alt*="user" i], .avatar, .user-icon').length > 0
        const hasInitials = $body.find('.initials, .user-initials').length > 0
        expect(
          hasUserInfo || hasAvatar || hasInitials,
          'Deve exibir alguma identificacao do usuario logado'
        ).to.be.ok
      })
    })

    it('deve ter opcao de logout/sair', () => {
      cy.get('body').then(($body) => {
        const hasLogout = $body.text().match(/sair|logout|desconectar|sign out/i)
        expect(hasLogout, 'Deve existir opcao de logout').to.be.ok
      })
    })

    it('nao deve exibir erros de console na pagina principal', () => {
      const consoleErrors = []

      cy.on('window:before:load', (win) => {
        const originalError = win.console.error
        win.console.error = (...args) => {
          consoleErrors.push(args.join(' '))
          originalError.apply(win.console, args)
        }
      })

      cy.visit('/')
      cy.loginAsValidUser()
      cy.url({ timeout: 15000 }).should('not.include', '/login')

      // Espera um tempo para erros assincronos
      cy.wait(3000).then(() => {
        if (consoleErrors.length > 0) {
          cy.log('ERROS DE CONSOLE ENCONTRADOS:')
          consoleErrors.forEach((err) => cy.log(err))
        }
        // Reporta mas nao falha - serve como evidencia
        expect(consoleErrors.length, `Encontrados ${consoleErrors.length} erros no console`).to.eq(0)
      })
    })
  })

  describe('Navegacao entre paginas', () => {
    it('deve navegar por todos os links do menu sem erros', () => {
      // Coleta links de navegacao
      cy.get('nav a[href], [role="navigation"] a[href], .sidebar a[href], .menu a[href]', { timeout: 10000 })
        .then(($links) => {
          const hrefs = []
          $links.each((i, el) => {
            const href = el.getAttribute('href')
            if (href && !href.startsWith('http') && !href.startsWith('mailto')) {
              hrefs.push(href)
            }
          })

          // Remove duplicatas
          const uniqueHrefs = [...new Set(hrefs)]
          cy.log(`Encontrados ${uniqueHrefs.length} links internos para testar`)

          // Visita cada link e verifica se carrega sem erro
          uniqueHrefs.forEach((href) => {
            cy.visit(href)
            cy.get('body').should('not.be.empty')
            // Verifica que nao caiu numa pagina de erro
            cy.get('body').invoke('text').should('not.match', /404|500|not found|server error/i)
            cy.log(`OK: ${href}`)
          })
        })
    })
  })

  describe('Responsividade', () => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
    ]

    viewports.forEach((vp) => {
      it(`deve exibir corretamente em ${vp.name} (${vp.width}x${vp.height})`, () => {
        cy.viewport(vp.width, vp.height)
        cy.get('body').should('be.visible')
        // Verifica que nao ha overflow horizontal (conteudo cortado)
        cy.document().then((doc) => {
          const bodyWidth = doc.body.scrollWidth
          expect(bodyWidth).to.be.at.most(vp.width + 20) // margem de 20px
        })
      })
    })
  })
})
