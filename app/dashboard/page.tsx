import { currentUser } from '@clerk/nextjs/server';
import { UserButton } from '@clerk/nextjs';
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
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {dbUser?.firstName}!
            </h1>
            
            {/* My Social Proof Badge */}
            <div className="mt-2">
              {(dbUser?.reviewCount ?? 0) > 0 ? (
                <span className="text-sm font-bold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300 shadow-sm">
                  ★ {Number(dbUser?.rating).toFixed(1)} ({dbUser?.reviewCount} Reviews)
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  New Member
                </span>
              )}
            </div>
          </div>
          
          {/* THE CLERK PROFILE & SIGN OUT BUTTON */}
          <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition">
             <UserButton afterSignOutUrl="/" />
          </div>
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