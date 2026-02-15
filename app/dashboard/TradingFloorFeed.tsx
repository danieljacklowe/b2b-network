'use client';

import { useState, useEffect } from 'react';

type Opportunity = {
  id: string;
  userEmail: string;
  userName: string;
  company: string;
  role: string;
  ask: string;
  createdAt: string;
};

export default function TradingFloorFeed({ currentUserEmail, currentUserName }: { currentUserEmail: string, currentUserName: string }) {
  const [feed, setFeed] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAsk, setNewAsk] = useState({ company: '', role: '', ask: '' });

  // --- NEW: Modal State ---
  const [selectedAsk, setSelectedAsk] = useState<Opportunity | null>(null);
  const [tradeForm, setTradeForm] = useState({ contactLinkedIn: '', relationshipContext: '' });
  const [isSubmittingTrade, setIsSubmittingTrade] = useState(false);

  useEffect(() => {
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        setFeed(data);
        setLoading(false);
      });
  }, []);

  const handlePostAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: currentUserEmail,
        userName: currentUserName || 'WarmDoor Member',
        company: newAsk.company,
        role: newAsk.role,
        ask: newAsk.ask,
      })
    });

    if (res.ok) {
      const createdAsk = await res.json();
      setFeed([createdAsk, ...feed]); 
      setNewAsk({ company: '', role: '', ask: '' }); 
      window.dispatchEvent(new Event('askPosted'));
    }
    setIsSubmitting(false);
  };

  // --- NEW: Handle Trade Submission ---
  const handleSubmitTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsk) return;
    
    setIsSubmittingTrade(true);

    const res = await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        opportunityId: selectedAsk.id,
        company: selectedAsk.company,
        requesterEmail: selectedAsk.userEmail, // The person who posted the ask
        offererEmail: currentUserEmail,        // YOU (the person helping)
        offererName: currentUserName,
        contactLinkedIn: tradeForm.contactLinkedIn,
        relationshipContext: tradeForm.relationshipContext,
      })
    });

    if (res.ok) {
      alert("Trade submitted! We'll notify the requester.");
      setSelectedAsk(null); // Close modal
      setTradeForm({ contactLinkedIn: '', relationshipContext: '' }); // Reset form
    } else {
      alert("Something went wrong. Please try again.");
    }
    setIsSubmittingTrade(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
      
      {/* 1. Post a New Ask Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Post a Request</h2>
        <form onSubmit={handlePostAsk} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Target Company (e.g. Stripe)" className="w-full p-3 border rounded-md"
              value={newAsk.company} onChange={e => setNewAsk({...newAsk, company: e.target.value})} />
            <input required placeholder="Target Role (e.g. VP of Engineering)" className="w-full p-3 border rounded-md"
              value={newAsk.role} onChange={e => setNewAsk({...newAsk, role: e.target.value})} />
          </div>
          <textarea required placeholder="Why do you want to meet them? (Keep it concise & high-signal)" className="w-full p-3 border rounded-md h-20"
            value={newAsk.ask} onChange={e => setNewAsk({...newAsk, ask: e.target.value})} />
          <button type="submit" disabled={isSubmitting} className="bg-orange-600 text-white font-bold py-2 px-6 rounded-md hover:bg-orange-700 transition">
            {isSubmitting ? 'Posting...' : 'Post to Trading Floor'}
          </button>
        </form>
      </div>

      {/* 2. The Live Feed Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700 border-b pb-2">Active Requests</h3>
        
        {loading ? (
          <p className="text-gray-500 animate-pulse">Loading the floor...</p>
        ) : feed.length === 0 ? (
          <p className="text-gray-500">The floor is quiet. Be the first to post a request!</p>
        ) : (
          feed.map((opp) => (
            <div key={opp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">{opp.userName}</span>
                  <span className="text-gray-400 text-sm">is looking for an intro to:</span>
                </div>
                <h4 className="text-xl font-extrabold text-orange-600">
                  {opp.role} @ {opp.company}
                </h4>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{opp.ask}</p>
              </div>
              
              {opp.userEmail !== currentUserEmail && (
                <button 
                  onClick={() => setSelectedAsk(opp)} // <-- THIS OPENS THE MODAL
                  className="bg-gray-900 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition shrink-0 ml-4">
                  I Can Help 🤝
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- NEW: The "I Can Help" Modal Overlay --- */}
      {selectedAsk && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Fulfill the Request</h3>
            <p className="text-gray-600 mb-6">
              You are offering to connect <span className="font-semibold">{selectedAsk.userName}</span> with a <span className="font-semibold">{selectedAsk.role} at {selectedAsk.company}</span>.
            </p>
            
            <form onSubmit={handleSubmitTrade} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Contact's LinkedIn URL</label>
                <input 
                  required 
                  type="url"
                  placeholder="https://linkedin.com/in/their-profile" 
                  className="w-full p-3 border rounded-md"
                  value={tradeForm.contactLinkedIn} 
                  onChange={e => setTradeForm({...tradeForm, contactLinkedIn: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Context (How well do you know them?)</label>
                <textarea 
                  required 
                  placeholder="e.g. We were co-founders. I can text them right now to see if they are open to a chat." 
                  className="w-full p-3 border rounded-md h-24"
                  value={tradeForm.relationshipContext} 
                  onChange={e => setTradeForm({...tradeForm, relationshipContext: e.target.value})} 
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedAsk(null)} 
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-200 transition">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingTrade}
                  className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-md hover:bg-orange-700 transition">
                  {isSubmittingTrade ? 'Submitting...' : 'Submit Intro Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}