'use client';

import { useState, useEffect } from 'react';

export default function MyTrades() {
  const [myOpenAsks, setMyOpenAsks] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = () => {
    fetch('/api/trades/me')
      .then(res => res.json())
      .then(data => {
        if (data.myOpenAsks) setMyOpenAsks(data.myOpenAsks);
        if (data.myRequests) setMyRequests(data.myRequests);
        if (data.myOffers) setMyOffers(data.myOffers);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrades();
    
    // NEW: Listen for new posts from the feed so we can auto-refresh!
    window.addEventListener('askPosted', fetchTrades);
    return () => window.removeEventListener('askPosted', fetchTrades);
  }, []);

  if (loading) return <div className="text-gray-500 animate-pulse py-4">Loading your active trades...</div>;

  if (myOpenAsks.length === 0 && myRequests.length === 0 && myOffers.length === 0) return null; 

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-12">
      <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">My Deal Desk</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Intros I Need (Open Asks & Active Trades) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🚪 Intros I Need</h3>
          
          {myOpenAsks.length === 0 && myRequests.length === 0 ? (
            <p className="text-gray-400 text-sm">No active requests yet.</p>
          ) : (
            <div className="space-y-4">
              
              {/* 1. Open Asks (Waiting for someone to help) */}
              {myOpenAsks.map(ask => (
                <div key={ask.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{ask.company}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      WAITING
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">You asked for: <span className="font-semibold">{ask.role}</span></p>
                </div>
              ))}

              {/* 2. Active Trades (Someone offered to help) */}
              {myRequests.map(trade => (
                <div key={trade.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{trade.company}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-orange-600 text-white rounded-full">
                      {trade.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">
                    <span className="font-bold">{trade.offererName}</span> offered to help!
                  </p>
                  <p className="text-xs text-orange-700 mt-1 font-medium">Check your email to connect.</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Intros I'm Offering */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-4">🤝 Intros I'm Offering</h3>
          {myOffers.length === 0 ? (
            <p className="text-gray-400 text-sm">You haven't offered any intros yet.</p>
          ) : (
            <div className="space-y-4">
              {myOffers.map(trade => (
                <div key={trade.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">{trade.company}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {trade.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    You offered an intro to <span className="font-semibold">{trade.requesterEmail}</span>.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}