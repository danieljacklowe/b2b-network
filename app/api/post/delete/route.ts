import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.redirect(new URL("/sign-in", req.url));

  const formData = await req.formData();
  const postId = formData.get("postId") as string;
  const userEmail = user.emailAddresses[0].emailAddress;

  // Verify ownership before deleting
  const post = await prisma.opportunity.findUnique({ where: { id: postId } });

  if (post?.userEmail === userEmail) {
    await prisma.opportunity.delete({
      where: { id: postId },
    });
  }

  return NextResponse.redirect(new URL("/dashboard?success=post_deleted", req.url), 303);
}