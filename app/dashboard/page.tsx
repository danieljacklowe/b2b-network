import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-orange-500/30">
      
      {/* Navbar */}
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold">Welcome back, {user?.firstName} 👋</h1>
          <p className="text-slate-400">The trading floor is active. You have 3 credits available.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-medium text-slate-400">Total Credits</h3>
            <p className="mt-2 text-3xl font-bold text-white">3</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-medium text-slate-400">Active Trades</h3>
            <p className="mt-2 text-3xl font-bold text-white">0</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-medium text-slate-400">Network Reach</h3>
            <p className="mt-2 text-3xl font-bold text-white">1,240</p>
          </div>
        </div>

        {/* Live Opportunities (Mock Data) */}
        <h2 className="mb-6 text-xl font-semibold">Recent Opportunities</h2>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {[
            { company: "Salesforce", role: "VP of Sales", ask: "Intro to Oracle", date: "2m ago" },
            { company: "HubSpot", role: "Director of Marketing", ask: "Intro to Stripe", date: "15m ago" },
            { company: "Notion", role: "Head of Growth", ask: "Intro to Airbnb", date: "1h ago" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-white/5 p-6 last:border-0 hover:bg-white/5 transition-colors">
              <div>
                <h3 className="font-semibold text-white">{item.company}</h3>
                <p className="text-sm text-slate-400">{item.role}</p>
              </div>
              <div className="text-right">
                <span className="block text-sm font-medium text-orange-500">Seeking: {item.ask}</span>
                <span className="text-xs text-slate-500">{item.date}</span>
              </div>
              <button className="ml-4 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
                View
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}