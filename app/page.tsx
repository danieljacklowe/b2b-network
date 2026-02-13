"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true); // Start loading spinner

    const formData = new FormData(event.currentTarget);
    
    // Prepare the data
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      linkedIn: formData.get("linkedIn"),
      dealSize: formData.get("dealSize"),
      icp: "B2B Tech", // Default value
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true); // Show success message
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting form");
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  }

  if (isSubmitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="max-w-md rounded-2xl bg-slate-900 p-10 shadow-2xl border border-slate-800">
          <h1 className="mb-4 text-4xl font-bold text-green-400">Application Received 🚀</h1>
          <p className="text-lg text-slate-300">
            Welcome to the future of B2B networking. We will review your profile and reach out shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6">
      
      {/* Hero Section */}
      <div className="mb-10 text-center max-w-2xl">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          The Exclusive <span className="text-blue-500">B2B Network</span>
        </h1>
        <p className="text-lg text-slate-400">
          Connect with high-value partners. Close bigger deals. 
          Join the waitlist to get early access.
        </p>
      </div>

      {/* The Form Card */}
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Work Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="jane@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">LinkedIn URL (Optional)</label>
            <input
              type="url"
              name="linkedIn"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="linkedin.com/in/jane"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Average Deal Size</label>
            <select
              name="dealSize"
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="< $10k">&lt; $10k</option>
              <option value="$10k - $50k">$10k - $50k</option>
              <option value="$50k - $100k">$50k - $100k</option>
              <option value="$100k+">$100k+</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-400 transition-all"
          >
            {isLoading ? "Joining..." : "Join Waitlist →"}
          </button>
        </form>
      </div>

    </main>
  );
}