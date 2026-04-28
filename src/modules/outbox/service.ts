import type { Prisma, PrismaClient } from "@prisma/client";

export type OutboxMessageInput = {
  type: string;
  aggregateType?: string;
  aggregateId?: string;
  payload: Prisma.InputJsonValue;
  availableAt?: Date;
};

export type OutboxService = {
  enqueue(tx: PrismaClient, msg: OutboxMessageInput): Promise<void>;
  dispatchBatch(input: { limit?: number }): Promise<{ delivered: number }>;
};

export function createOutboxService(deps: { prisma: PrismaClient; deliver: (m: { type: string; payload: any }) => Promise<void> }) {
  return {
    async enqueue(tx, msg) {
      await tx.outboxMessage.create({
        data: {
          type: msg.type,
          aggregateType: msg.aggregateType ?? null,
          aggregateId: msg.aggregateId ?? null,
          payloadJson: msg.payload,
          availableAt: msg.availableAt ?? new Date(),
        },
        select: { id: true },
      });
    },

    async dispatchBatch(input) {
      const limit = input.limit ?? 50;
      const now = new Date();

      const msgs = await deps.prisma.outboxMessage.findMany({
        where: { deliveredAt: null, availableAt: { lte: now } },
        orderBy: { createdAt: "asc" },
        take: limit,
        select: { id: true, type: true, payloadJson: true },
      });

      let delivered = 0;
      for (const m of msgs) {
        try {
          await deps.deliver({ type: m.type, payload: m.payloadJson });
          await deps.prisma.outboxMessage.update({
            where: { id: m.id },
            data: { deliveredAt: new Date() },
            select: { id: true },
          });
          delivered += 1;
        } catch (e) {
          await deps.prisma.outboxMessage.update({
            where: { id: m.id },
            data: { attempts: { increment: 1 }, lastError: e instanceof Error ? e.message : String(e) },
            select: { id: true },
          });
        }
      }

      return { delivered };
    },
  } satisfies OutboxService;
}

