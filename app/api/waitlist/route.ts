import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Save to Database (Neon)
    const newEntry = await prisma.waitlistApplication.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        linkedIn: body.linkedIn,
        dealSize: body.dealSize,
        icp: body.icp,
      },
    });

    // 2. Send Email Alert (Resend)
    // NOTE: Replace 'YOUR_EMAIL@gmail.com' with your actual email!
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "danieljacklowe@gmail.com", 
      subject: `🚀 New Lead: ${body.firstName} ${body.lastName}`,
      html: `
        <h1>New Waitlist Application!</h1>
        <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Deal Size:</strong> ${body.dealSize}</p>
        <p><strong>LinkedIn:</strong> ${body.linkedIn || "N/A"}</p>
        <hr />
        <p><em>Check the <a href="https://b2b-network.vercel.app/admin">Admin Dashboard</a> for more details.</em></p>
      `,
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error processing application:", error);
    return NextResponse.json(
      { error: "Error processing application" },
      { status: 500 }
    );
  }
}