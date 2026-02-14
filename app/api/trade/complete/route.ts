import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  const tradeId = formData.get("tradeId") as string;
  const offererEmail = formData.get("offererEmail") as string;

  // 1. Mark trade as COMPLETED
  await prisma.trade.update({
    where: { id: tradeId },
    data: { status: "COMPLETED" },
  });

  // 2. Update the Offerer's Rating (simple version: add a review and maintain 5-star vibe)
  await prisma.waitlistApplication.update({
    where: { email: offererEmail },
    data: {
      reviewCount: { increment: 1 },
      // In a real app, you'd calculate (total stars / count), 
      // for now, we'll just increment their reputation
    },
  });

  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}