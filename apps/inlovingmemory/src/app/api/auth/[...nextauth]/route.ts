import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { getAuthOptions } from "@/lib/auth";

type Ctx = { params: { nextauth: string[] } };

export async function GET(req: NextRequest, ctx: Ctx) {
  return NextAuth(req, ctx, getAuthOptions());
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return NextAuth(req, ctx, getAuthOptions());
}
