"use client";

import { useState, FormEvent } from "react";

// --- Components ---

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20"></div>
          <span className="text-xl font-bold text-white tracking-tight">Intro<span className="text-emerald-500">Trade</span></span>
        </div>
        <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
          AE Login
        </button>
      </div>
    </nav>
  );
}

function Feature({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 transition-all hover:border-emerald-500/30 hover:bg-white/10">
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
        <p>&copy; {new Date().getFullYear()} IntroTrade. All rights reserved.</p>
      </div>
    </footer>
  );
}

// --- Main Page ---

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // Logic remains the same, just the context changes
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      linkedIn: formData.get("linkedIn"),
      dealSize: formData.get("dealSize"),
      icp: "AE Marketplace", 
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  }

  // Success State
  if (isSubmitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <Navbar />
        <div className="animate-in fade-in zoom-in duration-500 max-w-md rounded-2xl border border-emerald-500/20 bg-slate-900 p-10 shadow-2xl shadow-emerald-500/10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl">
            🤝
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white">Request Received</h1>
          <p className="text-slate-400">
            We are verifying your LinkedIn profile. Once approved, you can start trading introductions.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 text-sm font-medium text-slate-500 hover:text-white"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-emerald-500/30">
      <Navbar />

      <main className="mx-auto flex max-w-7xl flex-col items-center px-6 pt-32 pb-12 lg:flex-row lg:gap-16">
        
        {/* Left Column: Copy & Social Proof */}
        <div className="mb-12 flex-1 text-center lg:mb-0 lg:text-left">
          
          <div className="mx-auto mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 lg:mx-0">
            <span className="mr-2 flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Accepting Top Tier AEs
          </div>

          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Trade Warm Intros. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
              Crush Your Quota.
            </span>
          </h1>
          
          <p className="mb-8 text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            The exclusive marketplace for Account Executives. Stop cold calling and start trading warm introductions with peers in the B2B sales industry.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-left">
            <Feature title="Verified AEs" desc="No SDRs. No Recruiters." icon="🛡️" />
            <Feature title="Real Intros" desc="Give an intro, get an intro." icon="🤝" />
            <Feature title="Bypass Gatekeepers" desc="Go straight to decision makers." icon="🚀" />
          </div>
        </div>

        {/* Right Column: The Form */}
        <div className="w-full max-w-md flex-shrink-0">
          <div className="relative rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
            {/* Glow Effect behind form */}
            <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-50 blur-xl"></div>
            
            <h2 className="mb-6 text-xl font-semibold text-white">Apply for Access</h2>
            
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="First Name"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all"
                />
              </div>

              <input
                type="email"
                name="email"
                required
                placeholder="Work Email"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all"
              />

              <input
                type="url"
                name="linkedIn"
                placeholder="LinkedIn URL (Mandatory)"
                required
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all"
              />

              <select
                name="dealSize"
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-emerald-500 focus:bg-white/10 focus:outline-none transition-all appearance-none"
              >
                <option className="bg-slate-900" value="SMB (< $10k)">Segment: SMB (&lt; $10k)</option>
                <option className="bg-slate-900" value="Mid-Market ($10k-$50k)">Segment: Mid-Market ($10k-$50k)</option>
                <option className="bg-slate-900" value="Enterprise ($100k+)">Segment: Enterprise ($100k+)</option>
                <option className="bg-slate-900" value="Strategic ($1M+)">Segment: Strategic ($1M+)</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all transform active:scale-[0.98]"
              >
                {isLoading ? "Processing..." : "Join the Trading Floor →"}
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