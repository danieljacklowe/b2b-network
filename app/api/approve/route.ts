import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get("userId") as string;
    const userEmail = formData.get("userEmail") as string;
    const firstName = formData.get("firstName") as string;

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Update the database to APPROVED
    await prisma.waitlistApplication.update({
      where: { id: userId },
      data: { status: "APPROVED" },
    });

    // 2. Send the "You're In" Email via Resend
    await resend.emails.send({
      from: 'WarmDoor <onboarding@resend.dev>', // Change to your verified domain later
      to: userEmail,
      subject: "You're in! The trading floor is open.",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ea580c;">Welcome to WarmDoor, ${firstName || 'User'}!</h2>
          <p>Your application has been approved by our team.</p>
          <p>You now have full access to the trading floor. You can post your own asks or help others with intros.</p>
          <div style="margin-top: 25px;">
            <a href="https://your-actual-domain.com/dashboard" 
               style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Enter the Trading Floor
            </a>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Stay warm,<br>The WarmDoor Team</p>
        </div>
      `
    });

    // 3. Redirect back to admin with success
    return NextResponse.redirect(new URL("/admin?success=approved", req.url), 303);

  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.redirect(new URL("/admin?error=failed", req.url), 303);
  }
}