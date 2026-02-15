import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ConnectionForm from './ConnectionForm';
import MyTrades from './MyTrades';
import DashboardTabs from './DashboardTabs'; // NEW IMPORT

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/sign-in');
  }

  const email = clerkUser.emailAddresses[0].emailAddress;

  let dbUser = await prisma.user.findUnique({
    where: { email: email },
    include: {
      _count: { select: { connections: true } }
    }
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        email: email,
        firstName: clerkUser.firstName || '',
      },
      include: {
        _count: { select: { connections: true } }
      }
    });
  }

  // THE GATEKEEPER
  if (dbUser._count.connections < 5) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <ConnectionForm userId={dbUser.id} currentCount={dbUser._count.connections} />
      </div>
    );
  }

  // THE TRADING FLOOR
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dbUser.firstName}!
          </h1>
        </div>
        
        {/* Pinned at the top: Actionable Items */}
        <MyTrades />
        
        {/* The new Tabbed interface handles the rest! */}
        <DashboardTabs 
          currentUserEmail={dbUser.email} 
          currentUserName={dbUser.firstName || 'WarmDoor Member'} 
        />
        
      </div>
    </div>
  );
}