import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const user = await currentUser();
  
  if (!user) return null;

  const email = user.emailAddresses[0].emailAddress;
  const firstName = user.firstName || "User";
  const lastName = user.lastName || "";

  // 1. Check user status
  let dbUser = await prisma.waitlistApplication.findUnique({
    where: { email: email },
  });

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="absolute right-6 top-6">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div className="max-w-md w-full rounded-2xl border border-orange-500/20 bg-slate-900/50 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-3xl">⏳</div>
          <h1 className="mb-4 text-3xl font-bold">Profile Under Review</h1>
          <p className="text-slate-400 mb-6">Welcome, {firstName}. We manually verify every AE to ensure the floor stays high-quality.</p>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <p className="text-sm text-slate-300">Status: <span className="font-bold text-orange-500 animate-pulse">Verification Pending</span></p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Fetch LIVE Opportunities from the database
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // --- UI STATE 2: THE TRADING FLOOR (APPROVED) ---
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 pb-20">
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
              <span className="font-bold">W</span>
            </div>
            <span className="text-xl font-bold">Warm<span className="text-orange-500">Door</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Credits: <span className="font-bold text-white">3</span> 💳</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Trading Floor</h1>
          <p className="text-slate-400">Post an ask or browse opportunities below.</p>
        </header>

        {/* THE POSTING FORM */}
        <div className="mb-12 rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">Request an Intro</h2>
          <form action="/api/post" method="POST" className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-400">Target Company</label>
              <input type="text" name="company" required placeholder="e.g. Nike" className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-400">Target Role</label>
              <input type="text" name="role" required placeholder="e.g. VP Marketing" className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-slate-400">Your Ask</label>
              <input type="text" name="ask" required placeholder="e.g. Need intro to CMO" className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none" />
            </div>
            <button type="submit" className="rounded-lg bg-orange-600 px-6 py-2.5 font-semibold text-white hover:bg-orange-500 transition-colors">
              Post Ask
            </button>
          </form>
        </div>

        {/* LIVE DATABASE FEED */}
        <h2 className="mb-4 text-lg font-semibold">Live Opportunities</h2>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {opportunities.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              No active asks. Be the first to post!
            </div>
          ) : (
            opportunities.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-white/5 p-6 last:border-0 hover:bg-white/5 transition-colors">
                <div>
                  <h3 className="font-semibold text-white">{item.company}</h3>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-medium text-orange-500">Seeking: {item.ask}</span>
                  <span className="text-xs text-slate-500">Posted by {item.userName}</span>
                </div>
                <button className="ml-6 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
                  I can help
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}