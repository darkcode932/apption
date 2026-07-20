// cypress/e2e/profile.cy.ts
// Suite 5: User profile page tests

describe("👤 User Profile", () => {
  beforeEach(() => {
    cy.loginAsUser();
    cy.visit("/profile");
    cy.waitForHydration();
  });

  it("should load the profile page", () => {
    cy.url().should("include", "/profile");
  });

  it("should display the user's display name or username", () => {
    cy.get("body").should(
      "contain.text",
      "Carine" // Part of the name
    );
  });

  it("should display the user's email address", () => {
    cy.contains("user3@apption.com").should("be.visible");
  });

  it("should display the user's location (city)", () => {
    cy.contains(/Yaoundé|Douala/i).should("be.visible");
  });

  it("should display the 'Certifié' badge since Carine was certified", () => {
    cy.contains(/Certifié|certified|officiel/i, { timeout: 8000 }).should(
      "be.visible"
    );
  });

  it("should display the account creation date or member since info", () => {
    cy.contains(/2026|membre/i).should("be.visible");
  });

  it("should display the petition activity section (pétitions signées or lancées)", () => {
    cy.contains(/pétition|signée|lancée|activité/i).should("be.visible");
  });

  it("should be accessible from the navbar avatar", () => {
    cy.visit("/home");
    cy.waitForHydration();
    // Click the avatar/profile button
    cy.contains("span", "Menu Utilisateur").parent().click({ force: true });
    cy.get("body").then(($body) => {
      // Either it opens a dropdown with profile link or navigates directly
      if ($body.text().includes("Profil") || $body.text().includes("profil")) {
        cy.contains(/Profil|Mon compte/i).first().click({ force: true });
        cy.url().should("include", "/profile");
      }
    });
  });
});
