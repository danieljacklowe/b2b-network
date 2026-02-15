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

    // 1. Find the current user's database ID
    const dbUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!dbUser) throw new Error("User not found");

    // 2. Fetch all connections EXCEPT the user's own
    const doors = await prisma.connection.findMany({
      where: { 
        userId: { not: dbUser.id } 
      },
      include: {
        user: { select: { firstName: true } } // Get the first name of the person who owns the door
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(doors);
  } catch (error) {
    console.error("Failed to fetch directory:", error);
    return NextResponse.json({ error: "Failed to fetch directory" }, { status: 500 });
  }
}