/**
 * Utility to sanitize user text inputs against HTML script tags, XSS and malformed payload injection.
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove <script> tags
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .trim();
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      sanitized[key] = sanitizeText(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  return sanitized as T;
}
