import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  // 1. Verify the user is logged in
  const user = await currentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // 2. Grab the data from the form
  const formData = await req.formData();
  const company = formData.get("company") as string;
  const role = formData.get("role") as string;
  const ask = formData.get("ask") as string;

  const email = user.emailAddresses[0].emailAddress;
  const userName = user.firstName ? `${user.firstName} ${user.lastName}` : "Anonymous AE";

  // 3. Save it to the database
  await prisma.opportunity.create({
    data: {
      userEmail: email,
      userName: userName,
      company: company,
      role: role,
      ask: ask,
    },
  });

  // 4. Redirect them right back to the dashboard (303 forces a clean reload)
  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}