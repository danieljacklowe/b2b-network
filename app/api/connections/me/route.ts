import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const email = clerkUser.emailAddresses[0].emailAddress;

    // 1. Find the current user
    const dbUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!dbUser) throw new Error("User not found");

    // 2. Fetch ONLY the connections that belong to this user
    const myDoors = await prisma.connection.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(myDoors);
  } catch (error) {
    console.error("Failed to fetch my network:", error);
    return NextResponse.json({ error: "Failed to fetch my network" }, { status: 500 });
  }
}