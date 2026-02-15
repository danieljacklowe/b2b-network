import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      opportunityId, 
      company, 
      requesterEmail, 
      offererEmail, 
      offererName, 
      contactLinkedIn, 
      relationshipContext 
    } = body;

    // 1. Save the Trade to the database
    const trade = await prisma.trade.create({
      data: {
        opportunityId,
        company,
        requesterEmail,
        offererEmail,
        offererName,
        contactLinkedIn,
        relationshipContext,
        status: "PENDING"
      }
    });

    // 2. Fire the notification email to the person who asked for the intro
    await resend.emails.send({
      from: 'WarmDoor <hello@getwarmdoor.com>', // Using your newly verified live domain!
      to: requesterEmail,
      subject: `🚪 Good news: Someone can open a door at ${company}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #ea580c;">WarmDoor Intro Offer</h2>
          <p>Great news! <strong>${offererName}</strong> has offered to help with your request for an intro at <strong>${company}</strong>.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin-top: 0;"><strong>Their Contact:</strong> <a href="${contactLinkedIn}">${contactLinkedIn}</a></p>
            <p style="margin-bottom: 0;"><strong>Context:</strong> "${relationshipContext}"</p>
          </div>

          <p>If this looks like a good fit, reply directly to this email to connect with ${offererName} (${offererEmail}) and coordinate the intro.</p>
          
          <p style="color: #888; font-size: 14px; margin-top: 40px;">Keep the floor high-signal,<br>The WarmDoor Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, trade });
  } catch (error) {
    console.error("Failed to create trade:", error);
    return NextResponse.json({ error: "Failed to create trade" }, { status: 500 });
  }
}