import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all the active asks on the floor
    const asks = await prisma.opportunity.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // 2. Look up the users who posted them to get their ratings
    const userEmails = asks.map(ask => ask.userEmail);
    const users = await prisma.user.findMany({
      where: { email: { in: userEmails } },
      select: { email: true, rating: true, reviewCount: true }
    });

    // 3. Combine the Ask with the User's Social Proof
    const enrichedAsks = asks.map(ask => {
      const user = users.find(u => u.email === ask.userEmail);
      return {
        ...ask,
        rating: user?.rating || 0,
        reviewCount: user?.reviewCount || 0
      };
    });

    return NextResponse.json(enrichedAsks);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Create the new Ask
    const newAsk = await prisma.opportunity.create({
      data: {
        userEmail: body.userEmail,
        userName: body.userName,
        company: body.company,
        role: body.role,
        ask: body.ask
      }
    });

    // 2. Fetch the poster's rating so it instantly shows up in the UI without a refresh
    const user = await prisma.user.findUnique({
      where: { email: body.userEmail },
      select: { rating: true, reviewCount: true }
    });

    return NextResponse.json({
      ...newAsk,
      rating: user?.rating || 0,
      reviewCount: user?.reviewCount || 0
    });
  } catch (error) {
    console.error("Failed to post ask:", error);
    return NextResponse.json({ error: "Failed to post ask" }, { status: 500 });
  }
}