const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://teste-colmeia-qa.colmeia-corp.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    chromeWebSecurity: false,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {},
  },
})
