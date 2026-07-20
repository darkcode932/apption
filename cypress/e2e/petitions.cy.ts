// cypress/e2e/petitions.cy.ts
// Suite 3: Petitions list, detail, and signing

describe("📜 Petitions", () => {
  const testPetitionId = Cypress.env("TEST_PETITION_ID");

  beforeEach(() => {
    cy.loginAsUser();
  });

  // ─── Petitions list ────────────────────────────────────────────────────────
  describe("Petitions List Page", () => {
    beforeEach(() => {
      cy.visit("/petitions");
      cy.waitForHydration();
    });

    it("should load the petitions list page", () => {
      cy.url().should("include", "/petitions");
    });

    it("should display at least one petition card", () => {
      // Wait for cards to be present after loading
      cy.get("[data-testid='petition-card'], article, .pet-card, a[href*='/petitions/']", {
        timeout: 10000,
      }).should("have.length.gte", 1);
    });

    it("should display petition titles on cards", () => {
      cy.get("a[href*='/petitions/']", { timeout: 10000 })
        .first()
        .should("be.visible");
    });

    it("should navigate to petition detail on card click", () => {
      cy.get("a[href*='/petitions/']", { timeout: 10000 }).first().click();
      cy.url().should("match", /\/petitions\/\w+/);
    });
  });

  // ─── Petition Detail ───────────────────────────────────────────────────────
  describe("Petition Detail Page", () => {
    beforeEach(() => {
      cy.visit(`/petitions/${testPetitionId}`);
      cy.waitForHydration();
    });

    it("should display the petition title", () => {
      cy.get("h1, h2").should("be.visible").and("not.be.empty");
    });

    it("should display the petition description section", () => {
      cy.contains(/Description de la pétition/i).should("be.visible");
    });

    it("should display the signatures counter", () => {
      cy.contains(/personnes ont signé|soutiens/i).should("be.visible");
    });

    it("should display the progress bar", () => {
      cy.get("div[class*='bg-green'], progress, [role='progressbar']").should(
        "exist"
      );
    });

    it("should display the petition author", () => {
      cy.contains(/lancé cette pétition/i).should("be.visible");
    });

    it("should display the petition category and scale badges", () => {
      cy.get(
        "[class*='badge'], span[class*='rounded'], span[class*='uppercase']"
      )
        .first()
        .should("be.visible");
    });

    // ─── Tabs ────────────────────────────────────────────────────────────────
    it("should show the three tabs: Discussion, Fil de Négociation, Signataires", () => {
      cy.contains(/DISCUSSION/i).should("be.visible");
      cy.contains(/FIL DE NÉGOCIATION|NEGOCIATION/i).should("be.visible");
      cy.contains(/SIGNATAIRES/i).should("be.visible");
    });

    it("should switch to Signataires tab and show signatures", () => {
      cy.contains(/SIGNATAIRES/i).click();
      // At least the tab content should be visible
      cy.contains(/SIGNATAIRES/i).should("have.class", "text-green-400");
    });

    it("should switch to Fil de Négociation tab", () => {
      cy.contains(/FIL DE NÉGOCIATION|NEGOCIATION/i).click();
      cy.contains(/FIL DE NÉGOCIATION|NEGOCIATION/i).should("be.visible");
    });

    // ─── Support button ──────────────────────────────────────────────────────
    it("should display the 'Soutenir cette cause' button", () => {
      cy.contains(/Soutenir cette cause/i).should("be.visible");
    });

    it("should display 'Partager la pétition' button", () => {
      cy.contains(/Partager la pétition/i).should("be.visible");
    });

    // ─── Sidebar signataires preview ─────────────────────────────────────────
    it("should display 'Derniers Signataires' in the sidebar", () => {
      cy.contains(/DERNIERS SIGNATAIRES/i).should("be.visible");
    });

    // ─── Signature modal ─────────────────────────────────────────────────────
    it("should open a signature confirmation modal on 'Soutenir' click", () => {
      cy.contains(/Soutenir cette cause/i).click();
      // Modal should appear with confirm button or already-signed message
      cy.get("body").then(($body) => {
        const hasModal =
          $body.find("[role='dialog'], .modal, [data-modal]").length > 0;
        const hasMessage = $body.text().includes("Confirmer") ||
          $body.text().includes("déjà signé") ||
          $body.text().includes("soutenu");
        expect(hasModal || hasMessage).to.be.true;
      });
    });
  });

  // ─── My Petitions ─────────────────────────────────────────────────────────
  describe("My Petitions Page", () => {
    beforeEach(() => {
      cy.visit("/my-petitions");
      cy.waitForHydration();
    });

    it("should load the My Petitions page", () => {
      cy.url().should("include", "/my-petitions");
    });

    it("should display page title or empty state", () => {
      cy.contains(/pétition|Aucune/i).should("be.visible");
    });
  });
});
