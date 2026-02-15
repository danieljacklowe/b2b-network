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

    // 1. Fetch the user to get their credit balance
    const dbUser = await prisma.user.findUnique({
      where: { email: myEmail },
      select: { credits: true } // We need this so dbUser is defined!
    });

    // 2. Fetch open asks
    const myOpenAsks = await prisma.opportunity.findMany({
      where: { userEmail: myEmail },
      orderBy: { createdAt: 'desc' }
    });

    // 3. Fetch requests (intros I need)
    const myRequests = await prisma.trade.findMany({
      where: { requesterEmail: myEmail },
      orderBy: { createdAt: 'desc' }
    });

    // 4. Fetch offers (intros I'm offering)
    const myOffers = await prisma.trade.findMany({
      where: { offererEmail: myEmail },
      orderBy: { createdAt: 'desc' }
    });

    // Send everything back to the Deal Desk
    return NextResponse.json({ 
      myOpenAsks, 
      myRequests, 
      myOffers, 
      credits: dbUser?.credits || 0 
    });
  } catch (error) {
    console.error("Failed to fetch trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}