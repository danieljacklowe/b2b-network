import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma'; // Import from the new helper file



export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Save to Database
    const application = await prisma.waitlistApplication.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        linkedIn: body.linkedIn,
        icp: body.icp || "", // Handle optional fields if they are empty
        dealSize: body.dealSize || "",
      },
    });

    return NextResponse.json({ success: true, id: application.id }, { status: 200 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save application' }, { status: 500 });
  }
}