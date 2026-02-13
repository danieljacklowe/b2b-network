"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveButton({ id, email, firstName, secret }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleApprove() {
    if (!confirm(`Approve ${firstName}? This will send an email.`)) return;

    setLoading(true);
    await fetch("/api/approve", {
      method: "POST",
      body: JSON.stringify({ id, email, firstName, secret }),
    });
    
    setLoading(false);
    router.refresh(); // Reloads the page to show "APPROVED" status
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="rounded bg-orange-600 px-3 py-1 text-xs font-bold text-white hover:bg-orange-500 disabled:opacity-50"
    >
      {loading ? "Sending..." : "Approve"}
    </button>
  );
}