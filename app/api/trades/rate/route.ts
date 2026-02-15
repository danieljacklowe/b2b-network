import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const myEmail = user.emailAddresses[0].emailAddress;
    const { tradeId, stars } = await req.json();

    // 1. Find the Trade
    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });
    
    if (!trade) return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    if (trade.requesterEmail !== myEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    if (trade.status !== "COMPLETED") return NextResponse.json({ error: "Trade must be completed to rate" }, { status: 400 });
    if (trade.isRated) return NextResponse.json({ error: "Already rated" }, { status: 400 });

    // 2. Find the person who gave the intro (the Offerer)
    const offerer = await prisma.user.findUnique({ where: { email: trade.offererEmail } });
    if (!offerer) return NextResponse.json({ error: "Offerer not found" }, { status: 404 });

    // 3. Calculate their new average rating
    const currentTotalScore = offerer.rating * offerer.reviewCount;
    const newReviewCount = offerer.reviewCount + 1;
    const newAverageRating = (currentTotalScore + stars) / newReviewCount;

    // 4. Update the Database (Transaction to ensure both succeed together)
    await prisma.$transaction([
      prisma.trade.update({
        where: { id: tradeId },
        data: { isRated: true, rating: stars }
      }),
      prisma.user.update({
        where: { email: trade.offererEmail },
        data: { 
          rating: newAverageRating,
          reviewCount: newReviewCount
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Rating failed:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}