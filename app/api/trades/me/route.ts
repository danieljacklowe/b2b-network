import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const myEmail = user.emailAddresses[0].emailAddress;

    // 1. NEW: Fetch my open Asks (Opportunities) that are waiting for help
    const myOpenAsks = await prisma.opportunity.findMany({
      where: { userEmail: myEmail },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Fetch Trades where someone offered to help me
    const myRequests = await prisma.trade.findMany({
      where: { requesterEmail: myEmail },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Fetch Trades where I offered to help someone else
    const myOffers = await prisma.trade.findMany({
      where: { offererEmail: myEmail },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ myOpenAsks, myRequests, myOffers });
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}