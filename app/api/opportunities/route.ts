import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all opportunities for the feed
export async function GET() {
  try {
    const opportunities = await prisma.opportunity.findMany({
      orderBy: { createdAt: 'desc' }, // Newest asks at the top
    });
    return NextResponse.json(opportunities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch asks" }, { status: 500 });
  }
}

// POST: Create a new ask
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userEmail, userName, company, role, ask } = body;

    const opportunity = await prisma.opportunity.create({
      data: { userEmail, userName, company, role, ask }
    });

    return NextResponse.json(opportunity);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create ask" }, { status: 500 });
  }
}