import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, firstName } = body;

    // Security Check: Ensure the requester has the secret key
    // (In a real app, we'd use session auth, but this works for now)
    if (body.secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Update Database Status
    await prisma.waitlistApplication.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    // 2. Send the "You're In" Email
    // NOTE: Replace 'YOUR_EMAIL@gmail.com' with your actual email for testing!
    await resend.emails.send({
      from: "WarmDoor <onboarding@resend.dev>",
      to: "danieljacklowe@gmail.com", // Change this to 'email' when you upgrade Resend
      subject: "Your WarmDoor Access 🔑",
      html: `
        <h1>Welcome to the Club, ${firstName}.</h1>
        <p>Your application to WarmDoor has been approved.</p>
        <p>You can now access the trading floor.</p>
        <br />
        <a href="https://warmdoor.vercel.app/login" style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login Now</a>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error approving user" }, { status: 500 });
  }
}