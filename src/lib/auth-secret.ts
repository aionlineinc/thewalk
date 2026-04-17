export function getAuthSecret() {
  // Prefer project-specific AUTH_SECRET, but support the NextAuth convention too.
  return process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";
}

