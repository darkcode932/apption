import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 90000,  // Next.js dev compiles routes lazily — needs extra time
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: false,
    screenshotOnRunFailure: true,
    specPattern: "cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    retries: {
      runMode: 1,   // Retry once on CI/headless
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      return config;
    },
  },
  env: {
    // Standard user (Carine Mbarga)
    USER_EMAIL: "user3@apption.com",
    USER_PASSWORD: "password123",
    // Admin
    ADMIN_EMAIL: "admin@apption.io",
    ADMIN_PASSWORD: "Password123!",
    // Super admin
    SUPERADMIN_EMAIL: "superadmin@apption.io",
    SUPERADMIN_PASSWORD: "Password123!",
    // Known petition ID for tests
    TEST_PETITION_ID: "Ng5lBvn0ecbm8KUBrx37",
  },
});
