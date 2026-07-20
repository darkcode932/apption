// cypress/support/e2e.ts
// This file is loaded automatically before each spec file.

import "./commands";

// Ignore uncaught exceptions from Firebase / Next.js internals
Cypress.on("uncaught:exception", (err) => {
  // Firebase auth persistence warning
  if (err.message.includes("ResizeObserver loop")) return false;
  if (err.message.includes("ChunkLoadError")) return false;
  return true;
});

// Clear authentication databases and local storage before every single test
beforeEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();
  cy.window().then((win) => {
    return new Promise((resolve) => {
      const req = win.indexedDB.deleteDatabase("firebaseLocalStorageDb");
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    });
  });
});
