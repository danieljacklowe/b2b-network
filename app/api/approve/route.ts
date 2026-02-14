import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { userId, userEmail, firstName } = await req.json();

    // 1. Update Database
    await prisma.waitlistApplication.update({
      where: { id: userId },
      data: { status: "APPROVED" },
    });

    // 2. Send Email 
    // IMPORTANT: Resend 'onboarding@resend.dev' only sends to YOUR email address!
    try {
      await resend.emails.send({
        from: 'WarmDoor <hello@getwarmdoor.com>',
        to: userEmail, 
        subject: "You're in! The trading floor is open.",
        html: `<p>Welcome, ${firstName}!</p>`
      });
    } catch (emailErr) {
      console.error("Email failed but DB updated:", emailErr);
    }

    // 3. RETURN JSON (Crucial for the button to turn green)
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}