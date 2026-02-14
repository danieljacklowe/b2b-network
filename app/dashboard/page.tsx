import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const user = await currentUser();
  
  // Failsafe: If no user, don't render
  if (!user) return null;

  const email = user.emailAddresses[0].emailAddress;
  const firstName = user.firstName || "User";
  const lastName = user.lastName || "";

  // 1. Check if user is in our database
  let dbUser = await prisma.waitlistApplication.findUnique({
    where: { email: email },
  });

  // 2. If they just signed up via Clerk SSO, add them to our database as PENDING
  if (!dbUser) {
    dbUser = await prisma.waitlistApplication.create({
      data: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        status: "PENDING",
      },
    });
  }

  // --- UI STATE 1: THE VELVET ROPE (PENDING) ---
  if (dbUser.status === "PENDING") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white selection:bg-orange-500/30">
        <div className="absolute right-6 top-6">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-500 rounded-2xl border border-orange-500/20 bg-slate-900/50 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-3xl">
            ⏳
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white">Profile Under Review</h1>
          <p className="text-slate-400 mb-6">
            Welcome, {firstName}. We manually verify every Account Executive to ensure the trading floor stays high-quality and spam-free.
          </p>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-slate-300">
              Status: <span className="font-bold text-orange-500 animate-pulse">Verification Pending</span>
            </p>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            You will receive an email as soon as you are approved.
          </p>
        </div>
      </div>
    );
  }

  // --- UI STATE 2: THE TRADING FLOOR (APPROVED) ---
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 shadow-lg shadow-orange-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
                <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold">Warm<span className="text-orange-500">Door</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Credits: <span className="font-bold text-white">3</span> 💳</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
          <p className="text-slate-400">The trading floor is active. You have 3 credits available.</p>
        </header>

        {/* Live Opportunities (Mock Data) */}
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {[
            { company: "Salesforce", role: "VP of Sales", ask: "Intro to Oracle", date: "2m ago" },
            { company: "HubSpot", role: "Director of Marketing", ask: "Intro to Stripe", date: "15m ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/5 p-6 last:border-0 hover:bg-white/5 transition-colors">
              <div>
                <h3 className="font-semibold text-white">{item.company}</h3>
                <p className="text-sm text-slate-400">{item.role}</p>
              </div>
              <div className="text-right">
                <span className="block text-sm font-medium text-orange-500">Seeking: {item.ask}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}