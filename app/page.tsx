"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";



function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
              <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Warm<span className="text-orange-500">Door</span></span>
        </div>

        {/* --- THE FIX IS HERE --- */}
        <Link 
          href="/sign-in" 
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          Member Login
        </Link>
        {/* ----------------------- */}

      </div>
    </nav>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:border-orange-500/30 hover:bg-white/10">
      <div className="mb-4 text-3xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950 py-10">
      <div className="mx-auto max-w-7xl px-6 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} WarmDoor Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

// --- Main Page ---

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // <--- Add this

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    // ... (Your FormData code stays the same) ...
    const formData = new FormData(event.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      linkedIn: formData.get("linkedIn"),
      dealSize: formData.get("dealSize"),
      icp: "WarmDoor Waitlist",
    };

    try {
      const response = await fetch("/api/waitlist", {
         // ... same fetch code ...
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/thank-you"); // <--- Change this! (Redirects user)
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      // ... same error handling ...
    } finally {
      setIsLoading(false);
    }
  }

  // DELETE or COMMENT OUT the entire "if (isSubmitted)" block.
  // We don't need it anymore because we are redirecting!

  
  return (
    <div className="min-h-screen bg-slate-950 selection:bg-orange-500/30">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col items-center px-6 pt-32 pb-12 lg:flex-row lg:gap-16">
        
        {/* Left Column: Copy & Social Proof */}
        <div className="mb-12 flex-1 text-center lg:mb-0 lg:text-left">
          
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-400 lg:mx-0">
            <span className="mr-2 flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Access Restricted to Vetted and Verified AEs
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Stop Cold Calling. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Open a Warm Door.
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            The marketplace where top AEs trade warm introductions. 
            Don't bang on locked doors—get invited in by someone who already has the key.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
            <Feature title="Peer-to-Peer" desc="Trade intros with verified AEs." icon="🤝" />
            <Feature title="Zero Spam" desc="All AEs are Vetted and Verified." icon="🚫" />
            <Feature title="Credit System" desc="Earn credits for every intro." icon="💳" />
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="w-full max-w-md flex-shrink-0">
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
            {/* Glow Effect behind form */}
            <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-50 blur-xl"></div>
            
            <h2 className="mb-6 text-xl font-semibold text-white">Apply for Access</h2>
            
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all"
                />
              </div>

              <input
                type="email"
                name="email"
                required
                placeholder="Work Email"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all"
              />

              <input
                type="url"
                name="linkedIn"
                placeholder="LinkedIn URL (Mandatory)"
                required
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all"
              />

              <select
                name="dealSize"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all appearance-none"
              >
                <option className="bg-slate-900" value="SMB">Segment: SMB</option>
                <option className="bg-slate-900" value="Mid-Market">Segment: Mid-Market</option>
                <option className="bg-slate-900" value="Enterprise">Segment: Enterprise</option>
                <option className="bg-slate-900" value="Strategic">Segment: Strategic</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/25 hover:from-orange-500 hover:to-red-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all transform active:scale-[0.98]"
              >
                {isLoading ? "Unlocking..." : "Request Access →"}
              </button>
              
              <p className="text-center text-xs text-slate-500">
                100% anonymous until a trade is accepted.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
// Triggering Vercel rebuild for env vars