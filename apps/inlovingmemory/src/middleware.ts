import { withAuth } from "next-auth/middleware";
import { getRuntimeAuthSecret } from "@/lib/auth-runtime";

const mwSecret = getRuntimeAuthSecret();

const STAFF_ROLES = ["SUPER_ADMIN", "ORG_ADMIN", "ORG_MANAGER"];

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ req, token }) {
      // Admin routes require staff role
      if (req.nextUrl.pathname.startsWith("/dashboard/admin")) {
        if (!token?.role || !STAFF_ROLES.includes(token.role as string)) {
          return false;
        }
      }
      // All /dashboard routes require authentication
      return !!token;
    },
  },
  ...(mwSecret ? { secret: mwSecret } : {}),
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
