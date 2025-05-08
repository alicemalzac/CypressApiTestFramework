const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'https://api.restful-api.dev', 
    specPattern: 'cypress/e2e/**/*.cy.js', 
    defaultCommandTimeout: 20000,
  },
  video: true, 
  reporter: 'mochawesome', 
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
  },
});