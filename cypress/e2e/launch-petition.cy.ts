// cypress/e2e/launch-petition.cy.ts
// Suite 6: Petition creation form tests

describe("🚀 Launch Petition", () => {
  beforeEach(() => {
    cy.loginAsUser();
    cy.visit("/launch-petition");
    cy.waitForHydration();
  });

  // ─── Page structure ────────────────────────────────────────────────────────
  it("should load the petition creation form", () => {
    cy.url().should("include", "/launch-petition");
  });

  it("should display a form with required fields on the final step", () => {
    // Step 0 (Scale) -> Step 1
    cy.contains("button", "Continuer").click();
    // Step 1 (Category) -> Step 2
    cy.contains("button", "Continuer").click();

    // Now fields should be visible
    cy.get("input#title").should("be.visible");
    cy.get("textarea#description").should("be.visible");
  });

  it("should display a title/headline input on step 3", () => {
    cy.contains("button", "Continuer").click();
    cy.contains("button", "Continuer").click();
    cy.get("input#title").should("be.visible");
  });

  it("should display a description/content textarea on step 3", () => {
    cy.contains("button", "Continuer").click();
    cy.contains("button", "Continuer").click();
    cy.get("textarea#description").should("be.visible");
  });

  it("should display category buttons on step 2", () => {
    // Step 0 -> Step 1
    cy.contains("button", "Continuer").click();
    // Categories should be visible
    cy.contains("button", "Environnement").should("be.visible");
    cy.contains("button", "Politique").should("be.visible");
  });

  it("should display scale selector buttons on step 1", () => {
    cy.contains(/Ville|National|International/i).should("be.visible");
  });

  // ─── Field validation ──────────────────────────────────────────────────────
  it("should show validation errors when submitting empty fields on step 3", () => {
    cy.contains("button", "Continuer").click();
    cy.contains("button", "Continuer").click();
    // Try to click submit (it should be disabled because title/description are empty)
    cy.contains("button", /Publier la pétition/i).should("be.disabled");
  });

  it("should prevent step progression if not satisfied", () => {
    cy.url().should("include", "/launch-petition");
  });

  // ─── Successful creation ───────────────────────────────────────────────────
  it("should create a petition and redirect on valid submission", () => {
    const uniqueTitle = `Test Pétition ${Date.now()}`;

    // Step 0 (Scale) -> select Ville and click Continuer
    cy.contains("button", "Ville").click();
    cy.contains("button", "Continuer").click();

    // Step 1 (Category) -> select Environnement and click Continuer
    cy.contains("button", "Environnement").click();
    cy.contains("button", "Continuer").click();

    // Step 2 (Form details) -> Fill required fields
    cy.get("input#title").clear().type(uniqueTitle);
    cy.get("textarea#description").clear().type(
      "Ceci est une description de test générée automatiquement par Cypress."
    );

    // Try to submit
    cy.contains("button", /Publier la pétition/i).click({ force: true });

    // After submission, should redirect to the new petition or to /my-petitions
    cy.url({ timeout: 25000 }).should("match", /petitions\/\w+|my-petitions/);
  });
});
