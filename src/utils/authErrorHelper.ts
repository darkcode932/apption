export interface AuthErrorInfo {
  title: string;
  description: string;
}

export function parseAuthError(err: any, provider?: "google" | "facebook"): AuthErrorInfo {
  const code = err?.code || "";
  const rawMessage = typeof err === "string" ? err : err?.message || "";

  // 1. Popup closed by user
  if (code === "auth/popup-closed-by-user" || rawMessage.includes("popup-closed-by-user")) {
    return {
      title: "Connexion interrompue",
      description: "Vous avez fermé la fenêtre de connexion avant d'autoriser l'accès.",
    };
  }

  // 2. Account exists with different credential
  if (
    code === "auth/account-exists-with-different-credential" ||
    rawMessage.includes("account-exists-with-different-credential")
  ) {
    return {
      title: "Compte déjà existant",
      description:
        "Un compte existe déjà avec cette adresse e-mail via une autre méthode de connexion (Google, Facebook ou e-mail/mot de passe). Veuillez utiliser cette dernière.",
    };
  }

  // 3. Invalid credential or provider error (e.g. Domain not allowed in Meta)
  if (
    code === "auth/invalid-credential" ||
    code === "auth/invalid-provider-id" ||
    rawMessage.includes("invalid-credential") ||
    rawMessage.includes("Impossible+de+charger+cette+URL")
  ) {
    return {
      title: `Échec d'authentification ${provider === "facebook" ? "Facebook" : provider === "google" ? "Google" : ""}`,
      description:
        "Impossible de valider vos identifiants auprès du service. Vérifiez vos autorisations et réessayez.",
    };
  }

  // 4. Network error
  if (code === "auth/network-request-failed" || rawMessage.includes("network-request-failed")) {
    return {
      title: "Erreur de connexion réseau",
      description: "Impossible de joindre le serveur. Vérifiez votre connexion Internet et réessayez.",
    };
  }

  // 5. User disabled
  if (code === "auth/user-disabled" || rawMessage.includes("user-disabled")) {
    return {
      title: "Compte suspendu",
      description: "Ce compte a été suspendu par l'administration d'Apption.",
    };
  }

  // 6. Wrong password or user not found for standard email auth
  if (
    code === "auth/wrong-password" ||
    code === "auth/user-not-found" ||
    code === "auth/invalid-email"
  ) {
    return {
      title: "Identifiants invalides",
      description: "Adresse e-mail ou mot de passe incorrect. Veuillez vérifier vos informations.",
    };
  }

  // Fallback
  return {
    title: "Erreur de connexion",
    description: rawMessage.length < 120 ? rawMessage : "Une erreur est survenue lors de l'authentification. Veuillez réessayer.",
  };
}
