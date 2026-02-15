'use client';

import { useState, useEffect } from 'react';

type Ask = {
  id: string;
  userName: string;
  userEmail: string;
  company: string;
  role: string;
  ask: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export default function TradingFloorFeed({ currentUserEmail, currentUserName }: { currentUserEmail: string, currentUserName: string }) {
  const [feed, setFeed] = useState<Ask[]>([]);
  const [newAsk, setNewAsk] = useState({ company: '', role: '', ask: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

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
        userName: currentUserName,
        ...newAsk
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

  const handleHelp = async (ask: Ask) => {
    const res = await fetch('/api/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        opportunityId: ask.id,
        requesterEmail: ask.userEmail,
        offererEmail: currentUserEmail,
        offererName: currentUserName,
        company: ask.company
      })
    });

    if (res.ok) {
      alert("Offer sent! Check your Deal Desk to track it.");
      window.dispatchEvent(new Event('askPosted')); 
    }
  };

  if (loading) return <div className="text-gray-500 animate-pulse py-4">Loading the Trading Floor...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-12">
      
      {/* Post a New Ask Box */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Post a Request</h3>
        <form onSubmit={handlePostAsk} className="space-y-4">
          <div className="flex gap-4">
            <input required type="text" placeholder="Target Company (e.g. Stripe)" className="w-1/2 p-3 border rounded-md" value={newAsk.company} onChange={e => setNewAsk({...newAsk, company: e.target.value})} />
            <input required type="text" placeholder="Target Role (e.g. VP of Sales)" className="w-1/2 p-3 border rounded-md" value={newAsk.role} onChange={e => setNewAsk({...newAsk, role: e.target.value})} />
          </div>
          <textarea required placeholder="Why do you want to meet them? What is the mutual value?" className="w-full p-3 border rounded-md h-24" value={newAsk.ask} onChange={e => setNewAsk({...newAsk, ask: e.target.value})} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 text-white font-bold py-3 rounded-md hover:bg-orange-700 transition">
            {isSubmitting ? 'Posting...' : 'Post to Trading Floor (Free)'}
          </button>
        </form>
      </div>

      {/* The Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Live Trading Floor</h3>
        
        {feed.length === 0 ? (
          <p className="text-gray-500 text-center py-8">The floor is quiet. Post the first request!</p>
        ) : (
          feed.map(ask => (
            <div key={ask.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-gray-900">{ask.userName}</span>
                  
                  {/* NEW: Social Proof Rating Badge */}
                  {ask.reviewCount > 0 ? (
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full border border-yellow-300">
                      ★ {Number(ask.rating).toFixed(1)} ({ask.reviewCount})
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                      New Member
                    </span>
                  )}
                  
                  <span className="text-gray-400 text-sm ml-2">is looking for an intro to:</span>
                </div>
                
                <h4 className="text-lg font-bold text-orange-600 mb-2">
                  {ask.role} <span className="text-gray-400 font-normal">at</span> {ask.company}
                </h4>
                <div className="bg-gray-50 p-4 rounded-md text-gray-700 text-sm italic border border-gray-100">
                  "{ask.ask}"
                </div>
              </div>

              {/* Action Button */}
              {ask.userEmail !== currentUserEmail && (
                <div className="w-48">
                  <button 
                    onClick={() => handleHelp(ask)}
                    className="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-md hover:bg-gray-800 transition shadow-sm">
                    I Can Help
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">Earn 1 Credit</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}