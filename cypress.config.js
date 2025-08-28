// cypress.config.js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://reqres.in/api",
    supportFile: false,
  },
  reporter: "spec",
  video: false,
  screenshotOnRunFailure: true,
});
