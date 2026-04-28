import type { PrismaClient } from "@prisma/client";
import type { Result } from "@/modules/_shared/result";
import { err, ok } from "@/modules/_shared/result";
import type { AppError } from "@/modules/_shared/errors";
import { unexpected } from "@/modules/_shared/errors";

export async function checkDbHealth(prisma: PrismaClient): Promise<Result<{ now: Date | null }, AppError>> {
  try {
    const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
    return ok({ now: result?.[0]?.now ?? null });
  } catch {
    return err(unexpected("db_unreachable"));
  }
}

