'use client';

import { useState } from 'react';

export default function ApproveButton({ id, email, firstName, secret }: any) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleApprove = async () => {
    setStatus('loading');

    try {
      const res = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, userEmail: email, firstName }),
      });

      // We expect JSON { success: true } from the server now
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <span className="text-green-600 font-bold flex items-center gap-1">
        ✅ Approved
      </span>
    );
  }

  return (
    <button
      onClick={handleApprove}
      disabled={status === 'loading'}
      className={`rounded px-3 py-1 text-sm font-medium text-white transition-colors ${
        status === 'error' ? 'bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
      }`}
    >
      {status === 'loading' ? 'Processing...' : status === 'error' ? 'Try Again' : 'Approve'}
    </button>
  );
}