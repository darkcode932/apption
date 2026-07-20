// cypress/e2e/home.cy.ts
// Suite 2: Home page tests

describe("🏠 Home Page", () => {
  beforeEach(() => {
    cy.loginAsUser();
    cy.visit("/home");
    cy.waitForHydration();
  });

  // ─── Navbar ────────────────────────────────────────────────────────────────
  it("should display the full navbar with brand and nav links", () => {
    cy.get("nav").should("be.visible");
    cy.get("nav").contains("APPTION").should("be.visible");
    cy.get("nav").contains("Dashboard").should("be.visible");
    cy.get("nav").contains("Lancer une pétition").should("be.visible");
    cy.get("nav").contains(/Parcourir|pétitions/i).should("be.visible");
    cy.get("nav").contains("Mes pétitions").should("be.visible");
  });

  it("should show the notification bell in the navbar", () => {
    cy.get("nav").find("button").filter(":has(svg)").should("have.length.gte", 1);
  });

  it("should show the user avatar in the navbar", () => {
    cy.get("nav").find("img[alt='Profile avatar']").should("be.visible");
  });

  // ─── Search bar ────────────────────────────────────────────────────────────
  it("should show the search input in the navbar", () => {
    cy.get("nav").find("input[placeholder*='Rechercher']").should("be.visible");
  });

  // ─── Hero banner ───────────────────────────────────────────────────────────
  it("should display the hero banner", () => {
    cy.get("h1").should("be.visible");
    cy.contains(/plateforme mondiale|changement|histoire/i).should("be.visible");
  });

  it("should display the CTA button 'Lancer une pétition'", () => {
    cy.contains("Lancer une pétition").should("be.visible");
  });

  // ─── Geolocation filter ────────────────────────────────────────────────────
  it("should display the geolocation filter buttons", () => {
    cy.contains(/Autour de moi/i).should("be.visible");
    cy.contains(/Toutes les causes|Mondial/i).should("be.visible");
  });

  it("should switch between 'Autour de moi' and 'Mondial' filters", () => {
    cy.contains("button", /Toutes les causes|Mondial/i).click();
    cy.contains("button", /Toutes les causes|Mondial/i).should(
      "have.class",
      "bg-green-500"
    );
    cy.contains("button", /Autour de moi/i).click();
    cy.contains("button", /Autour de moi/i).should("have.class", "bg-green-500");
  });

  // ─── Petitions section ─────────────────────────────────────────────────────
  it("should display the 'À la une' section", () => {
    cy.contains(/À la une/i).should("be.visible");
  });

  it("should display the 'Pétitions populaires' section", () => {
    cy.contains(/Pétitions populaires/i).should("be.visible");
  });

  it("should show petition cards with images", () => {
    // Wait for petitions to load (not skeletons)
    cy.get("img, [data-testid='petition-card']", { timeout: 10000 }).should(
      "be.visible"
    );
  });

  // ─── Navigation ────────────────────────────────────────────────────────────
  it("should navigate to Dashboard from navbar", () => {
    cy.get("nav").contains("Dashboard").click();
    cy.url().should("include", "/dashboard");
  });

  it("should navigate to Launch Petition from navbar", () => {
    cy.get("nav").contains("Lancer une pétition").click();
    cy.url().should("include", "/launch-petition");
  });

  it("should navigate to Petitions list from navbar", () => {
    cy.get("nav").contains(/Parcourir|pétitions/i).first().click();
    cy.url().should("include", "/petitions");
  });

  it("should navigate to My Petitions from navbar", () => {
    cy.get("nav").contains("Mes pétitions").click();
    cy.url().should("include", "/my-petitions");
  });
});
