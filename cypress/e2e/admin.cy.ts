// cypress/e2e/admin.cy.ts
// Suite 7: Admin dashboard tests

describe("🛡️ Admin Dashboard", () => {
  // ─── Admin Login ───────────────────────────────────────────────────────────
  describe("Admin Authentication", () => {
    beforeEach(() => {
      cy.visit("/admin/login");
      cy.waitForHydration();
    });

    it("should display the admin login form", () => {
      cy.get("input[type='email']").should("be.visible");
      cy.get("input[type='password']").should("be.visible");
      cy.get("button[type='submit']").should("be.visible");
    });

    it("should reject invalid admin credentials", () => {
      cy.get("#email").type("hacker@evil.com");
      cy.get("#password").type("wrongpass");
      cy.get("button").contains(/Accéder|Dashboard/i).click();
      cy.contains("p", /erreur|invalid|invalide|incorrect|unauthorized|error/i, {
        timeout: 8000,
      }).should("be.visible");
    });

    it("should reject a non-admin user account", () => {
      cy.get("#email").type(Cypress.env("USER_EMAIL"));
      cy.get("#password").type(Cypress.env("USER_PASSWORD"));
      cy.get("button").contains(/Accéder|Dashboard/i).click();
      // Should NOT navigate to /admin/dashboard
      cy.url({ timeout: 8000 }).should("not.include", "/admin/dashboard");
    });

    it("should login as admin successfully and reach admin area", () => {
      cy.loginAsAdmin();
      cy.url().should("include", "/admin/dashboard");
    });

    it("should login as super admin successfully", () => {
      cy.loginAsSuperAdmin();
      cy.url().should("include", "/admin/dashboard");
    });

    it("should redirect unauthenticated user from /admin/dashboard to /admin/login", () => {
      cy.visit("/admin/dashboard");
      cy.url({ timeout: 10000 }).should("include", "/admin/login");
    });
  });

  // ─── Admin Dashboard ───────────────────────────────────────────────────────
  describe("Admin Dashboard Overview", () => {
    beforeEach(() => {
      cy.loginAsSuperAdmin();
      cy.visit("/admin/dashboard");
      cy.waitForHydration();
    });

    it("should display the admin dashboard page", () => {
      cy.url().should("include", "/admin");
    });

    it("should display statistics cards (users, petitions)", () => {
      cy.contains(/Utilisateurs|Pétitions/i).should("be.visible");
    });

    it("should display the admin navigation sidebar or menu", () => {
      cy.get("nav, aside, [class*='sidebar'], [class*='menu']").should(
        "be.visible"
      );
    });

    it("should have a link to Users management", () => {
      cy.contains(/Utilisateurs|Users/i).should("be.visible");
    });

    it("should have a link to Petitions management", () => {
      cy.contains(/Pétitions|Petitions/i).should("be.visible");
    });
  });

  // ─── Users Management ──────────────────────────────────────────────────────
  describe("Users Management", () => {
    beforeEach(() => {
      cy.loginAsSuperAdmin();
      cy.visit("/admin/users");
      cy.waitForHydration();
    });

    it("should load the users management page", () => {
      cy.url().should("include", "/admin/users");
    });

    it("should display a list of users", () => {
      cy.get("table tbody tr, [data-testid='user-row'], li", {
        timeout: 10000,
      }).should("have.length.gte", 1);
    });

    it("should display user email in the list", () => {
      cy.contains("user3@apption.com").should("be.visible");
    });

    it("should show action buttons for each user (certify / promote)", () => {
      cy.get("button").filter(":contains('Certifier'), :contains('Promouvoir'), :contains('Vérifier')")
        .should("exist");
    });

    it("should show the certified badge for Carine's account", () => {
      cy.contains(/certifié|Certifié|verified/i).should("be.visible");
    });
  });

  // ─── Petitions Management ──────────────────────────────────────────────────
  describe("Petitions Management", () => {
    beforeEach(() => {
      cy.loginAsSuperAdmin();
      cy.visit("/admin/petitions");
      cy.waitForHydration();
    });

    it("should load the petitions management page", () => {
      cy.url().should("include", "/admin/petitions");
    });

    it("should display a list of petitions", () => {
      cy.get("table tbody tr, [data-testid='petition-row'], li", {
        timeout: 10000,
      }).should("have.length.gte", 1);
    });

    it("should show petition title, status, and actions", () => {
      cy.contains(/Pétition|Statut|Actions/i).should("be.visible");
    });
  });

  // ─── Admin Logout ──────────────────────────────────────────────────────────
  describe("Admin Logout", () => {
    it("should logout from admin and redirect to admin login", () => {
      cy.loginAsSuperAdmin();
      cy.visit("/admin/dashboard");
      cy.waitForHydration();
      // Find logout button
      cy.contains(/Déconnexion|Logout|déconnecter/i).click();
      cy.url({ timeout: 10000 }).should("include", "/admin/login");
    });
  });
});
