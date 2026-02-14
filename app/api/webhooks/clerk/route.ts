import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response('Error occured', { status: 400 });
  }

  // Handle the event
  if (evt.type === 'user.created') {
    const { email_addresses, first_name } = evt.data;
    const userEmail = email_addresses[0].email_address;

    try {
      // 1. Email to the USER (Only works for your own email until domain is verified)
      await resend.emails.send({
        from: 'WarmDoor <onboarding@resend.dev>',
        to: userEmail,
        subject: "We've got your application!",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hi ${first_name || 'there'},</h2>
            <p>Thanks for applying to WarmDoor! We've received your application.</p>
            <p>Our team manually reviews every profile to keep the network high-quality. We'll be in touch shortly.</p>
            <p>Stay warm,<br>The WarmDoor Team</p>
          </div>
        `
      });

      // 2. Alert Email to YOU (The Admin)
      await resend.emails.send({
        from: 'WarmDoor Bot <onboarding@resend.dev>',
        to: 'WarmDoor <hello@getwarmdoor.com>', // ⚠️ CHANGE THIS TO YOUR REAL INBOX EMAIL
        subject: `🚨 New Waitlist Application: ${userEmail}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ea580c; border-radius: 8px;">
            <h2 style="color: #ea580c;">New User Alert!</h2>
            <p><strong>Name:</strong> ${first_name || 'No name provided'}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
            <p>Log in to your Admin dashboard to review and approve them.</p>
            <a href="https://b2b-network.vercel.app/admin" style="background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to God Mode</a>
          </div>
        `
      });
      
      console.log("Both emails sent successfully!");

    } catch (error) {
      console.error("Failed to send Resend emails:", error);
    }
  }

  return new Response('', { status: 200 });
}