// cypress/support/commands.ts
// Custom reusable commands

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login via UI with email/password
       */
      login(email: string, password: string): Chainable<void>;
      /**
       * Login as a known role using env variables
       */
      loginAsUser(): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      loginAsSuperAdmin(): Chainable<void>;
      /**
       * Logout via navbar
       */
      logout(): Chainable<void>;
      /**
       * Wait for Next.js hydration
       */
      waitForHydration(): Chainable<void>;
    }
  }
}

/** Fill login form and submit */
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.get("#email").clear().type(email);
  cy.get("#password").clear().type(password);
  cy.get("button").contains("Se connecter").click();
  cy.url({ timeout: 15000 }).should("include", "/home");
});

/** Login as the standard user */
Cypress.Commands.add("loginAsUser", () => {
  cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
});

/** Login as admin */
Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit("/admin/login");
  cy.get("#email").clear().type(Cypress.env("ADMIN_EMAIL"));
  cy.get("#password").clear().type(Cypress.env("ADMIN_PASSWORD"));
  cy.get("button").contains(/Accéder|Dashboard/i).click();
  cy.url({ timeout: 20000 }).should("include", "/admin/dashboard");
});

/** Login as super admin */
Cypress.Commands.add("loginAsSuperAdmin", () => {
  cy.visit("/admin/login");
  cy.get("#email").clear().type(Cypress.env("SUPERADMIN_EMAIL"));
  cy.get("#password").clear().type(Cypress.env("SUPERADMIN_PASSWORD"));
  cy.get("button").contains(/Accéder|Dashboard/i).click();
  cy.url({ timeout: 20000 }).should("include", "/admin/dashboard");
});

/** Click logout in navbar dropdown */
Cypress.Commands.add("logout", () => {
  // Click avatar/profile menu button to open dropdown
  cy.contains("span", "Menu Utilisateur").parent().click({ force: true });
  cy.contains("button", "Déconnexion").click({ force: true });
  cy.url({ timeout: 10000 }).should("include", "/login");
});

/** Wait for React hydration before interacting */
Cypress.Commands.add("waitForHydration", () => {
  cy.get("body").should("not.have.class", "loading");
  // Small buffer for React to mount
  cy.wait(500);
});

export {};
