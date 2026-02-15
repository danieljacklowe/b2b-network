import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, personTitle, companyName, industry, context } = body;

    if (!userId || !personTitle || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const connection = await prisma.connection.create({
      data: {
        userId,
        personTitle,
        companyName,
        industry,
        context,
        strength: 3, // Defaulting to 3 for now, you can add a slider to the UI later if you want
      }
    });

    return NextResponse.json({ success: true, connection });
  } catch (error) {
    console.error("Failed to save connection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}