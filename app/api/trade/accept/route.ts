import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));

  const formData = await req.formData();
  const tradeId = formData.get("tradeId") as string;

  // Verify the person clicking "Accept" is actually the person who requested the intro
  const userEmail = user.emailAddresses[0].emailAddress;
  const trade = await prisma.trade.findUnique({ where: { id: tradeId } });

  if (trade?.requesterEmail === userEmail) {
    await prisma.trade.update({
      where: { id: tradeId },
      data: { status: "ACCEPTED" },
    });
  }

  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}