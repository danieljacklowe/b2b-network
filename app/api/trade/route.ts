import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));

  const formData = await req.formData();
  const opportunityId = formData.get("opportunityId") as string;
  const company = formData.get("company") as string;
  const requesterEmail = formData.get("requesterEmail") as string;
  
  // The new proof fields
  const contactLinkedIn = formData.get("contactLinkedIn") as string;
  const relationshipContext = formData.get("relationshipContext") as string;

  const offererEmail = user.emailAddresses[0].emailAddress;
  const offererName = user.firstName ? `${user.firstName} ${user.lastName}` : "Anonymous AE";

  // Prevent a user from offering to help themselves
  if (offererEmail === requesterEmail) {
    return NextResponse.redirect(new URL("/dashboard?error=self_help_not_allowed", req.url), 303);
  }

  // Create the PENDING Trade in Escrow
  await prisma.trade.create({
    data: {
      opportunityId,
      company,
      requesterEmail,
      offererEmail,
      offererName,
      contactLinkedIn,
      relationshipContext,
      status: "PENDING",
    },
  });

  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}