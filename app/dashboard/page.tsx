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
      data: { email, firstName, lastName, status: "PENDING", linkedIn: "", dealSize: "", icp: "" },
    });
  }

  // --- VELVET ROPE (PENDING) ---
  if (dbUser.status === "PENDING") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="absolute right-6 top-6"><UserButton afterSignOutUrl="/" /></div>
        <div className="max-w-md w-full rounded-2xl border border-orange-500/20 bg-slate-900/50 p-10 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 text-3xl">⏳</div>
          <h1 className="mb-4 text-3xl font-bold">Profile Under Review</h1>
          <p className="text-slate-400 mb-6">Welcome, {firstName}. We manually verify every AE to ensure the floor stays high-quality.</p>
        </div>
      </div>
    );
  }

const myAsks = await prisma.opportunity.findMany({
  where: { userEmail: email },
  orderBy: { createdAt: 'desc' }
});

  // 2. Fetch LIVE Data
  const opportunities = await prisma.opportunity.findMany({ orderBy: { createdAt: 'desc' } });
  
  // Add this near your other prisma fetches
  const activeIntros = await prisma.trade.findMany({
    where: { 
      OR: [{ requesterEmail: email }, { offererEmail: email }],
      status: "ACCEPTED" 
    },
    orderBy: { createdAt: 'desc' }
  });

  const incomingOffers = await prisma.trade.findMany({
    where: { requesterEmail: email, status: "PENDING" },
    orderBy: { createdAt: 'desc' }
  });

  // --- THE TRADING FLOOR (APPROVED) ---
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30 pb-20">
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 font-bold">W</div>
            <span className="text-xl font-bold">Warm<span className="text-orange-500">Door</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Rating: <span className="font-bold text-yellow-500">{dbUser.rating} ⭐</span></span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* ACTION CENTER */}
        {incomingOffers.length > 0 && (
          <div className="mb-12 rounded-xl border border-orange-500/30 bg-orange-500/5 p-6">
            <h2 className="mb-4 text-lg font-bold text-orange-500">Incoming Offers ({incomingOffers.length})</h2>
            <div className="grid gap-4">
              {incomingOffers.map((offer) => (
                <div key={offer.id} className="rounded-lg border border-white/10 bg-slate-900 p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{offer.offererName} offered help for {offer.company}</p>
                      <p className="text-xs text-slate-400 mt-1">Context: {offer.relationshipContext}</p>
                    </div>
                    <form action="/api/trade/accept" method="POST">
                      <input type="hidden" name="tradeId" value={offer.id} />
                      <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold hover:bg-green-500">Accept</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

{/* SECTION: ACTIVE INTROS */}
        {activeIntros.length > 0 && (
          <div className="mb-12 rounded-xl border border-green-500/30 bg-green-500/5 p-6">
            <h2 className="mb-4 text-lg font-bold text-green-500">Active Connections</h2>
            <div className="grid gap-4">
              {activeIntros.map((trade) => (
                <div key={trade.id} className="rounded-lg border border-white/10 bg-slate-900 p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <p className="text-white font-bold">Intro for {trade.company}</p>
                      <p className="text-sm text-slate-400">Partner: {trade.offererEmail === email ? "The Requester" : trade.offererName}</p>
                      <a href={trade.contactLinkedIn} target="_blank" className="text-blue-400 text-xs hover:underline">View Target LinkedIn</a>
                    </div>
                    
                    {/* Only the Requester can "Complete" the trade */}
                    {trade.requesterEmail === email && (
                      <form action="/api/trade/complete" method="POST">
                        <input type="hidden" name="tradeId" value={trade.id} />
                        <input type="hidden" name="offererEmail" value={trade.offererEmail} />
                        <button type="submit" className="rounded-lg bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20 text-white">
                          Intro Received (Rate 5⭐)
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POST FORM */}
        <div className="mb-12 rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">Request an Intro</h2>
          <form action="/api/post" method="POST" className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <input type="text" name="company" required placeholder="Target Company" className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white outline-none" />
            <input type="text" name="role" required placeholder="Target Role" className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white outline-none" />
            <input type="text" name="ask" required placeholder="Your Ask" className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white outline-none" />
            <button type="submit" className="rounded-lg bg-orange-600 px-6 py-2 font-bold hover:bg-orange-500">Post</button>
          </form>
        </div>

{/* SECTION: MY MANAGEMENT CONSOLE */}
        {myAsks.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-slate-300">My Active Asks ({myAsks.length})</h2>
            <div className="grid gap-3">
              {myAsks.map((ask) => (
                <div key={ask.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-5 py-3">
                  <div>
                    <span className="font-bold text-white">{ask.company}</span>
                    <span className="ml-3 text-xs text-slate-500 uppercase tracking-widest">{ask.role}</span>
                  </div>
                  <form action="/api/post/delete" method="POST">
                    <input type="hidden" name="postId" value={ask.id} />
                    <button 
                      type="submit" 
                      className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20"
                    >
                      Remove Ask
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MARKETPLACE */}
        <div className="grid gap-6">
          {opportunities.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/5 bg-white/5 p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{item.company}</h3>
                    <p className="text-orange-500 font-medium">{item.ask}</p>
                  </div>
                  <p className="text-xs text-slate-500">By {item.userName}</p>
                </div>

                {item.userEmail !== email && (
                  <details className="group">
                    <summary className="list-none cursor-pointer inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20">
                      I can help
                    </summary>
                    <div className="mt-4 rounded-lg bg-slate-900 p-4 border border-orange-500/20">
                      <form action="/api/trade" method="POST" className="flex flex-col gap-3">
                        <input type="hidden" name="opportunityId" value={item.id} />
                        <input type="hidden" name="company" value={item.company} />
                        <input type="hidden" name="requesterEmail" value={item.userEmail} />
                        <input type="url" name="contactLinkedIn" required placeholder="LinkedIn URL" className="w-full rounded bg-slate-950 border border-white/10 px-3 py-2 text-sm text-white" />
                        <textarea name="relationshipContext" required placeholder="How do you know them?" className="w-full rounded bg-slate-950 border border-white/10 px-3 py-2 text-sm text-white" rows={2} />
                        <button type="submit" className="w-full rounded bg-orange-600 py-2 text-sm font-bold hover:bg-orange-500">Submit Proof</button>
                      </form>
                    </div>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}