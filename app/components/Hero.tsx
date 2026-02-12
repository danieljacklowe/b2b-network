import React from 'react';

export default function Hero() {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden pt-24 pb-32">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-blue-400 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Accepting Applications for Q3 FinTech Cohort
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Stop Cold Calling. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
            Start Trading Warm Intros.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join a private, vetted network of elite Account Executives. Trade connections to decision-makers, earn social capital, and close deals faster through mutually guaranteed warm handoffs.
        </p>

        <div className="flex flex-col items-center gap-4">
          <button className="px-8 py-4 bg-white text-slate-950 text-lg font-bold rounded-lg hover:bg-slate-200 transition-colors duration-200 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
            Apply for Early Access
          </button>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
            Strictly invite-only. LinkedIn & Corporate Email required.
          </p>
        </div>
      </div>
    </section>
  );
}