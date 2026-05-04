import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

const credentialsSchema = z.object({
  email: z.preprocess((v) => (typeof v === "string" ? normalizeEmail(v) : v), z.string().email().max(320)),
  password: z.string().min(8).max(200),
});

/** Optional e.g. `.thewalk.org` while ILM lives on ilm.thewalk.org — omit when using a standalone apex (inlovingmemory.cloud). */
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN?.trim();

/** Omit `secret` so NextAuth uses `NEXTAUTH_SECRET` / `AUTH_SECRET` at runtime (a literal empty string would block that). */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        } as import("next-auth").User & { role: string };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as { id?: string }).id ?? token.sub;
        (token as { role?: string }).role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.sub ?? "";
        (session.user as { role?: string }).role = (token as { role?: string }).role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  ...(cookieDomain
    ? {
        cookies: {
          sessionToken: {
            name:
              process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
            options: {
              httpOnly: true,
              sameSite: "lax",
              path: "/",
              secure: process.env.NODE_ENV === "production",
              domain: cookieDomain,
            },
          },
        },
      }
    : {}),
};
