import crypto from "crypto";
import type { ApiKeyScope, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ApiKeyAuthResult =
  | { ok: true; keyId: string; scopes: Set<ApiKeyScope> }
  | { ok: false; status: 401 | 403; error: string };

function sha256Hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

export async function verifyApiKey(
  input: { apiKey: string | null; requiredScopes?: ApiKeyScope[] },
  deps: { prisma?: PrismaClient } = {},
): Promise<ApiKeyAuthResult> {
  const apiKey = (input.apiKey ?? "").trim();
  if (!apiKey) return { ok: false, status: 401, error: "missing_api_key" };

  const keyHash = sha256Hex(apiKey);
  const p = deps.prisma ?? prisma;
  const row = await p.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, isActive: true, scopes: true },
  });

  if (!row || !row.isActive) return { ok: false, status: 401, error: "invalid_api_key" };

  const scopes = new Set(row.scopes);
  const required = input.requiredScopes ?? [];
  for (const s of required) {
    if (!scopes.has(s)) return { ok: false, status: 403, error: "insufficient_scope" };
  }

  // best-effort lastUsedAt update; don't fail auth if it errors
  p.apiKey
    .update({ where: { id: row.id }, data: { lastUsedAt: new Date() }, select: { id: true } })
    .catch(() => {});

  return { ok: true, keyId: row.id, scopes };
}

