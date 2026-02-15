'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectionForm({ userId, currentCount }: { userId: string, currentCount: number }) {
  const [localCount, setLocalCount] = useState(currentCount);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    personTitle: '',
    companyName: '',
    industry: '',
    context: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (res.ok) {
        const newCount = localCount + 1;
        setLocalCount(newCount);
        
        // Clear the form so they can type the next one
        setFormData({ personTitle: '', companyName: '', industry: '', context: '' });

        // If they hit 5, refresh the page to trigger the Gatekeeper to open!
        if (newCount >= 5) {
          router.refresh();
        }
      } else {
        alert("Failed to save connection. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg border border-orange-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Unlock the Trading Floor</h2>
        <p className="text-gray-500 mt-2">To maintain a high-signal community, please add 5 solid connections you can introduce to others.</p>
        
        {/* Progress Tracker */}
        <div className="flex gap-2 mt-6">
          {[1, 2, 3, 4, 5].map((step) => (
            <div 
              key={step} 
              className={`h-2 flex-1 rounded-full transition-colors ${localCount >= step ? 'bg-orange-500' : 'bg-gray-200'}`} 
            />
          ))}
        </div>
        <p className="text-xs font-bold mt-2 text-orange-600 uppercase tracking-wider">
          {localCount} of 5 added
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Person's Title / Role</label>
          <input 
            required
            placeholder="e.g. VP of Sales, Technical Founder"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            value={formData.personTitle}
            onChange={(e) => setFormData({...formData, personTitle: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input 
              required
              placeholder="e.g. Stripe"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input 
              required
              placeholder="e.g. Fintech"
              className="w-full p-3 border border-gray-300 rounded-md"
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">How do you know them?</label>
          <textarea 
            required
            placeholder="e.g. We worked together for 3 years at Airbnb..."
            className="w-full p-3 border border-gray-300 rounded-md h-24"
            value={formData.context}
            onChange={(e) => setFormData({...formData, context: e.target.value})}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-orange-600 text-white font-bold py-3 rounded-md hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : localCount >= 4 ? 'Save & Enter Trading Floor 🚪' : `Add Connection ${localCount + 1}`}
        </button>
      </form>
    </div>
  );
}