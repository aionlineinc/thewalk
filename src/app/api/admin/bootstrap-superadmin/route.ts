import { NextResponse } from "next/server";
import { z } from "zod";
import { identityService } from "@/server/services";

const bodySchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
  name: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const secret = req.headers.get("x-bootstrap-secret") ?? "";
  if (process.env.BOOTSTRAP_SECRET) {
    if (secret !== process.env.BOOTSTRAP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password, name } = parsed.data;

  // Safe fallback: if BOOTSTRAP_SECRET is not set, allow bootstrap only when:
  // - no SUPER_ADMIN exists yet, and
  // - the email matches the intended initial admin
  if (!process.env.BOOTSTRAP_SECRET) {
    const identity = identityService();
    const allowed = await identity.canBootstrapWithoutSecret({ email });
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const identity = identityService();
  const result = await identity.upsertSuperAdmin({ email, password, name });
  if (!result.ok) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  return NextResponse.json({ ok: true, user: result.value.user });
}

