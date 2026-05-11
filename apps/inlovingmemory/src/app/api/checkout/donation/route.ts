import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  memorialId: z.string().uuid(),
  donorName: z.string().min(1).max(120),
  donorEmail: z.string().email().max(200),
  amount: z.number().positive(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  let json: unknown;
  try { json = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { memorialId, donorName, donorEmail, amount, message } = parsed.data;

  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  // Create donation record
  const donation = await prisma.ilmDonation.create({
    data: {
      memorialId,
      donorName: donorName.trim(),
      donorEmail,
      amount,
      message: message?.trim() || null,
      status: "PENDING",
    },
  });

  // Create Stripe PaymentIntent
  try {
    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: "usd",
        "metadata[donationId]": donation.id,
        "metadata[memorialId]": memorialId,
      }).toString(),
    });

    const stripeJson = (await stripeRes.json()) as { client_secret?: string; id?: string; error?: { message: string } };

    if (!stripeRes.ok) {
      await prisma.ilmDonation.update({ where: { id: donation.id }, data: { status: "FAILED" } });
      return NextResponse.json({ error: stripeJson.error?.message || "Payment failed" }, { status: 400 });
    }

    await prisma.ilmDonation.update({
      where: { id: donation.id },
      data: { stripePaymentIntentId: stripeJson.id, status: "COMPLETED" },
    });

    return NextResponse.json({ clientSecret: stripeJson.client_secret, donationId: donation.id });
  } catch {
    await prisma.ilmDonation.update({ where: { id: donation.id }, data: { status: "FAILED" } });
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
