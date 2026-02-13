export default function ThankYou() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white selection:bg-orange-500/30">
      
      {/* Success Card */}
      <div className="max-w-lg w-full animate-in fade-in zoom-in duration-500 rounded-2xl border border-orange-500/20 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/10 text-4xl shadow-lg shadow-orange-500/10">
          🔒
        </div>

        <h1 className="mb-2 text-3xl font-bold text-white">Application Received</h1>
        <p className="mb-8 text-slate-400">
          Your spot is reserved. Here is what happens next:
        </p>

        {/* The "Process" List */}
        <div className="space-y-4 text-left">
          
          {/* Step 1 */}
          <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20 text-green-500">
              ✓
            </div>
            <div>
              <p className="font-medium text-white">Profile Submitted</p>
              <p className="text-xs text-slate-500">We received your details.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
            <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
              ⏳
            </div>
            <div>
              <p className="font-medium text-white">Manual Verification</p>
              <p className="text-xs text-slate-500">We are checking your LinkedIn now.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-white/5 p-4 opacity-50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-400">
              ✉️
            </div>
            <div>
              <p className="font-medium text-white">Access Granted</p>
              <p className="text-xs text-slate-500">Look for an invite email soon.</p>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <a href="/" className="text-sm text-slate-500 hover:text-white transition-colors">
            ← Return to Home
          </a>
        </div>

      </div>
    </main>
  );
}