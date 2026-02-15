import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const myEmail = user.emailAddresses[0].emailAddress;
    const { tradeId } = await req.json();

    // 1. Find the Trade
    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });
    
    if (!trade) return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    if (trade.requesterEmail !== myEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    if (trade.status !== "PENDING") return NextResponse.json({ error: "Trade already processed" }, { status: 400 });

    // 2. Check if the user has enough credits
    const requester = await prisma.user.findUnique({ where: { email: myEmail } });
    if (!requester || requester.credits < 1) {
      return NextResponse.json({ error: "Not enough credits. Offer an intro to earn more!" }, { status: 400 });
    }

    // 3. THE TRANSACTION (All or Nothing)
    await prisma.$transaction([
      // A. Deduct 1 credit from the Requester (You)
      prisma.user.update({
        where: { email: trade.requesterEmail },
        data: { credits: { decrement: 1 } }
      }),
      // B. Add 1 credit to the Offerer (Them)
      prisma.user.update({
        where: { email: trade.offererEmail },
        data: { credits: { increment: 1 } }
      }),
      // C. Mark the Trade as COMPLETED
      prisma.trade.update({
        where: { id: tradeId },
        data: { status: "COMPLETED" }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
  }
}