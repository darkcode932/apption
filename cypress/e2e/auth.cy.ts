// cypress/e2e/auth.cy.ts
// Suite 1: Authentication tests

describe("🔐 Authentication", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  // ─── Page structure ────────────────────────────────────────────────────────
  it("should display the login form with all required fields", () => {
    cy.get("h1, h2").should("contain.text", "Connexion");
    cy.get("#email").should("be.visible");
    cy.get("#password").should("be.visible");
    cy.get("button").contains("Se connecter").should("be.visible");
  });

  it("should display social login buttons (Google, Facebook)", () => {
    cy.contains("Continuer avec Google").should("be.visible");
    cy.contains("Continuer avec Facebook").should("be.visible");
  });

  it("should have a link to the registration page", () => {
    cy.contains("Créer un compte").should("be.visible").click();
    cy.url().should("include", "/register");
  });

  it("should have a link to the forgot-password page", () => {
    cy.contains("Mot de passe oublié").should("be.visible").click();
    cy.url().should("include", "/forgot-password");
  });

  // ─── Password visibility toggle ────────────────────────────────────────────
  it("should toggle password visibility", () => {
    cy.get("#password").should("have.attr", "type", "password");
    // click the eye icon SVG
    cy.get("#password").parent().find("svg").click();
    cy.get("#password").should("have.attr", "type", "text");
    cy.get("#password").parent().find("svg").click();
    cy.get("#password").should("have.attr", "type", "password");
  });

  // ─── Validation ────────────────────────────────────────────────────────────
  it("should show error with invalid credentials", () => {
    cy.get("#email").type("wrong@test.com");
    cy.get("#password").type("wrongpassword");
    cy.get("button").contains("Se connecter").click();
    // Firebase returns error, app should display a message
    cy.contains(
      "p",
      /identifiant|mot de passe|invalide|incorrect|erreur|invalid|error/i,
      { timeout: 10000 }
    ).should("be.visible");
  });

  it("should show validation error for empty email", () => {
    cy.get("#password").type("somepassword");
    cy.get("button").contains("Se connecter").click();
    cy.get("#email:invalid, [data-error='email']").should("exist");
  });

  it("should show validation error for empty password", () => {
    cy.get("#email").type("test@test.com");
    cy.get("button").contains("Se connecter").click();
    cy.get("#password:invalid, [data-error='password']").should("exist");
  });

  // ─── Successful login ───────────────────────────────────────────────────────
  it("should login successfully and redirect to /home", () => {
    cy.get("#email").type(Cypress.env("USER_EMAIL"));
    cy.get("#password").type(Cypress.env("USER_PASSWORD"));
    cy.get("button").contains("Se connecter").click();
    cy.url({ timeout: 15000 }).should("include", "/home");
    cy.get("nav").should("be.visible");
  });

  // ─── Route protection ──────────────────────────────────────────────────────
  it("should redirect unauthenticated user from /home to /login", () => {
    cy.visit("/home");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  it("should redirect unauthenticated user from /petitions to /login", () => {
    cy.visit("/petitions");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  it("should redirect unauthenticated user from /launch-petition to /login", () => {
    cy.visit("/launch-petition");
    cy.url({ timeout: 10000 }).should("include", "/login");
  });

  // ─── Logout ────────────────────────────────────────────────────────────────
  it("should logout and redirect to /login", () => {
    cy.loginAsUser();
    cy.logout();
    cy.url().should("include", "/login");
  });
});
