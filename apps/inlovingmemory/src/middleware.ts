import { withAuth } from "next-auth/middleware";
import { getRuntimeAuthSecret } from "@/lib/auth-runtime";

const mwSecret = getRuntimeAuthSecret();

export default withAuth({
  pages: {
    signIn: "/sign-in",
  },
  ...(mwSecret ? { secret: mwSecret } : {}),
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
